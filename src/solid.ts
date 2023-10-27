import { type Exome, subscribe } from "exome";
import { createSignal, onCleanup } from "solid-js";

export function useStore<T extends Exome, R = T>(
	store: T,
	selector: (state: T) => R = (v) => v as any,
) {
	const [value, setValue] = createSignal(selector(store));

	function render() {
		setValue(() => selector(store));
	}

	const unsubscribe = subscribe(store, render);
	onCleanup(() => unsubscribe);

	return value;
}
