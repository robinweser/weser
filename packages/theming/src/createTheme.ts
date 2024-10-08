import isObject from 'isobject'

import createVariable from './createVariable.js'
import { Tokens } from './types.js'

export type SingleConfig = {
  selector?: string
  shouldTransformValue?: (path: string) => boolean
}

export const defaultShouldTransformValue = () => true

export default function createTheme<T extends Tokens>(
  tokens: T,
  config: SingleConfig = {}
): [T, string] {
  const {
    selector = ':root',
    shouldTransformValue = defaultShouldTransformValue,
  } = config

  const [theme, declarations] = extractVariables(
    structuredClone(tokens),
    shouldTransformValue
  )
  const css = `${selector}{${declarations.join(';')}}`

  return [theme, css]
}

function extractVariables<T extends Tokens>(
  tokens: T,
  convert: (path: string) => boolean,
  path = '',
  variables: Array<string> = []
): [T, Array<string>] {
  for (const property in tokens) {
    const value = tokens[property]

    const name = path + (path ? '.' : '') + property

    if (isObject(value)) {
      extractVariables(value, convert, name, variables)
    } else {
      if (convert(path)) {
        const [reference, declaration] = createVariable(
          name.replace(/[.]/g, '-'),
          value
        )

        variables.push(declaration)
        // @ts-ignore
        tokens[property] = reference
      }
    }
  }

  return [tokens, variables]
}
