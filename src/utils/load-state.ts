import {
	type Exome,
	exomeId,
	exomeName,
	runMiddleware,
	updateAll,
	exomeInstances,
	subscriptions,
} from "exome";

const loadableExomes: Record<string, typeof Exome> = {};

/**
 * For `loadState` to know what stores to build instances from, we must make sure we register them.
 *
 * @example:
 * ```ts
 * registerLoadable({
 *   CounterStore,
 * })
 * ```
 */
export const registerLoadable = (config: Record<string, any>): void => {
	Object.keys(config).forEach((key) => {
		const ExomeClass = config[key];
		ExomeClass.prototype[exomeName] = key;

		loadableExomes[key] = ExomeClass;

		// Update existing instances of this class
		const instances = exomeInstances.get(ExomeClass);
		if (instances) {
			for (const instance of instances) {
				const oldId = instance[exomeId];
				const firstHyphenIndex = oldId.indexOf("-");
				const suffix = firstHyphenIndex !== -1 ? oldId.substring(firstHyphenIndex + 1) : oldId;
				const newId = `${key}-${suffix}`;

				// Update the instance's ID
				instance[exomeId] = newId;

				// Update subscriptions mapping
				if (subscriptions[oldId]) {
					subscriptions[newId] = subscriptions[oldId];
					delete subscriptions[oldId];
				}
			}
		}
	});
};

/**
 * Loads saved store into existing store instance. It will rebuild all children stores too.
 *
 * @example:
 * ```ts
 * const counterStore = new CounterStore()
 * const savedStore = `{"$$exome_id":"CounterStore-LS5WUJPF17SF","count":200}`
 *
 * loadState(counterStore, savedStore)
 * ```
 */
export const loadState = (store: Exome, state: string): any => {
	if (!state || typeof state !== "string") {
		throw new Error(
			`State was not loaded. Passed state must be string, instead received "${typeof state}".`,
		);
	}

	const instances = new Map<string, Exome>();

	const output = JSON.parse(state, (key, value) => {
		if (key !== "" && value && typeof value === "object" && value.$$exome_id) {
			const {
				$$exome_id: localId,
				...state
			}: { $$exome_id: string; [key: string]: any } = value;

			const cachedInstance = instances.get(localId);

			if (cachedInstance) {
				for (const key in state) {
					if ((cachedInstance as any)[key] !== state[key]) {
						(cachedInstance as any)[key] = state[key];
					}
				}
				return cachedInstance;
			}

			const [name] = localId.split("-");
			const StoreExome = loadableExomes[name];

			if (!StoreExome) {
				throw new Error(
					`State cannot be loaded! "${name}" was not registered via \`registerLoadable\`.`,
				);
			}

			try {
				const instance = new StoreExome();

				const after = runMiddleware(instance, "LOAD_STATE", []);

				instance[exomeId] = localId;

				Object.assign(instance, state);

				instances.set(localId, instance);

				after();

				return instance;
			} catch (e) {
				throw new Error(
					`State cannot be loaded! "${name}.constructor" has logic that prevents state from being loaded.`,
				);
			}
		}

		return value;
	});

	if (!output?.$$exome_id) {
		throw new Error(
			"State was not loaded. Passed state string is not saved Exome instance.",
		);
	}

	const { $$exome_id: rootId, ...data } = output;

	const after = runMiddleware(store, "LOAD_STATE", []);

	Object.assign(store, data);

	after();

	// Run view update after state has been loaded
	updateAll();

	return data;
};
