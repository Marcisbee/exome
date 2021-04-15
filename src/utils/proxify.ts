import { Exome } from '../exome'
import { runMiddleware } from '../middleware'

export function proxify(parent: any, name: string, id: string): any {
  const proxy = new Proxy(
    parent,
    {
      get: (target, key) => {
        const value = target[key]

        if (parent === target && parent instanceof Exome && typeof value === 'function') {
          return (...args: any) => {
            const middleware = runMiddleware(proxy, key as any, args)

            const output = value.apply(proxy, args)

            if (output instanceof Promise) {
              return output
                .then((result) => {
                  if (typeof middleware === 'function') {
                    middleware()
                  }

                  return result
                })
                .catch((error) => {
                  throw error
                })
            }

            if (typeof middleware === 'function') {
              middleware()
            }

            return output
          }
        }

        if (value !== null && typeof value === 'object' && !(value instanceof Exome)) {
          return proxify(value, name, id)
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
