import { proxy, useSnapshot } from 'valtio'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const state = proxy({ count: 0 })

function App() {
  const snapshot = useSnapshot(state);

  return (
    <h1 onClick={() => snapshot.count++}>{snapshot.count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
