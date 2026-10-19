import { spawn } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { designsRoot, templates } from './templates.mjs'

const host = 'localhost'
const hubPort = 4180
const hubUrl = `http://${host}:${hubPort}/`

const children = []
const previewServers = []
let hubServer
let shutdownPromise

async function startHubServer() {
  let index = await readFile(join(designsRoot, 'index.html'), 'utf8')
  for (const template of templates) {
    index = index.replaceAll(`href="./${template.name}/`, `href="http://${host}:${template.port}/`)
  }
  return new Promise((resolve, reject) => {
    hubServer = createServer((request, response) => {
      const pathname = new URL(request.url ?? '/', hubUrl).pathname
      if (pathname === '/favicon.ico') {
        response.writeHead(204).end()
        return
      }

      if (!['/', '/index.html'].includes(pathname)) {
        response.writeHead(404).end('Not found')
        return
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed')
        return
      }

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      if (request.method === 'HEAD') {
        response.end()
        return
      }

      response.end(index)
    })

    hubServer.once('error', reject)
    hubServer.listen(hubPort, host, resolve)
  })
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function isTemplateAvailable(template) {
  try {
    const response = await fetch(`http://${host}:${template.port}/`, {
      signal: AbortSignal.timeout(1_000),
    })
    if (!response.ok) return false
    return (await response.text()).includes(`<title>${template.expectedTitle}</title>`)
  } catch {
    return false
  }
}

async function waitForPreview(template, child, exited) {
  const previewUrl = `http://${host}:${template.port}/`
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    const exitResult = await Promise.race([exited, delay(250).then(() => null)])
    if (exitResult) {
      const reason =
        exitResult.error?.message ??
        `process exited with ${exitResult.code === null ? exitResult.signal : `code ${exitResult.code}`}`
      throw new Error(`${template.name} failed to start on port ${template.port}: ${reason}`)
    }

    if (await isTemplateAvailable(template)) return
    if (child.exitCode !== null) {
      throw new Error(`${template.name} exited before its preview became ready`)
    }
  }

  throw new Error(`${template.name} did not become ready at ${previewUrl} within 60 seconds`)
}

async function startTemplate(template) {
  const projectPath = join(designsRoot, template.name)
  if (template.staticPreview) {
    const previewPath = join(projectPath, template.staticPreview)
    await access(previewPath)
    if (await isTemplateAvailable(template)) {
      console.log(`${template.name} is already running at http://${host}:${template.port}/`)
      return
    }

    const server = createServer((request, response) => {
      if (!['GET', 'HEAD'].includes(request.method ?? 'GET')) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed')
        return
      }

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      if (request.method === 'HEAD') {
        response.end()
        return
      }

      const page = createReadStream(previewPath)
      page.on('error', (error) => {
        console.error(`Unable to serve ${template.name}: ${error.message}`)
        if (!response.headersSent) response.writeHead(500)
        response.end('Unable to load this preview')
      })
      page.pipe(response)
    })

    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(template.port, host, resolve)
    })
    previewServers.push(server)
    console.log(`${template.name} ready at http://${host}:${template.port}/`)
    return
  }

  const viteCli = join(projectPath, 'node_modules', 'vite', 'bin', 'vite.js')

  if (await isTemplateAvailable(template)) {
    console.log(`${template.name} is already running at http://${host}:${template.port}/`)
    return
  }

  try {
    await access(viteCli)
  } catch {
    throw new Error(`Vite is not installed for ${template.name}; run npm install in ${projectPath}`)
  }

  const child = spawn(
    process.execPath,
    [
      viteCli,
      '--host',
      host,
      '--port',
      String(template.port),
      '--strictPort',
      '--clearScreen',
      'false',
    ],
    { cwd: projectPath, stdio: 'inherit', windowsHide: true },
  )
  children.push(child)

  const exited = new Promise((resolve) => {
    child.once('error', (error) => resolve({ error }))
    child.once('exit', (code, signal) => resolve({ code, signal }))
  })

  await waitForPreview(template, child, exited)
  console.log(`${template.name} ready at http://${host}:${template.port}/`)
}

function openHubInBrowser() {
  const command =
    process.platform === 'win32' ? 'cmd.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open'
  const args =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', `start "" "${hubUrl}"`]
      : [hubUrl]
  const browser = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true })
  browser.once('error', (error) => {
    console.error(`Could not open a browser automatically: ${error.message}`)
    console.log(`Open the template hub at ${hubUrl}`)
  })
  browser.unref()
}

function shutdown(exitCode = 0) {
  if (shutdownPromise) return shutdownPromise

  shutdownPromise = (async () => {
    process.exitCode = exitCode
    if (hubServer?.listening) {
      await new Promise((resolve) => hubServer.close(resolve))
    }
    await Promise.all(
      previewServers
        .filter((server) => server.listening)
        .map((server) => new Promise((resolve) => server.close(resolve))),
    )

    const pendingChildren = children.filter((child) => child.exitCode === null)
    for (const child of pendingChildren) child.kill('SIGTERM')
    await Promise.all(
      pendingChildren.map(
        (child) =>
          new Promise((resolve) => {
            child.once('exit', resolve)
            setTimeout(resolve, 5_000).unref()
          }),
      ),
    )
  })()

  return shutdownPromise
}

async function main() {
  await startHubServer()
  console.log(`Template hub is serving at ${hubUrl}`)

  for (const template of templates) {
    await startTemplate(template)
  }

  console.log('All template previews are ready. Keep this terminal open to use the hub.')
  openHubInBrowser()

  process.once('SIGINT', () => void shutdown(130))
  process.once('SIGTERM', () => void shutdown(143))
}

main().catch(async (error) => {
  console.error(error.message)
  await shutdown(1)
})
