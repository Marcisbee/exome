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

test.run();
