import isPlainObject from 'isobject'

import { T_Style } from '../types.js'

export type PropertyPriority<T = T_Style> = {
  [Property in keyof T]: number
}
export default function sortPropertyPlugin<
  T extends Record<string, any> = T_Style,
>(propertyPriority: PropertyPriority<T>) {
  function getPriority(property: keyof PropertyPriority<T>) {
    return propertyPriority[property] || 0
  }

  return function sortProperty(style: T): T {
    return Object.keys(style)
      .sort((a, b) => getPriority(a) - getPriority(b))
      .reduce((out, property) => {
        const value = style[property]

        if (isPlainObject(value)) {
          return {
            ...out,
            [property]: sortProperty(value),
          }
        }

        return {
          ...out,
          [property]: value,
        }
      }, {} as T)
  }
}
