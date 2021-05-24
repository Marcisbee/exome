import { test } from 'uvu'
import assert from 'uvu/assert'

import { Exome } from '../exome'
import { exomeId } from './exome-id'
import { setExomeId } from './set-id'

test('exports `setExomeId`', () => {
  assert.ok(setExomeId)
})

test('that `setExomeId` is function', () => {
  assert.instance(setExomeId, Function)
})

test('sets correct id on exome', () => {
  class Foo extends Exome {}
  const foo = new Foo()

  setExomeId(foo, '0110010101111000011011110110110101100101')

  assert.equal(foo[exomeId], 'Foo-0110010101111000011011110110110101100101')
})

test.run()
