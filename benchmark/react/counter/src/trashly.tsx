import { Trashly } from "trashly-react";
export { version } from "../../../node_modules/trashly-react/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const store = new Trashly({
	count: 0,
});

function increment() {
	store.mutate((s) => (s.count += 1));
}

function App() {
	const count = store.useSelector((s) => s.count);

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
