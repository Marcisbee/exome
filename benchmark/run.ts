import { blue, bold, yellow, green, red, magenta, gray } from "colorette"
import esbuild from 'esbuild'
import * as readline from 'readline'
import playwright from 'playwright';

const entry = process.argv.slice(2)[0]

if (!entry) {
  throw new Error('Entry was not provided');
}

esbuild.serve({
  servedir: 'www',
}, {
  entryPoints: [entry],
  outfile: './www/benchmark.js',
  target: 'es2016',
  format: 'esm',
  platform: 'browser',
  minify: true,
  bundle: true,
  sourcemap: 'external',
}).then(async (server) => {
  const browser = await playwright.chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`http://${server.host}:${server.port}`)
  await page.click('.fn-run-tests')
  const state: any = await new Promise((resolve) => {
    const interval = setInterval(check, 1000)

    async function check() {
      const state = await page.evaluate(() => (window as any).astrobench.state)

      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)

      if (!state.running) {
        clearInterval(interval)
        resolve(state)
        return
      }

      const suite = state.describes[state.index].suite

      process.stdout.write(`Running ${bold(blue(suite.name))} ${gray(`(${state.index + 1}/${state.describes.length})`)}`);

      Array.from(suite).forEach((benchmark: any, index) => {
        if (benchmark.running) {
          process.stdout.write(` - ${bold(yellow(benchmark.name))} ${gray(`(${index + 1}/${suite.length})`)}`);
        }
      })
    }
  })

  console.log(bold('Results!'))

  state.describes.forEach(({ suite }: any) => {
    if (!suite) return;
    console.log('')
    console.log(bold(blue(suite.name)));
    Array.from(suite).sort((a: any, b: any) => a.sum.delta - b.sum.delta).forEach((benchmark: any) => {
      if (!benchmark.sum) return;
      console.log(
        '  ',
        yellow(benchmark.name),
        benchmark.count + '',
        'x',
        magenta(benchmark.sum.ops),
        'ops/sec',
        `±${benchmark.sum.rme}%`,
        benchmark.sum.fastest ? green('(fastest)') : red(`(${benchmark.sum.delta}% slower)`)
      );
    });
  });

  await browser.close()
  server.stop()
})
