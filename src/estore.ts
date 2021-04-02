import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateRenderers } from './utils/update-maps'

export class Estore {
  constructor() {
    const name = this.constructor.name
    const id = `${name}-${ranID()}`

    updateRenderers.set(id, [])

    return proxify(this, name, id)
  }
}
