import { type Exome, subscribe } from "exome";
import { Observable } from "rxjs";

/**
 * Subscribes to store instance update events and trigger Observable updates accordingly.
 *
 * @example:
 * ```ts
 * import { observableFromExome } from "exome/rxjs"
 * import { counterStore } from "./counter.store.ts"
 *
 * observableFromExome(counterStore)
 *   .pipe(
 *     map(({ count }) => count),
 *     distinctUntilChanged()
 *   )
 *   .subscribe((value) => {
 *     console.log("Count changed to", value)
 *   });
 *
 * setInterval(counterStore.increment, 1000)
 * ```
 */
export function observableFromExome<T extends Exome = Exome>(
	store: T,
): Observable<T> {
	return new Observable<T>((subscriber) => {
		subscribe(store, (value: any) => subscriber.next(value));
		subscriber.next(store);
	});
}
