import * as colorette from 'colorette'
import esbuild from 'esbuild'
import playwright from 'playwright';

import { colorize } from './colorize';

const entry = process.argv.slice(2)[0]

if (!entry) {
  throw new Error('Entry was not provided');
}

const colors = {
  bold: colorette.bold,
  dim: colorette.dim,
  italic: colorette.italic,
  underline: colorette.underline,
  inverse: colorette.inverse,
  hidden: colorette.hidden,
  strikethrough: colorette.strikethrough,
  black: colorette.black,
  red: colorette.red,
  green: colorette.green,
  yellow: colorette.yellow,
  blue: colorette.blue,
  magenta: colorette.magenta,
  cyan: colorette.cyan,
  white: colorette.white,
  gray: colorette.gray,
};

esbuild.context({
  inject: [
    './lodash.ts',
  ],
  entryPoints: [entry],
  bundle: true,
  outfile: './www/bench.js',
  target: 'es2020',
  format: 'cjs',
  platform: 'browser',
  minify: true,
  sourcemap: 'external',
}).then(async (ctx) => {
  ctx.serve({
    port: 8000,
    servedir: 'www',
  }).then(async (server) => {
    const browser = await playwright.chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    // Uncomment to open and test benchmark in browser manually
    // await server.wait

    page.on('pageerror', (error) => {
      throw error;
    })

    page.on('console', (...message) => {
      if (message[0].text() === '<clear-line/>') {
        process.stdout.write('\r\x1b[K');
        return;
      }

      const parsedMessage = message.map((value) => colorize(value.text(), colors));

      process.stdout.write(parsedMessage.join(' '));
    });
    await page.goto(`http://${server.host}:${server.port}`)

    await page.waitForFunction(
      // @ts-ignore
      () => self.PW_TEST?.ended === true,
      undefined,
      {
        timeout: 0,
        polling: 100,
      }
    )

    await browser.close()
    ctx.dispose()
  })
})
