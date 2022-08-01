import { Exome } from '../exome'
import { runMiddleware } from '../middleware'

export function proxify<T extends Exome>(parent: T): T {
  const proto = Object.getPrototypeOf(parent) || {}

  Object.getOwnPropertyNames(Object.getPrototypeOf(parent)).forEach((key) => {
    const isGetter = typeof Object.getOwnPropertyDescriptor(proto, key)?.get === 'function'

    if (isGetter) {
      return
    }

    // eslint-disable-next-line no-prototype-builtins
    const isMethod = (proto as Record<string, any>).hasOwnProperty(key)
    const value = (parent as any)[key]

    if (!isMethod || !(parent instanceof Exome) || key === 'constructor' || typeof value !== 'function') {
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
