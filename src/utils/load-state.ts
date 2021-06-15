import { Exome } from '../exome'
import { exomeId } from './exome-id'
import { updateView } from './update-view'

const loadableExomes: Record<string, typeof Exome> = {}

export function registerLoadable(config: Record<string, any>) {
  Object.assign(loadableExomes, config)
}

export function loadState(
  store: Exome,
  state: string
) {
  if (!state || typeof state !== 'string') {
    throw new Error(`State was not loaded. Passed state must be string, instead received "${typeof state}".`)
  }

  const instances = new Map<string, Exome>()

  const output = JSON.parse(state, (key, value) => {
    if (key !== '' && value && typeof value === 'object' && value.$$exome_id) {
      const { $$exome_id: localId, ...state }: { $$exome_id: string, [key: string]: any } = value

      const cachedInstance = instances.get(localId)

      if (cachedInstance) {
        return cachedInstance
      }

      const [name] = localId.split('-')
      const StoreExome = loadableExomes[name]

      if (!StoreExome) {
        throw new Error(`State cannot be loaded! "${name}" was not registered via \`registerLoadable\`.`)
      }

      try {
        const instance = new StoreExome()

        instance[exomeId] = localId

        Object.assign(instance, state)

        instances.set(localId, instance)

        return instance
      } catch (e) {
        throw new Error(
          `State cannot be loaded! "${name}.constructor" has logic that prevents state from being loaded.`
        )
      }
    }

    return value
  })

  if (!output || !output.$$exome_id) {
    throw new Error('State was not loaded. Passed state string is not saved Exome instance.')
  }

  const { $$exome_id: rootId, ...data } = output

  Object.assign(store, data)

  // Run view update after state has been loaded
  updateView()

  return data
}
