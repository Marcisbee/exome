import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import * as React from "react";
import * as ReactDom from "react-dom/client";

export { version } from "../../../node_modules/@tanstack/store/package.json";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

export const counter = new Store(0);

const increment = () => {
  counter.setState((state) => state + 1);
};

function App() {
	const count = useStore(counter);

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
