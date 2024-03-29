import { CONSTRUCTOR, FUNCTION } from "../constants.ts";
import { Exome } from "../constructor.ts";
import { runMiddleware } from "../middleware.ts";

export const wrapper = <T extends Exome>(parent: T): T => {
	const proto: Exome = Object.getPrototypeOf(parent) || {};

	for (const key of Object.getOwnPropertyNames(proto)) {
		const isGetter =
			typeof Object.getOwnPropertyDescriptor(proto, key)?.get === FUNCTION;

		if (!isGetter) {
			const isMethod = proto.hasOwnProperty(key);
			const value = (parent as any)[key];

			if (
				isMethod &&
				parent instanceof Exome &&
				key !== CONSTRUCTOR &&
				typeof value === FUNCTION
			) {
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
	}

	return parent;
};
