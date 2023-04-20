import { Exome, GhostExome } from "exome";

export function test(val: any): boolean {
	return val instanceof Exome || val instanceof GhostExome;
}

export function print(val: typeof Exome): string {
	const proto: Exome | GhostExome = Object.getPrototypeOf(val);
	const name: string = proto.constructor.name || "";

	return `${name} ${JSON.stringify(val, null, "  ")}`;
}
