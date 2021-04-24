// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Fragment, render } from 'preact'
import { useRef } from 'preact/hooks'
import { useStore } from 'exome/preact'

import { counter } from '../stores/counter'

function App() {
  const { count, increment } = useStore(counter)
  const renders = useRef(0)

  renders.current += 1

  return (
    <>
      <h1 onClick={increment}>{count}</h1>
      <span>{renders.current}</span>
    </>
  )
}

render(<App />, document.body)
