import { type Exome, subscribe } from "exome";
import { useCallback, useSyncExternalStore } from "react";

export const useStore = <T extends Exome>(store: T): Readonly<T> => {
	return useSyncExternalStore(
		useCallback((l) => subscribe(store, l), [store]),
		useCallback(() => store, [store]),
	);
};
