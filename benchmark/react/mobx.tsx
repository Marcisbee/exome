import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDom from 'react-dom';

const appState = observable({
  count: 0,
  increment: action(function () {
    appState.count += 1;
  })
})

const App = observer(() => {
  return (
    <h1 onClick={appState.increment}>{appState.count}</h1>
  )
});

let key = 0;

export default function (target: HTMLElement) {
  ReactDom.render(<App  key={key++} />, target)
}
