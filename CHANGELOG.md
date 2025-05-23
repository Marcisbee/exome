# Changelog

## 2.8.1

### Bugfix
* Detect thenable (not necessarily a Promise instance) in actions.

## 2.8.0

### Feature
* Allow to read action response/return value from `getActionStatus` function.

## 2.7.0

### Feature
* Improve types for `onAction` function.

## 2.6.2

### Other
* Allow `null` and `undefined` in `useStore` function.

## 2.6.1

### Other
* Updates typedoc.

## 2.6.0

### Feature
* Adds action response data to `addMiddleware`, `runMiddleware` and `onAction`.

## 2.5.0

### Feature
* Allows deep inheritance.

## 2.4.4

### Other
* Upgrades esbuild.
* Upgrades biome.

## 2.4.3

### Other
* Makes types more explicit.
* Publish to jsr.

## 2.4.2

### Other
* Pass action error to devtools.

## 2.4.1

### Bugfix
* Properly re-throw errors from async actions.

## 2.4.0

### Feature
* Adds `getActionStatus` to `exome/utils`.

## 2.3.3

### Bugfix
* Properly handle errors in actions.
* Middleware now also returns error from actions.

## 2.3.2

### Bugfix
* Adds version export to `unstableExomeDevtools`.

## 2.3.1

### Other
* Adds `unstableExomeDevtools` method to `exome/devtools` package.

## 2.3.0

### Feature
* Add `LOAD_STATE` middleware action after state was prefilled via loadState.

## 2.2.0

### Feature
* Increase exome id length by 2 characters to lessen the birthday paradox.
* Use "try finally" for running "NEW" actions instead of "Promise.resolve()".

## 2.1.0

### Feature
* Adds support for Solid.js.
* Adds support for Angular signals.

## 2.0.4

### Bugfix
* Print circular store references in jest snapshots.

## 2.0.3

### Bugfix
* Fixes jest snapshot serializer depth.

## 2.0.2

### Bugfix
* Fixes `subscribe` method where it did not send store instance as argument.

## 2.0.1

### Bugfix
* Fixes vue integration of `useStore`.

## 2.0.0

### Breaking
* Reorganizes imports;
* Removes `updateMap`;
* Replaces `updateView` with `updateAll`;
* Replaces `exomeDevtools` with `exomeReduxDevtools`.

Please read the [migration guide](/MIGRATION-1-to-2.md) to ease the upgrade process.

### Migration guide

v2 includes some breaking changes around subscriptions. It better reorganizes files and imports.

Here are changes that need to be made:

1. `subscribe` is no longer in a separate import:

```diff
-import { subscribe } from "exome/subscribe";
+import { subscribe } from "exome";
```

2. `saveState`, `loadState` and `registerLoadable` is no longer part of root import:

```diff
-import { saveState, loadState, registerLoadable } from "exome";
+import { saveState, loadState, registerLoadable } from "exome/state";
```

3. `GhostExome` is no longer part of root import:

```diff
-import { GhostExome } from "exome";
+import { GhostExome } from "exome/ghost";
```

4. `updateMap` is no longer exposed (use `subscribe`, `update` and `updateAll` to listen to changes or trigger them):

5. `updateView` is renamed to `updateAll`:

```diff
-import { updateView } from "exome";
+import { updateAll } from "exome";
```

6. `exomeDevtools` is renamed to `exomeReduxDevtools`:

```diff
-import { exomeDevtools } from "exome/devtools";
+import { exomeReduxDevtools } from "exome/devtools";
```

## 1.5.6

### Other
* Published to npm with new logo.

## 1.5.5

### Other
* Published to npm with provenance.

## 1.5.4

### Bugfix
* Removes `peerDependencies` from package.json.

## 1.5.3

### Bugfixes
* Updates documentation;
* Cleans up published package.json file.

## 1.5.0

### Features
* Moves exported import files to `.mjs` file format.

## 1.4.0

### Features
* Adds support for Svelte.

## 1.3.0

### Features
* Performance improvements;
* Gets rid of Proxy usage as it was just an overhead without real benefits.

## 1.2.0

### Features
* Adds RXJS Observable support.

## 1.1.0

### Features
* Adds Deno support.

## 1.0.3

### Bugfixes
* Fixes broken redux devtools url.

## 1.0.2

### Bugfixes
* Fixes issue where getter get called before ready.

## 1.0.1

### Bugfixes
* Fixes rxjs compatibility issue when using `BehaviorSubject` inside `Exome`.

## 1.0.0

### Stable release
No actual changes as it's proven to be stable fo v1.

## 0.16.0

### Feature
* Adds `lit` support.

Added new ReactiveController named `StoreController` as part of lit v2.0.

## 0.15.0

### Feature
* Arrow functions no longer trigger actions.

This was previously wrong as we only should trigger actions for prototype methods. It is useful to define arrow method to GET some data and that should NOT trigger action and re-render.

## 0.14.0

### Feature
* Adds experimental `afterLoadState` method that triggers callback whenever Exome data was loaded via `loadState`.

## 0.13.0

### Feature
* Adds new `onAction` method that triggers callback whenever specific action is called.

## 0.12.4

### Bugfixes
* Fixes `loadState` inability to load circular Exome instances.

## 0.12.3

### Bugfixes
* Fixes `saveState` snapshot of circular Exome instances.

## 0.12.1

### Bugfixes
* `saveState` and `loadState` now works with minified class names;
* Issue with state type but warning about store type in load-state ([#8](https://github.com/Marcisbee/exome/pull/8)).

## 0.12.0

### Breaking changes

* Adds `registerLoadable` method that gathers all available Exomes that can be registered;
* Removes 3rd argument for `loadState` method;

```diff
- loadState(target, state, { Person, Dog })
+ registerLoadable({ Person, Dog })
+ loadState(target, state)
```

## 0.11.0

* Adds `subscribe` method that allows to listen for changes in particular Exome instance;

## 0.10.1

* Fixes jest serializer output for `GhostExome`;

## 0.10.0

* Adds `GhostExome` class;

  It is accepted as Exome instance, but will not update or call middleware.

## 0.9.2

* Fixes type declaration.

## 0.9.1

* Fixes vue export;
* Adds `setExomeId` method.

## 0.9.0

* Adds Vue support.

  Added `useStore` hook for Vue 3 composition api.
