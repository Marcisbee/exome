import { Exome } from './exome'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Middleware = (instance: Exome, action: string, payload: any[]) => (void | (() => void))

export const middleware: Middleware[] = []

export function addMiddleware(fn: Middleware) {
  middleware.push(fn)

  return () => {
    const index = middleware.indexOf(fn)
    middleware.splice(index, 1)
  }
}

export function runMiddleware(...params: Parameters<Middleware>) {
  const after = middleware.map((middleware) => middleware(...params))

  return () => {
    after.forEach((middleware) => {
      if (typeof middleware !== 'function') {
        return
      }

      middleware()
    })
  }
}
