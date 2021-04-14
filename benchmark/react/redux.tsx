import { combineReducers, createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const increment = () => {
  return {
    type: "INCREMENT"
  }
}

const counter = (state = 1, action: any) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1
    default:
      return state
  }
}

const rootReducer = combineReducers({
  counter
})

const store = createStore(rootReducer)

function App() {
  const count = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();

  return (
    <h1 onClick={() => dispatch(increment())}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<Provider store={store}><App key={key++} /></Provider>, target)
}
