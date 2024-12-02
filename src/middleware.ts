import { FUNCTION } from "./constants.ts";
import type { Exome } from "./constructor.ts";
import { update } from "./subscribe.ts";

export type Middleware = (
	instance: Exome,
	action: string,
	payload: any[],
) => void | ((error?: Error, response?: any) => void);

export const middleware: Middleware[] = [];

/**
 * Listens to middleware calls for any store instance.
 */
export const addMiddleware = (fn: Middleware): (() => void) => {
	middleware.push(fn);

	return () => {
		middleware.splice(middleware.indexOf(fn), 1);
	};
};

/**
 * Triggers middleware for particular store instance to be called.
 * When return function gets called, it maks that the middleware action
 * was completed with or without errors.
 */
export const runMiddleware = (
	parent: Parameters<Middleware>[0],
	key: Parameters<Middleware>[1],
	args: Parameters<Middleware>[2],
): ((error?: Error, response?: any) => void) => {
	const after = middleware.map((middleware) => middleware(parent, key, args));

	return (error?: Error, response?: any) => {
		if (key !== "NEW") update(parent);

		let x = 0;
		const l = after.length;
		while (x < l) {
			typeof after[x] === FUNCTION &&
				(after[x] as (error?: Error, response?: any) => void)(error, response);
			++x;
		}
	};
};
