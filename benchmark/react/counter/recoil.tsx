import { atom, RecoilRoot, useRecoilState } from 'recoil'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const counterState = atom({
  key: 'counterState',
  default: 0,
});

function App() {
  const [count, setCount] = useRecoilState(counterState);

  return (
    <h1 onClick={() => setCount((state) => state + 1)}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<RecoilRoot><App key={key++} /></RecoilRoot>, target)
}
