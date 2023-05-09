# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```
use-reducer ............ 18.25ms/ops ±3.77% (166.88kb)
use-state .............. 18.96ms/ops ±7.57% (166.86kb)
exome .................. 20.12ms/ops ±7.66% (168.22kb)
nanostores ............. 20.38ms/ops ±5.44% (169.29kb)
use-sync-external-store  20.51ms/ops ±20.30% (167.03kb)
simpler-state .......... 20.61ms/ops ±2.63% (170.91kb)
superstate ............. 20.64ms/ops ±11.48% (170.72kb)
preact-signals ......... 20.73ms/ops ±3.25% (176.24kb)
constate ............... 21.05ms/ops ±11.12% (168.09kb)
teaful ................. 21.87ms/ops ±4.31% (169.15kb)
zustand ................ 22.02ms/ops ±15.58% (170.90kb)
remini ................. 22.09ms/ops ±4.46% (172.82kb)
storeon ................ 22.15ms/ops ±12.85% (167.91kb)
use-context ............ 22.47ms/ops ±32.67% (167.10kb)
use-change ............. 22.56ms/ops ±10.96% (171.59kb)
redux .................. 22.79ms/ops ±2.34% (181.97kb)
signia ................. 23.11ms/ops ±13.47% (174.07kb)
mobx ................... 23.69ms/ops ±2.12% (236.81kb)
react-easy-state ....... 23.87ms/ops ±10.06% (177.67kb)
trashly ................ 24.70ms/ops ±8.04% (194.49kb)
pullstate .............. 24.91ms/ops ±5.65% (188.42kb)
effector ............... 24.98ms/ops ±11.71% (184.24kb)
jotai .................. 25.71ms/ops ±2.85% (175.40kb)
redux-toolkit .......... 28.69ms/ops ±9.30% (202.48kb)
valtio ................. 29.10ms/ops ±5.19% (174.35kb)
resso .................. 32.21ms/ops ±5.51% (169.44kb)
recoil ................. 34.61ms/ops ±2.80% (255.21kb)
xstate ................. 40.08ms/ops ±9.31% (240.74kb)
```

2. Triggered increment action and updated component view
```
exome ........ 23.20ms/ops ±1.24% (169.08kb)
recoil ....... 31.60ms/ops ±13.37% (256.01kb)
redux ........ 232.63ms/ops ±2.85% (182.82kb)
mobx ......... 237.08ms/ops ±2.81% (237.60kb)
redux-toolkit  241.67ms/ops ±1.65% (203.31kb)
trashly ...... 267.76ms/ops ±3.47% (195.31kb)
valtio ....... 1170.39ms/ops ±1.14% (175.15kb)
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
