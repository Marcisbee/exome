import * as React from 'react'
import * as ReactDom from 'react-dom'

import { Exome } from '../src'
import { useStore } from '../src/react'

class CounterStore extends Exome {
  public count = 0

  public increment() {
    this.count += 1
  }
}

const counter = new CounterStore()

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

ReactDom.render(<App />, document.body)
