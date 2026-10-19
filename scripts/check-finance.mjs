/**
 * Enforces ADR 0002: every monetary figure derives from the Representative APR.
 *
 * Run with `npm run check:finance` from the louis-designs folder. Reports every failure
 * it finds and exits non-zero if there were any, so it can gate a handoff.
 *
 * The rules exist because each was broken at least once in these drafts, and each
 * failure was invisible on inspection: the wrong numbers looked entirely plausible.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const designsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Matches `apr / 100 / 12` and friends: the nominal rate, which overstates the payment. */
const NOMINAL_RATE_PATTERNS = [/\/\s*100\s*\/\s*12/, /\bapr\b\s*\/\s*12\b/i]

/** The effective monthly rate. `dealer.ts` must contain this, not merely lack the nominal one. */
const EFFECTIVE_RATE = /\(\s*1\s*\+\s*apr\s*\/\s*100\s*\)\s*\*\*\s*\(\s*1\s*\/\s*12\s*\)/

/**
 * Matches a literal monthly figure baked into fixture data, e.g. `monthlyFrom: 1099`.
 * Anchored on the property name rather than on line position or a trailing comma, so
 * the last property in an object literal and inline objects are both caught. Requires a
 * digit after the colon, which excludes the `monthlyFrom: number` type declaration and
 * the derived `monthlyFrom: v.price > 0 ? ...` form. An explicit zero is allowed: it
 * means "no finance quoted on this vehicle", not an advertised figure.
 */
const HARDCODED_MONTHLY = /monthlyFrom['"]?\s*:\s*(?!0\s*[,}\s])[\d_.]/g

function findTemplates() {
  return readdirSync(designsRoot)
    .filter((name) => {
      if (name === 'node_modules' || name === 'scripts') return false
      const dir = join(designsRoot, name)
      if (!statSync(dir).isDirectory()) return false
      try {
        return statSync(join(dir, 'src', 'data', 'dealer.ts')).isFile()
      } catch {
        return false
      }
    })
    .sort()
}

function sourceFiles(dir) {
  const out = []
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      const full = join(current, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.(ts|vue)$/.test(entry.name)) out.push(full)
    }
  }
  walk(join(dir, 'src'))
  return out
}

function extractKernel(dealerSource) {
  const text = dealerSource.replace(/\r/g, '')
  const marker = text.indexOf('The longest term we quote against')
  if (marker < 0) return null
  const start = text.lastIndexOf('/**', marker)
  if (start < 0) return null
  return text.slice(start).trimEnd()
}

/**
 * Returns a top-level `export const <name> = ...` declaration, including its indented
 * continuation lines. Terminating on the next unindented line rather than on a blank
 * line means a missing blank line cannot swallow unrelated declarations.
 */
function extractDeclaration(text, name) {
  const lines = text.replace(/\r/g, '').split('\n')
  const start = lines.findIndex((line) => line.startsWith(`export const ${name}`))
  if (start < 0) return null

  const collected = [lines[start]]
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '' || /^\S/.test(lines[i])) break
    collected.push(lines[i])
  }
  return collected.join('\n')
}

/** Pulls the numbers out of the representative example so they can be recomputed. */
function parseRepresentativeExample(source) {
  const dealerSource = source.replace(/\r/g, '')
  const apr = dealerSource.match(/export const REPRESENTATIVE_APR\s*=\s*([\d.]+)/)
  const block = extractDeclaration(dealerSource, 'representativeExample')
  if (!apr || !block) return null

  const money = (label) => {
    const hit = block.match(new RegExp(`${label}\\s*£([\\d,]+\\.\\d{2})`))
    return hit ? Number(hit[1].replace(/,/g, '')) : null
  }
  const years = block.match(/over\s+(\d+)\s+years/)

  return {
    apr: Number(apr[1]),
    borrow: money('Borrow'),
    deposit: money('with a'),
    monthly: money('Monthly payment:'),
    optionFee: money('Option to purchase fee'),
    costOfCredit: money('Total cost of credit:'),
    totalRepayable: money('Total amount repayable:'),
    termMonths: years ? Number(years[1]) * 12 : null,
  }
}

function monthlyPaymentFor(principal, termMonths, apr) {
  const r = (1 + apr / 100) ** (1 / 12) - 1
  return (principal * r) / (1 - (1 + r) ** -termMonths)
}

const failures = []
const templates = findTemplates()

if (templates.length === 0) {
  console.error('No templates found. Expected folders containing src/data/dealer.ts.')
  process.exit(1)
}

const kernels = new Map()

