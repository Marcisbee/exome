import { Exome } from 'exome'
import { useStore } from 'exome/solid'
import { createComputed, createRoot } from 'solid-js'

class Counter extends Exome {
  count = 0
  label = 'initial'

  increment() {
    this.count += 1
  }

  rename() {
    this.label = 'changed'
  }
}

export function observe(selector: boolean) {
  return createRoot((dispose) => {
    const store = new Counter()
    const values: (number | [number, string])[] = []
    const state = selector
      ? useStore(store, (s) => s.count)
      : useStore(store)

    createComputed(() => {
      const value = state()
      values.push(typeof value === 'number' ? value : [value.count, value.label])
    })

    store.increment()
    store.rename()
    store.increment()
    dispose()
    return values
  })
}
