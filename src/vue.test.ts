import proxyquire from "proxyquire";
import { test } from "uvu";
import assert from "uvu/assert";
import { effectScope, isRef, nextTick, ref } from "vue";
import * as exome from "./exome.ts";

const { Exome } = exome;
const { useStore } = proxyquire
	.noCallThru()
	.load<typeof import("./vue.ts")>("./vue.ts", { exome });

class Child extends Exome {
	name = "child";
}

class Store extends Exome {
	count = 0;
	object = { count: ref(1) };
	items = [1, 2];
	existing = ref("hello");
	child = new Child();
	optional?: string;
	maybeChild = null;
	get doubled() {
		return this.count * 2;
	}
	increment(amount: number) {
		return (this.count += amount);
	}
}

test("Vue state refs preserve values and update after actions", async () => {
	const store = new Store();
	const scope = effectScope();
	try {
		const state = scope.run(() => useStore(store))!;
		for (const key of [
			"count",
			"object",
			"items",
			"existing",
			"optional",
			"maybeChild",
			"doubled",
		] as const) {
			assert.ok(isRef(state[key]), `${key} must be a ref`);
		}
		assert.equal(state.count.value, 0);
		assert.equal(state.object.value, { count: 1 });
		assert.equal(state.items.value, [1, 2]);
		assert.equal(state.optional.value, undefined);
		assert.equal(state.maybeChild.value, null);
		assert.is(state.existing, store.existing);
		assert.is(state.child, store.child);
		assert.equal(state.increment(2), 2);
		await nextTick();
		assert.equal(state.count.value, 2);
		assert.equal(state.doubled.value, 4);
	} finally {
		scope.stop();
	}
});
test.run();
