# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```sh
use-state .............. 15.1 ms/ops ±0.3 | 165.6 KB
use-reducer ............ 15.2 ms/ops ±0.3 | 165.6 KB
use-sync-external-store  15.8 ms/ops ±0.3 | 165.8 KB
exome-v2.0.3 ........... 15.9 ms/ops ±0.2 | 167.2 KB
use-context ............ 15.9 ms/ops ±0.2 | 165.9 KB
superstate-v0.1.0 ...... 16.2 ms/ops ±0.2 | 169.5 KB
constate-v3.3.2 ........ 16.4 ms/ops ±0.4 | 166.9 KB
zustand-v4.3.8 ......... 16.6 ms/ops ±0.2 | 169.0 KB
storeon-v3.1.5 ......... 16.6 ms/ops ±0.2 | 166.7 KB
nanostores-v0.8.1 ...... 16.6 ms/ops ±0.4 | 167.7 KB
tanstack-store-v0.1.3 .. 16.7 ms/ops ±0.4 | 169.2 KB
simpler-state-v1.2.1 ... 16.7 ms/ops ±0.3 | 169.0 KB
teaful-v0.11.1 ......... 17.3 ms/ops ±0.2 | 167.9 KB
preact-signals-v1.3.2 .. 17.3 ms/ops ±0.2 | 174.6 KB
redux-v4.2.1 ........... 17.5 ms/ops ±0.3 | 179.5 KB
signia-v0.1.4 .......... 17.5 ms/ops ±0.3 | 172.9 KB
remini-v1.3.0 .......... 17.5 ms/ops ±0.3 | 171.6 KB
use-change-v1.1.4 ...... 17.6 ms/ops ±0.3 | 170.5 KB
effector-v22.8.6 ....... 18.4 ms/ops ±0.3 | 182.4 KB
mobx-v6.9.0 ............ 18.6 ms/ops ±0.2 | 235.9 KB
trashly-v0.1.6 ......... 19.0 ms/ops ±0.4 | 193.3 KB
react-easy-state-v6.3.0  19.1 ms/ops ±0.2 | 176.5 KB
ripple-v1.10.5 ......... 19.5 ms/ops ±0.3 | 173.0 KB
pullstate-v1.25.0 ...... 20.9 ms/ops ±0.5 | 187.1 KB
jotai-v1.13.1 .......... 21.0 ms/ops ±0.2 | 174.7 KB
redux-toolkit-v1.9.5 ... 21.8 ms/ops ±0.2 | 207.0 KB
valtio-v1.10.5 ......... 23.4 ms/ops ±0.3 | 174.0 KB
recoil-v0.7.7 .......... 25.9 ms/ops ±0.4 | 255.6 KB
resso-v0.14.0 .......... 26.2 ms/ops ±0.3 | 167.9 KB
xstate-v4.37.2 ......... 29.4 ms/ops ±0.5 | 238.0 KB
```

2. Triggered increment action and updated component view
```sh
exome-v2.0.3 ......... 17.8 ms/ops ±0.3 | 168.0 KB
simpler-state-v1.2.1 . 18.7 ms/ops ±0.5 | 169.7 KB
nanostores-v0.8.1 .... 18.7 ms/ops ±0.1 | 168.4 KB
signia-v0.1.4 ........ 18.8 ms/ops ±0.2 | 173.6 KB
jotai-v1.13.1 ........ 18.8 ms/ops ±0.2 | 175.4 KB
preact-signals-v1.3.2  19.0 ms/ops ±0.2 | 175.3 KB
recoil-v0.7.7 ........ 21.7 ms/ops ±0.4 | 256.3 KB
mobx-v6.9.0 .......... 218.0 ms/ops ±3.5 | 236.6 KB
redux-v4.2.1 ......... 221.2 ms/ops ±3.6 | 180.3 KB
redux-toolkit-v1.9.5 . 229.1 ms/ops ±3.4 | 207.8 KB
trashly-v0.1.6 ....... 253.8 ms/ops ±3.5 | 194.1 KB
valtio-v1.10.5 ....... 977.3 ms/ops ±17.6 | 174.7 KB
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
