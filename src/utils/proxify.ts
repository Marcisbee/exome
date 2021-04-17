import { Exome } from '../exome'
import { runMiddleware } from '../middleware'

export function proxify<T extends Record<any, any>>(parent: T): T {
  const proxy = new Proxy(
    parent,
    {
      get: (target: any, key) => {
        const value = target[key]

        if (parent === target && parent instanceof Exome && typeof value === 'function') {
          return (...args: any) => {
            const middleware = runMiddleware(proxy as unknown as Exome, key as any, args)

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

        if (value !== null && typeof value === 'object' && (value.constructor === Object || value.constructor === Array)) {
          return proxify(value)
        }

        return target[key]
      },

      set: (target: any, key: string, value) => {
        target[key] = value

        return true
      }
    }
  )

  return proxy
}
