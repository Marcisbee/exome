import React, { StrictMode } from 'react'
import ReactDom from 'react-dom'

import { useStore } from '..'
import { counterStore, jokeStore } from './store'

function Joke() {
  const { joke, getJoke, isLoading } = useStore(jokeStore)

  return (
    <div>
      {joke && (
        <ul>
          <li>{joke.setup}</li>
          <li>{joke.punchline}</li>
        </ul>
      )}

      <button
        onClick={getJoke}
        disabled={isLoading}
      >
        Fetch new joke
      </button>
    </div>
  )
}

function Counter() {
  const { count, increment, decrement, reset } = useStore(counterStore)

  return (
    <>
      <h1>{count}</h1>

      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
    </>
  )
}

function App() {
  return (
    <div>
      <Counter />

      <hr/>

      <Joke />
    </div>
  )
}

ReactDom.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('app')
)
