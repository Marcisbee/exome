import * as React from "react";
import * as ReactDom from "react-dom/client";

import { Exome } from "../../../../src/exome";
import { useStore } from "../../../../src/react";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

class Counter extends Exome {
	public count = 0;
	public increment() {
		this.count += 1;
	}
}

const counter = new Counter();

function App() {
	const { count, increment } = useStore(counter);

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
