import { Estore } from '..'

interface Joke {
  id: number
  type: string
  setup: string
  punchline: string
}

export class JokeStore extends Estore {
  public joke?: Joke
  public isLoading = false

  public async getJoke() {
    this.setLoading(true)

    this.joke = await fetch('https://official-joke-api.appspot.com/random_joke')
      .then<Joke>((response) => response.json())

    this.setLoading(false)
  }

  private setLoading(isLoading: boolean) {
    this.isLoading = isLoading
  }
}

export const jokeStore = new JokeStore()

export class CounterStore extends Estore {
  public count = 0

  public increment() {
    this.count++
  }

  public decrement() {
    this.count--
  }

  public reset() {
    this.count = 0
  }
}

export const counterStore = new CounterStore()
