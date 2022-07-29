import * as React from 'react';
import * as ReactDom from 'react-dom';

function increment(value: number) {
  return value + 1;
}

function App() {
  const [count, incrementCount] = React.useReducer(increment, 0);

  return (
    <h1 onClick={incrementCount}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
