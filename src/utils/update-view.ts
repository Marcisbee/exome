import { updateMap } from './update-map'

export function updateView(): void {
  Object.keys(updateMap).forEach((key) => {
    const renderers = updateMap[key]

    updateMap[key] = []

    renderers.forEach((renderer) => renderer())
  })
}
