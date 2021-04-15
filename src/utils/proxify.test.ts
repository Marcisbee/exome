import { test } from 'uvu'
import assert from 'uvu/assert'
import { Exome } from '../exome'
import { exomeId } from './exome-id'

import { proxify } from './proxify'

test('returns same instance of Exome just as Proxy', () => {
  class Test extends Exome {}
  const input = new Test()

  const output = proxify(input)

  assert.instance(output, Test)
  assert.instance(output, Exome)
  assert.is(input[exomeId], output[exomeId])

  // They are not equal because output is Proxy
  assert.is(input === output, false)
})

test('returns same object', () => {
  const input = {
    name: 'foo'
  }

  const output = proxify(input)

  assert.equal(output, input)

  // They are not equal because output is Proxy
  assert.is(input === output, false)
})

test('returns same array', () => {
  const input = [1, 2, 3]

  const output = proxify(input)

  assert.equal(output, input)

  // They are not equal because output is Proxy
  assert.is(input === output, false)
})

test('can set value to proxied object', () => {
  const input = {}

  const output = proxify(input);

  (output as any).hello = 'world'

  assert.equal(output, {
    hello: 'world'
  })
})

test('can get value from proxied object', () => {
  const input = {
    foo: 'bar'
  }

  const output = proxify(input)

  assert.equal(output.foo, 'bar')
})

test('proxies nested objects', () => {
  const input = {
    first: {
      second: {
        name: 'John'
      }
    }
  }

  const output = proxify(input)

  assert.equal(output.first, input.first)

  // They are not equal because output is Proxy
  assert.is(input.first === output.first, false)
})

test('proxies nested array', () => {
  const input = {
    first: {
      second: [
        1,
        2,
        3
      ]
    }
  }

  const output = proxify(input)

  assert.equal(output.first, input.first)

  // They are not equal because output is Proxy
  assert.is(input.first === output.first, false)
})

test('does not proxy function from regular object', () => {
  const input = {
    method() {}
  }

  const output = proxify(input)

  assert.equal(output.method, input.method)
  assert.is(input.method === output.method, true)
})

test('proxies function from Exome instance', () => {
  class Person extends Exome {
    public method(first: number, second: number) {
      return `method:${first}:${second}`
    }
  }
  const input = new Person()

  const output = proxify(input)

  assert.is(input.method === output.method, false)

  const returnInput = input.method(1, 2)
  const returnOutput = output.method(1, 2)

  assert.is(returnInput, 'method:1:2')
  assert.is(returnOutput, 'method:1:2')
})

test('proxies async function from Exome instance', async() => {
  class Person extends Exome {
    public async method(first: number, second: number) {
      return `method:${first}:${second}`
    }
  }
  const input = new Person()

  const output = proxify(input)

  assert.is(input.method === output.method, false)

  const returnInput = await input.method(1, 2)
  const returnOutput = await output.method(1, 2)

  assert.is(returnInput, 'method:1:2')
  assert.is(returnOutput, 'method:1:2')
})

test('throws error from proxied method', () => {
  class Person extends Exome {
    public method() {
      throw new Error('hey there')
    }
  }
  const input = new Person()

  const output = proxify(input)

  assert.throws(output.method)
})

test('does not proxy already proxied Exome instance', () => {
  class Dog extends Exome {
    constructor(public name: string) {
      super()
    }
  }
  const dogVincent = new Dog('Vincent')
  class Person extends Exome {
    public dogs: Dog[] = [dogVincent]
  }
  const input = new Person()

  const output = proxify(input)

  assert.is(dogVincent === input.dogs[0], true)
  assert.is(dogVincent === output.dogs[0], true)
})

test.run()
