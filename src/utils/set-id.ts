import { Exome } from "../exome";
import { exomeId } from "./exome-id";

export function setExomeId(store: Exome, id: string): void {
	const [name] = store[exomeId].split("-");
	store[exomeId] = `${name}-${id}`;
}
