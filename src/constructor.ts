import { CONSTRUCTOR, exomeId, exomeName } from "./constants.ts";
import { createID } from "./create-id.ts";
import { middleware, runMiddleware } from "./middleware.ts";
import { subscriptions } from "./subscribe.ts";
import { wrapper } from "./utils/wrapper.ts";

/**
 * Class that every store extends from.
 */
export class Exome {
	private [exomeId]: string;
	private [exomeName]!: string;

	constructor() {
		const name = this[exomeName] || this[CONSTRUCTOR].name;
		const id = (this[exomeId] = name + "-" + createID());
		const after = middleware.length && runMiddleware(this, "NEW", []);

		subscriptions[id] = new Set();

		// Run this code after child constructor to get all the parameters right.
		if (after) Promise.resolve().then(after as () => void);

		return wrapper(this);
	}
}
