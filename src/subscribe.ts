import { exomeId } from "./constants.ts";
import type { Exome } from "./constructor.ts";

export const subscriptions: Record<string, Set<() => any>> = {};

/**
 * Subscribe to store instance update events.
 */
export const subscribe = <T extends Exome>(
	store: T,
	fn: (store: T) => void,
): (() => void) => {
	const set = (subscriptions[store[exomeId]] ??= new Set());
	const update = () => fn(store);

	set.add(update);

	return () => {
		set.delete(update);
	};
};

/**
 * Sends update event to specific store instance.
 */
export const update = (store: Exome): void => {
	for (const fn of subscriptions[store[exomeId]]?.values?.() || []) {
		fn();
	}
};

/**
 * Sends update event to all existing store instances.
 */
export const updateAll = (): void => {
	Object.values(subscriptions).map((set) => {
		for (const fn of set.values()) {
			fn();
		}
	});
};
