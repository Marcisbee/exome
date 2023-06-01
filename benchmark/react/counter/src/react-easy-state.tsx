import { store, view } from "@risingstack/react-easy-state";
export { version } from "../../../node_modules/@risingstack/react-easy-state/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const counter = store({
	count: 0,
	increment: () => counter.count++,
});

const App = view(function App() {
	return <h1 onClick={clickAction(counter.increment)}>{counter.count}</h1>;
});

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
