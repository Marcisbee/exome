import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import { useStore } from 'exome/react'

import { counter } from '../stores/counter'

function App() {
  const { count, increment } = useStore(counter)
  const renders = React.useRef(0)

  renders.current += 1

  return (
    <>
      <h1 onClick={increment}>{count}</h1>
      <span>{renders.current}</span>
    </>
  )
}

const root = ReactDom.createRoot(document.body);
root.render(<App />);
