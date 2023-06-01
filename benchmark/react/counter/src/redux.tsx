import { combineReducers, createStore } from "redux";
export { version } from "../../../node_modules/redux/package.json";
import { Provider, useDispatch, useSelector } from "react-redux";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { elementReady } from "./utils/wait-for-element";
import { clickAction } from "./utils/click-action";

const increment = () => {
	return {
		type: "INCREMENT",
	};
};

const counter = (state = 0, action: any) => {
	switch (action.type) {
		case "INCREMENT":
			return state + 1;
		default:
			return state;
	}
};

const rootReducer = combineReducers({
	counter,
});

const store = createStore(rootReducer);

function App() {
	const count = useSelector((state: any) => state.counter);
	const dispatch = useDispatch();

	return <h1 onClick={clickAction(() => dispatch(increment()))}>{count}</h1>;
}

let key = 0;

export default async function (target: HTMLElement) {
	const root = ReactDom.createRoot(target);
	root.render(
		<Provider store={store} key={key++}>
			<App />
		</Provider>,
	);

	return elementReady("h1");
}
