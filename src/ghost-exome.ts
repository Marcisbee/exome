import { exomeId } from './utils/exome-id'
import { ranID } from './utils/ran-id'

export class GhostExome {
  private [exomeId]: string

  constructor() {
    const name = this.constructor.name

    this[exomeId] = `${name}-${ranID()}`
  }
}
