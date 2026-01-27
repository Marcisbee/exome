import { test } from "uvu";
import assert from "uvu/assert";

import { Exome, exomeId, getExomeId } from "exome";
import { registerLoadable, saveState, loadState } from "exome/state";
import { subscriptions } from "../subscribe.ts";

test("updates instance IDs when registerLoadable is called after instance creation", () => {
	class Store extends Exome {
		public count = 0;
	}

	// Create instance BEFORE calling registerLoadable
	const store = new Store();
	const idBeforeRegister = getExomeId(store);

	// Call registerLoadable AFTER instance creation
	registerLoadable({
		MyStore: Store,
	});

	const idAfterRegister = getExomeId(store);

	// The ID should now use the registered name "MyStore" instead of minified name
	assert.ok(idAfterRegister.startsWith("MyStore-"));
	assert.not.ok(idAfterRegister.startsWith("Store-"));

	// The suffix (random part) should remain the same
	const suffixBefore = idBeforeRegister.substring(idBeforeRegister.indexOf("-") + 1);
	const suffixAfter = idAfterRegister.substring(idAfterRegister.indexOf("-") + 1);
	assert.equal(suffixBefore, suffixAfter);
});

test("updates IDs of multiple instances when registerLoadable is called", () => {
	class Counter extends Exome {
		constructor(public count: number) {
			super();
		}
	}

	// Create multiple instances BEFORE calling registerLoadable
	const counter1 = new Counter(1);
	const counter2 = new Counter(2);
	const counter3 = new Counter(3);

	const id1Before = getExomeId(counter1);
	const id2Before = getExomeId(counter2);
	const id3Before = getExomeId(counter3);

	// Call registerLoadable AFTER instances are created
	registerLoadable({
		MyCounter: Counter,
	});

	const id1After = getExomeId(counter1);
	const id2After = getExomeId(counter2);
	const id3After = getExomeId(counter3);

	// All IDs should now use the registered name
	assert.ok(id1After.startsWith("MyCounter-"));
	assert.ok(id2After.startsWith("MyCounter-"));
	assert.ok(id3After.startsWith("MyCounter-"));

	// Suffixes should remain the same
	assert.equal(
		id1Before.substring(id1Before.indexOf("-")),
		id1After.substring(id1After.indexOf("-"))
	);
	assert.equal(
		id2Before.substring(id2Before.indexOf("-")),
		id2After.substring(id2After.indexOf("-"))
	);
	assert.equal(
		id3Before.substring(id3Before.indexOf("-")),
		id3After.substring(id3After.indexOf("-"))
	);
});

test("allows saving and loading state with stable IDs", () => {
	// Simulate minified class name
	class S extends Exome {
		constructor(public value: string) {
			super();
		}
	}

	// Create instance with minified name, save state
	const store1 = new S("test");
	const savedState = saveState(store1);

	// Register with stable name after saving
	registerLoadable({
		AppStore: S,
	});

	// Create new instance and load state
	const store2 = new S("");
	loadState(store2, savedState);

	assert.equal(store2.value, "test");
	// Verify the ID uses the stable name
	assert.ok(getExomeId(store2).startsWith("AppStore-"));
});

test("stable IDs across builds (simulated with minified class names)", () => {
	// Simulate minified class name
	class S extends Exome {
		public data = "hello";
	}

	// Create instance with minified name
	const store = new S();
	const idBeforeRegister = getExomeId(store);

	// This simulates what happens in production where class name is minified
	assert.ok(idBeforeRegister.startsWith("S-"));

	// Register with stable name
	registerLoadable({
		StableStoreName: S,
	});

	const idAfterRegister = getExomeId(store);

	// ID should now use stable name
	assert.ok(idAfterRegister.startsWith("StableStoreName-"));

	// Save state and verify it uses stable name
	const savedState = saveState(store);
	assert.ok(savedState.includes("StableStoreName-"));
	assert.not.ok(savedState.includes("S-"));
});

test("registerLoadable works correctly when called before instance creation", () => {
	class MyStore extends Exome {
		public value = 42;
	}

	// Call registerLoadable BEFORE instance creation (the recommended way)
	registerLoadable({
		MyStore,
	});

	const store = new MyStore();
	const id = getExomeId(store);

	// ID should use the registered name from the start
	assert.ok(id.startsWith("MyStore-"));
});

test("subscriptions mapping is updated when ID changes", () => {
	class Counter extends Exome {
		constructor(public count: number) {
			super();
		}
	}

	// Create instance BEFORE calling registerLoadable
	const counter = new Counter(0);
	const idBefore = getExomeId(counter);

	// Verify subscriptions exist for the old ID
	assert.ok(subscriptions[idBefore], `subscriptions should exist for ${idBefore}`);

	// Call registerLoadable AFTER instance creation
	registerLoadable({
		MyCounter: Counter,
	});

	const idAfter = getExomeId(counter);

	// Verify ID changed
	assert.ok(idAfter.startsWith("MyCounter-"), `ID should start with MyCounter-, got: ${idAfter}`);

	// Verify subscriptions were moved to the new ID
	assert.ok(subscriptions[idAfter], `subscriptions should exist for new ID ${idAfter}, but got: ${JSON.stringify(Object.keys(subscriptions))}`);
	assert.not.ok(subscriptions[idBefore], `subscriptions should not exist for old ID ${idBefore}`);
});

test.run();
