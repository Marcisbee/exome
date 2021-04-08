import { Exome } from 'exome'

export function test(val: any): boolean {
  return val instanceof Exome
}

export function print(val: typeof Exome): string {
  const proto: Exome = Object.getPrototypeOf(val)
  const name: string = proto.constructor.name || ''

  return `${name} ${JSON.stringify(val, null, '  ')}`
}
