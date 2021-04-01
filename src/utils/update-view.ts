import { updateQueue, updateRenderers } from './update-maps'

export function updateView (): void {
  updateQueue.forEach((_, key) => {
    // console.log("Update view for", key);
    updateRenderers.get(key)!.forEach((renderer) => renderer())
    updateRenderers.set(key, [])
  })

  updateQueue.clear()
}
