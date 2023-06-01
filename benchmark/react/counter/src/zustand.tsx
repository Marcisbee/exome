import { create } from "zustand";
export { version } from "../../../node_modules/zustand/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const useCounterStore = create<{ count: number; increment: () => void }>(
	(set) => ({
		count: 0,
		increment: () => set((state) => ({ count: state.count + 1 })),
	}),
);

function App() {
	const { count, increment } = useCounterStore();

	return <h1 onClick={clickAction(increment)}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	return elementReady("h1");
}
