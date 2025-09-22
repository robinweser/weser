import isPlainObject from 'isobject'
import { assignStyle } from 'css-in-js-utils'
import { WithHooks } from '@css-hooks/core'

type Extension<T, Hooks> = {
  condition: boolean | undefined
  style: T_ExtendStyle<T, Hooks>
}

export type T_ExtendStyle<T, Hooks> = WithHooks<keyof Hooks & string, T> & {
  extend?:
    | Extension<T, Hooks>
    | T_ExtendStyle<T, Hooks>
    | Array<Extension<T, Hooks>>
}

type T_Extend = Record<string, any> & { condition?: never; style?: never }

export default function extendPlugin() {
  return extend
}

function extend<T extends T_Extend>(style: T) {
  for (const property in style) {
    const value = style[property as keyof typeof style]

    if (property === 'extend') {
      // @ts-ignore
      const extensions = [].concat(value) as T[]
      extensions.forEach((extension) => extendStyle(style, extension))
      delete style[property]
      // support nested extend as well
    } else if (isPlainObject(value)) {
      // @ts-ignore
      style[property] = extend(value as T)
    }
  }

  return style
}

function extendStyle<T extends T_Extend>(
  style: T,
  extension: T | { condition: boolean; style: T }
) {
  // extend conditional style objects
  if ('condition' in extension) {
    if (extension.condition) {
      assignStyle(style, extend(extension.style))
    }
  } else {
    // extend basic style objects
    assignStyle(style, removeUndefined(extend(extension)))
  }
}

function removeUndefined<T extends T_Extend>(style: T) {
  for (const property in style) {
    const value = style[property as keyof typeof style]

    if (isPlainObject(value)) {
      // @ts-ignore
      style[property] = removeUndefined(value)
    } else if (Array.isArray(value)) {
      style[property] = value.filter((item: any) => !isUndefinedValue(item))
    } else if (isUndefinedValue(value)) {
      delete style[property]
    }
  }

  return style
}

const FALSY_REGEX = /undefined|null/
const URL_REGEX = /url/

function isUndefinedValue(value: any) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' &&
      FALSY_REGEX.test(value) &&
      !URL_REGEX.test(value))
  )
}
