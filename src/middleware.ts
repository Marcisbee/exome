import { Exome } from './exome'

export type Middleware = (instance: Exome, action: string, payload: any[]) => void

export const middleware: Middleware[] = []

export function addMiddleware(fn: Middleware) {
  middleware.push(fn)
}

export function runMiddleware(...params: Parameters<Middleware>) {
  middleware.forEach((middleware) => middleware(...params))
}
