import { Exome } from '../exome'
import { runMiddleware } from '../middleware'
import { exomeId } from './exome-id'

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
                  runMiddleware(target, String(key), args)

                  target.constructor.after?.[key]?.call(proxy)
                })
                .catch((error) => {
                  throw error
                })
            } else {
              runMiddleware(target, String(key), args)

              target.constructor.after?.[key]?.call(proxy)
            }

            return output
          }
        }

        if (target[key] !== null && typeof target[key] === 'object' && !(target[key] instanceof Exome)) {
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
