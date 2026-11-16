import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";

// Exercise consumer bundles, including separate builds that rename the same class.
const names = new Set();
const storage = new Map();
for (const minify of [false, true]) {
	for (const padding of [0, 12]) {
		for (const timing of ["before", "after"]) {
			const { outputFiles } = await build({
				stdin: {
					contents: `
import { Exome, exomeId, getExomeId, setExomeId } from './src/exome.ts';
import { registerLoadable, saveState, loadState } from './src/state.ts';
${Array.from({ length: padding }, (_, i) => `const padding${i} = () => ${i}; export const result${i} = [${Array(30).fill(`padding${i}()`).join(",")}];`).join("\n")}
class Preferences extends Exome { value = 0; }
${timing === "before" ? "registerLoadable({ Preferences });" : ""}
const store = new Preferences();
setExomeId(store, 'store-with-suffix');
${timing === "after" ? "registerLoadable({ Preferences });" : ""}
export const className = Preferences.name;
export const id = getExomeId(store);
export const rawId = store[exomeId];
export const key = 'exome-' + id;
const saved = storage.get(key);
if (saved) loadState(store, saved);
export const previous = store.value;
store.value++;
storage.set(key, saveState(store));
class Root extends Exome { child = store; }
const restored = new Root();
loadState(restored, saveState(new Root()));
export const restoredValue = restored.child.value;
export const restoredId = getExomeId(restored.child);
export const freshIds = [getExomeId(new Preferences()), getExomeId(new Preferences())];
// Reads above have warmed the ID cache. Public writes and registration must
// still update it, including suffixes containing hyphens.
setExomeId(store, 'updated-with-suffix');
export const updatedId = getExomeId(store);
registerLoadable({ RenamedPreferences: Preferences });
export const renamedId = getExomeId(store);
store[exomeId] = 'OldName-direct-write';
export const assignedId = getExomeId(store);
`,
					resolveDir: process.cwd(),
				},
				bundle: true,
				write: false,
				format: "cjs",
				platform: "node",
				minify,
			});
			const module = { exports: {} };
			runInNewContext(outputFiles[0].text, { module, storage });
			const result = module.exports;
			names.add(result.className);
			assert.equal(
				result.key,
				"exome-Preferences-store-with-suffix",
				`${minify}/${padding}/${timing}`,
			);
			assert.equal(result.rawId, result.id);
			assert.equal(result.updatedId, "Preferences-updated-with-suffix");
			assert.equal(result.renamedId, "RenamedPreferences-updated-with-suffix");
			assert.equal(result.assignedId, "RenamedPreferences-direct-write");
			assert.equal(result.restoredId, result.id);
			assert.equal(result.restoredValue, result.previous + 1);
			assert.notEqual(...result.freshIds);
			assert.ok(result.freshIds.every((id) => id.startsWith("Preferences-")));
		}
	}
}
assert.ok(
	names.size >= 3,
	"development and production builds must use different class names",
);
assert.equal(storage.size, 1);
assert.equal(JSON.parse([...storage.values()][0]).value, 8);
console.log(
	"Storage survives 8 development/minified build and registration-timing combinations.",
);
