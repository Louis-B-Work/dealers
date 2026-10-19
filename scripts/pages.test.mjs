import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { designsRoot, templates } from './templates.mjs'

const output = join(designsRoot, 'dist')

async function assertLocalAssets(html, filename) {
  const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>')
  for (const [, reference] of markup.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|data:|mailto:|tel:|#)/.test(reference)) continue
    assert.ok(!reference.startsWith('/'), `Root-relative asset: ${reference}`)
    const asset = fileURLToPath(new URL(reference, pathToFileURL(filename)))
    assert.ok(await stat(asset), `Missing asset: ${reference}`)
  }
}

test('gallery links to exactly the six published previews, with no localhost URLs', async () => {
  const filename = join(output, 'index.html')
  const html = await readFile(filename, 'utf8')
  const links = [...html.matchAll(/class="open-link" href="([^"]+)"/g)].map((match) => match[1])
  assert.equal(links.length, 6)
  assert.deepEqual(
    links.sort(),
    templates.map(({ name }) => `./${name}/`).sort(),
  )
  assert.doesNotMatch(html, /localhost|127\.0\.0\.1/)
  await assertLocalAssets(html, filename)
  assert.ok(await stat(join(output, '.nojekyll')))
})

for (const template of templates) {
  test(`${template.name} has a published entry point and portable assets`, async () => {
    const filename = join(output, template.name, 'index.html')
    const html = await readFile(filename, 'utf8')
    assert.ok(html.includes(`<title>${template.expectedTitle}</title>`))
    if (template.staticPreview) {
      assert.equal(html, await readFile(join(designsRoot, template.name, template.staticPreview), 'utf8'))
    } else {
      assert.match(html, /<script type="module"[^>]+src="\.\/assets\//)
    }
    await assertLocalAssets(html, filename)
  })
}
