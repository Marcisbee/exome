import { runMiddleware } from './middleware'
import { exomeId } from './utils/exome-id'
import { exomeName } from './utils/exome-name'
import { afterLoadStateCallbacks } from './utils/load-state'
import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateMap } from './utils/update-map'

export class Exome {
  private [exomeId]: string
  private [exomeName]!: string

  constructor() {
    const name = this[exomeName] || this.constructor.name

    this[exomeId] = `${name}-${ranID()}`

    updateMap[this[exomeId]] = []

    // Run this code after constructor to get all the parameters right.
    Promise.resolve().then(() => {
      runMiddleware(this, 'NEW', [])
    })

    return proxify(this)
  }

  public afterLoadState(cb: () => void) {
    if (afterLoadStateCallbacks == null) {
      return
    }

    afterLoadStateCallbacks.push(cb)
  }
}
