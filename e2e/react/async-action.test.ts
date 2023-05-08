import { join } from 'path'
import { suite } from 'uvu'
import assert from 'uvu/assert'

import * as ENV from '../setup/playwright'
import { BrowserContext } from '../setup/playwright'

const entry = join(__dirname, './async-action.tsx')
const test = suite<BrowserContext>('Async action', { entry } as any)

test.before(ENV.setup)
test.before.each(ENV.homepage)
test.after(ENV.reset)

test('renders nothing inside <h1>', async({ page }) => {
  const h1 = (await page.$('h1'))!
  const span = (await page.$('span'))!

  assert.equal(await h1.innerText(), '')
  assert.equal(await span.innerText(), '1')
})

test('renders content inside <h1> after action finishes', async({ page }) => {
  const h1 = (await page.$('h1'))!
  const span = (await page.$('span'))!

  assert.equal(await h1.innerText(), '')
  assert.equal(await span.innerText(), '1')

  await page.click('#getMessage')

  assert.equal(await h1.innerText(), '')
  assert.equal(await span.innerText(), '1')

  await page.waitForTimeout(100)

  assert.equal(await h1.innerText(), 'Hello world')
  assert.equal(await span.innerText(), '2')
})

test('manages loading state correctly', async({ page }) => {
  const span = (await page.$('span'))!

  assert.equal((await page.$('#loading')) === null, true)
  assert.equal(await span.innerText(), '1')

  await page.click('#getMessageWithLoading')

  assert.equal((await page.$('#loading')) === null, false)
  assert.equal(await span.innerText(), '2')

  await page.waitForTimeout(100)

  assert.equal((await page.$('#loading')) === null, true)
  assert.equal(await span.innerText(), '3')
})

test.run()
