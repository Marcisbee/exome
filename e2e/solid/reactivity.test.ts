import { join } from 'path'
import { suite } from 'uvu'
import assert from 'uvu/assert'
import * as ENV from '../setup/playwright'
import type { BrowserContext } from '../setup/playwright'

const entry = join(__dirname, './reactivity.ts')
const test = suite<BrowserContext>('Solid reactivity', { entry } as any)

test.before(ENV.setup)
test.before.each(ENV.homepage)
test.after(ENV.reset)

test('default accessor propagates in-place store mutations to computations', async ({ page }) => {
  const values = await page.evaluate(async () => {
    const entry = '/app.js'
    const { observe } = await import(entry)
    return observe(false)
  })
  assert.equal(values, [[0, 'initial'], [1, 'initial'], [1, 'changed'], [2, 'changed']])
})

test('primitive selector updates only when its selected value changes', async ({ page }) => {
  const values = await page.evaluate(async () => {
    const entry = '/app.js'
    const { observe } = await import(entry)
    return observe(true)
  })
  assert.equal(values, [0, 1, 2])
})

test.run()
