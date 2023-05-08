import { Exome, subscribe } from "exome";
import { getCurrentScope, onScopeDispose, shallowRef, triggerRef } from "vue";

export function useStore<T extends Exome>(store: T): Readonly<T> {
	const shallow = shallowRef(store);
	const unsubscribe = subscribe(store, () => triggerRef(shallow));

	getCurrentScope() && onScopeDispose(unsubscribe);

	return store;
}
