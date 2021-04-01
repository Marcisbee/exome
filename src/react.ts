import React from 'react'

import { Estore } from './estore'
import { estoreId } from './utils/estore-id'
import { updateRenderers } from './utils/update-maps'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

export function useStore<T extends Estore> (store: T): Readonly<T> {
  const renderer = React.useState<any>({})
  const id: string = (store as any)[estoreId]

  useIsomorphicLayoutEffect(
    () => {
      updateRenderers.get(id)!.push(() => {
        console.log('Re-renders view for', id)
        renderer[1]({})
      })
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
