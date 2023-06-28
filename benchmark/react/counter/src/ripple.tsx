import { createRipples } from "@m-c2/ripple";
export { version } from "../../../node_modules/valtio/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const [{ useCounter }, services] = createRipples({
	counter: {
		count: 0,
	},
});

function App() {
	const [counter, setCounter] = useCounter();

	return (
		<h1
			onClick={clickAction(() => {
				counter.count++;
				setCounter();
			})}
		>
			{counter.count}
		</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
