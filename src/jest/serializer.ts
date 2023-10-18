import { Exome } from "exome";
import { GhostExome } from "exome/ghost";

const depthMap = new WeakMap<typeof Exome, number>();

export function test(val: any): boolean {
	return val instanceof Exome || val instanceof GhostExome;
}

export function print(
	val: typeof Exome,
	printDepth: (value: any) => string,
): string {
	const proto: Exome | GhostExome = Object.getPrototypeOf(val);
	const name = proto.constructor.name || "Exome";

	const currentInstanceDepth = depthMap.get(val) || 0;
	depthMap.set(val, currentInstanceDepth + 1);

	try {
		if (currentInstanceDepth > 0) {
			return `${name} [circular]`;
		}

		return (
			`${name} ` +
			printDepth(
				Object.entries(val)
					.filter(([, value]) => typeof value !== "function")
					.sort(([a], [b]) => (a < b ? -1 : 1))
					.reduce<Record<string, any>>(
						(acc, [key, value]) => ({
							...acc,
							[key]: value,
						}),
						{},
					),
			)
		);
	} catch (e) {
		// biome-ignore lint/complexity/noUselessCatch: <explanation>
		throw e;
	} finally {
		if (currentInstanceDepth === 0) {
			depthMap.delete(val);
		} else {
			depthMap.set(val, currentInstanceDepth);
		}
	}
}
