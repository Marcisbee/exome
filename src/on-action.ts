import type { Exome } from "./constructor.ts";
import { addMiddleware } from "./middleware.ts";

type Unsubscribe = () => void;

/**
 * Listens to specific actions for all instances of particular store.
 */
export const onAction = <T extends Exome>(
	Parent: new (...args: any[]) => T,
	action: null | "NEW" | "LOAD_STATE" | keyof T,
	callback: (
		instance: T,
		action: "NEW" | "LOAD_STATE" | keyof T,
		payload: any[],
		error?: Error,
	) => void,
	type: "before" | "after" = "after",
): Unsubscribe => {
	return addMiddleware((instance, targetAction, payload) => {
		if (
			!(
				instance instanceof Parent &&
				(targetAction === action || action === null)
			)
		) {
			return;
		}

		if (type === "before") {
			callback(instance, targetAction as any, payload);
			return;
		}

		return (error) => callback(instance, targetAction as any, payload, error);
	});
};
