import { Exome } from 'exome'
import { useStore } from 'exome/radi'
import { createRoot } from 'radi'

class Counter extends Exome {
  count = 0
  increment() { this.count += 1 }
  async incrementAsync() {
    await Promise.resolve()
    this.count += 1
  }
}

class ParentCounter extends Counter {
  child = new Counter()
}

const counter = new ParentCounter()
const nested = counter.child
const calls = document.createElement('output')
calls.id = 'subscriptions'
let selections = 0
const count = useStore(counter, store => {
  calls.textContent = String(++selections)
  return store.count
})
const target = document.createElement('main')
const root = createRoot(target)

function App() {
  return <section>
    <h1>{count}</h1>
    <p title={useStore(counter, store => `Count: ${store.count}`)}>{count}</p>
    <span>{useStore(nested, store => store.count)}</span>
  </section>
}

document.body.append(target, calls)
for (const [label, action] of [
  ['Increment', counter.increment],
  ['Async increment', counter.incrementAsync],
  ['Nested increment', nested.increment],
  ['Unmount', () => root.unmount()],
  ['Mount', () => root.render(<App />)],
] as const) {
  const button = document.createElement('button')
  button.textContent = label
  button.onclick = action
  document.body.append(button)
}
root.render(<App />)
