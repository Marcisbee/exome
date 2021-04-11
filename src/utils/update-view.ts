import { updateMap } from './update-map'

export function updateView(): void {
  updateMap.forEach((renderers, key) => {
    updateMap.set(key, [])

    renderers.forEach((renderer) => renderer())
  })
}
