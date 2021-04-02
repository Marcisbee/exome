<div align="center">
  <img src="assets/logo.svg" width="800" height="180" />
</div>

<div align="center">
  <a href="https://github.com/Marcisbee/exome/actions">
    <img alt="CI" src="https://img.shields.io/github/workflow/status/Marcisbee/exome/CI?style=flat-square" />
  </a>
  <a href="https://www.npmjs.com/package/exome">
    <img alt="npm" src="https://img.shields.io/npm/v/exome.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=exome">
    <img alt="package size" src="https://img.shields.io/bundlephobia/minzip/exome?style=flat-square" />
  </a>
</div>

<div align="center">
  Proxy based state manager for deeply nested states
</div>

<br />

## Features

- 📦 **Small**: Just **1 KB** minified
- 🚀 **Fast**: Uses **no diffing** of state changes (because of architecture, it's not needed)
- 😍 **Simple**: Uses classes as state
- 🎡 **Nested**: Easily manage deeply nested state structures
- 💪 **Immutable**: Data can only be changed via actions
- 🎛 **Effects**: Built-in effects for actions
- 🛡 **Bulletproof**: Written in strict TypeScript
- 🗂 **Typed**: All your state will be typed
- 💨 **Zero dependencies**


# Installation
To install the stable version:
```bash
npm install --save exome
```
This assumes you are using [npm](https://www.npmjs.com/package/exome) as your package manager.

# Usage
@TODO

# Motivation
I stumbled upon a need to store deeply nested store and manage chunks of them individually and regular flux selector/action architecture just didn't make much sense anymore. So I started to prototype what would ideal deeply nested store interaction look like and I saw that we could simply use classes for this.

**Goals I set for this project:**

- [x] Easy usage with deeply nested state chunks (array in array)
- [x] Single source of thruth (can be multiple tho, but it's up to you)
- [x] Type safe with TypeScript
- [x] To have actions be only way of editing state
- [x] To have effects trigger extra actions
- [ ] Redux devtool support

# MIT License
Copyright (C) 2021 Marcis Bergmanis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
