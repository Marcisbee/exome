import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Exome, getExomeId } from '../../../src';
import { useStore } from '../../../src/react';

class FieldStore extends Exome {
  constructor(public name: string) {
    super();
  }

  public rename(name: string) {
    this.name = name;
  }
}

class Store extends Exome {
  constructor(public fields: FieldStore[] = []) {
    super();
  }
}

const store = new Store(
  Array.from(Array(1000).keys()).map((i) => new FieldStore(`Field #${i + 1}`))
);

function Field({ field }: { field: FieldStore }) {
  const { name, rename } = useStore(field);

  return (
    <div>
      Last {`<Field>`} render at: {new Date().toISOString()}
      &nbsp;
      <input value={name} onChange={(e) => rename(e.target.value)} />
    </div>
  );
}

function App() {
  const { fields } = useStore(store);

  return (
    <div>
      <div>
        Last {`<App>`} render at: {new Date().toISOString()}
      </div>
      <br />
      {fields.map((field) => (
        <Field key={getExomeId(field)} field={field} />
      ))}
    </div>
  );
}

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App key={key++} />, target)
}
