import { Exome, addMiddleware, Middleware, getExomeId, updateMap } from 'exome'
import { useLayoutEffect, useEffect, useReducer } from 'preact/hooks'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? useLayoutEffect
  : useEffect

const preactMiddleware: Middleware = (instance) => {
  return () => {
    const id = getExomeId(instance)
    const renderers = updateMap[id] ?? []

    updateMap[id] = []

    renderers.forEach((renderer) => renderer())
  }
}

addMiddleware(preactMiddleware)

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const [changed, render] = useReducer((n: boolean) => !n, true)
  const id = getExomeId(store)

  useIsomorphicLayoutEffect(
    () => {
      if (!updateMap[id]) {
        updateMap[id] = []
      }

      const queue = updateMap[id]!
      const renderHandler: any = render

      queue.push(renderHandler)

      return () => {
        if (queue === updateMap[id]!) {
          const index = queue.indexOf(renderHandler)

          if (index === -1) {
            return
          }

          queue.splice(index, 1)
        }
      }
    },
    [id, changed]
  )

  if (!id) {
    throw new Error(
      '"useStore" encountered store that is not an instance of "Exome"'
    )
  }

  return store
}
