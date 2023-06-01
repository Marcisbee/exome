import constate from "constate";
export { version } from "../../../node_modules/constate/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

function useCounter() {
	const [count, setCount] = React.useState(0);
	const increment = () => setCount((prevCount) => prevCount + 1);
	return { count, increment };
}

const [CounterProvider, useCounterContext] = constate(useCounter);

function App() {
	const { count, increment } = useCounterContext();

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<CounterProvider key={key++}>
			<App />
		</CounterProvider>,
	);

	return elementReady("h1");
}
