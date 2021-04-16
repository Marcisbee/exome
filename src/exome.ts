import { runMiddleware } from './middleware'
import { exomeId } from './utils/exome-id'
import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateMap } from './utils/update-map'

export class Exome {
  private [exomeId]: string

  constructor() {
    const name = this.constructor.name

    this[exomeId] = `${name}-${ranID()}`

    updateMap[this[exomeId]] = []

    // Run this code after constructor to get all the parameters right.
    requestAnimationFrame(() => {
      runMiddleware(this, 'NEW', [])
    })

    return proxify(this)
  }
}
