import { reduce } from '@weser/array'
import hash from '../helpers/hash'
import { createFlagNode } from '../helpers/flags'

export default function precompileConditions(
  conditions: Array<string>,
  devMode: boolean = false
) {
  const flags = reduce(
    conditions,
    (flags, property) => {
      flags[property] = devMode
        ? property.replace(/ /g, '-').replace(/[^a-z0-9-]/gi, '')
        : hash(property as string)
      return flags
    },
    {} as Record<string, string>
  )

  const node = createFlagNode(flags, devMode)

  return [node, flags] as const
}
