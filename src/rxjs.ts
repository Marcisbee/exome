import { Exome } from 'exome'
import { subscribe } from './subscribe'
import { Observable } from 'rxjs'

export function observableFromExome<T extends Exome = Exome>(
  store: T
): Observable<T> {
  return new Observable<T>((subscriber) => {
    subscribe(store, (value) => subscriber.next(value))
    subscriber.next(store)
  })
}
