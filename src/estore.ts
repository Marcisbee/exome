import { estoreId } from './utils/estore-id'
import { proxify } from './utils/proxify'
import { ranID } from './utils/ran-id'
import { updateRenderers } from './utils/update-maps'

export class Estore {
  private [estoreId]: string

  constructor() {
    const name = this.constructor.name
    const id = `${name}-${ranID()}`

    updateRenderers.set(id, [])

    this[estoreId] = id

    return proxify(this, name, id)
  }
}
