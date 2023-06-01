import { signal } from "@preact/signals-react";
export { version } from "../../../node_modules/@preact/signals-react/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const count = signal(0);

function App() {
	return <h1 onClick={clickAction(() => (count.value += 1))}>{count.value}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	count.value = 0;
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
