import { test } from 'uvu'
import assert from 'uvu/assert'

import { exomeName } from './exome-name'

test('exports `exomeName`', () => {
  assert.ok(exomeName)
})

test.run()
