import { signal } from '@preact/signals-react';
import * as React from 'react';
import * as ReactDom from 'react-dom';

const count = signal(0);

function App() {
  return (
    <h1 onClick={() => count.value += 1}>{count.value}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  count.value = 0
  ReactDom.render(<App key={key++} />, target)
}
