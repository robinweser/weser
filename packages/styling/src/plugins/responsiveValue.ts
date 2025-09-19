import isPlainObject from 'isobject'
import { assignStyle } from 'css-in-js-utils'

import { T_Style } from '../types.js'

type T_Responsive<T> = T | (T | undefined)[]

export type T_ResponsiveStyle<T = T_Style> = {
  [P in keyof T]: T_Responsive<T[P]>
}

function resolveResponsiveValues<T = T_Style>(
  style: T,
  mediaQueries: Array<string>
) {
  for (const key in style) {
    const property = key as keyof typeof style
    const value = style[property]

    if (isPlainObject(value)) {
      // @ts-ignore
      style[property] = resolveResponsiveValues(value, mediaQueries)
    }

    if (Array.isArray(value)) {
      const [defaultValue, ...mediaValues] = value
      // @ts-ignore
      style[property] = defaultValue

      mediaQueries.slice(0, mediaValues.length).forEach((query, index) => {
        if (mediaValues[index] !== null && mediaValues[index] !== undefined) {
          // @ts-ignore
          assignStyle(style, {
            [query]: {
              [property]: mediaValues[index],
            },
          })
        }
      })
    }
  }

  return style
}

export default function responsiveValuePlugin<T = T_Style>(
  mediaQueries: Array<string>
) {
  return function responsiveValue(style: T) {
    return resolveResponsiveValues<T>(style, mediaQueries)
  }
}
