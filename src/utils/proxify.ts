import { estoreId } from './estore-id'
import { updateQueue } from './update-maps'
import { updateView } from './update-view'

export function proxify (parent: any, name: string, id: string): any {
  return new Proxy(
    parent,
    {
      get: (target, key) => {
        if (key === estoreId) {
          return id
        }

        if (typeof target[key] === 'function') {
          return (...args: any) => {
            const output = target[key](...args)

            if (!updateQueue.has(name)) {
              updateQueue.set(id, true)
            }

            console.log('Action', key, 'was called in', name, '(', id, ')')

            updateView()

            return output
          }
        }

        if (target[key] !== null && typeof target[key] === 'object') {
          return proxify(target[key], name, id)
        }

        return target[key]
      },

      set: (target, key, value) => {
        if (key in target) {
          return false
        }

        target[key] = value

        return value
      }
    }
  )
}
