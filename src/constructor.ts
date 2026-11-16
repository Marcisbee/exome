import { CONSTRUCTOR, exomeId, exomeName } from "./constants.ts";
import { createID } from "./create-id.ts";
import { runMiddleware } from "./middleware.ts";
import { wrapper } from "./utils/wrapper.ts";

const idValue = Symbol();
const idName = Symbol();

/**
 * Class that every store extends from.
 */
export class Exome {
	private [idValue]: string;
	private [idName]: string;

	private get [exomeId](): string {
		const name = this[exomeName];
		if (name && name !== this[idName]) {
			const id = this[idValue];
			this[idValue] = name + id.slice(id.indexOf("-"));
			this[idName] = name;
		}
		return this[idValue];
	}

	private set [exomeId](id: string) {
		this[idValue] = id;
		this[idName] = "";
	}
	private [exomeName]!: string;

	constructor() {
		const name = this[exomeName] || this[CONSTRUCTOR].name;
		this[idValue] = name + "-" + createID();
		// Shared accessors only rebuild the ID when registration changes its name.
		this[idName] = name;
		const after = runMiddleware(this, "NEW", []);

		// Run this code after child constructor to get all the parameters right.
		Promise.resolve().then(after as any);

		return wrapper(this);
	}
}
