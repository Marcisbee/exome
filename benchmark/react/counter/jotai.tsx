import { atom, useAtom } from 'jotai'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const countAtom = atom(0)

function App() {
  const [count, setCount] = useAtom(countAtom)

  return (
    <h1 onClick={() => setCount((state) => state + 1)}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
