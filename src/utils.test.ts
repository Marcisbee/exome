import proxyquire from "proxyquire";
import { suite } from "uvu";
import assert from "uvu/assert";

import { Exome, addMiddleware, getExomeId, update } from "./exome.ts";
import { middleware } from "./middleware.ts";

const { getActionStatus } = proxyquire
	.noCallThru()
	.load<typeof import("./utils.ts")>("./utils.ts", {
		exome: {
			Exome,
			getExomeId,
			addMiddleware,
			update,
		},
	});

{
	const test = suite("getActionStatus");

	test.before.each(() => {
		middleware.splice(0, 100);
	});

	test("exports `getActionStatus`", () => {
		assert.ok(getActionStatus);
	});

	test("that `getActionStatus` is function", () => {
		assert.instance(getActionStatus, Function);
	});

	test("returns same instance if same store + action", () => {
		class TestStore extends Exome {
			public async run1() {}
			public async run2() {}
		}
		const test1 = new TestStore();
		const test2 = new TestStore();

		const test1run1_1 = getActionStatus(test1, "run1");
		const test1run1_2 = getActionStatus(test1, "run1");
		const test1run2_1 = getActionStatus(test1, "run2");

		assert.ok(test1run1_1 === test1run1_2);
		assert.not(test1run1_1 === test1run2_1);

		const test2run1_1 = getActionStatus(test2, "run1");

		assert.not(test1run1_1 === test2run1_1);
	});

	test("returns same instance if not unsubscribed", () => {
		class TestStore extends Exome {
			public async run() {}
		}
		const test1 = new TestStore();

		const test1run_1 = getActionStatus(test1, "run");

		test1run_1.unsubscribe();

		const test1run_2 = getActionStatus(test1, "run");

		assert.not(test1run_1 === test1run_2);
	});

	test("returns loading status", async () => {
		class TestStore extends Exome {
			public get status() {
				return getActionStatus(this, "run");
			}
			public async run() {}
		}
		const test1 = new TestStore();

		// biome-ignore lint/suspicious/noSelfCompare: it's a getter, not pointless!
		assert.ok(test1.status === test1.status);

		assert.snapshot(
			JSON.stringify(test1.status),
			`{"loading":false,"error":false}`,
		);

		const promise = test1.run();

		assert.snapshot(
			JSON.stringify(test1.status),
			`{"loading":true,"error":false}`,
		);

		await promise;

		assert.snapshot(
			JSON.stringify(test1.status),
			`{"loading":false,"error":false}`,
		);
	});

	test("returns error status", async () => {
		class TestStore extends Exome {
			public get status() {
				return getActionStatus(this, "run");
			}
			public async run() {
				throw new Error("Poop");
			}
		}
		const test1 = new TestStore();

		// biome-ignore lint/suspicious/noSelfCompare: it's a getter, not pointless!
		assert.ok(test1.status === test1.status);

		assert.snapshot(
			JSON.stringify(test1.status),
			`{"loading":false,"error":false}`,
		);

		const promise = test1.run();

		assert.snapshot(
			JSON.stringify(test1.status),
			`{"loading":true,"error":false}`,
		);

		try {
			await promise;
		} catch (_) {}

		assert.snapshot(
			JSON.stringify(test1.status),
			`{"loading":false,"error":{}}`,
		);
		assert.instance(test1.status.error, Error);
		assert.equal(String(test1.status.error), "Error: Poop");
	});

	test.run();
}
