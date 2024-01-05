import { fake } from "sinon";
import { test } from "uvu";
import assert from "uvu/assert";

import { Exome } from "./exome";
import { addMiddleware, runMiddleware } from "./middleware";

test("exports `addMiddleware`", () => {
	assert.ok(addMiddleware);
});

test("that `addMiddleware` is function", () => {
	assert.instance(addMiddleware, Function);
});

test("exports `runMiddleware`", () => {
	assert.ok(runMiddleware);
});

test("that `runMiddleware` is function", () => {
	assert.instance(runMiddleware, Function);
});

test("adds middleware without issues via `addMiddleware`", () => {
	const middleware = fake();

	assert.not.throws(() => addMiddleware(middleware));
});

test("runs added middleware via `runMiddleware`", () => {
	const instance = new Exome();
	const middleware1 = fake();
	const middleware2 = fake();

	addMiddleware(middleware1);
	addMiddleware(middleware2);

	runMiddleware(instance, "actionName", []);

	assert.equal(middleware1.callCount, 1);
	assert.equal(middleware1.args[0][0], instance);
	assert.equal(middleware1.args[0][1], "actionName");
	assert.equal(middleware1.args[0][2], []);

	assert.equal(middleware2.callCount, 1);
	assert.equal(middleware2.args[0][0], instance);
	assert.equal(middleware2.args[0][1], "actionName");
	assert.equal(middleware2.args[0][2], []);
});

test("runs middleware unsubscribe method", () => {
	const instance = new Exome();
	const unsubscribe = fake();
	const middleware: any = fake.returns(unsubscribe);

	addMiddleware(middleware);

	const after = runMiddleware(instance, "actionName", []);

	assert.equal(middleware.callCount, 1);
	assert.equal(middleware.args[0][0], instance);
	assert.equal(middleware.args[0][1], "actionName");
	assert.equal(middleware.args[0][2], []);

	assert.equal(unsubscribe.callCount, 0);

	after();

	assert.equal(unsubscribe.callCount, 1);
	assert.equal(unsubscribe.args[0], [undefined]);
});

test("removes middleware correctly", () => {
	const instance = new Exome();
	const middleware = fake();

	const unsubscribe = addMiddleware(middleware);

	runMiddleware(instance, "actionName", []);

	assert.equal(middleware.callCount, 1);
	assert.equal(middleware.args[0], [instance, "actionName", []]);

	runMiddleware(instance, "actionName", []);

	assert.equal(middleware.callCount, 2);
	assert.equal(middleware.args[1], [instance, "actionName", []]);

	unsubscribe();
	runMiddleware(instance, "actionName", []);

	assert.equal(middleware.callCount, 2);
});

test("removes multiple middleware correctly", () => {
	const instance = new Exome();
	const middleware1 = fake();
	const middleware2 = fake();

	const unsubscribe1 = addMiddleware(middleware1);
	const unsubscribe2 = addMiddleware(middleware2);

	runMiddleware(instance, "actionName", []);

	assert.equal(middleware1.callCount, 1);
	assert.equal(middleware1.args[0], [instance, "actionName", []]);
	assert.equal(middleware2.callCount, 1);
	assert.equal(middleware2.args[0], [instance, "actionName", []]);

	runMiddleware(instance, "actionName", []);

	assert.equal(middleware1.callCount, 2);
	assert.equal(middleware1.args[1], [instance, "actionName", []]);
	assert.equal(middleware2.callCount, 2);
	assert.equal(middleware2.args[1], [instance, "actionName", []]);

	unsubscribe1();
	unsubscribe2();
	runMiddleware(instance, "actionName", []);

	assert.equal(middleware1.callCount, 2);
	assert.equal(middleware2.callCount, 2);
});

test.run();
