/**
 * @module exome/svelte
 */
import { type Exome, subscribe } from "exome";

/**
 * Subscribes to store instance update events and trigger updates to component accordingly.
 *
 * @example:
 * ```html
 * <script lang="ts">
 *   import { useStore } from "exome/svelte"
 *   import { counterStore } from "./counter.store.ts"
 *
 *   const { increment } = counterStore
 *   const count = useStore(counterStore, s => s.count)
 * </script>
 *
 * <main>
 *   <button on:click={increment}>{$count}</button>
 * </main>
 * ```
 */
export function useStore<T extends Exome, R = T>(
	store: T,
	selector: (state: T) => R = (v) => v as any,
): {
	subscribe(cb: (value: R) => void): () => void;
} {
	return {
		subscribe(cb: (value: R) => void) {
			cb(selector(store));
			return subscribe(store, () => cb(selector(store)));
		},
	};
}
