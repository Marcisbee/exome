import { type Exome, addMiddleware, getExomeId, update } from "exome";

interface ActionStatus<E = any> {
	loading: boolean;
	error: false | E;
	unsubscribe: () => void;
}

const actionStatusCache: Record<string, ActionStatus> = {};

/**
 * Subscribes to specific action in specific instance and returns satus about that action.
 */
export function getActionStatus<E = Error, T extends Exome = any>(
	store: T,
	action: keyof T,
): ActionStatus<E> {
	const key = getExomeId(store) + ":" + (action as string);
	let cached = actionStatusCache[key];

	if (cached) {
		return cached;
	}

	cached = actionStatusCache[key] = {
		loading: false,
		error: false,
		unsubscribe() {
			unsubscribe();
			actionStatusCache[key] = undefined as any;
		},
	};

	let actionIndex = 0;

	const unsubscribe = addMiddleware((instance, targetAction, payload) => {
		if (instance !== store || targetAction !== action || !cached) {
			return;
		}

		actionIndex++;
		const currentActionIndex = actionIndex;
		cached.loading = true;
		cached.error = false;

		update(instance);

		return (error) => {
			if (currentActionIndex !== actionIndex || !cached) {
				return;
			}

			cached.loading = false;
			cached.error = error || false;

			update(instance);
		};
	});

	return cached;
}
