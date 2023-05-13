# Migration from v1 to v2

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
