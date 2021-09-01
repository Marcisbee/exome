import { addMiddleware, Exome, getExomeId, Middleware, updateMap } from 'exome'
import { ReactiveController, ReactiveControllerHost } from 'lit'

const litMiddleware: Middleware = (instance) => {
  return () => {
    const id = getExomeId(instance)
    const renderers = updateMap[id] === undefined ? [] : updateMap[id]

    updateMap[id] = []

    renderers.forEach((renderer) => renderer())
  }
}

addMiddleware(litMiddleware)

export class StoreController<T extends Exome> implements ReactiveController {
  host: ReactiveControllerHost

  private readonly _id: string
  private _queue!: any[]
  private readonly _render: () => void

  constructor(host: ReactiveControllerHost, public store: T) {
    (this.host = host).addController(this)
    this._id = getExomeId(store)

    if (!this._id) {
      throw new Error(
        '"StoreController" encountered value that is not an instance of "Exome"'
      )
    }

    if (updateMap[this._id] === undefined) {
      updateMap[this._id] = []
    }

    this._render = () => {
      this.host.requestUpdate()
    }
  }

  hostUpdated() {
    this._queue = updateMap[this._id]!
    this._queue.push(this._render)
  }

  hostConnected() {
    this._queue = updateMap[this._id]!
    this._queue.push(this._render)
  }

  hostDisconnected() {
    if (this._queue === updateMap[this._id]!) {
      const index = this._queue.indexOf(this._render)

      if (index === -1) {
        return
      }

      this._queue.splice(index, 1)
    }
  }
}
