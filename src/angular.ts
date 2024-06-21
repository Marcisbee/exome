import {
	DestroyRef,
	type Signal,
	assertInInjectionContext,
	inject,
	signal,
} from "@angular/core";
import { type Exome, subscribe } from "exome";

/**
 * Creates Angular signal and subscribes to store instance update events and trigger updates to component accordingly.
 *
 * @example:
 * ```ts
 * import { useStore } from "exome/angular"
 * import { counterStore } from "./counter.store.ts"
 *
 * @Component({
 *   selector: 'my-app',
 *   template: `
 *     <button (click)="increment()">
 *       {{count}}
 *     </button>
 *   `,
 * })
 * export class App {
 *   public count = useStore(counterStore, (s) => s.count)
 *
 *   public increment() {
 *     counterStore.increment()
 *   }
 * }
 * ```
 */
export function useStore<T extends Exome, R = T>(
	store: T,
	selector: (state: T) => R = (v) => v as any,
): Signal<R> {
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
