import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const counterContext = React.createContext({});

export const CounterProvider = ({ children }) => {
	const [counter, setCounter] = React.useState(0);

	const increment = () => {
		return setCounter((s) => s + 1);
	};

	return (
		<counterContext.Provider value={{ counter, increment }}>
			{children}
		</counterContext.Provider>
	);
};

function App() {
	const { counter, increment } = React.useContext(counterContext);

	return <h1 onClick={clickAction(increment)}>{counter}</h1>;
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
