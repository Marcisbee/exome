import { Exome, loadState, registerLoadable, saveState } from '../src'

export class Dog extends Exome {
  constructor(public name: string, public breed: string) {
    super()
  }

  public rename(name: string) {
    this.name = name
  }

  public changeBreed(breed: string) {
    this.breed = breed
  }
}

export class Person extends Exome {
  constructor(public name: string, public dogs: Dog[] = []) {
    super()
  }

  public rename(name: string) {
    this.name = name
  }

  public addDog(dog: Dog) {
    this.dogs.push(dog)
  }
}

export class Store extends Exome {
  public persons: Person[] = []

  public addPerson(person: Person) {
    this.persons.push(person)
  }
}

export const dogStorePre = new Store()
export const dogStore = new Store()

const dogAndyPre = new Dog('Andy', 'beagle pup')

dogStorePre.addPerson(
  new Person('John Wick', [
    dogAndyPre
  ])
)

dogStorePre.addPerson(
  new Person('Jane Doe', [
    dogAndyPre
  ])
)

dogStorePre.addPerson(
  new Person('Daniel Craig')
)

const savedStore = saveState(dogStorePre)

registerLoadable({
  Person,
  Dog,
})

loadState(dogStore, savedStore)

export const dogAndy = dogStore.persons[0].dogs[0]
