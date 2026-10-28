import assert from "node:assert/strict";
import { Exome } from "exome";
import { useStore } from "exome/vue";
import { effectScope, isRef, nextTick, ref } from "vue";

class Child extends Exome {
	name = "child";
}

class Store extends Exome {
	count = 0;
	object = { count: ref(1) };
	items = [1, 2];
	existing = ref("hello");
	child = new Child();
	maybeChild = null;
	get doubled() {
		return this.count * 2;
	}
	increment(amount) {
		return (this.count += amount);
	}
}

const store = new Store();
const scope = effectScope();
try {
	const state = scope.run(() => useStore(store));
	for (const key of [
		"count",
		"object",
		"items",
		"existing",
		"optional",
		"maybeChild",
		"doubled",
	]) {
		assert.ok(isRef(state[key]), `${key} must be a ref`);
	}
	assert.equal(state.count.value, 0);
	assert.deepEqual(state.object.value, { count: 1 });
	assert.deepEqual(state.items.value, [1, 2]);
	assert.equal(state.optional.value, undefined);
	assert.equal(state.maybeChild.value, null);
	assert.equal(state.existing, store.existing);
	assert.equal(state.child, store.child);
	assert.equal(state.increment(2), 2);
	await nextTick();
	assert.equal(state.count.value, 2);
	assert.equal(state.doubled.value, 4);
} finally {
	scope.stop();
}
