import { test } from "uvu";
import assert from "uvu/assert";

import { Exome, exomeId, getExomeId, setExomeId } from "exome";

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

test("exports `setExomeId`", () => {
	assert.ok(setExomeId);
});

test("that `setExomeId` is function", () => {
	assert.instance(setExomeId, Function);
});

test("sets correct id on exome", () => {
	class Foo extends Exome {}
	const foo = new Foo();

	setExomeId(foo, "0110010101111000011011110110110101100101");

	assert.equal(foo[exomeId], "Foo-0110010101111000011011110110110101100101");
});

test.run();
