import type { Exome } from "./constructor.ts";

// Store-owned subscriptions allow callback/store cycles to be collected together.
const subscriptions = new WeakMap<Exome, Set<() => any>>();
const allSubscriptions = new Set<{ deref(): Set<() => any> | undefined }>();
const collected =
	typeof FinalizationRegistry === "function"
		? new FinalizationRegistry<{ deref(): Set<() => any> | undefined }>(
				(ref) => {
					allSubscriptions.delete(ref);
				},
			)
		: undefined;

function track(set: Set<() => any>) {
	// Preserve updateAll on older runtimes that do not support weak references.
	const ref =
		typeof WeakRef === "function" ? new WeakRef(set) : { deref: () => set };
	allSubscriptions.add(ref);
	collected?.register(set, ref);
}

/**
 * Subscribe to store instance update events.
 */
export const subscribe = <T extends Exome>(
	store: T | null | undefined,
	fn: (store: T) => void,
): (() => void) => {
	if (store == null) {
		return () => {};
	}

	let set = subscriptions.get(store);
	if (!set) {
		set = new Set();
		subscriptions.set(store, set);
		track(set);
	}
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
	for (const fn of subscriptions.get(store)?.values() || []) {
		fn();
	}
};

/**
 * Sends update event to all existing store instances.
 */
export const updateAll = (): void => {
	for (const ref of [...allSubscriptions]) {
		const set = ref.deref();
		if (!set) {
			allSubscriptions.delete(ref);
			continue;
		}
		for (const fn of set) fn();
	}
};
