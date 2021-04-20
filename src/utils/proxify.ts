import { Exome } from '../exome'
import { runMiddleware } from '../middleware'

function proxifyWithoutPromise<T extends Exome>(parent: T): T {
  Object.getOwnPropertyNames(Object.getPrototypeOf(parent)).forEach((key) => {
    const value = (parent as any)[key]

    if (key === 'constructor' || typeof value !== 'function') {
      return
    }

    (parent as any)[key] = (...args: any) => {
      const middleware = runMiddleware(parent, key as any, args)

      const output = value.apply(parent, args)

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
  })

  return parent
}

export function proxify<T extends Exome>(parent: T): T {
  // Handles browsers that don't support Proxy
  if (typeof Proxy === 'undefined') {
    return proxifyWithoutPromise(parent)
  }

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
      }
    }
  )

  // It means we're using Proxy polyfill, that runs `Object.seal` for target and output objects.
  // This is not acceptable behavior as it's no longer possible to extend Exome class.
  if (!Object.isExtensible(proxy)) {
    throw new Error('Exome class cannot be sealed. This is probably due to invalid Proxy polyfill.')
  }

  return proxy
}
