import * as React from 'react';
import * as ReactDom from 'react-dom';
import { atom, RecoilRoot, useRecoilState } from 'recoil';

const fields = Array.from(Array(1000).keys()).map((i) => atom({ key: `field-${i}`, default: `Field #${i + 1}` }))

const fieldsStore = atom({
  key: 'fieldsStore',
  default: fields,
});

function Field({ index }: { index: number }) {
  const [name, rename] = useRecoilState(fields[index]);

  return (
    <div>
      Last {`<Field>`} render at: {new Date().toISOString()}
      &nbsp;
      <input value={name} onChange={(e) => rename(e.target.value)} />
    </div>
  );
}

function App() {
  const [fields] = useRecoilState(fieldsStore);

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
  ReactDom.render(<RecoilRoot><App key={key++} /></RecoilRoot>, target)
}
