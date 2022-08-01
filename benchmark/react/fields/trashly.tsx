import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Trashly } from 'trashly-react';

const store = new Trashly({
  fields: Array.from(Array(1000).keys()).map((i) => `Field #${i + 1}`),
});

function rename(index: number, name: string) {
  store.mutate((s) => s.fields[index] = name);
}

function Field({ index }: { index: number }) {
  const name = store.useSelector((s) => s.fields[index]);

  return (
    <div>
      Last {`<Field>`} render at: {new Date().toISOString()}
      &nbsp;
      <input value={name} onChange={(e) => rename(index, e.target.value)} />
    </div>
  );
}

function App() {
  const fields = store.useSelector((s) => s.fields);

  return (
    <div>
      <div>
        Last {`<App>`} render at: {new Date().toISOString()}
      </div>
      <br />
      {fields.map((_, index) => (
        <Field key={index} index={index} />
      ))}
    </div>
  );
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
