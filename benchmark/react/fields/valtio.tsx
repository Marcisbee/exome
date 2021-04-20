import * as React from 'react';
import * as ReactDom from 'react-dom';
import { proxy, useSnapshot } from 'valtio';

const state = proxy({
  fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
})

function Field({ index }: { index: number }) {
  const { fields } = useSnapshot(state);
  const name = fields[index];

  return (
    <div>
      Last {`<Field>`} render at: {new Date().toISOString()}
      &nbsp;
      <input value={name} onChange={(e) => state.fields[index] = e.target.value} />
    </div>
  );
}

function App() {
  const { fields } = useSnapshot(state, { sync: true });

  return (
    <div>
      <div>
        Last {`<App>`} render at: {new Date().toISOString()}
      </div>
      <br />
      {fields.map((field, index) => (
        <Field key={index} index={index} />
      ))}
    </div>
  );
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
