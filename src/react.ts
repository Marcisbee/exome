import type { Exome } from 'exome'
import React from 'react'
import { subscribe } from './subscribe'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

function increment(number: number) {
  return number + 1
}

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const [, render] = React.useState(0)

  useIsomorphicLayoutEffect(
    () => subscribe(store, () => render(increment)),
    [store]
  )

  return store
}
