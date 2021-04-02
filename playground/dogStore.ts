import { Estore } from '..'

export class Dog extends Estore {
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

export class Person extends Estore {
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

export class Store extends Estore {
  public persons: Person[] = []

  public addPerson(person: Person) {
    this.persons.push(person)
  }

  public prefill({ persons }: { persons: Person[] }) {
    this.persons = persons
  }
}

export const dogStore = new Store()

export const dogAndy = new Dog('Andy', 'beagle pup')

dogStore.prefill({
  persons: [
    new Person('John Wick', [
      dogAndy
    ]),
    new Person('Jane Doe', [
      dogAndy
    ]),
    new Person('Daniel Craig')
  ]
})
