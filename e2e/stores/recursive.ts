import { Exome } from 'exome'

export class RecursiveStore extends Exome {
  constructor(
    public name: string,
    public items: RecursiveStore[] = []
  ) {
    super()
  }

  public rename(name: string) {
    this.name = name
  }
}

export const refRecursiveItem = new RecursiveStore('ref', [
  new RecursiveStore('first'),
  new RecursiveStore('second')
])

export const recursiveStore = new RecursiveStore('root', [
  new RecursiveStore('one', [
    refRecursiveItem
  ]),
  new RecursiveStore('two', [
    refRecursiveItem
  ])
])
