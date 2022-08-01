import Benchmark, { Suite, Options } from 'benchmark'
import ReactDOM from 'react-dom';

// import useState from './use-state';
// import useReducer from './use-reducer';
import exome from './exome';
import redux from './redux';
import reduxToolkit from './redux-toolkit';
import mobx from './mobx';
import jotai from './jotai';
import valtio from './valtio';
import recoil from './recoil';
import pullState from './pullstate';
import trashly from './trashly';

// @ts-ignore
window.Benchmark = Benchmark;

const suite = new Suite('Count')

const target = document.getElementById('bench')!;

let increment: HTMLHeadingElement;

function configTest(renderer: (target: HTMLElement) => void): Options {
  return {
    fn() {
      increment.click();
    },
    onStart() {
      console.log(`<blue><bold>${this.name}</bold></blue> <dim>...</dim>`)
      renderer(target);

      increment = target.querySelector('h1')!;
    },
    onComplete() {
      (this as any).output = parseInt(target.innerText, 10)

      ReactDOM.unmountComponentAtNode(target);
      target.innerHTML = '';
      console.log('<clear-line/>');
    },
  };
}

// add tests
suite
  // React baseline for performance
  // .add('useState', configTest(useState))
  // .add('useReducer', configTest(useReducer))

  // Benchmark subjects
  .add('Exome', configTest(exome))
  .add('Redux', configTest(redux))
  .add('Redux Toolkit', configTest(reduxToolkit))
  .add('Mobx', configTest(mobx))
  .add('Jotai', configTest(jotai))
  .add('Valtio', configTest(valtio))
  .add('Recoil', configTest(recoil))
  .add('PullState', configTest(pullState))
  .add('Trashly', configTest(trashly))

  // add listeners
  .on('start', function (this: any) {
    console.log(`Starting <bold><green>${this.name}</green></bold>\n\n`)
  })
  .on('cycle', (event: any) => {
    console.log(`<blue><bold>${(event.target.name + ' ').padEnd(15, '.').replace(/(\.+)$/, '<dim>$1</dim>')}</bold></blue> <yellow>${Math.round(event.target.hz).toLocaleString()} ops/sec</yellow> ±${event.target.stats.rme.toFixed(2)}% (${event.target.stats.sample.length} runs sampled) <dim>${event.target.output.toLocaleString()} was output</dim>\n`)
  })
  .on('complete', function (this: any) {
    console.log('\nFastest is <bold><green>' + this.filter('fastest').map('name') + '</green></bold>\n')

    // @ts-ignore
    window.PW_TEST.ended = true;
  })

  // run
  .run({ async: true })
