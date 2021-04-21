import path from 'path'
import esbuild from 'esbuild'
import playwright from 'playwright'
import { Context } from 'uvu'

export interface BrowserContext extends Context {
  entry: string
  server: esbuild.ServeResult
  browser: playwright.ChromiumBrowser
  page: playwright.Page
}

export async function setup(context: BrowserContext) {
  await esbuild.serve({
    servedir: path.join(__dirname, 'www')
  }, {
    entryPoints: [
      context.entry
    ],
    outfile: path.join(__dirname, 'www/app.js'),
    target: 'es2016',
    format: 'esm',
    platform: 'browser',
    minify: true,
    bundle: true,
    sourcemap: 'external'
  }).then(async(server) => {
    context.server = server
    context.browser = await playwright.chromium.launch()

    const ctx = await context.browser.newContext()

    context.page = await ctx.newPage()
  })
}

export async function reset(context: BrowserContext) {
  await context.browser.close()
  await context.server.stop()
}

export async function homepage(context: BrowserContext) {
  await context.page.goto(`http://${context.server.host}:${context.server.port}`)
}
