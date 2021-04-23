import ReactDOM from 'react-dom';

// import useState from './use-state';
import exome from './exome';
import redux from './redux';
import reduxToolkit from './redux-toolkit';
import mobx from './mobx';
import valtio from './valtio';
import jotai from './jotai';
import recoil from './recoil';
import pullState from './pullstate';

const testBunnies = [
  // {
  //   name: 'useState',
  //   render: useState,
  //   target: null,
  // },
  {
    name: 'Exome',
    render: exome,
    target: null,
  },
  {
    name: 'Redux',
    render: redux,
    target: null,
  },
  {
    name: 'Redux toolkit',
    render: reduxToolkit,
    target: null,
  },
  {
    name: 'Mobx',
    render: mobx,
    target: null,
  },
  {
    name: 'Jotai',
    render: jotai,
    target: null,
  },
  {
    name: 'Valtio',
    render: valtio,
    target: null,
  },
  {
    name: 'Recoil',
    render: recoil,
    target: null,
  },
  {
    name: 'Pullstate',
    render: pullState,
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

win.suite("Increment counter", function () {
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
