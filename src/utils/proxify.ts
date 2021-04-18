import { Exome } from '../exome'
import { runMiddleware } from '../middleware'

export function proxify<T extends Exome>(parent: T): T {
  const proxy = new Proxy<T>(
    parent,
    {
      get(target: any, key) {
        const value = target[key]

        if (typeof value === 'function' && parent === target && parent instanceof Exome) {
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

        return value
      },

      set(target: any, key: string, value) {
        target[key] = value

        return true
      }
    }
  )

  return proxy
}
