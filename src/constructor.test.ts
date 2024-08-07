import { test } from "uvu";
import assert from "uvu/assert";

import { exomeId } from "./constants";
import { Exome } from "./constructor";

test("exports `Exome`", () => {
	assert.instance(Exome, Function);
});

test("exome instance have `exomeId`", () => {
	const instance = new Exome();

	assert.is(typeof instance[exomeId], "string");
});

test("extended exome instance have `exomeId`", () => {
	class Person extends Exome {}
	const instance = new Person();

	assert.is(typeof instance[exomeId], "string");
});

test('exome instance has "Exome" in id', () => {
	const instance = new Exome();

	assert.match(instance[exomeId], /^Exome-[A-Z0-9]+$/);
});

test('extended exome instance has "Person" in id', () => {
	class Person extends Exome {}
	const instance = new Person();

	assert.match(instance[exomeId], /^Person-[A-Z0-9]+$/);
});

test('extended exome instance has "Person" in id', () => {
	class Person extends Exome {}
	const instance = new Person();

	assert.match(instance[exomeId], /^Person-[A-Z0-9]+$/);
});

test('extended another class has same id', () => {
	class PersonParent extends Exome {}
	class Person extends PersonParent {}
	const instance = new Person();

	assert.match(instance[exomeId], /^Person-[A-Z0-9]+$/);
});

test("throws error for async action", async () => {
	class TestStore extends Exome {
		public async run() {
			throw new Error("Poop");
		}
	}
	const test1 = new TestStore();

	try {
		await test1.run();
		assert.unreachable();
	} catch (err) {
		assert.instance(err, Error);
		assert.equal(err.message, "Poop");
	}
});

test.run();
