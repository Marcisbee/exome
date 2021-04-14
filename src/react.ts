import { Exome, addMiddleware, Middleware, getExomeId, updateMap } from 'exome'
import React from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

const reactMiddleware: Middleware = (instance) => {
  return () => {
    const id = getExomeId(instance)
    const renderers = updateMap[id] ?? []

    updateMap[id] = []

    renderers.forEach((renderer) => renderer())
  }
}

addMiddleware(reactMiddleware)

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const renderer = React.useReducer((n: boolean) => !n, true)
  const id = getExomeId(store)

  useIsomorphicLayoutEffect(
    () => {
      const handler = () => {
        renderer[1]()
      }

      if (!updateMap[id]) {
        updateMap[id] = []
      }

      const queue = updateMap[id]!

      queue.push(handler)

      return () => {
        if (queue === updateMap[id]!) {
          const index = queue.indexOf(handler)

          if (index === -1) {
            return
          }

          queue.splice(index, 1)
        }
      }
    },
    [renderer]
  )

  if (!id) {
    throw new Error(
      '"useStore" encountered store that is not an instance of "Exome"'
    )
  }

  return store
}
