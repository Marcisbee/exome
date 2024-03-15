import { exomeId } from "../constants.ts";
import type { Exome } from "../constructor.ts";

/**
 * Gets unique id of specific store instance.
 */
export const getExomeId = (store: Exome): string => {
	return store[exomeId];
};

/**
 * Sets custom id to specific store instance.
 */
export const setExomeId = (store: Exome, id: string): void => {
	const [name] = getExomeId(store).split("-");
	store[exomeId] = `${name}-${id}`;
};
