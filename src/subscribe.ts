import { exomeId } from "./constants.ts";
import type { Exome } from "./constructor.ts";

export const subscriptions: Record<string, Set<() => any>> = {};

export const subscribe = <T extends Exome>(
	store: T,
	fn: (store: T) => void,
) => {
	const set = (subscriptions[store[exomeId]] ??= new Set());
	const update = () => fn(store);

	set.add(update);

	return () => {
		set.delete(update);
	};
};

export const update = (store: Exome) => {
	for (const fn of subscriptions[store[exomeId]]?.values?.() || []) {
		fn();
	}
};

export const updateAll = () => {
	Object.values(subscriptions).map((set) => {
		for (const fn of set.values()) {
			fn();
		}
	});
};
