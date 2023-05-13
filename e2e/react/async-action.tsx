import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import { useStore } from 'exome/react'

import { asyncStore } from '../stores/async-store'

function App() {
  const { message, loading, getMessage, getMessageWithLoading } = useStore(asyncStore)
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

const root = ReactDom.createRoot(document.body);
root.render(<App />);
