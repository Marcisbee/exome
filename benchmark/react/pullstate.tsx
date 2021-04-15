import { Store, useStoreState } from 'pullstate'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const CounterStore = new Store({
  count: 0,
});

function App() {
  const count = useStoreState(CounterStore, (s) => s.count);

  return (
    <h1 onClick={() => CounterStore.update((s) => {
      s.count += 1;
    })}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
