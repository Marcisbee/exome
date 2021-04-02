<div align="center">
  <img src="assets/logo.svg" width="800" height="180" />
</div>

<br />

<div align="center">
  <a href="https://github.com/Marcisbee/exome/actions">
    <img alt="CI" src="https://img.shields.io/github/workflow/status/Marcisbee/exome/CI?style=flat-square" />
  </a>
  <a href="https://www.npmjs.com/package/exome">
    <img alt="npm" src="https://img.shields.io/npm/v/exome.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=exome">
    <img alt="package size" src="https://img.shields.io/bundlephobia/minzip/exome?style=flat-square" />
  </a>
</div>

<br />

<div align="center">
  Proxy based state manager for deeply nested states
</div>

## Features

- 📦 **Small**: Just **1 KB** minified
- 🚀 **Fast**: Uses **no diffing** of state changes (because of architecture, it's not needed)
- 😍 **Simple**: Uses classes as state
- 🧬 **Nested**: Easily manage deeply nested state structures
- 💪 **Immutable**: Data can only be changed via actions
- 🎛 **Effects**: Built-in effects for actions
- 🛡 **Bulletproof**: Written in strict TypeScript
- 🗂 **Typed**: All your state will be typed
- 💨 **Zero dependencies**


# Installation
To install the stable version:
```bash
npm install --save exome
```
This assumes you are using [npm](https://www.npmjs.com/package/exome) as your package manager.

# Usage
Library can be used without typescript, but I mostly recommend using it with typescript as it will guide you through what can and cannot be done as there are no checks without it and can lead to quite nasty bugs.

To create a typed store just create new class with name of your choosing by extending `Exome` class exported from `exome` library.

```ts
import { Exome } from 'exome'

// We'll have a store called "CounterStore"
class CounterStore extends Exome {
  // Lets set up one property "count" with default value "0"
  public count = 0

  // Now lets create action that will update "count" value
  public increment() {
    this.count++
  }
}
```

That is the basic structure of simple store. It can have as many properties as you'd like. There are no restrictions.

Now we should create an instance of `CounterStore` to use it.

```ts
const counterStore = new CounterStore()
```

Nice! Now we can start using `counterStore` state. Lets include it in our `react` component via `useStore` hook that is exported by `exome` library.

```tsx
import { useStore } from 'exome'

function Counter() {
  const { count, increment } = useStore(counterStore)

  return (
    <button onClick={increment}>{count}</button>
  )
}
```

And that is it! No providers, no context, no boilerplate, just your state and actions.

# API

`exome` library has only two exports `Exome` and `useStore`.

## `Exome`
It's just a class that deals with underlying logic that handles state changes.

## `useStore`
Takes in only one parameter - an instance of `Exome` class. And outputs that same instance. It links this particular instance to this component to handle component updates.

Exome can also include multiple Exomes inside itself. And whenever new Exome is used in child component, it has to be wrapped in `useStore` hook.

For example:
```tsx
class Todo extends Exome {
  constructor(
    public message: string,
    public completed = false
  ) {}

  public complete() {
    this.completed = true
  }
}

class Store extends Exome {
  constructor(
    public list: Todo[]
  ) {}
}

const store = new Store([
  new Todo('Code a new state library', true),
  new Todo('Write documentation'),
])

function TodoView({ todo }: { todo: Todo }) {
  const { message, complete } = useStore(todo)

  return (
    <li>
      <strong>
        {message}
      </strong>

      <button onClick={complete}>
        complete
      </button>
    </li>
  )
}

function App() {
  const { list } = useStore(store)

  return (
    <ul>
      {list.map((todo) => (
        <TodoView todo={} />
      ))}
    </ul>
  )
}
```

# Motivation
I stumbled upon a need to store deeply nested store and manage chunks of them individually and regular flux selector/action architecture just didn't make much sense anymore. So I started to prototype what would ideal deeply nested store interaction look like and I saw that we could simply use classes for this.

**Goals I set for this project:**

- [x] Easy usage with deeply nested state chunks (array in array)
- [x] Single source of thruth (can be multiple tho, but it's up to you)
- [x] Type safe with TypeScript
- [x] To have actions be only way of editing state
- [x] To have effects trigger extra actions
- [ ] Redux devtool support

# MIT License
Copyright (C) 2021 Marcis Bergmanis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
