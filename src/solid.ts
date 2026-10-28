/**
 * @module exome/solid
 */
import { type Exome, subscribe } from "exome";
import { type Accessor, createSignal, onCleanup } from "solid-js";

/**
 * Subscribes to store instance update events and trigger updates to component accordingly.
 *
 * @example:
 * ```ts
 * import { useStore } from "exome/solid"
 * import { counterStore } from "./counter.store.ts"
 *
 * function App() {
 *   const { count, increment } = useStore(counterStore, s => s.count)
 *
 *   return (
 *     <button onClick={increment}>{count}</button>
 *   );
 * }
 * ```
 */
export function useStore<T extends Exome, R = T>(
	store: T,
	selector?: (state: T) => R,
): Accessor<R> {
	const select = selector ?? ((v: T) => v as unknown as R);
	// Exome mutates the store in place, so the default accessor must notify
	// computations even though the store reference stays the same.
	const [value, setValue] = createSignal(
		select(store),
		selector ? undefined : { equals: false },
	);

	function render() {
		setValue(() => select(store));
	}

	const unsubscribe = subscribe(store, render);
	onCleanup(() => unsubscribe);

	return value;
}
