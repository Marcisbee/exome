# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```sh
use-reducer ............ 17.43ms/ops ±1.30% (165.96kb)
use-state .............. 17.72ms/ops ±1.32% (165.95kb)
use-sync-external-store  18.57ms/ops ±1.88% (166.12kb)
exome .................. 18.63ms/ops ±1.19% (167.46kb)
nanostores ............. 18.99ms/ops ±1.35% (168.03kb)
superstate ............. 19.06ms/ops ±1.53% (169.81kb)
use-context ............ 19.30ms/ops ±0.88% (166.19kb)
simpler-state .......... 19.40ms/ops ±1.44% (169.28kb)
zustand ................ 19.46ms/ops ±1.06% (169.27kb)
constate ............... 19.69ms/ops ±2.08% (167.18kb)
storeon ................ 19.85ms/ops ±1.07% (167.00kb)
preact-signals ......... 20.16ms/ops ±4.24% (174.36kb)
teaful ................. 20.51ms/ops ±1.79% (168.24kb)
use-change ............. 20.63ms/ops ±1.37% (170.67kb)
signia ................. 20.77ms/ops ±1.02% (173.16kb)
remini ................. 21.12ms/ops ±1.28% (171.91kb)
redux .................. 21.63ms/ops ±1.40% (179.75kb)
react-easy-state ....... 22.27ms/ops ±0.85% (176.76kb)
trashly ................ 22.32ms/ops ±1.90% (193.58kb)
mobx ................... 22.49ms/ops ±0.80% (235.90kb)
effector ............... 22.88ms/ops ±2.43% (182.60kb)
pullstate .............. 23.47ms/ops ±0.90% (187.51kb)
jotai .................. 24.42ms/ops ±1.26% (174.48kb)
redux-toolkit .......... 26.41ms/ops ±0.81% (200.25kb)
valtio ................. 26.68ms/ops ±0.91% (173.08kb)
resso .................. 29.60ms/ops ±0.62% (168.18kb)
recoil ................. 32.85ms/ops ±1.08% (254.30kb)
xstate ................. 36.61ms/ops ±2.25% (238.26kb)
```

2. Triggered increment action and updated component view
```sh
exome ......... 17.72ms/ops ±4.01% (168.28kb)
nanostores .... 18.72ms/ops ±1.46% (168.72kb)
simpler-state . 18.73ms/ops ±0.67% (169.95kb)
preact-signals  18.77ms/ops ±0.51% (175.05kb)
jotai ......... 19.20ms/ops ±2.25% (175.20kb)
signia ........ 19.23ms/ops ±4.34% (173.88kb)
recoil ........ 24.81ms/ops ±1.21% (255.05kb)
redux ......... 224.54ms/ops ±0.72% (180.55kb)
mobx .......... 225.30ms/ops ±1.29% (236.64kb)
redux-toolkit . 232.03ms/ops ±1.16% (201.04kb)
trashly ....... 254.36ms/ops ±2.10% (194.35kb)
valtio ........ 1142.38ms/ops ±1.59% (173.83kb)
```

<!-- _Note: **Less is better**_ -->

I know counter doesn't really show real world app performance, but I didn't want to waste much time re-creating real world app for each state so this will have to do.

# Running benchmarks
There's a cli to run and return results. Tests run on top of `tachometer` library from Google via Chromium in browser environment.

Before starting, make sure you're in `/benchmark` directory.

To prepare dependencies, run:
```
npm install
```

And to run tests:
```
node run.react.counter.mjs
node run.react.fields.mjs
```
