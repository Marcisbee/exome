import { test } from "uvu";
import assert from "uvu/assert";

import { Exome } from "../constructor";
import { exomeId } from "../constants";
import { getExomeId } from "./id";

test("exports `getExomeId`", () => {
	assert.ok(getExomeId);
});

test("that `getExomeId` is function", () => {
	assert.instance(getExomeId, Function);
});

test("returns `undefined` when passed empty object", () => {
	const output = getExomeId({} as any);

	assert.equal(output, undefined);
});

test("returns `undefined` when passed empty class", () => {
	class Foo {}
	const output = getExomeId(new Foo() as any);

	assert.equal(output, undefined);
});

test("returns id from Exome class", () => {
	class Foo extends Exome {}
	const output = getExomeId(new Foo());

	assert.equal(typeof output, "string");
});

test("returns correct id from class", () => {
	class Foo extends Exome {}
	const foo = new Foo();
	foo[exomeId] = "Foo-Test-123";

	const output = getExomeId(foo);

	assert.equal(output, "Foo-Test-123");
});

test.run();
