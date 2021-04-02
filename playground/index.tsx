import React, { StrictMode } from 'react'
import ReactDom from 'react-dom'

import { useStore } from '..'
import { Dog, dogStore, Person } from './dogStore'
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
    <div>
      <h1>{count}</h1>

      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

function People({ store }: { store: Person }) {
  const person = useStore(store)

  return (
    <div>
      <strong>{person.name}</strong>
      {person.dogs.length
        ? (
            <div>- owner of: {person.dogs.map((dog) => dog.name).join(', ')}</div>
          )
        : (
            <div>- owns no dogs</div>
          )}
      <button onClick={() => person.addDog(new Dog('Joly', 'Husky'))}>
        add new dog
      </button>
      <hr />
    </div>
  )
}

function Dogs() {
  const state = useStore(dogStore)

  return (
    <div>
      {state.persons.map((person, index) => (
        <People key={`${person.name}-${index}`} store={person} />
      ))}
      <button onClick={() => state.addPerson(new Person('Samson Jo'))}>
        add new person
      </button>
    </div>
  )
}

function App() {
  return (
    <div>
      <Counter />

      <br />
      <hr />
      <br />

      <Joke />

      <br />
      <hr />
      <br />

      <Dogs />
    </div>
  )
}

ReactDom.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('app')
)
