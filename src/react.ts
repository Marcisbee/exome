import React from 'react'

import { Exome } from './exome'
import { exomeId } from './utils/exome-id'
import { updateRenderers } from './utils/update-maps'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const renderer = React.useState<any>({})
  const id: string = (store as any)[exomeId]

  useIsomorphicLayoutEffect(
    () => {
      const handler = () => {
        renderer[1]({})
      }

      const queue = updateRenderers.get(id)!

      queue.push(handler)

      return () => {
        if (queue === updateRenderers.get(id)!) {
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
