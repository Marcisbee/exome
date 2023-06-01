import { proxy, useSnapshot } from "valtio";
export { version } from "../../../node_modules/valtio/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const state = proxy({
	fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
});

function Field({ index }: { index: number }) {
	const { fields } = useSnapshot(state);
	const name = fields[index];

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input
				value={name}
				onChange={(e) => (state.fields[index] = e.target.value)}
			/>
		</div>
	);
}

function App() {
	const { fields } = useSnapshot(state);

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.map((field, index) => (
				<Field key={index} index={index} />
			))}
			<h1>foot</h1>
		</div>
	);
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(<App key={key++} />);

	await new Promise((resolve) => setTimeout(resolve, 10));

	return elementReady("h1");
}
