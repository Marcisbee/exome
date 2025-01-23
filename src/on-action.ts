import type { Exome } from "./constructor.ts";
import { addMiddleware } from "./middleware.ts";

type Unsubscribe = () => void;

/**
 * Listens to specific actions for all instances of particular store.
 */
export const onAction = <
	T extends Exome,
	A extends null | "NEW" | "LOAD_STATE" | keyof T,
>(
	Parent: new (...args: any[]) => T,
	action: A,
	callback: <
		P extends A extends keyof T
			? T[A] extends (...args: infer P) => any
				? P
				: any[]
			: any[],
	>(
		instance: T,
		action: Exclude<A, null>,
		payload: P,
		error?: Error,
		response?: any,
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
			callback(instance, targetAction as any, payload as any);
			return;
		}

		return (error, response) =>
			callback(instance, targetAction as any, payload as any, error, response);
	});
};
