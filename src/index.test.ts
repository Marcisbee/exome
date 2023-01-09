import { test } from 'uvu'
import assert from 'uvu/assert'

import {
  Exome,
  updateMap,
  updateView,
  saveState,
  loadState,
  getExomeId,
  addMiddleware
} from './index'

test.before.each(() => {
  Object.keys(updateMap).forEach((key) => {
    delete updateMap[key]
  })
})

test('exports `Exome`', () => {
  assert.ok(Exome)
})

test('exports `updateMap`', () => {
  assert.ok(updateMap)
  assert.equal(updateMap, {})
})

test('exports `updateView`', () => {
  assert.ok(updateView)
  assert.instance(updateView, Function)
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

test.run()
