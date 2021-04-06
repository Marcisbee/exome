import { Exome } from '../exome'
import { getExomeId } from './get-id'

export function saveState(store: Exome): string {
  function stringify(_: string, value: any): any {
    // Found an Exome instance, replace it with simple object
    // that contains `$$exome_id` property.
    if (value instanceof Exome) {
      const id = getExomeId(value)

      if (!id) {
        return value
      }

      return {
        $$exome_id: id,
        ...value
      }
    }

    return value
  }

  const root = JSON.stringify(store, stringify)

  return root
}
