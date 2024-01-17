import proxyquire from "proxyquire";
import { test } from "uvu";
import assert from "uvu/assert";

import { Exome } from "../constructor";
import { GhostExome } from "../ghost";

const { print, test: testSerializer } = proxyquire
	.noCallThru()
	.load<typeof import("./serializer.ts")>("./serializer.ts", {
		exome: {
			Exome,
		},
		"exome/ghost": {
			GhostExome,
		},
	});

function mockPrettyPrint(value: any) {
	if (testSerializer(value)) {
		return print(value, mockPrettyPrint);
	}

	if (Array.isArray(value)) {
		return [
			"[",
			"  " +
				value
					.reduce((acc, value) => {
						return acc.concat(`${mockPrettyPrint(value)},`);
					}, [] as string[])
					.join("\n")
					.replace(/\n/g, "\n  "),
			"]",
		]
			.join("\n")
			.replace("\n  \n", "");
	}

	if (value && typeof value === "object") {
		return [
			"{",
			"  " +
				Object.entries(value)
					.reduce((acc, [key, value]) => {
						return acc.concat(
							`${JSON.stringify(key)}: ${mockPrettyPrint(value)},`,
						);
					}, [] as string[])
					.join("\n")
					.replace(/\n/g, "\n  "),
			"}",
		]
			.join("\n")
			.replace("\n  \n", "");
	}

	return JSON.stringify(value);
}

test("exports `print`", () => {
	assert.ok(print);
});

test("that `print` is function", () => {
	assert.instance(print, Function);
});

test("exports `test`", () => {
	assert.ok(testSerializer);
});

test("that `test` is function", () => {
	assert.instance(testSerializer, Function);
});

test("`test` returns `true` when encountering instance of Exome", () => {
	const output = testSerializer(new Exome());

	assert.is(output, true);
});

test("`test` returns `true` when encountering instance of GhostExome", () => {
	const output = testSerializer(new GhostExome());

	assert.is(output, true);
});

test("`test` returns `true` when encountering instance of extended Exome", () => {
	class Extended extends Exome {}
	const output = testSerializer(new Extended());

	assert.is(output, true);
});

test("`test` returns `true` when encountering instance of extended GhostExome", () => {
	class Extended extends GhostExome {}
	const output = testSerializer(new Extended());

	assert.is(output, true);
});

test("`test` returns `false` when encountering `Exome`", () => {
	const output = testSerializer(Exome);

	assert.is(output, false);
});

test("`test` returns `false` when encountering `GhostExome`", () => {
	const output = testSerializer(GhostExome);

	assert.is(output, false);
});

test("`test` returns `false` when encountering `undefined`", () => {
	const output = testSerializer(undefined);

	assert.is(output, false);
});

test("`test` returns `false` when encountering `null`", () => {
	const output = testSerializer(null);

	assert.is(output, false);
});

test("`test` returns `false` when encountering `0`", () => {
	const output = testSerializer(0);

	assert.is(output, false);
});

test("`test` returns `false` when encountering `1`", () => {
	const output = testSerializer(1);

	assert.is(output, false);
});

test('`test` returns `false` when encountering ""', () => {
	const output = testSerializer("");

	assert.is(output, false);
});

test('`test` returns `false` when encountering "foo"', () => {
	const output = testSerializer("foo");

	assert.is(output, false);
});

test("`test` returns `false` when encountering `{}`", () => {
	const output = testSerializer({});

	assert.is(output, false);
});

test("`test` returns `false` when encountering `[]`", () => {
	const output = testSerializer([]);

	assert.is(output, false);
});

test("`print` outputs empty Exome instance", () => {
	const output = print(new Exome(), mockPrettyPrint);

	assert.snapshot(output, "Exome {}");
});

test("`print` outputs empty extended Exome instance", () => {
	class Extended extends Exome {}
	const output = print(new Extended(), mockPrettyPrint);

	assert.snapshot(output, "Extended {}");
});

test("`print` outputs filled extended Exome instance", () => {
	class Extended extends Exome {
		public name?: string;
		public foo = "bar";

		public get gotName() {
			return "this will not show";
		}

		public methodFoo() {}
		private methodBar() {}
	}
	const output = print(new Extended(), mockPrettyPrint);

	assert.snapshot(
		output,
		`Extended {
  "foo": "bar",
  "name": undefined,
}`,
	);
});

test("`print` outputs nested extended Exome instance", () => {
	class Dog extends Exome {
		constructor(public name: string) {
			super();
		}
	}
	class Owner extends Exome {
		public dogs = [new Dog("Andy")];
	}
	const output = print(new Owner(), mockPrettyPrint);

	assert.snapshot(
		output,
		`Owner {
  "dogs": [
    Dog {
      "name": "Andy",
    },
  ],
}`,
	);
});

test("`print` outputs empty GhostExome instance", () => {
	const output = print(new GhostExome(), mockPrettyPrint);

	assert.snapshot(output, "GhostExome {}");
});

test("`print` outputs empty extended GhostExome instance", () => {
	class Extended extends GhostExome {}
	const output = print(new Extended(), mockPrettyPrint);

	assert.snapshot(output, "Extended {}");
});

test("`print` outputs filled extended GhostExome instance", () => {
	class Extended extends GhostExome {
		public name?: string;
		public foo = "bar";

		public get gotName() {
			return "this will not show";
		}

		public methodFoo() {}
		private methodBar() {}
	}
	const output = print(new Extended(), mockPrettyPrint);

	assert.snapshot(
		output,
		`Extended {
  "foo": "bar",
  "name": undefined,
}`,
	);
});

test("`print` outputs nested extended GhostExome instance", () => {
	class Dog extends GhostExome {
		constructor(public name: string) {
			super();
		}
	}
	class Owner extends GhostExome {
		public dogs = [new Dog("Andy")];
	}
	const output = print(new Owner(), mockPrettyPrint);

	assert.snapshot(
		output,
		`Owner {
  "dogs": [
    Dog {
      "name": "Andy",
    },
  ],
}`,
	);
});

test("`print` outputs untitled class", () => {
	const output = print(new (class {})(), mockPrettyPrint);

	assert.snapshot(output, "Exome {}");
});

test("`print` handles circular reference", () => {
	class Data extends Exome {
		constructor(public extra: Data[] = []) {
			super();
		}
	}

	const circular = new Data();
	circular.extra.push(circular);

	const input = new Data([circular, new Data([circular]), circular]);
	const output = print(input, mockPrettyPrint);

	assert.snapshot(
		output,
		`Data {
  "extra": [
    Data {
      "extra": [
        Data [circular],
      ],
    },
    Data {
      "extra": [
        Data {
          "extra": [
            Data [circular],
          ],
        },
      ],
    },
    Data {
      "extra": [
        Data [circular],
      ],
    },
  ],
}`,
	);
});

test.run();
