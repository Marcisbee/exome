# Benchmarks
I created a simple benchmark to get the gist of how this library performs. I did not create benchmarks to brag or anything (is not my intention to start a fire in a community), it's just an interesting thing to look at.

Also one thing to note is that I disabled batching in valtio as it is avoids sync code and cannot really be benchmarked in a way we can test it.

So I created a simple `counter state` with `increment action` with each library I cared to test and:

|1. Rendered that counter component with initial state|2. Triggered increment action and updated component view|
|-|-|
|<img src="../assets/render.png" />|<img src="../assets/increment.png" />|

_Note: **Higher is better**_

I know counter doesn't really show real world app performance, but I didn't want to waste much time re-creating real world app for each state so this will have to do.

# Running benchmarks
Since I use Macbook with M1 processor, it's not straight forward to install puppeteer, hence there's no cli to run tests and get results printed. It's all done via browser.

To prepare dependencies, run:
```
npm install
```

And to start test server run:
```
npm test
```

It'll tell the address and port to open in browser of your choosing and just run benchmarks from there.
