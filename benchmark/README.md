# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```sh
use-reducer ............ 17.64 ms/ops ±0.28 | 165.64 KB
use-state .............. 17.78 ms/ops ±0.28 | 165.62 KB
use-sync-external-store  18.54 ms/ops ±0.32 | 165.79 KB
exome .................. 18.76 ms/ops ±0.36 | 167.15 KB
superstate ............. 19.26 ms/ops ±0.38 | 169.49 KB
nanostores ............. 19.44 ms/ops ±0.34 | 167.70 KB
use-context ............ 19.44 ms/ops ±0.34 | 165.87 KB
constate ............... 19.78 ms/ops ±0.29 | 166.86 KB
simpler-state .......... 19.84 ms/ops ±0.39 | 168.96 KB
zustand ................ 19.87 ms/ops ±0.28 | 168.94 KB
storeon ................ 20.18 ms/ops ±0.25 | 166.67 KB
preact-signals ......... 20.25 ms/ops ±0.22 | 174.03 KB
teaful ................. 20.45 ms/ops ±0.27 | 167.92 KB
use-change ............. 20.57 ms/ops ±0.36 | 170.35 KB
signia ................. 20.94 ms/ops ±0.29 | 172.84 KB
remini ................. 21.23 ms/ops ±0.50 | 171.58 KB
redux .................. 21.70 ms/ops ±0.26 | 179.42 KB
mobx ................... 22.59 ms/ops ±0.26 | 235.57 KB
trashly ................ 22.65 ms/ops ±0.36 | 193.26 KB
react-easy-state ....... 22.66 ms/ops ±0.27 | 176.43 KB
effector ............... 23.01 ms/ops ±0.38 | 182.28 KB
pullstate .............. 23.78 ms/ops ±0.37 | 187.18 KB
jotai .................. 24.86 ms/ops ±0.38 | 174.16 KB
redux-toolkit .......... 26.58 ms/ops ±0.30 | 199.93 KB
valtio ................. 27.19 ms/ops ±0.31 | 172.75 KB
resso .................. 30.03 ms/ops ±0.29 | 167.85 KB
recoil ................. 33.80 ms/ops ±1.55 | 253.97 KB
xstate ................. 37.27 ms/ops ±0.72 | 237.94 KB
```

2. Triggered increment action and updated component view
```sh
exome ......... 17.43 ms/ops ±0.35 | 167.96 KB
jotai ......... 18.66 ms/ops ±0.22 | 174.87 KB
nanostores .... 18.72 ms/ops ±0.18 | 168.40 KB
simpler-state . 18.93 ms/ops ±0.81 | 169.62 KB
signia ........ 19.11 ms/ops ±0.27 | 173.55 KB
preact-signals  19.26 ms/ops ±0.91 | 174.73 KB
recoil ........ 22.47 ms/ops ±0.79 | 254.72 KB
redux ......... 219.14 ms/ops ±5.02 | 180.23 KB
mobx .......... 224.82 ms/ops ±5.11 | 236.31 KB
redux-toolkit . 231.02 ms/ops ±4.33 | 200.71 KB
trashly ....... 256.00 ms/ops ±1.60 | 194.02 KB
valtio ........ 1177.78 ms/ops ±19.97 | 173.50 KB
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
