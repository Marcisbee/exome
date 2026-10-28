import { Exome, addMiddleware, getExomeId, subscribe } from "exome";
import { exomeReduxDevtools, unstableExomeDevtools } from "exome/devtools";
import { test } from "uvu";
import assert from "uvu/assert";

test("Exome devtools receives initialized state and completed action state", async () => {
	const messages: any[] = [];
	const previousWindow = globalThis.window;
	(globalThis as any).window = {
		addEventListener() {},
		__EXOME_DEVTOOLS_EXTENSION__: {
			connect: () => ({
				disconnect() {},
				subscribe() {},
				send: (message: any) =>
					messages.push(JSON.parse(JSON.stringify(message))),
			}),
		},
	};
	const remove = addMiddleware(
		unstableExomeDevtools({ name: "compatibility" }),
	);
	try {
		class Store extends Exome {
			count = 1;
			increment() {
				return ++this.count;
			}
		}
		const store = new Store();
		await Promise.resolve();
		const initialized = messages.find(
			({ event, type }) => event === "update" && type === "state",
		);
		assert.is(initialized.payload[1].count, 1);
		assert.is(store.increment(), 2);
		const completed = messages.find(
			({ event, type }) => event === "update" && type === "action",
		);
		assert.is(completed.payload.before.count, 1);
		assert.is(completed.payload.after.count, 2);
		assert.is(completed.payload.response, 2);
		assert.is(
			messages.filter(({ type }) => type === "state").at(-1).payload[1].count,
			2,
		);
	} finally {
		remove();
		globalThis.window = previousWindow;
	}
});

test("Redux devtools receives actions and can restore state with subscriber updates", async () => {
	const messages: any[] = [];
	let receive: (message: any) => void = () => {};
	const previousWindow = globalThis.window;
	(globalThis as any).window = {
		__REDUX_DEVTOOLS_EXTENSION__: {
			connect: () => ({
				init() {},
				subscribe: (listener: typeof receive) => {
					receive = listener;
				},
				send: (action: any, state: any) =>
					messages.push(JSON.parse(JSON.stringify({ action, state }))),
			}),
		},
	};
	const remove = addMiddleware(exomeReduxDevtools({ name: "compatibility" }));
	let unsubscribe = () => {};
	try {
		class Store extends Exome {
			count = 1;
			increment() {
				return ++this.count;
			}
		}
		const store = new Store();
		await Promise.resolve();
		const values: number[] = [];
		unsubscribe = subscribe(store, ({ count }) => values.push(count));
		store.increment();
		assert.is(messages.at(-1).action.type, "[Store] increment");
		assert.is(messages.at(-1).state.Store[0].count, 2);
		receive({
			type: "DISPATCH",
			state: JSON.stringify({ $$exome_id: getExomeId(store), count: 9 }),
		});
		assert.is(store.count, 9);
		assert.equal(values, [2, 9]);
	} finally {
		unsubscribe();
		remove();
		globalThis.window = previousWindow;
	}
});

test.run();
