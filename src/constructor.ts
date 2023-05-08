import { runMiddleware } from "./middleware.ts";
import { CONSTRUCTOR, exomeId, exomeName } from "./constants.ts";
import { createID } from "./create-id.ts";
import { subscriptions } from "./subscribe.ts";
import { wrapper } from "./utils/wrapper.ts";

export class Exome {
	private [exomeId]: string;
	private [exomeName]!: string;

	constructor() {
		const name = this[exomeName] || this[CONSTRUCTOR].name;
		const id = (this[exomeId] = name + createID());

		subscriptions[id] = new Set();

		// Run this code after constructor to get all the parameters right.
		Promise.resolve().then(() => runMiddleware(this, "NEW", []));

		return wrapper(this);
	}

	// @TODO what to do with this?
	// public afterLoadState(cb: () => void) {
	//   if (afterLoadStateCallbacks == null) {
	//     return;
	//   }

	//   afterLoadStateCallbacks.push(cb);
	// }
}
