import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Exome } from '../../src/exome';
import { useStore } from '../../src/react';

class Counter extends Exome {
  public count = 0;
  public increment() {
    this.count++;
  }
}

const counter = new Counter();

function App() {
  const { count, increment } = useStore(counter);

  return (
    <h1 onClick={increment}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
