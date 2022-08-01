import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Trashly } from 'trashly-react';

const store = new Trashly({
  count: 0,
});

function increment() {
  store.mutate((s) => s.count += 1);
}

function App() {
  const count = store.useSelector((s) => s.count);

  return (
    <h1 onClick={increment}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
