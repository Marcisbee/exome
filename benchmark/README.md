# Benchmarks
I created a simple benchmark to get the gist of how this library performs.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

1. Rendered that counter component with initial state
```
Exome ......... 88,837 ops/sec ±1.54% (66 runs sampled)
Redux ......... 87,565 ops/sec ±1.01% (67 runs sampled)
Redux Toolkit . 63,978 ops/sec ±0.49% (67 runs sampled)
Mobx .......... 81,837 ops/sec ±0.85% (68 runs sampled)
Jotai ......... 72,942 ops/sec ±0.45% (66 runs sampled)
Valtio ........ 62,652 ops/sec ±0.67% (66 runs sampled)
Recoil ........ 45,874 ops/sec ±2.55% (65 runs sampled)
PullState ..... 66,480 ops/sec ±0.61% (68 runs sampled)

Fastest is Exome
```

2. Triggered increment action and updated component view
```
Exome ......... 11,173 ops/sec ±1.37% (66 runs sampled)
Recoil ........ 9,540 ops/sec ±3.28% (53 runs sampled)
Redux ......... 392 ops/sec ±0.79% (66 runs sampled)
Mobx .......... 403 ops/sec ±1.57% (64 runs sampled)
Valtio ........ 83 ops/sec ±2.95% (56 runs sampled)

Fastest is Exome
```

<!-- _Note: **Higher is better**_ -->

I know counter doesn't really show real world app performance, but I didn't want to waste much time re-creating real world app for each state so this will have to do.

# Running benchmarks
There's a cli to run and return results. Tests run on top of `benchmark.js` library via Playwright in browser environment.

Before starting, make sure you're in `/benchmark` directory.

To prepare dependencies, run:
```
npm install
```

And to run tests:
```
npm test ./react/counter
```

`test` script takes in single arg that points to benchmark directory you want to run.

Currently possible benchmarks are:
```
npm test ./react/counter
npm test ./react/fields
```
