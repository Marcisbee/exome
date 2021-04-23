import { Exome, addMiddleware, Middleware, getExomeId, updateMap } from 'exome'

const vanillaMiddleware: Middleware = (instance) => {
  return () => {
    const id = getExomeId(instance)
    const renderers = updateMap[id] ?? []

    updateMap[id] = []

    renderers.forEach((renderer) => renderer())
  }
}

addMiddleware(vanillaMiddleware)

type Handler<T extends Exome> = (store: Readonly<T>) => void
type Unsubscribe = () => void

export function subscribe<T extends Exome>(store: T, handler: Handler<T>): Unsubscribe {
  const id = getExomeId(store)

  if (!id) {
    throw new Error(
      '"subscribe" encountered store that is not an instance of "Exome"'
    )
  }

  if (!updateMap[id]) {
    updateMap[id] = []
  }

  const queue = updateMap[id]!

  function render() {
    handler(store)
  }

  queue.push(render)

  return () => {
    if (queue === updateMap[id]!) {
      const index = queue.indexOf(render)

      if (index === -1) {
        return
      }

      queue.splice(index, 1)
    }
  }
}
