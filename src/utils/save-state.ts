import { Exome, getExomeId } from "exome";

const replacer = (): any => {
	const savedInstances: Record<string, true> = {};

	return (_: string, value: any): any => {
		// Found an Exome instance, replace it with simple object
		// that contains `$$exome_id` property.
		if (value instanceof Exome) {
			const id = getExomeId(value);

			if (!id) {
				return value;
			}

			if (savedInstances[id]) {
				return {
					$$exome_id: id,
				};
			}

			savedInstances[id] = true;

			return {
				$$exome_id: id,
				...value,
			};
		}

		return value;
	};
};

/**
 * Saves given store instance and its children (even recursive) to string that can be later restored.
 *
 * @example:
 * ```ts
 * class CounterStore extends Exome {
 *   public count = 5
 *
 *   public increment() {
 *     this.count += 1
 *   }
 * }
 *
 * saveState(new CounterStore())
 * ```
 */
export const saveState = (store: Exome, readable = false): string => {
	const output = JSON.stringify(store, replacer(), readable ? 2 : undefined);

	if (output === undefined) {
		return "null";
	}

	return output;
};
