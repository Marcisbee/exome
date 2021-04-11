import { Exome, addMiddleware, Middleware, getExomeId, updateMap } from 'exome'
import React from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

const reactMiddleware: Middleware = (instance) => {
  return () => {
    const id = getExomeId(instance)
    const chunk = updateMap.get(id) ?? []

    updateMap.set(id, [])

    chunk.forEach((renderer) => renderer())
  }
}

addMiddleware(reactMiddleware)

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const renderer = React.useState<any>({})
  const id = getExomeId(store)

  useIsomorphicLayoutEffect(
    () => {
      const handler = () => {
        renderer[1]({})
      }

      if (!updateMap.has(id)) {
        updateMap.set(id, [])
      }

      const queue = updateMap.get(id)!

      queue.push(handler)

      return () => {
        if (queue === updateMap.get(id)!) {
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
