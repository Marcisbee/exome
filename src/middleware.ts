import { update } from "./subscribe.ts";
import type { Exome } from "./constructor.ts";
import { FUNCTION } from "./constants.ts";

export type Middleware = (
	instance: Exome,
	action: string,
	payload: any[],
) => void | (() => void);

export const middleware: Middleware[] = [];

export const addMiddleware = (fn: Middleware) => {
	middleware.push(fn);

	return () => {
		middleware.splice(middleware.indexOf(fn), 1);
	};
};

export const runMiddleware = (
	parent: Parameters<Middleware>[0],
	key: Parameters<Middleware>[1],
	args: Parameters<Middleware>[2],
) => {
	const after = middleware.map((middleware) => middleware(parent, key, args));

	return () => {
		update(parent);

		let x = 0;
		const l = after.length;
		while (x < l) {
			typeof after[x] === FUNCTION && (after[x] as Function)();
			++x;
		}
	};
};
