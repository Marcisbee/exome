import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

function increment(value: number) {
	return value + 1;
}

function App() {
	const [count, incrementCount] = React.useReducer(increment, 0);

	return <h1 onClick={clickAction(incrementCount)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
