import { Trashly } from "trashly-react";
export { version } from "../../../node_modules/trashly-react/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const store = new Trashly({
	fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
});

function rename(index: number, name: string) {
	store.mutate((s) => (s.fields[index] = name));
}

function Field({ index }: { index: number }) {
	const name = store.useSelector((s) => s.fields[index]);

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input value={name} onChange={(e) => rename(index, e.target.value)} />
		</div>
	);
}

function App() {
	const fields = store.useSelector((s) => s.fields);

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.map((_, index) => (
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
