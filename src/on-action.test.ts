import { fake } from "sinon";
import { test } from "uvu";
import assert from "uvu/assert";

import { Exome } from "./constructor";
import { middleware, runMiddleware } from "./middleware";

import { onAction } from "./on-action";

test.before.each(() => {
	middleware.splice(0, 100);
});

test("exports `onAction`", () => {
	assert.ok(onAction);
});

test("that `onAction` is function", () => {
	assert.instance(onAction, Function);
});

test("adds before middleware without errors", () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const person = new Person("John");
	const handler = fake();

	onAction(Person, "rename", handler, "before");

	const after = runMiddleware(person, "rename", [1]);

	assert.equal(handler.callCount, 1);
	assert.equal(handler.args[0], [person, "rename", [1]]);

	after();

	assert.equal(handler.callCount, 1);
});

test("adds after middleware without errors", () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const person = new Person("John");
	const handler = fake();

	onAction(Person, "rename", handler, "after");

	const after = runMiddleware(person, "rename", [1]);

	assert.equal(handler.callCount, 0);

	after();

	assert.equal(handler.callCount, 1);
	assert.equal(handler.args[0], [person, "rename", [1], undefined]);
});

test("calls NEW action correctly", async () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const handler = fake();
	onAction(Person, "NEW", handler);

	assert.equal(handler.callCount, 0);

	new Person("John");

	await new Promise((resolve) => setTimeout(resolve, 0));

	assert.equal(handler.callCount, 1);
	assert.instance(handler.args[0][0], Person);
	assert.equal(handler.args[0][1], "NEW");
	assert.equal(handler.args[0][2].length, 0);
});

test("calls LOAD_STATE action correctly before", async () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const handler = fake();
	onAction(Person, "LOAD_STATE", handler, "before");

	assert.equal(handler.callCount, 0);

	const instance = new Person("John");

	runMiddleware(instance, "LOAD_STATE", []);

	assert.equal(handler.callCount, 1);
	assert.instance(handler.args[0][0], Person);
	assert.equal(handler.args[0][1], "LOAD_STATE");
	assert.equal(handler.args[0][2].length, 0);
});

test("calls LOAD_STATE action correctly after", async () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const handler = fake();
	onAction(Person, "LOAD_STATE", handler, "after");

	assert.equal(handler.callCount, 0);

	const instance = new Person("John");

	await new Promise((resolve) => setTimeout(resolve, 0));

	const after = runMiddleware(instance, "LOAD_STATE", []);
	after();

	assert.equal(handler.callCount, 1);
	assert.instance(handler.args[0][0], Person);
	assert.equal(handler.args[0][1], "LOAD_STATE");
	assert.equal(handler.args[0][2].length, 0);
});

test("calls any action correctly", async () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const handler = fake();
	onAction(Person, null, handler);

	assert.equal(handler.callCount, 0);

	const person = new Person("John");

	await new Promise((resolve) => setTimeout(resolve, 0));

	assert.equal(handler.callCount, 1);
	assert.instance(handler.args[0][0], Person);
	assert.equal(handler.args[0][1], "NEW");
	assert.equal(handler.args[0][2].length, 0);

	person.rename("Jane");

	assert.equal(handler.callCount, 2);
	assert.equal(handler.args[1], [person, "rename", ["Jane"], undefined]);
});

test("calls custom action correctly", () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const handler = fake();
	onAction(Person, "rename", handler);

	assert.equal(handler.callCount, 0);

	const person = new Person("John");

	assert.equal(handler.callCount, 0);

	person.rename("Jane");

	assert.equal(handler.callCount, 1);
	assert.equal(handler.args[0], [person, "rename", ["Jane"], undefined]);
});

test("unsubscribes correctly", () => {
	class Person extends Exome {
		constructor(public name?: string) {
			super();
		}

		public rename(name: string) {
			this.name = name;
		}
	}

	const handler = fake();
	const unsubscribe = onAction(Person, "rename", handler);

	assert.equal(handler.callCount, 0);

	const person = new Person("John");

	assert.equal(handler.callCount, 0);

	person.rename("Jane");

	assert.equal(handler.callCount, 1);

	person.rename("Janine");

	assert.equal(handler.callCount, 2);

	unsubscribe();

	assert.equal(handler.callCount, 2);
});

test.run();
