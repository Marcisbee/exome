import { test } from 'uvu'
import assert from 'uvu/assert'
import { Exome } from '../exome'
import { exomeId } from './exome-id'

import { saveState } from './save-state'

test('exports `saveState`', () => {
  assert.ok(saveState)
})

test('that `saveState` is function', () => {
  assert.instance(saveState, Function)
})

test('returns "null" if `null` is passed in', () => {
  const output = saveState(null as any)

  assert.snapshot(output, 'null')
  assert.not.throws(() => JSON.parse(output))
})

test('returns "" if `undefined` is passed in', () => {
  const output = saveState(undefined as any)

  assert.snapshot(output, 'null')
  assert.not.throws(() => JSON.parse(output))
})

test('returns "{}" if `Exome` instance is passed without exomeId', () => {
  const instance = new Exome();
  (instance[exomeId] as any) = undefined

  const output = saveState(instance)

  assert.snapshot(output, '{}')
  assert.not.throws(() => JSON.parse(output))
})

test('returns correct snapshot with empty `Exome` instance', () => {
  const instance = new Exome()
  instance[exomeId] = 'foo'

  const output = saveState(instance)

  assert.snapshot(output, '{"$$exome_id":"foo"}')
  assert.not.throws(() => JSON.parse(output))
})

test('returns correct snapshot with filled `Exome` instance', () => {
  class Person extends Exome {
    public firstName = 'John'
    public lastName = 'Wick'
  }
  const instance = new Person()
  instance[exomeId] = 'foo'

  const output = saveState(instance)

  assert.snapshot(output, '{"$$exome_id":"foo","firstName":"John","lastName":"Wick"}')
  assert.not.throws(() => JSON.parse(output))
})

test('returns correct snapshot with nested `Exome` instance', () => {
  class Interest extends Exome {
    constructor(
      public type: string
    ) {
      super()
    }
  }

  const interestSkating = new Interest('Skating')
  interestSkating[exomeId] = 'skating-123'

  const interestHockey = new Interest('Hockey')
  interestHockey[exomeId] = 'hockey-123'

  class Person extends Exome {
    constructor(
      public name: string,
      public interests: Interest[] = []
    ) {
      super()
    }
  }

  const personJohn = new Person('John', [interestHockey, interestSkating])
  personJohn[exomeId] = 'john-123'

  const personJane = new Person('Jane', [interestSkating])
  personJane[exomeId] = 'jane-123'

  class Store extends Exome {
    constructor(
      public persons: Person[]
    ) {
      super()
    }
  }

  const store = new Store([personJohn, personJane])
  store[exomeId] = 'store-123'

  const output = saveState(store, true)

  assert.snapshot(output, `{
  "$$exome_id": "store-123",
  "persons": [
    {
      "$$exome_id": "john-123",
      "name": "John",
      "interests": [
        {
          "$$exome_id": "hockey-123",
          "type": "Hockey"
        },
        {
          "$$exome_id": "skating-123",
          "type": "Skating"
        }
      ]
    },
    {
      "$$exome_id": "jane-123",
      "name": "Jane",
      "interests": [
        {
          "$$exome_id": "skating-123"
        }
      ]
    }
  ]
}`)
  assert.not.throws(() => JSON.parse(output))
})

test('returns correct snapshot for circular `Exome` instance', () => {
  class Person extends Exome {
    constructor(
      public name: string,
      public friends: Person[]
    ) {
      super()
    }
  }

  class Store extends Exome {
    constructor(
      public persons: Person[]
    ) {
      super()
    }
  }

  const personJohn = new Person('John', [])
  personJohn[exomeId] = 'john-123'
  personJohn.friends = [personJohn]

  const store = new Store([personJohn])
  store[exomeId] = 'store-123'

  const output = saveState(store, true)

  assert.snapshot(output, `{
  "$$exome_id": "store-123",
  "persons": [
    {
      "$$exome_id": "john-123",
      "name": "John",
      "friends": [
        {
          "$$exome_id": "john-123"
        }
      ]
    }
  ]
}`)
  assert.not.throws(() => JSON.parse(output))
})

test.run()
