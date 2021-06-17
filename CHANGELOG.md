# Changelog

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
