import { Exome } from 'exome'

export default {
  test: (val: any) => {
    return val instanceof Exome
  },

  print: (val: typeof Exome) => {
    const proto: Exome = Object.getPrototypeOf(val)
    const name: string = proto.constructor.name || ''

    return `${name} ${JSON.stringify(val, null, '  ')}`
  }
}
