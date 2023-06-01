import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";
export { version } from "../../../node_modules/xstate/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const counterMachine = createMachine({
	initial: "active",
	context: { count: 0 },
	states: {
		active: {
			on: {
				INCREMENT: {
					actions: assign({ count: (ctx) => ctx.count + 1 }),
				},
			},
		},
	},
});

function App() {
	const [state, send] = useMachine(counterMachine);

	return (
		<h1
			onClick={clickAction(() => {
				send("INCREMENT");
			})}
		>
			{state.context.count}
		</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
