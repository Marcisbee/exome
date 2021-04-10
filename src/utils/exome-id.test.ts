import { test } from 'uvu'
import assert from 'uvu/assert'

import { exomeId } from './exome-id'

test('exports `exomeId`', () => {
  assert.ok(exomeId)
})

test.run()
