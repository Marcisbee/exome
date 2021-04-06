import { runMiddleware } from './middleware'
import { exomeId } from './utils/exome-id'
import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateRenderers } from './utils/update-maps'

export const registeredExomes = new Map()

export class Exome {
  private [exomeId]: string

  constructor() {
    const name = this.constructor.name
    const id = `${name}-${ranID()}`

    if (!registeredExomes.has(name)) {
      registeredExomes.set(name, this.constructor)
    }

    updateRenderers.set(id, [])

    this[exomeId] = id

    requestAnimationFrame(() => {
      runMiddleware(this, 'NEW', [])
    })

    return proxify(this, name, id)
  }
}
