/**
 * @module exome/preact
 */
import { type Exome, subscribe } from "exome";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";

const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

function increment(number: number): number {
	return number + 1;
}

/**
 * Subscribes to store instance update events and trigger updates to component accordingly.
 *
 * @example:
 * ```ts
 * import { useStore } from "exome/preact"
 * import { counterStore } from "./counter.store.ts"
 *
 * function App() {
 *   const { count, increment } = useStore(counterStore)
 *
 *   return (
 *     <button onClick={increment}>{count}</button>
 *   );
 * }
 * ```
 */
export function useStore<T extends Exome>(store: T): Readonly<T> {
	const [, render] = useState(0);

	useIsomorphicLayoutEffect(
		() => subscribe(store, () => render(increment)),
		[store],
	);

	return store;
}
