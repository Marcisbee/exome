import { test } from "uvu";
import assert from "uvu/assert";

import { Exome } from "../exome";
import { exomeId } from "./exome-id";

import { loadState, registerLoadable } from "./load-state";

test("exports `loadState`", () => {
	assert.ok(loadState);
});

test("that `loadState` is function", () => {
	assert.instance(loadState, Function);
});

test("throws error if `undefined` is passed in", () => {
	const target = new Exome();

	assert.throws(() => {
		loadState(target, undefined as any);
	});
});

test("throws error if `null` is passed in", () => {
	const target = new Exome();

	assert.throws(() => {
		loadState(target, null as any);
	});
});

test('throws error if "null" is passed in', () => {
	const target = new Exome();

	assert.throws(() => {
		loadState(target, "null");
	});
});

test('throws error if "{}" is passed in', () => {
	const target = new Exome();

	assert.throws(() => {
		loadState(target, "{}");
	});
});

test('throws error if "{}" is passed in', () => {
	const target = new Exome();

	assert.throws(() => {
		loadState(target, "{}");
	});
});

test("doesn't modify root id of Exome instance", () => {
	const target = new Exome();
	const state = JSON.stringify({
		$$exome_id: "Exome-1",
	});

	loadState(target, state);

	assert.not.equal(target[exomeId], "Exome-1");
});

test("assigns simple property to Exome instance", () => {
	class Person extends Exome {
		public name?: string;
	}
	const target = new Person();
	const state = JSON.stringify({
		$$exome_id: "Person-1",
		name: "John",
	});

	loadState(target, state);

	assert.equal(target.name, "John");
});

test("throws error if class is missing", () => {
	class Person extends Exome {
		public name?: string;
		public friends: Person[] = [];
	}
	const target = new Person();
	const state = JSON.stringify({
		$$exome_id: "Person-1",
		name: "John",
		friends: [
			{
				$$exome_id: "Person-2",
				name: "Jane",
			},
		],
	});

	assert.throws(() => loadState(target, state));
});

test("assigns nested property to Exome instance", () => {
	class Person extends Exome {
		public name?: string;
		public friends: Person[] = [];
	}
	const target = new Person();
	const state = JSON.stringify({
		$$exome_id: "Person-1",
		name: "John",
		friends: [
			{
				$$exome_id: "Person-2",
				name: "Jane",
			},
		],
	});

	registerLoadable({
		Person,
	});

	loadState(target, state);

	assert.equal(target.name, "John");
	assert.equal(target.friends.length, 1);
	assert.instance(target.friends[0], Person);
	assert.equal(target.friends[0].name, "Jane");
	assert.equal(target.friends[0].friends, []);
	assert.equal(target.friends[0][exomeId], "Person-2");
});

test("assigns circular property to Exome instance", () => {
	class Dog extends Exome {
		public name?: string;
	}
	class Person extends Exome {
		public name?: string;
		public dogs: Dog[] = [];
	}
	class Store extends Exome {
		public persons: Person[] = [];
	}
	const target = new Store();
	const state = JSON.stringify({
		$$exome_id: "Store-1",
		persons: [
			{
				$$exome_id: "Person-1",
				name: "John",
				dogs: [
					{
						$$exome_id: "Dog-1",
						name: "Andy",
					},
					{
						$$exome_id: "Dog-2",
						name: "Buttons",
					},
				],
			},
			{
				$$exome_id: "Person-2",
				name: "Jane",
				dogs: [
					{
						$$exome_id: "Dog-1",
						name: "Andy",
					},
				],
			},
		],
	});

	registerLoadable({
		Person,
		Dog,
	});

	loadState(target, state);

	assert.equal(target.persons.length, 2);
	assert.instance(target.persons[0], Person);
	assert.equal(target.persons[0].name, "John");

	assert.equal(target.persons[0].dogs.length, 2);
	assert.instance(target.persons[0].dogs[0], Dog);
	assert.equal(target.persons[0].dogs[0].name, "Andy");

	assert.instance(target.persons[0].dogs[1], Dog);
	assert.equal(target.persons[0].dogs[1].name, "Buttons");

	assert.instance(target.persons[1], Person);
	assert.equal(target.persons[1].name, "Jane");

	assert.equal(target.persons[1].dogs.length, 1);
	assert.instance(target.persons[1].dogs[0], Dog);
	assert.equal(target.persons[1].dogs[0].name, "Andy");

	assert.is(target.persons[0].dogs[0] === target.persons[1].dogs[0], true);
});

test("throws error if Exome instance cannot be constructed", () => {
	class Person extends Exome {
		public friends: Person[] = [];

		constructor(public name: string) {
			super();

			if (!name) {
				throw new Error("`name` must be defined");
			}
		}
	}
	const target = new Person("Jeff");
	const state = JSON.stringify({
		$$exome_id: "Person-1",
		name: "John",
		friends: [
			{
				$$exome_id: "Person-2",
				name: "Phil",
			},
		],
	});

	registerLoadable({
		Person,
	});

	assert.throws(() => loadState(target, state));
});

test("creates proper instances with minified class names", () => {
	class P extends Exome {
		public friends: P[] = [];

		constructor(public name: string) {
			super();
		}
	}
	const target = new P("Jeff");
	const state = JSON.stringify({
		$$exome_id: "Person-1",
		name: "John",
		friends: [
			{
				$$exome_id: "Person-2",
				name: "Phil",
			},
		],
	});

	registerLoadable({
		Person: P,
	});

	loadState(target, state);

	assert.equal(target.name, "John");

	assert.equal(target.friends.length, 1);
	assert.instance(target.friends[0], P);
	assert.equal(target.friends[0].name, "Phil");
});

test("creates proper instances with circular state", () => {
	class Person extends Exome {
		constructor(public name: string, public friends: Person[]) {
			super();
		}
	}

	class Store extends Exome {
		constructor(public persons: Person[]) {
			super();
		}
	}

	const target = new Store([]);

	const state = JSON.stringify({
		$$exome_id: "Store-123",
		persons: [
			{
				$$exome_id: "Person-123",
				name: "John",
				friends: [
					{
						$$exome_id: "Person-123",
					},
				],
			},
		],
	});

	registerLoadable({ Person, Store });

	loadState(target, state);

	assert.equal(target.persons.length, 1);
	assert.equal(target.persons[0].name, "John");
	assert.equal(target.persons[0].friends.length, 1);
	assert.is(target.persons[0].friends[0], target.persons[0]);
});

test.run();
