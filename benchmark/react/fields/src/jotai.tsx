import { atom, PrimitiveAtom, useAtom } from "jotai";
export { version } from "../../../node_modules/jotai/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const fieldsAtom = atom(
	Array.from(Array(1000).keys()).map((i) => atom(`Field #${i + 1}`)),
);

function Field({ field: fieldAtom }: { field: PrimitiveAtom<string> }) {
	const [field, setField] = useAtom(fieldAtom);

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input value={field} onChange={(e) => setField(e.target.value)} />
		</div>
	);
}

function App() {
	const [fields] = useAtom(fieldsAtom);

	return (
		<div>
			<div>
				Last {`<App>`} render at: {new Date().toISOString()}
			</div>
			<br />
			{fields.map((field, index) => (
				<Field key={index} field={field} />
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
