import { exomeId } from './utils/exome-id'
import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateRenderers } from './utils/update-maps'

export class Exome {
  private [exomeId]: string

  constructor() {
    const name = this.constructor.name
    const id = `${name}-${ranID()}`

    updateRenderers.set(id, [])

    this[exomeId] = id

    return proxify(this, name, id)
  }
}
