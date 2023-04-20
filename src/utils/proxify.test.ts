import { test } from "uvu";
import assert from "uvu/assert";
import { fake } from "sinon";
import { Exome } from "../exome";
import { exomeId } from "./exome-id";

import { proxify } from "./proxify";

test("returns same instance of Exome", () => {
	class Test extends Exome {}
	const input = new Test();

	const output = proxify(input);

	assert.instance(output, Test);
	assert.instance(output, Exome);
	assert.is(input[exomeId], output[exomeId]);

	assert.is(input === output, true);
});

test("returns same object", () => {
	const input: any = {
		name: "foo",
	};

	const output = proxify(input);

	assert.equal(output, input);

	assert.is(input === output, true);
});

test("returns same array", () => {
	const input: any = [1, 2, 3];

	const output = proxify(input);

	assert.equal(output, input);

	assert.is(input === output, true);
});

test("can set value to proxied object", () => {
	const input: any = {};

	const output = proxify(input);

	output.hello = "world";

	assert.equal(output, {
		hello: "world",
	});
});

test("can get value from proxied object", () => {
	const input: any = {
		foo: "bar",
	};

	const output = proxify(input);

	assert.equal(output.foo, "bar");
});

test("does not proxy nested objects", () => {
	const input: any = {
		first: {
			second: {
				name: "John",
			},
		},
	};

	const output = proxify(input);

	assert.equal(output.first, input.first);

	assert.is(input.first === output.first, true);
});

test("does not proxy nested array", () => {
	const input: any = {
		first: {
			second: [1, 2, 3],
		},
	};

	const output = proxify(input);

	assert.equal(output.first, input.first);

	assert.is(input.first === output.first, true);
});

test("does not proxy function from regular object", () => {
	const input: any = {
		method() {},
	};

	const output = proxify(input);

	assert.equal(output.method, input.method);
	assert.is(input.method === output.method, true);
});

test("skips proxy for arrow function from Exome instance", () => {
	class Person extends Exome {
		public method = (first: number, second: number) => {
			return `method:${first}:${second}`;
		};
	}
	const input = new Person();

	const output = proxify(input);

	assert.is(input.method === output.method, true);

	const returnInput = input.method(1, 2);
	const returnOutput = output.method(1, 2);

	assert.is(returnInput, "method:1:2");
	assert.is(returnOutput, "method:1:2");
});

test("proxies function from Exome instance", () => {
	class Person extends Exome {
		public method(first: number, second: number) {
			return `method:${first}:${second}`;
		}
	}
	const input = new Person();
	const method1 = input.method;

	const output = proxify(input);

	assert.is(method1 === output.method, false);

	const returnInput = method1(1, 2);
	const returnOutput = output.method(1, 2);

	assert.is(returnInput, "method:1:2");
	assert.is(returnOutput, "method:1:2");
});

test("proxies async function from Exome instance", async () => {
	class Person extends Exome {
		public async method(first: number, second: number) {
			return `method:${first}:${second}`;
		}
	}
	const input = new Person();
	const method1 = input.method;

	const output = proxify(input);

	assert.is(method1 === output.method, false);

	const returnInput = await method1(1, 2);
	const returnOutput = await output.method(1, 2);

	assert.is(returnInput, "method:1:2");
	assert.is(returnOutput, "method:1:2");
});

test("throws error from proxied method", () => {
	class Person extends Exome {
		public method() {
			throw new Error("hey there");
		}
	}
	const input = new Person();

	const output = proxify(input);

	assert.throws(output.method);
});

test("does not proxy already proxied Exome instance", () => {
	class Dog extends Exome {
		constructor(public name: string) {
			super();
		}
	}
	const dogVincent = new Dog("Vincent");
	class Person extends Exome {
		public dogs: Dog[] = [dogVincent];
	}
	const input = new Person();

	const output = proxify(input);

	assert.is(dogVincent === input.dogs[0], true);
	assert.is(dogVincent === output.dogs[0], true);
});

test("does not proxy Date instance", () => {
	const date = new Date();
	class Clock extends Exome {
		public date = date;
	}
	const input = new Clock();

	const output = proxify(input);

	assert.is(date === input.date, true);
	assert.is(date === output.date, true);
});

test("does not call getter while initializing", () => {
	const activeGetter = fake(() => "Hello");
	class Store extends Exome {
		public get active() {
			return activeGetter();
		}
	}
	const store = new Store();

	assert.is(activeGetter.callCount, 0);

	const output = proxify(store);

	assert.is(activeGetter.callCount, 0);
	assert.is(store.active, "Hello");
	assert.is(activeGetter.callCount, 1);
	assert.is(store.active === output.active, true);
});

test.run();
