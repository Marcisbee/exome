import { test } from "uvu";
import assert from "uvu/assert";
import { Exome, subscribe, update, updateAll } from "./exome.ts";

test("updates reach live subscriptions and stop after unsubscribe", () => {
	const first = new Exome();
	const second = new Exome();
	const received: Exome[] = [];
	const stopFirst = subscribe(first, (store) => received.push(store));
	const stopSecond = subscribe(second, (store) => received.push(store));
	update(first);
	assert.equal(received, [first]);
	received.length = 0;
	updateAll();
	assert.equal(received, [first, second]);
	stopFirst();
	received.length = 0;
	update(first);
	updateAll();
	assert.equal(received, [second]);
	stopSecond();
	received.length = 0;
	updateAll();
	assert.equal(received, []);
});
test.run();
