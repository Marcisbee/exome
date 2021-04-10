import { test } from 'uvu'
import assert from 'uvu/assert'

import {
  Exome,
  useStore,
  saveState,
  loadState,
  getExomeId,
  addMiddleware,
  exomeDevtools
} from './index'

test('exports `Exome`', () => {
  assert.ok(Exome)
})

test('exports `useStore`', () => {
  assert.ok(useStore)
  assert.instance(useStore, Function)
})

test('exports `saveState`', () => {
  assert.ok(saveState)
  assert.instance(saveState, Function)
})

test('exports `loadState`', () => {
  assert.ok(loadState)
  assert.instance(loadState, Function)
})

test('exports `getExomeId`', () => {
  assert.ok(getExomeId)
  assert.instance(getExomeId, Function)
})

test('exports `addMiddleware`', () => {
  assert.ok(addMiddleware)
  assert.instance(addMiddleware, Function)
})

test('exports `exomeDevtools`', () => {
  assert.ok(exomeDevtools)
  assert.instance(exomeDevtools, Function)
})

test.run()
