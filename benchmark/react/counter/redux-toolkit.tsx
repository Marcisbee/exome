import { configureStore, createSlice } from '@reduxjs/toolkit'
import { combineReducers, createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1
    },
  },
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})

function App() {
  const count = useSelector((state: any) => state.counter.count)
  const dispatch = useDispatch()

  return (
    <h1 onClick={() => dispatch(counterSlice.actions.increment())}>{count}</h1>
  )
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<Provider store={store}><App key={key++} /></Provider>, target)
}
