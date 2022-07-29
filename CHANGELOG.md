# Changelog

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
