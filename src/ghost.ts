import { exomeId } from "exome";

import { createID } from "./create-id.ts";

export class GhostExome {
	private [exomeId] = this.constructor.name + createID();
}
