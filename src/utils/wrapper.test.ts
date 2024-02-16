import { suite } from "uvu";
import assert from "uvu/assert";

import { wrapper } from "./wrapper.ts";

{
	const test = suite("wrapper");

	test("exports `wrapper`", () => {
		assert.ok(wrapper);
	});

	test("that `wrapper` is function", () => {
		assert.instance(wrapper, Function);
	});

	test("doesn't throw with sync success action", () => {
		class TestStore {
			constructor() {
				return wrapper(this as any);
			}
			public test() {}
		}
		const testStore = new TestStore();

		assert.not.throws(testStore.test);
	});

	test("doesn't throw with async success action", async () => {
		class TestStore {
			constructor() {
				return wrapper(this as any);
			}
			public async test() {
				await Promise.resolve();
			}
		}
		const testStore = new TestStore();

		try {
			await testStore.test();
			assert.ok(true);
		} catch (err) {
			assert.instance(err, Error);
			assert.equal(err.message, "test error");
		}
	});

	test("throws with sync error action", () => {
		class TestStore {
			constructor() {
				return wrapper(this as any);
			}
			public test() {
				throw new Error("test error");
			}
		}
		const testStore = new TestStore();

		assert.throws(testStore.test);
	});

	test("throws with async error action", async () => {
		class TestStore {
			constructor() {
				return wrapper(this as any);
			}
			public async test() {
				await Promise.resolve();
				throw new Error("test error");
			}
		}
		const testStore = new TestStore();

		try {
			await testStore.test();
			assert.unreachable();
		} catch (err) {
			assert.instance(err, Error);
			assert.equal(err.message, "test error");
		}
	});

	test.run();
}
