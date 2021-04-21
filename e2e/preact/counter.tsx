import { render } from 'preact'
import { useRef } from 'preact/hooks'
import { Exome } from 'exome'
import { useStore } from 'exome/preact'

class CounterStore extends Exome {
  public count = 0

  public increment() {
    this.count += 1
  }
}

const counter = new CounterStore()

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
