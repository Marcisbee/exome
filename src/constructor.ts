import { CONSTRUCTOR, exomeId, exomeName } from "./constants.ts";
import { createID } from "./create-id.ts";
import { runMiddleware } from "./middleware.ts";
import { subscriptions } from "./subscribe.ts";
import { wrapper } from "./utils/wrapper.ts";

export class Exome {
	private [exomeId]: string;
	private [exomeName]!: string;

	constructor() {
		const name = this[exomeName] || this[CONSTRUCTOR].name;
		const id = (this[exomeId] = name + "-" + createID());

		subscriptions[id] = new Set();

		try {
			return wrapper(this);
		} catch (error) {
			// Need only the "finally" branch, so just rethrow whatever we get here.
			// biome-ignore lint/complexity/noUselessCatch:
			throw error;
		} finally {
			// Run this code after constructor to get all the parameters right.
			runMiddleware(this, "NEW", []);
		}
	}
}
