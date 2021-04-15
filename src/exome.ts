import { runMiddleware } from './middleware'
import { exomeId } from './utils/exome-id'
import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateMap } from './utils/update-map'

export class Exome {
  private [exomeId]: string

  constructor() {
    const name = this.constructor.name
    const id = `${name}-${ranID()}`

    updateMap[id] = []

    this[exomeId] = id

    // Run this code after constructor to get all the parameters right.
    Promise.resolve().then(() => {
      runMiddleware(this, 'NEW', [])
    })

    return proxify(this, name, id)
  }
}
