import { type Exome, subscribe } from "exome";
import { useEffect, useLayoutEffect, useState } from "react";

const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

function increment(number: number) {
	return number + 1;
}

export const useStore = <T extends Exome>(store: T): Readonly<T> => {
	const [, render] = useState(0);

	useIsomorphicLayoutEffect(
		() => subscribe(store, () => render(increment)),
		[store],
	);

	return store;
};
