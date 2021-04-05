import { runMiddleware } from '../middleware'
import { exomeId } from './exome-id'
import { updateQueue } from './update-maps'
import { updateView } from './update-view'

export function proxify(parent: any, name: string, id: string): any {
  const proxy = new Proxy(
    parent,
    {
      get: (target, key) => {
        if (parent === target && parent[exomeId] && typeof target[key] === 'function') {
          return (...args: any) => {
            target.constructor.before?.[key]?.call(proxy)

            const output = target[key].call(proxy, ...args)

            if (output instanceof Promise) {
              output
                .then(() => {
                  if (!updateQueue.has(name)) {
                    updateQueue.set(id, true)
                  }

                  runMiddleware(target, String(key), args)

                  target.constructor.after?.[key]?.call(proxy)
                  updateView()
                })
                .catch((error) => {
                  throw error
                })
            } else {
              if (!updateQueue.has(name)) {
                updateQueue.set(id, true)
              }

              runMiddleware(target, String(key), args)

              target.constructor.after?.[key]?.call(proxy)
              updateView()
            }

            return output
          }
        }

        if (target[key] !== null && typeof target[key] === 'object') {
          return proxify(target[key], name, id)
        }

        return target[key]
      },

      set: (target, key, value) => {
        target[key] = value

        return true
      }
    }
  )

  return proxy
}
