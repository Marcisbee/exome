import type { Exome } from 'exome'
import React from 'react'
import { subscribe } from './subscribe'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? React.useLayoutEffect
  : React.useEffect

function flipBit(number: number) {
  return ~number
}

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const [, render] = React.useState(0)

  useIsomorphicLayoutEffect(
    () => subscribe(store, () => render(flipBit)),
    [store]
  )

  return store
}
