import { updateQueue, updateRenderers } from './update-maps'

export function updateView(): void {
  updateQueue.forEach((_, key) => {
    const chunk = updateRenderers.get(key)!
    updateRenderers.set(key, [])

    chunk.forEach((renderer) => renderer())
  })

  updateQueue.clear()
}
