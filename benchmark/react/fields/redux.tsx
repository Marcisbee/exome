import { configureStore, createSlice } from '@reduxjs/toolkit'
import { combineReducers, createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const fieldsSlice = createSlice({
  name: 'fields',
  initialState: {
    fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
  },
  reducers: {
    rename: (state, action) => {
      state.fields[action.payload.index] = action.payload.value
    },
  },
})

const store = configureStore({
  reducer: {
    fields: fieldsSlice.reducer,
  },
})

function Field({ index, field: name }: { index: number, field: string }) {
  const dispatch = useDispatch()

  return (
    <div>
      Last {`<Field>`} render at: {new Date().toISOString()}
      &nbsp;
      <input value={name} onChange={(e) => dispatch(fieldsSlice.actions.rename({ index, value: e.target.value }))} />
    </div>
  );
}

function App() {
  const fields: string[] = useSelector((state: any) => state.fields.fields, () => false)

  return (
    <div>
      <div>
        Last {`<App>`} render at: {new Date().toISOString()}
      </div>
      <br />
      {fields.map((field, index) => (
        <Field key={index} index={index} field={field} />
      ))}
    </div>
  );
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<Provider store={store}><App key={key++} /></Provider>, target)
}
