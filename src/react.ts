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
  const [changed, render] = React.useReducer((n: boolean) => !n, true)
  const id = getExomeId(store)

  useIsomorphicLayoutEffect(
    () => {
      if (!updateMap[id]) {
        updateMap[id] = []
      }

      const queue = updateMap[id]!

      queue.push(render)

      return () => {
        if (queue === updateMap[id]!) {
          const index = queue.indexOf(render)

          if (index === -1) {
            return
          }

          queue.splice(index, 1)
        }
      }
    },
    [changed]
  )

  if (!id) {
    throw new Error(
      '"useStore" encountered store that is not an instance of "Exome"'
    )
  }

  return store
}
