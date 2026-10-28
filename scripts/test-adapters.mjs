// Run with --conditions=browser to exercise Solid cleanup rather than its SSR runtime.
import {
	createEnvironmentInjector,
	runInInjectionContext,
} from "@angular/core";
import { Exome } from "exome";
import { useStore as useAngularStore } from "exome/angular";
import { observableFromExome } from "exome/rxjs";
import { useStore as useSolidStore } from "exome/solid";
import { useStore as useVueStore } from "exome/vue";
import { Subscriber } from "rxjs";
import { createRoot } from "solid-js";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { effectScope } from "vue";

class Counter extends Exome {
	count = 0;
	increment() {
		this.count++;
	}
}

for (const [name, mount] of [
	[
		"Solid",
		(store, selector) =>
			createRoot((dispose) => ({
				read: useSolidStore(store, selector),
				dispose,
			})),
	],
	[
		"Angular",
		(store, selector) => {
			const injector = createEnvironmentInjector([]);
			return {
				read: runInInjectionContext(injector, () =>
					useAngularStore(store, selector),
				),
				dispose: () => {
					if (!injector.destroyed) injector.destroy();
				},
			};
		},
	],
]) {
	test(`${name} releases only the disposed consumer's subscription`, () => {
		const store = new Counter();
		let calls = 0;
		const first = mount(store, (value) => {
			calls++;
			return value.count;
		});
		const second = mount(store, (value) => value.count);
		try {
			assert.is(first.read(), 0);
			store.increment();
			assert.is(first.read(), 1);
			assert.is(calls, 2);
			first.dispose();
			store.increment();
			assert.is(calls, 2);
			assert.is(first.read(), 1);
			assert.is(second.read(), 2);
		} finally {
			first.dispose();
			second.dispose();
		}
	});
}

test("Vue releases the subscription when its effect scope stops", () => {
	const store = new Counter();
	const first = effectScope();
	const second = effectScope();
	const count = first.run(() => useVueStore(store).count);
	const liveCount = second.run(() => useVueStore(store).count);
	try {
		assert.is(count.value, 0);
		store.increment();
		assert.is(count.value, 1);
		first.stop();
		store.increment();
		assert.is(count.value, 1);
		assert.is(liveCount.value, 2);
	} finally {
		first.stop();
		second.stop();
	}
});

class CountingSubscriber extends Subscriber {
	calls = 0;
	next(value) {
		this.calls++;
		super.next(value);
	}
}

test("RxJS releases the listener on unsubscribe, without affecting other subscribers", () => {
	const store = new Counter();
	const observable = observableFromExome(store);
	const first = observable.subscribe(new CountingSubscriber());
	const second = observable.subscribe(new CountingSubscriber());
	try {
		assert.is(first.calls, 1);
		store.increment();
		assert.is(first.calls, 2);
		first.unsubscribe();
		store.increment();
		assert.is(first.calls, 2);
		assert.is(second.calls, 3);
	} finally {
		first.unsubscribe();
		second.unsubscribe();
	}
});

test("RxJS releases the listener when unsubscribed during the initial emission", () => {
	const store = new Counter();
	const subscriber = new CountingSubscriber({
		next: () => subscriber.unsubscribe(),
	});
	observableFromExome(store).subscribe(subscriber);
	assert.is(subscriber.closed, true);
	assert.is(subscriber.calls, 1);
	store.increment();
	assert.is(subscriber.calls, 1);
});

test.run();
