import { Exome } from '../exome'
import { exomeId } from './exome-id'
import { updateView } from './update-view'

export function loadState(
  store: Exome,
  state: string,
  config: Record<string, any> = {}
) {
  const instances = new Map()

  const { $$exome_id: rootId, ...data } = JSON.parse(state, (key, value) => {
    if (key !== '' && value && typeof value === 'object' && value.$$exome_id) {
      const { $$exome_id: localId, ...state } = value

      const cachedInstance = instances.get(localId)

      if (cachedInstance) {
        return cachedInstance
      }

      const [name]: [string] = localId.split('-')
      const StoreExome = config[name]

      if (!StoreExome) {
        throw new Error(`State cannot be loaded! "${name}" is missing.`)
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

  Object.assign(store, data)

  // Run view update after state has been loaded
  updateView()

  return data
}
