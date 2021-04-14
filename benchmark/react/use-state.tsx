import * as React from 'react';
import * as ReactDom from 'react-dom';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <h1 onClick={() => setCount((state) => state + 1)}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
