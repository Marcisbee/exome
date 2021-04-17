import ReactDOM from 'react-dom';

import reactUseState from './use-state';
import reactExome from './exome';
import reactRedux from './redux';
import reactReduxToolkit from './redux-toolkit';
import reactMobx from './mobx';
import reactValtio from './valtio';
import reactJotai from './jotai';
import reactRecoil from './recoil';
import reactPullState from './pullstate';

const testBunnies = [
  {
    name: 'React useState',
    render: reactUseState,
    target: null,
  },
  {
    name: 'React Exome',
    render: reactExome,
    target: null,
  },
  {
    name: 'React Redux',
    render: reactRedux,
    target: null,
  },
  {
    name: 'React Redux toolkit',
    render: reactReduxToolkit,
    target: null,
  },
  {
    name: 'React Mobx',
    render: reactMobx,
    target: null,
  },
  {
    name: 'React Jotai',
    render: reactJotai,
    target: null,
  },
  {
    name: 'React Valtio',
    render: reactValtio,
    target: null,
  },
  {
    name: 'React Recoil',
    render: reactRecoil,
    target: null,
  },
  {
    name: 'React Pullstate',
    render: reactPullState,
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

win.suite("Increment", function () {
  win.beforeBench(function () {
    testBunnies.forEach(({ target, render }) => {
      ReactDOM.unmountComponentAtNode(target);
      target.innerHTML = '';
      render(target);
    });
  });

  testBunnies.forEach(({ name, target }) => {
    win.bench(name, function () {
      const increment = target.querySelector('h1')!;

      increment.click();
    });
  });
});
