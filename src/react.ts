import type { Exome } from "exome";
import { useLayoutEffect, useEffect, useState } from "react";
import { subscribe } from "./subscribe";

const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

function increment(number: number) {
	return number + 1;
}

export function useStore<T extends Exome>(store: T): Readonly<T> {
	const [, render] = useState(0);

	useIsomorphicLayoutEffect(
		() => subscribe(store, () => render(increment)),
		[store],
	);

	return store;
}
