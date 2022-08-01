import Benchmark, { Suite, Options } from 'benchmark'
import ReactDOM from 'react-dom';

import exome from './exome';
import redux from './redux';
import reduxToolkit from './redux-toolkit';
import mobx from './mobx';
import valtio from './valtio';
import recoil from './recoil';
import trashly from './trashly';

// @ts-ignore
window.Benchmark = Benchmark;

const suite = new Suite('1000 Fields')

const target = document.getElementById('bench')!;

function configTest(renderer: (target: HTMLElement) => void): Options {
  return {
    fn() {
      const input = target.querySelectorAll('input')![10]!;

      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', true, true);
      input.value = '' + Math.random();
      (input as any)._valueTracker.setValue(Math.random())
      input.dispatchEvent(evt);
    },
    onStart() {
      console.log(`<blue><bold>${this.name}</bold></blue> <dim>...</dim>`)
      renderer(target);
    },
    onComplete() {
      console.log('<clear-line/>');
      ReactDOM.unmountComponentAtNode(target);
      target.innerHTML = '';
    },
  };
}

// add tests
suite
  .add('Exome', configTest(exome))
  .add('Recoil', configTest(recoil))
  .add('Redux', configTest(redux))
  .add('Redux Toolkit', configTest(reduxToolkit))
  .add('Mobx', configTest(mobx))
  .add('Trashly', configTest(trashly))
  .add('Valtio', configTest(valtio))

  // add listeners
  .on('start', function(this: any) {
    console.log(`Starting <bold><green>${this.name}</green></bold>\n\n`)
  })
  .on('cycle', (event: any) => {
    console.log(`<blue><bold>${(event.target.name + ' ').padEnd(15, '.').replace(/(\.+)$/, '<dim>$1</dim>')}</bold></blue> <yellow>${Math.round(event.target.hz).toLocaleString()} ops/sec</yellow> ±${event.target.stats.rme.toFixed(2)}% (${event.target.stats.sample.length} runs sampled)\n`)
  })
  .on('complete', function (this: any) {
    console.log('\nFastest is <bold><green>' + this.filter('fastest').map('name') + '</green></bold>\n')

    // @ts-ignore
    window.PW_TEST.ended = true;
  })

  // run
  .run({ async: true })
