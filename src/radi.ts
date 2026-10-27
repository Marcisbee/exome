/**
 * @module exome/radi
 */
import { type Exome, subscribe } from "exome";

/**
 * Creates a subscribable value for Radi children and attributes.
 * Radi releases each subscription when its consuming element is removed.
 */
export function useStore<T extends Exome, R = T>(
	store: T,
	selector: (state: T) => R = (value) => value as unknown as R,
): {
	subscribe(callback: (value: R) => void): () => void;
} {
	return {
		subscribe(callback) {
			callback(selector(store));
			return subscribe(store, () => callback(selector(store)));
		},
	};
}
