import { atom, RecoilRoot, useRecoilState } from "recoil";
export { version } from "../../../node_modules/recoil/package.json";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";

const fields = Array.from(Array(1000).keys()).map((i) =>
	atom({ key: `field-${i}`, default: `Field #${i + 1}` }),
);

const fieldsStore = atom({
	key: "fieldsStore",
	default: fields,
});

function Field({ index }: { index: number }) {
	const [name, rename] = useRecoilState(fields[index]);

	return (
		<div>
			Last {`<Field>`} render at: {new Date().toISOString()}
			&nbsp;
			<input value={name} onChange={(e) => rename(e.target.value)} />
		</div>
	);
}

function App() {
	const [fields] = useRecoilState(fieldsStore);

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
	root.render(
		<RecoilRoot key={key++}>
			<App />
		</RecoilRoot>,
	);

	await new Promise((resolve) => setTimeout(resolve, 10));

	return elementReady("h1");
}
