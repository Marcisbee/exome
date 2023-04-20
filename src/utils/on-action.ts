import { Exome } from "../exome";
import { addMiddleware } from "../middleware";

type Unsubscribe = () => void;

export function onAction<T extends Exome>(
	Parent: new (...args: any[]) => T,
	action: null | "NEW" | keyof T,
	callback: (instance: T, action: "NEW" | keyof T, payload: any[]) => void,
	type: "before" | "after" = "after",
): Unsubscribe {
	return addMiddleware((instance, targetAction, payload) => {
		if (
			!(
				instance instanceof Parent &&
				(targetAction === action || action === null)
			)
		) {
			return;
		}

		if (targetAction === "NEW" || type === "before") {
			callback(instance, targetAction as any, payload);
			return;
		}

		return () => {
			callback(instance, targetAction as any, payload);
		};
	});
}
