import { atom } from "nanostores";
export { version } from "../../../node_modules/nanostores/package.json";
import { useStore } from "@nanostores/react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

export const counter = atom(0);

function App() {
	const count = useStore(counter);

	return (
		<h1 onClick={clickAction(() => counter.set(counter.get() + 1))}>{count}</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
