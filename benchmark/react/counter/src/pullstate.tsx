import { Store, useStoreState } from "pullstate";
export { version } from "../../../node_modules/pullstate/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const CounterStore = new Store({
	count: 0,
});

function App() {
	const count = useStoreState(CounterStore, (s) => s.count);

	return (
		<h1
			onClick={clickAction(() =>
				CounterStore.update((s) => {
					s.count += 1;
				}),
			)}
		>
			{count}
		</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
