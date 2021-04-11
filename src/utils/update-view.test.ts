import { fake } from 'sinon'
import { test } from 'uvu'
import assert from 'uvu/assert'

import { updateMap } from './update-map'
import { updateView } from './update-view'

test.before.each(() => {
  updateMap.clear()
})

test('exports `updateView`', () => {
  assert.ok(updateView)
})

test('that `updateView` is function', () => {
  assert.instance(updateView, Function)
})

test('doesn\'t throw error when `updateMap` is empty', () => {
  assert.not.throws(updateView)
})

test('doesn\'t throw error when `updateMap` is with one empty array', () => {
  updateMap.set('foo', [])

  assert.not.throws(updateView)
})

test('runs single update from `foo`', () => {
  const update = fake()
  updateMap.set('foo', [update])

  updateView()

  assert.equal(update.callCount, 1)
})

test('runs two updates from `foo`', () => {
  const update1 = fake()
  const update2 = fake()
  updateMap.set('foo', [update1, update2])

  updateView()

  assert.equal(update1.callCount, 1)
  assert.equal(update2.callCount, 1)
})

test('runs multiple updates from different keys', () => {
  const update1 = fake()
  const update2 = fake()
  const update3 = fake()
  updateMap.set('foo', [update1, update2])
  updateMap.set('bar', [update3])

  updateView()

  assert.equal(update1.callCount, 1)
  assert.equal(update2.callCount, 1)
  assert.equal(update3.callCount, 1)
})

test('clears `updateMap` after each run', () => {
  updateMap.set('foo', [fake()])
  updateMap.set('bar', [fake()])

  assert.not.equal(updateMap.get('foo').length, 0)
  assert.not.equal(updateMap.get('bar').length, 0)

  updateView()

  assert.equal(updateMap.get('foo').length, 0)
  assert.equal(updateMap.get('bar').length, 0)
})

test.run()
