import { Exome } from 'exome'

class CounterStore extends Exome {
  public count = 0

  public increment() {
    this.count += 1
  }
}

export const counter = new CounterStore()
