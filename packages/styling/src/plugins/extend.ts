import isPlainObject from 'isobject'
import { assignStyle } from 'css-in-js-utils'
import { WithHooks } from '@css-hooks/core'

// Depth-limited recursive type to bound TypeScript instantiation cost
type Depth = 0 | 1 | 2 | 3 | 4 | 5
type Decrement = { 0: 0; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4 }

type ExtensionDepth<T, Hooks, D extends Depth> = {
  condition: boolean | undefined
  style: T_ExtendStyleDepth<T, Hooks, Decrement[D]>
}

export type T_ExtendStyleDepth<T, Hooks, D extends Depth = 3> = WithHooks<
  keyof Hooks & string,
  T
> & {
  extend?:
    | ExtensionDepth<T, Hooks, D>
    | T_ExtendStyleDepth<T, Hooks, Decrement[D]>
    | Array<ExtensionDepth<T, Hooks, D>>
}

// Default export type with moderate recursion cap
export type T_ExtendStyle<T, Hooks> = T_ExtendStyleDepth<T, Hooks, 3>

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
