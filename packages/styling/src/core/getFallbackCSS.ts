import { hyphenateProperty } from 'css-in-js-utils'

import getFallbackVariable from './getFallbackVariable.js'

import { T_Fallback } from '../types.js'

export default function getFallbackCSS(fallbacks: Array<T_Fallback>) {
  const rootCSS = fallbacks.reduce((css, { property, values = [], match }) => {
    // use the last value as a default matcher if no match is provided
    const actualMatch = match || values[values.length - 1]

    return (
      css +
      []
        // @ts-ignore
        .concat(property)
        .map((prop) => `${getFallbackVariable(prop, actualMatch)}:;`)
        .join('')
    )
  }, '')

  const supportsCSS = fallbacks.map(({ property, values = [], match }) => {
    // use the last value as a default matcher if no match is provided
    const actualMatch = match || values[values.length - 1]

    return values
      .map((value) =>
        []
          // @ts-ignore
          .concat(property)
          .map(
            (prop) =>
              `@supports (${hyphenateProperty(prop)}:${value}){:root{${getFallbackVariable(prop, actualMatch)}:${value}}}`
          )
          .join('')
      )
      .join('')
  })

  return (rootCSS ? `:root {${rootCSS}}` : '') + supportsCSS.join('')
}
