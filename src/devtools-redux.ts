import { Exome, type Middleware, getExomeId, updateAll } from "exome";

interface ReduxMessage {
	type: string;
	state: string;
}

interface ReduxAction {
	type: string;
	payload: any;
}

interface Redux {
	subscribe: (cb: (message: ReduxMessage) => void) => void;
	send: (action: ReduxAction, state: Record<string, any>) => void;
	init: (state: Record<string, any>) => void;
}

interface ReduxConfig {
	name?: string;
	maxAge?: number;
	actionsBlacklist?: string | string[];
	serialize?: {
		replacer?: (key: string, value: any) => any;
		reviver?: (key: string, value: any) => any;
	};
}

const fullStore: Map<string, Map<string, Exome>> = new Map();

function deepCloneStore(value: any, depth: string[] = []): any {
	if (value == null || typeof value !== "object") {
		return value;
	}

	if (value instanceof Exome && getExomeId(value)) {
		const id = getExomeId(value);

		// Stop circular Exome
		if (depth.indexOf(id) > -1) {
			return {
				$$exome_id: id,
			};
		}

		const data = deepCloneStore({ ...value }, depth.concat(id));

		return {
			$$exome_id: id,
			...data,
		};
	}

	if (
		value.constructor !== Array &&
		value.constructor !== Object &&
		value.constructor !== Date
	) {
		return {
			$$exome_class: value.constructor.name,
		};
	}

	const output: Record<string, unknown> = value.constructor() || {};

	for (const key of Object.keys(value)) {
		output[key] = deepCloneStore(value[key], depth);
	}

	return output;
}

const getFullStore = (): any => {
	const output: Record<string, Exome[]> = {};

	for (const [key, map] of fullStore.entries()) {
		output[key] = Array.from(map.values());
	}

	// Improve serializer with `__serializedType__` once https://github.com/zalmoxisus/redux-devtools-extension/issues/737 is resolved
	return deepCloneStore(output);
};

/**
 * Subscribes to Redux DevTools.
 * https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
 */
export const exomeReduxDevtools = ({
	name,
	maxAge,
	actionsBlacklist,
}: {
	name?: string;
	maxAge?: number;
	actionsBlacklist?: string;
}): Middleware => {
	const devtoolName: string = "__REDUX_DEVTOOLS_EXTENSION__";
	let extension: any;
	try {
		extension =
			(window as any)[devtoolName] || (window.top as any)[devtoolName];
	} catch (e) {}

	if (!extension) {
		return () => {};
	}

	const config: ReduxConfig = {
		name,
		maxAge,
		actionsBlacklist,
	};

	const ReduxTool: Redux = extension.connect(config);

	ReduxTool.subscribe((message) => {
		if (message.type === "DISPATCH" && message.state) {
			// We'll just use json parse reviver function to update instances
			JSON.parse(message.state, (_, value) => {
				if (
					typeof value === "object" &&
					value !== null &&
					"$$exome_id" in value
				) {
					const { $$exome_id, ...restValue } = value;
					const [name] = $$exome_id.split("-");
					const instance = fullStore.get(name)?.get($$exome_id);

					Object.assign(instance!, restValue);

					return instance;
				}

				return value;
			});

			updateAll();
		}
	});

	ReduxTool.init(getFullStore());

	return (instance, action, payload) => {
		const id = getExomeId(instance);
		const name: string = id.replace(/-.*$/, "");
		const type = `[${name}] ${action}`;

		if (!name) {
			return;
		}

		if (!fullStore.has(name)) {
			fullStore.set(name, new Map());
		}

		if (action === "NEW") {
			fullStore.get(name)?.set(getExomeId(instance), instance);
			ReduxTool.send({ type, payload: undefined }, getFullStore());
		}

		return () => {
			let parsedPayload: any[] = [];

			try {
				parsedPayload = JSON.parse(JSON.stringify(payload));
			} catch (e) {}

			ReduxTool.send({ type, payload: parsedPayload }, getFullStore());
		};
	};
};
