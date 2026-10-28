import { test } from "uvu";
import assert from "uvu/assert";
import { Exome, addMiddleware, subscribe } from "./exome";

test("actions without middleware preserve results, errors and notifications", async () => {
	const failure = new Error("action failed");
	class Store extends Exome {
		value = 0;
		set(value: number) {
			this.value = value;
			return value;
		}
		fail() {
			this.value++;
			throw failure;
		}
		async later(fail = false) {
			await Promise.resolve();
			this.value++;
			if (fail) throw failure;
			return this.value;
		}
	}
	const store = new Store();
	const values: number[] = [];
	const unsubscribe = subscribe(store, ({ value }) => values.push(value));
	try {
		const { set, fail, later } = store;
		assert.is(set(4), 4);
		try {
			fail();
			assert.unreachable();
		} catch (error) {
			assert.is(error, failure);
		}
		const pending = later();
		assert.equal(values, [4, 5]);
		assert.is(await pending, 6);
		try {
			await later(true);
			assert.unreachable();
		} catch (error) {
			assert.is(error, failure);
		}
		assert.equal(values, [4, 5, 6, 7]);
	} finally {
		unsubscribe();
	}
});

test("existing actions observe middleware registration and retain in-flight completions", async () => {
	class Store extends Exome {
		async run(value: number) {
			await Promise.resolve();
			return value;
		}
	}
	const store = new Store();
	const events: unknown[] = [];
	const unsubscribe = subscribe(store, () => events.push("update"));
	const first = store.run(1);
	const remove = addMiddleware((instance, action, payload) => {
		assert.is(instance, store);
		events.push([action, payload]);
		return (error, result) => events.push([error, result]);
	});
	try {
		await first;
		assert.equal(events, ["update"]);
		const second = store.run(2);
		remove();
		await second;
		await store.run(3);
		assert.equal(events, [
			"update",
			["run", [2]],
			"update",
			[undefined, 2],
			"update",
		]);
	} finally {
		unsubscribe();
	}
});

test("construction middleware completes after subclass fields are initialized", async () => {
	const events: unknown[] = [];
	class Store extends Exome {
		value = 42;
	}
	const remove = addMiddleware((instance, action) => {
		if (!(instance instanceof Store) || action !== "NEW") return;
		events.push(instance.value);
		return () => events.push(instance.value);
	});
	new Store();
	remove();
	assert.equal(events, [undefined]);
	await Promise.resolve();
	assert.equal(events, [undefined, 42]);
});

test("new instances see changed prototype methods without evaluating getters", () => {
	class Parent extends Exome {
		run() {
			return 1;
		}
		get value(): number {
			throw new Error("getter must not run during construction");
		}
	}
	class Store extends Parent {}
	const first = new Store();
	Parent.prototype.run = () => 2;
	const second = new Store();
	assert.is(first.run(), 1);
	assert.is(second.run(), 2);
});

test("an action named NEW retains construction notification semantics", () => {
	class Store extends Exome {
		NEW() {
			return 42;
		}
	}
	const store = new Store();
	let updates = 0;
	const unsubscribe = subscribe(store, () => updates++);
	try {
		assert.is(store.NEW(), 42);
		assert.is(updates, 0);
	} finally {
		unsubscribe();
	}
});

test.run();
