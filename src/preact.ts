import type { Exome } from 'exome'
import { useLayoutEffect, useEffect, useState } from 'preact/hooks'
import { subscribe } from './subscribe'

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? useLayoutEffect
  : useEffect

function flipBit(number: number) {
  return ~number
}

export function useStore<T extends Exome>(store: T): Readonly<T> {
  const [, render] = useState(0)

  useIsomorphicLayoutEffect(
    () => subscribe(store, () => render(flipBit)),
    [store]
  )

  return store
}
