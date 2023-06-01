import useChange from "use-change";
export { version } from "../../../node_modules/use-change/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const store = { count: 0 };

function App() {
	const [count, setCount] = useChange(store, "count");

	return <h1 onClick={clickAction(() => setCount((s) => s + 1))}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
