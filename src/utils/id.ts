import { exomeId } from "../constants.ts";
import type { Exome } from "../constructor.ts";

export const getExomeId = (store: Exome): string => {
	return store[exomeId];
};

export const setExomeId = (store: Exome, id: string): void => {
	const [name] = getExomeId(store).split("-");
	store[exomeId] = `${name}-${id}`;
};
