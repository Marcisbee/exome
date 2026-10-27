import { join } from 'path'
import { suite } from 'uvu'
import assert from 'uvu/assert'
import * as ENV from '../setup/playwright'
import type { BrowserContext } from '../setup/playwright'

const test = suite<BrowserContext>('Radi packaged adapter', {
  entry: join(__dirname, './counter.tsx'),
  tsconfig: join(__dirname, './tsconfig.json'),
} as any)

test.before(ENV.setup)
test.before.each(ENV.homepage)
test.after(ENV.reset)

test('updates consumers and attributes, releases subscriptions, and remounts with current state', async ({ page }) => {
  assert.equal(await page.textContent('h1'), '0')
  assert.equal(await page.textContent('p'), '0')
  await page.click('text="Increment"')
  assert.equal(await page.textContent('h1'), '1')
  assert.equal(await page.textContent('p'), '1')
  assert.equal(await page.getAttribute('p', 'title'), 'Count: 1')
  await page.click('text="Async increment"')
  assert.equal(await page.textContent('h1'), '2')
  await page.click('text="Nested increment"')
  assert.equal(await page.textContent('span'), '1')
  assert.equal(await page.textContent('h1'), '2')

  await page.click('text="Unmount"')
  assert.equal(await page.$('h1'), null)
  const selections = await page.textContent('#subscriptions')
  await page.click('text="Increment"')
  assert.equal(await page.textContent('#subscriptions'), selections)
  await page.click('text="Mount"')
  assert.equal(await page.textContent('h1'), '3')
  assert.equal(await page.textContent('p'), '3')
  await page.click('text="Increment"')
  assert.equal(await page.textContent('h1'), '4')
  assert.equal(await page.textContent('p'), '4')
})

test.run()
