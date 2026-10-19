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
  test(`${template.name} has a gallery screenshot with portable markup`, async () => {
    const html = await readFile(join(output, 'index.html'), 'utf8')
    const image = `./previews/${template.name}.jpg`
    const tag = [...html.matchAll(/<img\b[^>]*class="card-preview"[^>]*>/g)]
      .map(([markup]) => markup)
      .find((markup) => markup.includes(`src="${image}"`))
    assert.ok(tag, `Missing gallery image for ${template.name}`)
    assert.match(tag, /alt="[^"]+"/)
    assert.match(tag, /width="1440" height="900"/)
    const published = await readFile(join(output, 'previews', `${template.name}.jpg`))
    assert.deepEqual(published, await readFile(join(designsRoot, 'previews', `${template.name}.jpg`)))
    assert.equal(published.readUInt16BE(0), 0xffd8, 'Preview must be a JPEG')
    assert.ok(published.length < 350_000, 'Preview must stay below 350 KB')
  })

  test(`${template.name} has a published entry point and portable assets`, async () => {
    const filename = join(output, template.name, 'index.html')
    const html = await readFile(filename, 'utf8')
    assert.ok(html.includes(`<title>${template.expectedTitle}</title>`))
    if (template.staticPreview) {
      assert.equal(html, await readFile(join(designsRoot, template.name, template.staticPreview), 'utf8'))
      for (const asset of template.staticAssets ?? []) {
        assert.equal(
          await readFile(join(output, template.name, asset), 'utf8'),
          await readFile(join(designsRoot, template.name, asset), 'utf8'),
          `${asset} must be published without changes`,
        )
      }
    } else {
      assert.match(html, /<script type="module"[^>]+src="\.\/assets\//)
    }
    await assertLocalAssets(html, filename)
  })
}
