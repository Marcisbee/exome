import { join } from 'path'
import { suite } from 'uvu'
import assert from 'uvu/assert'

import * as ENV from '../setup/playwright'
import { BrowserContext } from '../setup/playwright'

const entry = join(__dirname, './recursive.tsx')
const test = suite<BrowserContext>('Recursive', { entry } as any)

test.before(ENV.setup)
test.before.each(ENV.homepage)
test.after(ENV.reset)

test('renders correct amount of <input> elements', async({ page }) => {
  const inputs = await page.$$('input')

  assert.equal(inputs.length, 9)
})

test('has correct values in input fields', async({ page }) => {
  const inputs = await page.$$('input')

  assert.equal(await inputs[0].getAttribute('value'), 'root')
  assert.equal(await inputs[1].getAttribute('value'), 'one')
  assert.equal(await inputs[2].getAttribute('value'), 'ref')
  assert.equal(await inputs[3].getAttribute('value'), 'first')
  assert.equal(await inputs[4].getAttribute('value'), 'second')
  assert.equal(await inputs[5].getAttribute('value'), 'two')
  assert.equal(await inputs[6].getAttribute('value'), 'ref')
  assert.equal(await inputs[7].getAttribute('value'), 'first')
  assert.equal(await inputs[8].getAttribute('value'), 'second')
})

test('updates root value correctly', async({ page }) => {
  const inputs = await page.$$('input')

  assert.equal(await inputs[0].getAttribute('value'), 'root')

  await inputs[0].fill('Foo')

  assert.equal(await inputs[0].getAttribute('value'), 'Foo')
  assert.equal(await inputs[1].getAttribute('value'), 'one')
  assert.equal(await inputs[2].getAttribute('value'), 'ref')
  assert.equal(await inputs[3].getAttribute('value'), 'first')
  assert.equal(await inputs[4].getAttribute('value'), 'second')
  assert.equal(await inputs[5].getAttribute('value'), 'two')
  assert.equal(await inputs[6].getAttribute('value'), 'ref')
  assert.equal(await inputs[7].getAttribute('value'), 'first')
  assert.equal(await inputs[8].getAttribute('value'), 'second')
})

test('updates reference value correctly', async({ page }) => {
  const inputs = await page.$$('input')

  assert.equal(await inputs[2].getAttribute('value'), 'ref')
  assert.equal(await inputs[6].getAttribute('value'), 'ref')

  await inputs[2].fill('Bar')

  assert.equal(await inputs[2].getAttribute('value'), 'Bar')
  assert.equal(await inputs[6].getAttribute('value'), 'Bar')
})

test.run()
