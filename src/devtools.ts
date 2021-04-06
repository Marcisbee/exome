/* eslint-disable @typescript-eslint/naming-convention */
import { Exome } from './exome'
import { Middleware } from './middleware'
import { exomeId } from './utils/exome-id'
import { updateQueue } from './utils/update-maps'
import { updateView } from './utils/update-view'

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

interface ReduxConfig {
  name?: string
  maxAge?: number
  actionsBlacklist?: string | string[]
  serialize?: {
    replacer?: (key: string, value: any) => any
    reviver?: (key: string, value: any) => any
  }
}

const fullStore = new Map<string, Map<string, Exome>>()

function getFullStore() {
  const output: Record<string, Exome[]> = {}

  for (const [key, map] of fullStore.entries()) {
    output[key] = Array.from(map.values())
  }

  // Improve serializer with `__serializedType__` once https://github.com/zalmoxisus/redux-devtools-extension/issues/737 is resolved
  return JSON.parse(JSON.stringify(output, (_, value) => {
    if (value instanceof Exome && value[exomeId]) {
      return {
        $$exome_id: value[exomeId],
        ...value
      }
    }

    return value
  }))
}

export function exomeDevtools({
  name,
  maxAge,
  actionsBlacklist
}: {
  name?: string
  maxAge?: number
  actionsBlacklist?: string
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

  const config: ReduxConfig = {
    name,
    maxAge,
    actionsBlacklist
  }

  const ReduxTool: Redux = extension.connect(config)

  ReduxTool.subscribe((message) => {
    if (message.type === 'DISPATCH' && message.state) {
      // We'll just use json parse reviver function to update instances
      JSON.parse(message.state, (_, value) => {
        if (typeof value === 'object' && value !== null && '$$exome_id' in value) {
          const { $$exome_id, ...restValue } = value
          const [name] = $$exome_id.split('-')
          const instance = fullStore.get(name)?.get($$exome_id)

          updateQueue.set($$exome_id, true)

          Object.assign(instance, restValue)

          return instance
        }

        return value
      })

      updateView()
    }
  })

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
