import { test } from "uvu";
import assert from "uvu/assert";

import { Exome, update, updateAll, getExomeId, addMiddleware } from "./exome";

test("exports `Exome`", () => {
	assert.ok(Exome);
});

test("exports `update`", () => {
	assert.ok(update);
	assert.instance(update, Function);
});

test("exports `updateAll`", () => {
	assert.ok(updateAll);
	assert.instance(updateAll, Function);
});

test("exports `getExomeId`", () => {
	assert.ok(getExomeId);
	assert.instance(getExomeId, Function);
});

test("exports `addMiddleware`", () => {
	assert.ok(addMiddleware);
	assert.instance(addMiddleware, Function);
});

test.run();
