import React from 'react'

import { Estore } from './estore'
import { estoreId } from './utils/estore-id'
import { updateRenderers } from './utils/update-maps'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

export function useStore<T extends Estore>(store: T): Readonly<T> {
  const renderer = React.useState<any>({})
  const id: string = (store as any)[estoreId]

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
      '"useStore" encountered store that is not an instance of "Estore"'
    )
  }

  return store
}
