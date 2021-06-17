import { Exome } from '../exome'
import { getExomeId } from './get-id'

function replacer(): any {
  const savedInstances: Record<string, true> = {}

  return (_: string, value: any): any => {
    // Found an Exome instance, replace it with simple object
    // that contains `$$exome_id` property.
    if (value instanceof Exome) {
      const id = getExomeId(value)

      if (!id) {
        return value
      }

      if (savedInstances[id]) {
        return {
          $$exome_id: id
        }
      }

      savedInstances[id] = true

      return {
        $$exome_id: id,
        ...value
      }
    }

    return value
  }
}

export function saveState(store: Exome, readable: boolean = false): string {
  const output = JSON.stringify(store, replacer(), readable ? 2 : undefined)

  if (output === undefined) {
    return 'null'
  }

  return output
}
