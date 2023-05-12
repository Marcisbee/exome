import { exomeId } from "./constants.ts";
import type { Exome } from "./constructor.ts";

export const subscriptions: Record<string, Set<Function>> = {};

export const subscribe = (store: Exome, fn: Function) => {
	const set = (subscriptions[store[exomeId]] ??= new Set());

	set.add(fn);

	return () => {
		set.delete(fn);
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
