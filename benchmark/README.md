# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```sh
use-state .............. 18.4 ms/ops ±1.1 | 165.6 KB
use-reducer ............ 18.4 ms/ops ±1.3 | 165.6 KB
use-sync-external-store  18.7 ms/ops ±0.4 | 165.8 KB
exome-v2.0.2 ........... 18.9 ms/ops ±0.4 | 167.2 KB
superstate-v0.1.0 ...... 19.6 ms/ops ±0.5 | 169.5 KB
use-context ............ 19.9 ms/ops ±0.3 | 165.9 KB
simpler-state-v1.2.1 ... 20.0 ms/ops ±0.4 | 169.0 KB
zustand-v4.3.8 ......... 20.1 ms/ops ±0.5 | 169.0 KB
nanostores-v0.8.1 ...... 20.1 ms/ops ±1.3 | 167.7 KB
constate-v3.3.2 ........ 20.2 ms/ops ±0.7 | 166.9 KB
storeon-v3.1.5 ......... 20.6 ms/ops ±0.5 | 166.7 KB
use-change-v1.1.4 ...... 20.7 ms/ops ±0.4 | 170.5 KB
teaful-v0.11.1 ......... 20.8 ms/ops ±0.5 | 167.9 KB
preact-signals-v1.3.2 .. 21.4 ms/ops ±0.6 | 174.6 KB
remini-v1.3.0 .......... 21.4 ms/ops ±0.6 | 171.6 KB
signia-v0.1.4 .......... 21.7 ms/ops ±1.6 | 172.9 KB
redux-v4.2.1 ........... 22.1 ms/ops ±0.4 | 179.5 KB
mobx-v6.9.0 ............ 23.0 ms/ops ±0.6 | 235.9 KB
react-easy-state-v6.3.0  23.0 ms/ops ±0.7 | 176.5 KB
trashly-v0.1.6 ......... 23.0 ms/ops ±0.6 | 193.3 KB
effector-v22.8.6 ....... 23.4 ms/ops ±1.1 | 182.4 KB
pullstate-v1.25.0 ...... 24.1 ms/ops ±0.4 | 187.1 KB
jotai-v1.13.1 .......... 25.2 ms/ops ±0.7 | 174.7 KB
redux-toolkit-v1.9.5 ... 27.1 ms/ops ±0.9 | 207.0 KB
valtio-v1.10.5 ......... 27.8 ms/ops ±0.9 | 174.0 KB
resso-v0.14.0 .......... 30.6 ms/ops ±0.7 | 167.9 KB
recoil-v0.7.7 .......... 34.3 ms/ops ±1.2 | 255.6 KB
xstate-v4.37.2 ......... 37.9 ms/ops ±1.6 | 238.0 KB
```

2. Triggered increment action and updated component view
```sh
exome-v2.0.2 ......... 18.4 ms/ops ±1.5 | 168.0 KB
nanostores-v0.8.1 .... 18.9 ms/ops ±0.4 | 168.4 KB
jotai-v1.13.1 ........ 19.0 ms/ops ±0.7 | 175.4 KB
simpler-state-v1.2.1 . 19.0 ms/ops ±1.2 | 169.7 KB
signia-v0.1.4 ........ 19.2 ms/ops ±0.3 | 173.6 KB
preact-signals-v1.3.2  20.6 ms/ops ±4.8 | 175.3 KB
recoil-v0.7.7 ........ 22.0 ms/ops ±0.1 | 256.3 KB
mobx-v6.9.0 .......... 225.8 ms/ops ±4.0 | 236.6 KB
redux-v4.2.1 ......... 232.8 ms/ops ±20.5 | 180.3 KB
redux-toolkit-v1.9.5 . 235.8 ms/ops ±2.9 | 207.8 KB
trashly-v0.1.6 ....... 261.2 ms/ops ±11.2 | 194.1 KB
valtio-v1.10.5 ....... 1020.3 ms/ops ±19.7 | 174.7 KB
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
