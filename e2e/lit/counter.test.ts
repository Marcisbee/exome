import { join } from 'path'
import { suite } from 'uvu'
import assert from 'uvu/assert'

import * as ENV from '../setup/playwright'
import { BrowserContext } from '../setup/playwright'

const entry = join(__dirname, './counter.ts')
const test = suite<BrowserContext>('Counter', { entry } as any)

test.before(ENV.setup)
test.before.each(ENV.homepage)
test.after(ENV.reset)

test('renders <h1> with "0" inside', async({ page }) => {
  const counterValue = await (await page.$('h1'))!.innerText()

  assert.equal(counterValue, '0')
})

test('increments count on click', async({ page }) => {
  await page.click('h1')

  const counterValue = await (await page.$('h1'))!.innerText()

  assert.equal(counterValue, '1')
})

test('increments count on click multiple times', async({ page }) => {
  await page.click('h1')
  await page.click('h1')
  await page.click('h1')
  await page.click('h1')

  const counterValue = await (await page.$('h1'))!.innerText()
  const renderCount = await (await page.$('span'))!.innerText()

  assert.equal(counterValue, '4')
  assert.equal(renderCount, '5')
})

test.run()
