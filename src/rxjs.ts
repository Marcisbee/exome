import { type Exome, subscribe } from "exome";
import { Observable } from "rxjs";

export function observableFromExome<T extends Exome = Exome>(
	store: T,
): Observable<T> {
	return new Observable<T>((subscriber) => {
		subscribe(store, (value: any) => subscriber.next(value));
		subscriber.next(store);
	});
}
