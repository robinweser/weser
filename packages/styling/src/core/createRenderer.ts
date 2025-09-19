import { CSSProperties } from 'react'
import { createHooks as baseCreateHooks } from '@css-hooks/react'
import { WithHooks } from '@css-hooks/core'
import { assignStyle } from 'css-in-js-utils'

import fallbackValuePlugin from './fallbackValuePlugin.js'
import getFallbackCSS from './getFallbackCSS.js'

import { T_Fallback } from '../types.js'

type Plugin<T> = (style: T) => T

type HookOptions<Hooks extends string> = Parameters<
  typeof baseCreateHooks<Hooks>
>[0]

type Config<T, Hooks extends string> = {
  hooks: HookOptions<Hooks>
  fallbacks?: Array<T_Fallback>
  plugins?: Array<Plugin<T>>
  mergeStyle?: typeof assignStyle
}

type Properties<T, Hooks> =
  | Array<Properties<T, Hooks>>
  | WithHooks<Hooks, T>
  | undefined
type CSSFunction<T, Hooks> = (
  ...style: Array<Properties<T, Hooks>>
) => CSSProperties
export default function createRenderer<
  Hooks extends Record<string, string>,
  T extends Record<string, any> = CSSProperties,
>({
  hooks,
  fallbacks = [],
  plugins = [],
  mergeStyle = assignStyle,
}: Config<T, keyof Hooks & string>): [
  string,
  CSSFunction<T, keyof Hooks & string>,
] {
  if (fallbacks.length > 0) {
    plugins.unshift(fallbackValuePlugin(fallbacks))
  }

  const fallbackCSS = getFallbackCSS(fallbacks)

  const [baseCSS, fn] = baseCreateHooks(hooks)

  const staticCSS = [baseCSS, fallbackCSS].join('')

  function css(...style: Array<Properties<T, keyof Hooks & string>>) {
    // we ignore the "Type instantiation is excessively deep and possibly infinite."
    // @ts-ignore
    const flattened = style.flat(Infinity) as unknown as Array<T>
    const filtered = flattened.filter(Boolean)

    const merged = mergeStyle({} as T, ...filtered)
    const processed = plugins.reduce(
      (processed, plugin) => plugin(processed),
      merged
    )

    return fn(processed as unknown as Parameters<typeof fn>[0])
  }

  return [staticCSS, css]
}
