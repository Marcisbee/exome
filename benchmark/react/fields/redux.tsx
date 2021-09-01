import { combineReducers, createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import * as React from 'react';
import * as ReactDom from 'react-dom';

const rename = (index: number, value: string) => {
  return {
    type: "RENAME",
    index,
    value,
  }
}

const initialState = Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`);

const counter = (state = initialState, action: any) => {
  switch (action.type) {
    case "RENAME":
      return state.map((value, index) => {
        if (action.index === index) {
          return action.value;
        }

        return value;
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  counter
})

const store = createStore(rootReducer)

function Field({ index, field: name }: { index: number, field: string }) {
  const dispatch = useDispatch();

  return (
    <div>
      Last {`<Field>`} render at: {new Date().toISOString()}
      &nbsp;
      <input value={name} onChange={(e) => dispatch(rename(index, e.target.value))} />
    </div>
  );
}

function App() {
  const fields: string[] = useSelector((state: any) => state.counter, () => false)

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
