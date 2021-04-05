import { Exome } from './exome'
import { Middleware } from './middleware'
import { exomeId } from './utils/exome-id'

interface ReduxMessage {
  type: string
  state: string
}

interface ReduxAction {
  type: string
  payload: any
}

interface Redux {
  subscribe: (cb: (message: ReduxMessage) => void) => void
  send: (action: ReduxAction, state: Record<string, any>) => void
  init: (state: Record<string, any>) => void
}

const fullStore = new Map<string, Map<string, Exome>>()

function getFullStore() {
  const output: Record<string, Exome[]> = {}

  for (const [key, map] of fullStore.entries()) {
    output[key] = Array.from(map.values())
  }

  return output
}

export function exomeDevtools({
  name,
  maxAge
}: {
  name?: string
  maxAge?: number
}): Middleware {
  let extension
  try {
    extension =
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ ||
      (window.top as any).__REDUX_DEVTOOLS_EXTENSION__
  } catch (e) { }

  if (!extension) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Please install Redux devtools extension\n' +
        'http://extension.remotedev.io/'
      )
    }
    return () => {}
  }

  const ReduxTool: Redux = extension.connect({
    name,
    maxAge
  })

  // ReduxTool.subscribe((message) => {
  //   if (message.type === 'DISPATCH' && message.state) {
  //     console.log({
  //       message
  //     })
  //   }
  // })

  ReduxTool.init(getFullStore())

  return (instance, action, payload) => {
    const name = instance.constructor.name

    if (!name) {
      return
    }

    if (!fullStore.has(name)) {
      fullStore.set(name, new Map())
    }

    if (action === 'NEW') {
      fullStore.get(name)?.set(instance[exomeId], instance)
    }

    const type = `[${instance.constructor.name}] ${action}`
    let parsedPayload: any[] = []

    try {
      parsedPayload = JSON.parse(JSON.stringify(payload))
    } catch (e) {}

    ReduxTool.send({ type, payload: parsedPayload }, getFullStore())
  }
}
