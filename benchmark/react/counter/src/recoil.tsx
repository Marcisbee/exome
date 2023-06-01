import { atom, RecoilRoot, useRecoilState } from "recoil";
export { version } from "../../../node_modules/recoil/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const counterState = atom({
	key: "counterState",
	default: 0,
});

function App() {
	const [count, setCount] = useRecoilState(counterState);

	return (
		<h1 onClick={clickAction(() => setCount((state) => state + 1))}>{count}</h1>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<RecoilRoot key={key++}>
			<App />
		</RecoilRoot>,
	);

	return elementReady("h1");
}
