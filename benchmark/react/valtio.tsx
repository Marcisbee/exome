import { proxy, useSnapshot } from 'valtio'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const state = proxy({ count: 0 })

function App() {
  const snapshot = useSnapshot(state, { sync: true });

  return (
    <h1 onClick={() => state.count++}>{snapshot.count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
