import ReactDOM from 'react-dom';

import reactExome from './exome';
import reactRedux from './redux';
import reactMobx from './mobx';
import reactRecoil from './recoil';
import reactValtio from './valtio';

const testBunnies = [
  {
    name: 'React Exome - 1000 items',
    render: reactExome,
    target: null,
  },
  {
    name: 'React Recoil - 1000 items',
    render: reactRecoil,
    target: null,
  },
  {
    name: 'React Redux - 1000 items',
    render: reactRedux,
    target: null,
  },
  {
    name: 'React Mobx - 1000 items',
    render: reactMobx,
    target: null,
  },
  {
    name: 'React Valtio - 1000 items',
    render: reactValtio,
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

win.suite("Start up", () => {
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

win.suite("Change 10th value", function () {
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
