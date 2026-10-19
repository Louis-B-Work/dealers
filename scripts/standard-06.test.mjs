import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { STOCK, BODY_TYPES, filterStock, financeQuote, parseRoute, escapeHtml } from '../standard-06/stock.mjs'
import { templates } from './templates.mjs'

test('template 6 uses personalisable dealership branding throughout', async () => {
  const html = await readFile(new URL('../standard-06/index.html', import.meta.url), 'utf8')
  const app = await readFile(new URL('../standard-06/app.mjs', import.meta.url), 'utf8')
  const template = templates.find(({ name }) => name === 'standard-06')
  assert.equal(template.expectedTitle, 'Dealership Name | Considered Cars')
  assert.ok(html.includes(`<title>${template.expectedTitle}</title>`))
  assert.match(html, /class="brand-name">Dealership Name<\/span>/)
  assert.match(html, /class="brand-mark">D<\/span>/)
  assert.match(html, /class="footer-brand">Dealership Name<\/div>/)
  assert.match(app, /const homeTitle = 'Dealership Name \| Considered Cars'/)
  assert.doesNotMatch(html + app, /northline|class="brand-mark">N<\/span>/i)
})

test('template 6 stock has unique detail routes and complete specifications', () => {
  assert.equal(STOCK.length, 11)
  assert.equal(new Set(STOCK.map((car) => car.id)).size, STOCK.length)
  for (const car of STOCK) {
    for (const key of ['id', 'make', 'model', 'trim', 'year', 'miles', 'gearbox', 'fuel', 'bodyType', 'price', 'engine', 'doors', 'img']) {
      assert.ok(car[key], `${car.id}: missing ${key}`)
    }
    assert.match(car.id, /^[a-z0-9-]+$/)
  }
  for (const body of BODY_TYPES) {
    assert.ok(filterStock(new URLSearchParams({ bodyType: body.name })).length, `${body.name} needs stock`)
  }
})

test('make, model and budget filters combine exactly', () => {
  const params = new URLSearchParams({ make: 'Volkswagen', model: 'Polo', maxPrice: '12000' })
  assert.deepEqual(filterStock(params).map((car) => car.id), ['volkswagen-polo'])
  params.set('maxPrice', '11989')
  assert.equal(filterStock(params).length, 0)
  params.set('maxPrice', '11990')
  assert.equal(filterStock(params).length, 1)
})

test('body, fuel and transmission filters combine, with empty results supported', () => {
  assert.deepEqual(filterStock(new URLSearchParams({ bodyType: 'SUV', fuel: 'Electric', gearbox: 'Automatic' })).map((car) => car.id), ['kia-ev6'])
  assert.equal(filterStock(new URLSearchParams({ make: 'Fiat', bodyType: 'Estate' })).length, 0)
  assert.equal(filterStock(new URLSearchParams({ maxPrice: '8000' })).length, 0)
})

test('text search is trimmed, case-insensitive and includes trim', () => {
  assert.deepEqual(filterStock(new URLSearchParams({ query: '  GT-LINE  ' })).map((car) => car.id), ['kia-ev6'])
  assert.equal(filterStock(new URLSearchParams({ query: '<script>' })).length, 0)
})

test('stock sorts do not mutate shared stock or disagree with requested order', () => {
  const original = STOCK.map((car) => car.id)
  for (const [sort, key, direction] of [['price-asc', 'price', 1], ['price-desc', 'price', -1], ['year-desc', 'year', -1], ['mileage-asc', 'miles', 1]]) {
    const results = filterStock(new URLSearchParams({ sort }))
    for (let index = 1; index < results.length; index++) {
      assert.ok((results[index][key] - results[index - 1][key]) * direction >= 0)
    }
  }
  assert.deepEqual(STOCK.map((car) => car.id), original)
  const featured = filterStock(new URLSearchParams())
  assert.ok(featured[0].featured)
  const firstRegular = featured.findIndex((car) => !car.featured)
  assert.ok(featured.slice(firstRegular).every((car) => !car.featured))
})

test('finance matches the exact homepage illustration at penny precision', () => {
  assert.deepEqual(financeQuote(12000, 0, 60), {
    credit: 12000, monthly: 262.69, interest: 3761.4, total: 15761.4,
  })
})

test('finance total includes deposit and all rounded instalments', () => {
  for (const car of STOCK) {
    for (const term of [24, 36, 48, 60]) {
      const deposit = 1000
      const quote = financeQuote(car.price, deposit, term)
      assert.equal(quote.credit, car.price - deposit)
      assert.equal(quote.total, Math.round((deposit + quote.monthly * term) * 100) / 100)
      assert.equal(quote.interest, Math.round((quote.total - car.price) * 100) / 100)
      assert.ok(quote.monthly > 0)
    }
  }
})

test('finance supports a full deposit and zero APR without NaN', () => {
  assert.deepEqual(financeQuote(12000, 12000, 60), { credit: 0, monthly: 0, interest: 0, total: 12000 })
  assert.deepEqual(financeQuote(12000, 0, 60, 0), { credit: 12000, monthly: 200, interest: 0, total: 12000 })
})

test('invalid finance values fail explicitly', () => {
  for (const args of [[0, 0, 60], [-1, 0, 60], [100, -1, 60], [100, 101, 60], [100, 0, 0], [100, 0, 2.5], [NaN, 0, 60], [100, Infinity, 60], [100, 0, 60, -1]]) {
    assert.throws(() => financeQuote(...args), RangeError)
  }
})

test('hash routes preserve portable vehicle and search links', () => {
  assert.equal(parseRoute('').path, '/')
  assert.equal(parseRoute('#/vehicles/kia-ev6').path, '/vehicles/kia-ev6')
  const route = parseRoute('#/vehicles?make=Land+Rover&bodyType=SUV&maxPrice=25000')
  assert.equal(route.path, '/vehicles')
  assert.equal(route.params.get('make'), 'Land Rover')
  assert.equal(filterStock(route.params).length, 1)
})

test('query text is escaped before inserting it into markup', () => {
  assert.equal(escapeHtml('<img src="x" onerror=\'x\'>&'), '&lt;img src=&quot;x&quot; onerror=&#39;x&#39;&gt;&amp;')
})
