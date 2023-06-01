import { createEvent, createStore } from "effector";
export { version } from "../../../node_modules/effector/package.json";
import { useStore } from "effector-react";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const increment = createEvent();

const $counter = createStore(0).on(increment, (n) => n + 1);

function App() {
	const counter = useStore($counter);

	return <h1 onClick={clickAction(increment)}>{counter}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
