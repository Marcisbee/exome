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
	selector: (state: T) => R = (v) => v as any,
): Accessor<R> {
	const [value, setValue] = createSignal(selector(store));

	function render() {
		setValue(() => selector(store));
	}

	const unsubscribe = subscribe(store, render);
	onCleanup(() => unsubscribe);

	return value;
}
