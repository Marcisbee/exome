# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```
use-reducer ............ 17.27ms/ops ±1.59% (166.88kb)
use-state .............. 17.68ms/ops ±2.04% (166.86kb)
use-sync-external-store  18.35ms/ops ±1.07% (167.03kb)
exome .................. 18.63ms/ops ±1.16% (168.37kb)
superstate ............. 18.82ms/ops ±0.60% (170.72kb)
simpler-state .......... 19.17ms/ops ±1.04% (170.91kb)
use-context ............ 19.21ms/ops ±0.52% (167.10kb)
nanostores ............. 19.22ms/ops ±4.04% (169.29kb)
constate ............... 19.48ms/ops ±0.99% (168.09kb)
zustand ................ 19.77ms/ops ±3.02% (170.90kb)
storeon ................ 19.78ms/ops ±1.06% (167.91kb)
preact-signals ......... 19.79ms/ops ±1.76% (176.24kb)
teaful ................. 20.46ms/ops ±1.98% (169.15kb)
use-change ............. 20.62ms/ops ±1.66% (171.59kb)
signia ................. 20.75ms/ops ±0.52% (174.07kb)
remini ................. 20.93ms/ops ±1.39% (172.82kb)
redux .................. 21.71ms/ops ±1.27% (181.97kb)
react-easy-state ....... 22.31ms/ops ±1.64% (177.67kb)
trashly ................ 22.42ms/ops ±2.24% (194.49kb)
mobx ................... 22.50ms/ops ±0.96% (236.81kb)
effector ............... 22.92ms/ops ±1.30% (184.24kb)
pullstate .............. 23.38ms/ops ±0.66% (188.42kb)
jotai .................. 24.49ms/ops ±1.04% (175.40kb)
redux-toolkit .......... 26.33ms/ops ±0.82% (202.48kb)
valtio ................. 26.80ms/ops ±0.73% (174.34kb)
resso .................. 29.74ms/ops ±0.86% (169.44kb)
recoil ................. 32.89ms/ops ±2.29% (255.21kb)
xstate ................. 37.21ms/ops ±2.11% (240.74kb)
```

2. Triggered increment action and updated component view
```
exome ......... 17.87ms/ops ±3.82% (169.19kb)
preact-signals  18.82ms/ops ±0.90% (176.93kb)
recoil ........ 24.51ms/ops ±1.06% (255.96kb)
redux ......... 220.81ms/ops ±1.34% (182.78kb)
mobx .......... 221.23ms/ops ±1.90% (237.55kb)
redux-toolkit . 230.08ms/ops ±1.48% (203.26kb)
trashly ....... 253.83ms/ops ±1.64% (195.26kb)
valtio ........ 1151.83ms/ops ±1.17% (175.09kb)
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
