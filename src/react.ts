import { type Exome, subscribe } from "exome";
import { useEffect, useLayoutEffect, useState } from "react";

const renderIncrement = (number: number) => number + 1;

const useIsomorphicLayoutEffect =
	window === undefined ? useLayoutEffect : useEffect;

export const useStore = <T extends Exome>(store: T): Readonly<T> => {
	const [, render] = useState(0);

	useIsomorphicLayoutEffect(
		() => subscribe(store, () => render(renderIncrement)),
		[store],
	);

	return store;
};
