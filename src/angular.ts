import {
	DestroyRef,
	assertInInjectionContext,
	inject,
	signal,
} from "@angular/core";
import { Exome, subscribe } from "exome";

export function useStore<T extends Exome, R = T>(
	store: T,
	selector: (state: T) => R = (v) => v as any,
) {
	const writableSignal = signal(selector(store));

	function render() {
		writableSignal.set(selector(store));
	}

	const unsubscribe = subscribe(store, render);

	const requiresCleanup: any = assertInInjectionContext(useStore);
	const cleanupRef = requiresCleanup ? inject(DestroyRef) : null;

	cleanupRef?.onDestroy(unsubscribe);

	return writableSignal.asReadonly();
}
