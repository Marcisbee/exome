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

			if (
				isMethod &&
				parent instanceof Exome &&
				key !== CONSTRUCTOR &&
				typeof (parent as any)[key] === FUNCTION
			) {
				const value = (parent as any)[key].bind(parent);

				(parent as any)[key] = (...args: any) => {
					const middleware = runMiddleware(parent, key, args);

					const output = value(...args);

					if (output instanceof Promise) {
						return output.then((result) => (middleware(), result));
					}

					return middleware(), output;
				};
			}
		}
	}

	return parent;
};
