import { Exome } from '../exome'
import { exomeId } from './exome-id'

export function getExomeId(store: Exome): string {
  return store[exomeId]
}
