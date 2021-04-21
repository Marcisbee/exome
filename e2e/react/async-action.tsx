import * as React from 'react'
import * as ReactDom from 'react-dom'
import { Exome } from 'exome'
import { useStore } from 'exome/react'

const api = {
  getMessage() {
    return new Promise<string>((resolve) => {
      setTimeout(resolve, 100, 'Hello world')
    })
  }
}

class Store extends Exome {
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

const store = new Store()

function App() {
  const { message, loading, getMessage, getMessageWithLoading } = useStore(store)
  const renders = React.useRef(0)

  renders.current += 1

  return (
    <>
      {loading && (<i id="loading" />)}
      <h1>{message}</h1>
      <button id="getMessage" onClick={getMessage}>Get message</button>
      <button id="getMessageWithLoading" onClick={getMessageWithLoading}>Get message with loading</button>
      <span>{renders.current}</span>
    </>
  )
}

ReactDom.render(<App />, document.body)
