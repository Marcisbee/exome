import ReactDOM from 'react-dom';

import exome from './exome';
import redux from './redux';
import mobx from './mobx';
import recoil from './recoil';
import valtio from './valtio';

const testBunnies = [
  {
    name: 'Exome',
    render: exome,
    target: null,
  },
  {
    name: 'Recoil',
    render: recoil,
    target: null,
  },
  {
    name: 'Redux',
    render: redux,
    target: null,
  },
  {
    name: 'Mobx',
    render: mobx,
    target: null,
  },
  {
    name: 'Valtio',
    render: valtio,
    target: null,
  },
].map((bunny) => {
  const target = document.getElementById('content')!.appendChild(document.createElement('div'));

  target.setAttribute('data-content', bunny.name);

  return {
    ...bunny,
    target,
  }
});

const win: Window & { suite: any, bench: any, beforeBench: any } = window as any;

win.suite("Start up 1000 items", () => {
  win.beforeBench(() => {
    testBunnies.forEach(({ target }) => {
      ReactDOM.unmountComponentAtNode(target);
    });
  });

  testBunnies.forEach(({ name, render, target }) => {
    win.bench(name, () => {
      render(target);
    });
  });
});

win.suite("Change 10th value from 1000 items", function () {
  win.beforeBench(function () {
    testBunnies.forEach(({ target, render }) => {
      ReactDOM.unmountComponentAtNode(target);
      target.innerHTML = '';
      render(target);
    });
  });

  testBunnies.forEach(({ name, target }) => {
    win.bench(name, function () {
      const input = target.querySelectorAll('input')![10]!;

      const evt = document.createEvent("HTMLEvents");
      evt.initEvent("input", true, true);
      input.value = '' + Math.random();
      (input as any)._valueTracker.setValue(Math.random())
      input.dispatchEvent(evt);
    });
  });
});
