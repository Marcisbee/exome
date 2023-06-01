import createStore from "teaful";
export { version } from "../../../node_modules/teaful/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { clickAction } from "./utils/click-action";
import { elementReady } from "./utils/wait-for-element";

const { useStore: useCounter } = createStore({ count: 0 });

function App() {
	const [count, setCount] = useCounter.count(0);

	return <h1 onClick={clickAction(() => setCount((c) => c + 1))}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
