import { entity } from "simpler-state";
export { version } from "../../../node_modules/simpler-state/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

export const counter = entity(0);

export const increment = () => {
	counter.set((value) => value + 1);
};

function App() {
	const count = counter.use();

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
