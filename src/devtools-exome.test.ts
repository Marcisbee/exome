import { spawnSync } from "node:child_process";
import proxyquire from "proxyquire";
import { test } from "uvu";
import assert from "uvu/assert";
import * as exome from "./exome.ts";
import { middleware } from "./middleware.ts";

const { exomeDevtools } = proxyquire
	.noCallThru()
	.load<typeof import("./devtools-exome.ts")>("./devtools-exome.ts", { exome });
let messages: any[];
let sync: (event: { type: "sync" }) => void;
const previousWindow = globalThis.window;
test.before.each(() => {
	middleware.splice(0);
	messages = [];
	(globalThis as any).window = {
		addEventListener() {},
		__EXOME_DEVTOOLS_EXTENSION__: {
			connect() {
				return {
					disconnect() {},
					subscribe(callback: typeof sync) {
						sync = callback;
					},
					send(message: any) {
						messages.push(JSON.parse(JSON.stringify(message)));
					},
				};
			},
		},
	};
});
test.after.each(() => {
	middleware.splice(0);
	(globalThis as any).window = previousWindow;
});

test("sync keeps the latest maxAge actions across repeated overflow", () => {
	exome.addMiddleware(exomeDevtools({ name: "History", maxAge: 3 }));
	class Counter extends exome.Exome {
		count = 0;
		increment() {
			this.count++;
		}
	}
	const counter = new Counter();
	for (let i = 0; i < 7; i++) counter.increment();
	sync({ type: "sync" });
	assert.equal(
		messages.at(-1).payload.actions.map((a: any) => a.after.count),
		[5, 6, 7],
	);
});

test("state, action payload and response preserve unusual plain data", () => {
	exome.addMiddleware(exomeDevtools({ name: "Serialization" }));
	const dictionary = Object.assign(Object.create(null), { answer: 42 });
	const cyclic: any = { label: "root" };
	cyclic.self = cyclic;
	const shared = { value: 1 };
	const input = {
		big: BigInt("9007199254740993"),
		dictionary,
		cyclic,
		shared: [shared, shared],
	};
	class Store extends exome.Exome {
		data = input;
		echo(value: any) {
			return value;
		}
	}
	const store = new Store();
	store.echo(input);
	sync({ type: "sync" });
	const snapshot = messages.at(-1).payload;
	const expected = {
		big: { $$exome_bigint: "9007199254740993" },
		dictionary: { answer: 42 },
		cyclic: { label: "root", self: { $$exome_circular: true } },
		shared: [{ value: 1 }, { value: 1 }],
	};
	assert.equal(snapshot.states[0][1].data, expected);
	assert.equal(snapshot.actions[0].payload[0], expected);
	assert.equal(snapshot.actions[0].response, expected);
});
test("unused stores are collected while live updates and history remain usable", () => {
	const result = spawnSync(
		process.execPath,
		[
			"--expose-gc",
			"-r",
			"esbuild-register",
			"-e",
			`
		const assert = require("node:assert/strict");
		const exome = require("./src/exome.ts");
		const { exomeDevtools } = require("proxyquire").noCallThru()
			.load("./src/devtools-exome.ts", { exome });
		let sync;
		const messages = [];
		global.window = {
			addEventListener() {},
			__EXOME_DEVTOOLS_EXTENSION__: { connect: () => ({
				disconnect() {},
				subscribe(callback) { sync = callback; },
				send(message) { messages.push(JSON.parse(JSON.stringify(message))); }
			}) }
		};
		exome.addMiddleware(exomeDevtools({ name: "Lifecycle" }));
		class Store extends exome.Exome {
			count = 0;
			increment() { this.count++; }
			echo(value) { return value; }
		}
		(async () => {
			const live = new Store();
			let retired = new Store();
			const retiredId = exome.getExomeId(retired);
			const ref = new WeakRef(retired);
			retired.increment();
			retired.echo({ nested: retired });
			await Promise.resolve();
			retired = null;
			for (let i = 0; i < 100; i++) {
				await new Promise(resolve => setTimeout(resolve, 10));
				global.gc();
				if (!ref.deref()) break;
			}
			assert.equal(ref.deref(), undefined, "middleware retained the unused store");
			live.increment();
			exome.updateAll();
			assert(messages.some(m => m.type === "state" && m.payload[0] === exome.getExomeId(live) && m.payload[1].count === 1));
			sync({ type: "sync" });
			const snapshot = messages.at(-1).payload;
			assert.deepEqual(snapshot.states.map(s => s[0]), [exome.getExomeId(live)]);
			const history = snapshot.actions.filter(a => a.instance === retiredId);
			assert.equal(history[0].before.count, 0);
			assert.equal(history[0].after.count, 1);
			assert.deepEqual(history[1].payload, [{ nested: { $$exome_id: retiredId } }]);
			assert.deepEqual(history[1].response, { nested: { $$exome_id: retiredId } });
			assert(messages.some(m => m.event === "remove" && m.type === "state" && m.payload === retiredId));
		})().catch(error => { console.error(error); process.exitCode = 1; });
	`,
		],
		{ encoding: "utf8", timeout: 15000 },
	);
	assert.is(result.status, 0, result.stderr || String(result.error));
});
test.run();
