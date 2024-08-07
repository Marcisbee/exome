import { CONSTRUCTOR, FUNCTION } from "../constants.ts";
import { Exome } from "../constructor.ts";
import { runMiddleware } from "../middleware.ts";

export function getAllPropertyNames(obj: any) {
	const props = [];

	while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype) {
		props.push(
			...Object.getOwnPropertyNames(obj).filter(
				(key) =>
					key !== CONSTRUCTOR &&
					obj.hasOwnProperty(key) &&
					typeof Object.getOwnPropertyDescriptor(obj, key)?.get !== FUNCTION,
			),
		);
	}

	return props;
}

export const wrapper = <T extends Exome>(parent: T): T => {
	const properties = getAllPropertyNames(parent);

	for (const key of properties) {
		const value = (parent as any)[key];

		if (typeof value === FUNCTION) {
			(parent as any)[key] = (...args: any) => {
				const middleware = runMiddleware(parent, key, args);
				try {
					const output = value.apply(parent, args);

					if (output instanceof Promise) {
						return new Promise<any>((resolve, reject) => {
							output
								.then((result) => (middleware(), resolve(result)))
								.catch((error) => (reject(error), middleware(error)));
						});
					}

					return middleware(), output;
				} catch (error) {
					middleware(error as Error);
					throw error;
				}
			};
		}
	}

	return parent;
};
