import { Exome } from 'exome'

const api = {
  getMessage() {
    return new Promise<string>((resolve) => {
      setTimeout(resolve, 100, 'Hello world')
    })
  }
}

class AsyncStore extends Exome {
  public loading = false
  public message: string | null = null

  public async getMessage() {
    this.message = await api.getMessage()
  }

  public async getMessageWithLoading() {
    this.setLoading(true)

    this.message = await api.getMessage()

    this.setLoading(false)
  }

  public setLoading(value: boolean) {
    this.loading = value
  }
}

export const asyncStore = new AsyncStore()
