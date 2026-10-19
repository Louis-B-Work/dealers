import { spawnSync } from 'node:child_process'
import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { designsRoot, templates } from './templates.mjs'

const command = process.argv[2]
if (!['ci', 'build'].includes(command)) {
  throw new Error('Expected ci or build')
}
if (!process.env.npm_execpath) {
  throw new Error('Run this script through npm run setup or npm run build')
}

const output = join(designsRoot, 'dist')
if (command === 'build') {
  await rm(output, { recursive: true, force: true })
  await mkdir(output, { recursive: true })
  await copyFile(join(designsRoot, 'index.html'), join(output, 'index.html'))
  await cp(join(designsRoot, 'previews'), join(output, 'previews'), { recursive: true })
  await writeFile(join(output, '.nojekyll'), '')
}

for (const template of templates) {
  const project = join(designsRoot, template.name)
  if (template.staticPreview) {
    if (command === 'build') {
      const destination = join(output, template.name)
      await mkdir(destination, { recursive: true })
      await copyFile(join(project, template.staticPreview), join(destination, 'index.html'))
      for (const asset of template.staticAssets ?? []) {
        await copyFile(join(project, asset), join(destination, asset))
      }
    }
    continue
  }

  console.log(`\n${command}: ${template.name}`)
  const args = command === 'ci'
    ? ['ci']
    : ['run', 'build', '--', '--base', './', '--outDir', join(output, template.name)]
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd: project,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${template.name}: npm ${command} failed (${result.signal ?? result.status})`)
  }
}

console.log(command === 'build' ? '\nAll six previews built in dist/.' : '\nTemplate dependencies installed.')
