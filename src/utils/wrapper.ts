import { CONSTRUCTOR, FUNCTION } from "../constants.ts";
import type { Exome } from "../constructor.ts";
import { middleware as middlewares, runMiddleware } from "../middleware.ts";
import { update } from "../subscribe.ts";

export function getAllPropertyNames(obj: any) {
	const props = [];

	// biome-ignore lint/style/noParameterAssign:
	while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype) {
		for (const key of Object.getOwnPropertyNames(obj)) {
			if (
				key !== CONSTRUCTOR &&
				obj.hasOwnProperty(key) &&
				typeof Object.getOwnPropertyDescriptor(obj, key)?.get !== FUNCTION
			)
				props.push(key);
		}
	}

	return props;
}

export const wrapper = <T extends Exome>(parent: T): T => {
	const properties = getAllPropertyNames(parent);
	// Reuse the completion callback while there are no middleware listeners.
	// Check listeners at invocation time so existing stores see registrations.
	const notify = () => update(parent);

	for (const key of properties) {
		const value = (parent as any)[key];

		if (typeof value === FUNCTION) {
			(parent as any)[key] = (...args: any) => {
				const middleware =
					middlewares.length || key === "NEW"
						? runMiddleware(parent, key, args)
						: notify;
				try {
					const output = value.apply(parent, args);

					if (output && typeof output.then === FUNCTION) {
						return new Promise<any>((resolve, reject) => {
							(output as Promise<any>)
								.then(
									(result) => (middleware(undefined, result), resolve(result)),
								)
								.catch((error) => (reject(error), middleware(error)));
						});
					}

					return middleware(undefined, output), output;
				} catch (error) {
					middleware(error as Error);
					throw error;
				}
			};
		}
	}

	return parent;
};
