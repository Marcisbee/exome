import { exomeId } from "exome";

import { createID } from "./create-id.ts";

/**
 * This is a class that pretends to be Exome store, but doesn't apply same change detection logic.
 * This is useful for testing and mocking data.
 */
export class GhostExome {
	private [exomeId] = this.constructor.name + "-" + createID();
}
