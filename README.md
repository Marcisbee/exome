<a href="../../"><img src="logo/logo-title-dark.png" width="220" /></a>

<a href="https://github.com/Marcisbee/exome/actions">
  <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/Marcisbee/exome/main.yml?branch=main&style=flat-square" />
</a>
<a href="https://www.npmjs.com/package/exome">
  <img alt="npm" src="https://img.shields.io/npm/v/exome.svg?style=flat-square" />
</a>
<a href="https://bundlephobia.com/result?p=exome">
  <img alt="package size" src="https://deno.bundlejs.com/?q=exome&badge=&badge-style=flat-square" />
</a>
<a href="https://discord.gg/a62gfaDW2e">
  <img alt="discord" src="https://dcbadge.vercel.app/api/server/a62gfaDW2e?style=flat-square" />
</a>

State manager for deeply nested states. Includes integration for [React](#react), [Preact](#preact), [Vue](#vue), [Svelte](#svelte), [Lit](#lit), [Rxjs](#rxjs), [Angular](#angular) & [No framework](#no-framework). Can be easily used in microfrontends architecture.

# Features

- 📦 **Small**: Just **1 KB** minizipped
- 🚀 **Fast**: Uses **no diffing** of state changes see [**benchmarks**](./benchmark/README.md)
- 😍 **Simple**: Uses classes as state, methods as actions
- 🛡 **Typed**: Written in strict TypeScript
- 🔭 **Devtools**: Redux devtools integration
- 💨 **Zero dependencies**

> **Note**
> If you're upgrading from v1 to v2, please read the [migration guide](./MIGRATION-1-to-2.md) to ease the upgrade process.

```ts
// store/counter.ts
import { Exome } from "exome"

export class Counter extends Exome {
  public count = 0

  public increment() {
    this.count += 1
  }
}

export const counter = new Counter()
```

```tsx
// components/counter.tsx
import { useStore } from "exome/react"
import { counter } from "../stores/counter.ts"

export default function App() {
  const { count, increment } = useStore(counter)

  return (
    <h1 onClick={increment}>{count}</h1>
  )
}
```

[__Simple Demo__](https://codesandbox.io/s/exome-counter-96qfq)

# Table of contents

- [Core concepts](#core-concepts)
- [Usage](#usage)
- Integration
  - [React](#react)
  - [Preact](#preact)
  - [Vue](#vue)
  - [Svelte](#svelte)
  - [Lit](#lit)
  - [Rxjs](#rxjs)
  - [Angular](#angular)
  - [No framework](#no-framework)
- [Redux devtools](#redux-devtools)
- [API](#api)
- [FAQ](#faq)
- [**Benchmarks**](benchmark/README.md)
- [Motivation](#motivation)

# Installation
To install the stable version:
```bash
npm install --save exome
```
This assumes you are using [npm](https://www.npmjs.com/package/exome) as your package manager.

# Core concepts
Any piece of state you have, must use a class that extends `Exome`.

`Stores`

Store can be a single class or multiple ones. I'd suggest keeping stores small, in terms of property sizes.

`State values`

Remember that this is quite a regular class (with some behind the scenes work with Proxies). So you can write you data inside properties however you'd like. Properties can be public, private, object, arrays, getters, setters, static etc.

`Actions`

Every method in class is considered as an action. They are only for changing state. Whenever any method is called in Exome it triggers update to middleware and updates view components. Actions can be regular methods or even async ones.

If you want to get something from state via method, use getters.

# Usage
Library can be used without typescript, but I mostly recommend using it with typescript as it will guide you through what can and cannot be done as there are no checks without it and can lead to quite nasty bugs.

To create a typed store just create new class with a name of your choosing by extending `Exome` class exported from `exome` library.

```ts
import { Exome } from "exome"

// We'll have a store called "CounterStore"
class CounterStore extends Exome {
  // Lets set up one property "count" with default value "0"
  public count = 0

  // Now lets create action that will update "count" value
  public increment() {
    this.count += 1
  }
}
```
[__Open in codesandbox__](https://codesandbox.io/s/exome-counter-96qfq)

That is the basic structure of simple store. It can have as many properties as you'd like. There are no restrictions.

Now we should create an instance of `CounterStore` to use it.

```ts
const counter = new CounterStore()
```

Nice! Now we can start using `counter` state.

# Integration
## React
Use `useStore()` from `exome/react` to get store value and re-render component on store change.

```tsx
import { useStore } from "exome/react"
import { counter } from "../stores/counter.ts"

export function Example() {
  const { count, increment } = useStore(counter)
  return <button onClick={increment}>{count}</button>
}
```

## Preact
Use `useStore()` from `exome/preact` to get store value and re-render component on store change.

```tsx
import { useStore } from "exome/preact"
import { counter } from "../stores/counter.ts"

export function Example() {
  const { count, increment } = useStore(counter)
  return <button onClick={increment}>{count}</button>
}
```

## Vue
Use `useStore()` from `exome/vue` to get store value and re-render component on store change.

```html
<script lang="ts" setup>
  import { useStore } from "exome/vue";
  import { counter } from "./store/counter.ts";

  const { count, increment } = useStore(counter);
</script>

<template>
  <button @click="increment()">{{ count }}</button>
</template>
```

## Svelte
Use `useStore()` from `exome/svelte` to get store value and re-render component on store change.

```html
<script>
  import { useStore } from "exome/svelte"
  import { counter } from "./store/counter.js"

  const { increment } = counter
  const count = useStore(counter, s => s.count)
</script>

<main>
  <button on:click={increment}>{$count}</button>
</main>
```

## Lit
Use `StoreController` from `exome/lit` to get store value and re-render component on store change.

```ts
import { StoreController } from "exome/lit"
import { counter } from "./store/counter.js"

@customElement("counter")
class extends LitElement {
  private counter = new StoreController(this, counter);

  render() {
    const { count, increment } = this.counter.store;

    return html`
      <h1 @click=${increment}>${count}</h1>
    `;
  }
}
```

## Rxjs
Use `observableFromExome` from `exome/rxjs` to get store value as Observable and trigger it when it changes.

```ts
import { observableFromExome } from "exome/rxjs"
import { counter } from "./store/counter.js"

observableFromExome(countStore)
  .pipe(
    map(({ count }) => count),
    distinctUntilChanged()
  )
  .subscribe((value) => {
    console.log("Count changed to", value);
  });

setInterval(counter.increment, 1000);
```

## Angular
Angular support is handled via rxjs async pipes!

Use `observableFromExome` from `exome/rxjs` to get store value as Observable and trigger it when it changes.

```ts
import { observableFromExome } from "exome/rxjs"
import { counter } from "./store/counter.ts"

@Component({
  selector: 'my-app',
  template: `
    <h1 *ngIf="(counter$ | async) as counter" (click)="counter.increment()">
      {{counter.count}}
    </h1>
  `,
})
export class App {
  public counter$ = observableFromExome(counter)
}
```

## No framework
Use `subscribe` from `exome` to get store value in subscription callback event when it changes.

```ts
import { subscribe } from "exome"
import { counter } from "./store/counter.js"

const unsubscribe = subscribe(counter, ({ count }) => {
  console.log("Count changed to", count)
})

setInterval(counter.increment, 1000)
setTimeout(unsubscribe, 5000)
```

# Redux devtools

You can use redux devtools extension to explore Exome store chunk by chunk.

Just add `exomeReduxDevtools` middleware via `addMiddleware` function exported by library before you start defining store.

```ts
import { addMiddleware } from 'exome'
import { exomeReduxDevtools } from 'exome/devtools'

addMiddleware(
  exomeReduxDevtools({
    name: 'Exome Playground'
  })
)
```

It all will look something like this:

![Exome using Redux Devtools](https://user-images.githubusercontent.com/16621507/115083737-871c3d00-9f10-11eb-94e7-21353d093a7e.png)

# API
### `Exome`
A class with underlying logic that handles state changes. Every store must be extended from this class.

```ts
abstract class Exome {}
```

### `useStore`
Is function exported from "exome/react".

```ts
function useStore<T extends Exome>(store: T): Readonly<T>
```

__Arguments__
1. `store` _([Exome](#exome))_: State to watch changes from. Without Exome being passed in this function, react component will not be updated when particular Exome updates.

__Returns__

- [_Exome_](#exome): Same store is returned.

__Example__

```tsx
import { useStore } from "exome/react"

const counter = new Counter()

function App() {
  const { count, increment } = useStore(counter)

  return <button onClick={increment}>{count}</button>
}
```
[__Open in Codesandbox__](https://codesandbox.io/s/exome-counter-96qfq)

### `onAction`
Function that calls callback whenever specific action on Exome is called.

```ts
function onAction(store: typeof Exome): Unsubscribe
```

__Arguments__
1. `store` _([Exome](#exome) constructor)_: Store that has desired action to listen to.
2. `action` _(string)_: method (action) name on store instance.
3. `callback` _(Function)_: Callback that will be triggered before or after action.<br>
   __Arguments__
   - `instance` _([Exome](#exome))_: Instance where action is taking place.
   - `action` _(String)_: Action name.
   - `payload` _(any[])_: Array of arguments passed in action.<br>
4. `type` _("before" | "after")_: when to run callback - before or after action, default is `"after"`.

__Returns__

- _Function_: Unsubscribes this action listener

__Example__

```tsx
import { onAction } from "exome"

const unsubscribe = onAction(
  Person,
  'rename',
  (instance, action, payload) => {
    console.log(`Person ${instance} was renamed to ${payload[0]}`);

    // Unsubscribe is no longer needed
    unsubscribe();
  },
  'before'
)
```

### `saveState`
Function that saves snapshot of current state for any Exome and returns string.

```ts
function saveState(store: Exome): string
```

__Arguments__
1. `store` _([Exome](#exome))_: State to save state from (will save full state tree with nested Exomes).

__Returns__

- _String_: Stringified Exome instance

__Example__

```tsx
import { saveState } from "exome/state"

const saved = saveState(counter)
```

### `loadState`
Function that loads saved state in any Exome instance.

```ts
function loadState(
  store: Exome,
  state: string
): Record<string, any>
```

__Arguments__
1. `store` _([Exome](#exome))_: Store to load saved state to.
2. `state` _(String)_: Saved state string from `saveState` output.

__Returns__

- _Object_: Data that is loaded into state, but without Exome instance (if for any reason you have to have this data).

__Example__

```ts
import { loadState, registerLoadable } from "exome/state"

registerLoadable({
  Counter
})

const newCounter = new Counter()

const loaded = loadState(newCounter, saved)
loaded.count // e.g. = 15
loaded.increment // undefined

newCounter.count // new counter instance has all of the state applied so also = 15
newCounter.increment // [Function]
```

### `registerLoadable`
Function that registers Exomes that can be loaded from saved state via [`loadState`](#loadState).

```ts
function registerLoadable(
  config: Record<string, typeof Exome>,
): void
```

__Arguments__
1. `config` _(Object)_: Saved state string from `saveState` output.
   - key _(String)_: Name of the Exome state class (e.g. `"Counter"`).
   - value _([Exome](#exome) constructor)_: Class of named Exome (e.g. `Counter`).

__Returns__

- _void_

__Example__

```ts
import { loadState, registerLoadable } from "exome/state"

registerLoadable({
  Counter,
  SampleStore
})
```

### `addMiddleware`
Function that adds middleware to Exome. It takes in callback that will be called every time before an action is called.

React hook integration is actually a middleware.

```ts
type Middleware = (instance: Exome, action: string, payload: any[]) => (void | Function)

function addMiddleware(fn: Middleware): void
```

__Arguments__
1. `callback` _(Function)_: Callback that will be triggered `BEFORE` action is started.<br>
   __Arguments__
   - `instance` _([Exome](#exome))_: Instance where action is taking place.
   - `action` _(String)_: Action name.
   - `payload` _(any[])_: Array of arguments passed in action.<br>

   __Returns__
   - _(void | Function)_: Callback can return function that will be called `AFTER` action is completed.

__Returns__

- _void_: Nothingness...

__Example__

```ts
import { Exome, addMiddleware } from "exome"

addMiddleware((instance, name, payload) => {
  if (!(instance instanceof Timer)) {
    return;
  }

  console.log(`before action "${name}"`, instance.time);

  return () => {
    console.log(`after action "${name}"`, instance.time);
  };
});

class Timer extends Exome {
  public time = 0;

  public increment() {
    this.time += 1;
  }
}

const timer = new Timer()

setInterval(timer.increment, 1000)

// > before action "increment", 0
// > after action "increment", 1
//   ... after 1s
// > before action "increment", 1
// > after action "increment", 2
//   ...
```
[__Open in Codesandbox__](https://codesandbox.io/s/exome-middleware-ro6of?file=/src/App.tsx)

# FAQ
### Q: Can I use Exome inside Exome?
YES! It was designed for that exact purpose.
Exome can have deeply nested Exomes inside itself. And whenever new Exome is used in child component, it has to be wrapped in `useStore` hook and that's the only rule.

For example:
```tsx
class Todo extends Exome {
  constructor(public message: string, public completed = false) {
    super();
  }

  public toggle() {
    this.completed = !this.completed;
  }
}

class Store extends Exome {
  constructor(public list: Todo[]) {
    super();
  }
}

const store = new Store([
  new Todo("Code a new state library", true),
  new Todo("Write documentation")
]);

function TodoView({ todo }: { todo: Todo }) {
  const { message, completed, toggle } = useStore(todo);

  return (
    <li>
      <strong
        style={{
          textDecoration: completed ? "line-through" : "initial"
        }}
      >
        {message}
      </strong>
      &nbsp;
      <button onClick={toggle}>toggle</button>
    </li>
  );
}

function App() {
  const { list } = useStore(store);

  return (
    <ul>
      {list.map((todo) => (
        <TodoView key={getExomeId(todo)} todo={todo} />
      ))}
    </ul>
  );
}
```
[__Open in Codesandbox__](https://codesandbox.io/s/exome-todo-sz1j4?file=/src/App.tsx)

### Q: Can deep state structure be saved to string and then loaded back as an instance?
YES! This was also one of key requirements for this. We can save full state from any Exome with [`saveState`](#saveState), save it to file or database and the load that string up onto Exome instance with [`loadState`](#loadState).

For example:
```tsx
const savedState = saveState(store)

const newStore = new Store()

loadState(newStore, savedState)
```

### Q: Can I update state outside of React component?
Absolutely. You can even share store across multiple React instances (or if we're looking into future - across multiple frameworks).

For example:
```tsx
class Timer extends Exome {
  public time = 0

  public increment() {
    this.time += 1
  }
}

const timer = new Timer()

setInterval(timer.increment, 1000)

function App() {
  const { time } = useStore(timer)

  return <h1>{time}</h1>
}
```
[__Open in Codesandbox__](https://codesandbox.io/s/exome-middleware-ro6of?file=/src/App.tsx)

# IE support
To run Exome on IE, you must have `Symbol` and `Promise` polyfills and down-transpile to ES5 as usual. And that's it!

# Motivation
I stumbled upon a need to store deeply nested store and manage chunks of them individually and regular flux selector/action architecture just didn't make much sense anymore. So I started to prototype what would ideal deeply nested store interaction look like and I saw that we could simply use classes for this.

**Goals I set for this project:**

- [x] Easy usage with deeply nested state chunks (array in array)
- [x] Type safe with TypeScript
- [x] To have actions be only way of editing state
- [x] To have effects trigger extra actions
- [x] Redux devtool support

# License
[MIT](LICENCE) &copy; [Marcis Bergmanis](https://twitter.com/marcisbee)