for (const name of templates) {
  const dir = join(designsRoot, name)
  const fail = (rule, detail) => failures.push({ name, rule, detail })
  const dealerSource = readFileSync(join(dir, 'src', 'data', 'dealer.ts'), 'utf8')

  // 1. The kernel must be present, identical everywhere, and use the effective rate.
  const kernel = extractKernel(dealerSource)
  if (!kernel) fail('kernel-present', 'no finance kernel found in src/data/dealer.ts')
  else kernels.set(name, kernel)
  if (!EFFECTIVE_RATE.test(dealerSource)) {
    fail(
      'effective-rate',
      'src/data/dealer.ts does not derive the effective monthly rate `(1 + apr / 100) ** (1 / 12)`',
    )
  }

  // 2. No literal monthly figures in fixture data.
  for (const file of sourceFiles(dir)) {
    const source = readFileSync(file, 'utf8')
    const relative = file.slice(designsRoot.length + 1).replace(/\\/g, '/')

    const literals = source.match(HARDCODED_MONTHLY)
    if (literals) fail('no-hardcoded-monthly', `${relative}: ${literals.length} literal figure(s)`)

    // 3. No nominal rate. The APR is an effective annual rate; dividing it by twelve
    //    overstates the payment and desynchronises it from the representative example.
    //    This applies to dealer.ts too — that is where the rate is actually derived.
    for (const pattern of NOMINAL_RATE_PATTERNS) {
      if (pattern.test(source)) fail('no-nominal-rate', `${relative}: matches ${pattern}`)
    }
  }

  // 4. The representative example must reproduce from its own stated inputs.
  const example = parseRepresentativeExample(dealerSource)
  if (!example) {
    fail('representative-example', 'could not parse the representative example')
    continue
  }
  const missing = Object.entries(example).filter(([, value]) => value === null)
  if (missing.length > 0) {
    fail('representative-example', `missing field(s): ${missing.map(([k]) => k).join(', ')}`)
    continue
  }

  const principal = example.borrow - example.deposit
  const expectedMonthly = monthlyPaymentFor(principal, example.termMonths, example.apr)
  if (Math.abs(expectedMonthly - example.monthly) > 0.01) {
    fail(
      'representative-example',
      `states £${example.monthly.toFixed(2)}/month, but ${example.apr}% APR over ` +
        `${example.termMonths} months on £${principal.toFixed(2)} is £${expectedMonthly.toFixed(2)}`,
    )
  }

  const expectedRepayable = example.monthly * example.termMonths + example.optionFee
  if (Math.abs(expectedRepayable - example.totalRepayable) > 0.01) {
    fail(
      'representative-example',
      `total repayable £${example.totalRepayable.toFixed(2)} does not equal ` +
        `${example.termMonths} × £${example.monthly.toFixed(2)} + £${example.optionFee.toFixed(2)} ` +
        `= £${expectedRepayable.toFixed(2)}`,
    )
  }

  // "Borrow £X ... with a £Y deposit" follows the production wording in
  // hp-calculator.ts, where X is the cash price and the credit is X − Y. The cost of
  // credit is therefore measured against the credit, not against the cash price;
  // with a zero deposit the two coincide, which is why this only bites once a
  // deposit-bearing example is published.
  const expectedCost = example.totalRepayable - principal
  if (Math.abs(expectedCost - example.costOfCredit) > 0.01) {
    fail(
      'representative-example',
      `cost of credit £${example.costOfCredit.toFixed(2)} does not equal ` +
        `£${example.totalRepayable.toFixed(2)} − £${principal.toFixed(2)} = £${expectedCost.toFixed(2)}`,
    )
  }
}

// 5. One kernel, shared verbatim, so there is a single source of truth to port.
const distinct = new Map()
for (const [name, kernel] of kernels) {
  if (!distinct.has(kernel)) distinct.set(kernel, [])
  distinct.get(kernel).push(name)
}
if (distinct.size > 1) {
  const groups = [...distinct.values()].map((names) => names.join(', ')).join('  |  ')
  failures.push({
    name: 'all templates',
    rule: 'kernel-identical',
    detail: `${distinct.size} different kernels: ${groups}`,
  })
}

for (const name of templates) {
  const templateFailures = failures.filter((f) => f.name === name)
  if (templateFailures.length === 0) console.log(`  ok    ${name}`)
  else for (const f of templateFailures) console.log(`  FAIL  ${name}  [${f.rule}] ${f.detail}`)
}
for (const f of failures.filter((f) => f.name === 'all templates')) {
  console.log(`  FAIL  ${f.name}  [${f.rule}] ${f.detail}`)
}

if (failures.length > 0) {
  console.log(
    `\n${failures.length} finance check failure(s) across ${templates.length} template(s).` +
      `\nSee docs/adr/0002-monetary-figures-derive-from-apr.md`,
  )
  process.exit(1)
}

console.log(`\nAll finance checks passed across ${templates.length} template(s).`)
