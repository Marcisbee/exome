import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

let count = 0;
let listener = () => {};

const countStore = {
	increment() {
		count += 1;
		listener();
	},
	subscribe(l) {
		listener = l;
		return () => {
			listener = () => {};
		};
	},
	getSnapshot() {
		return count;
	},
};

function App() {
	const count = React.useSyncExternalStore(
		countStore.subscribe,
		countStore.getSnapshot,
	);

	return <h1 onClick={clickAction(countStore.increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
