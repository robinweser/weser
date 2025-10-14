import { createHooks as baseCreateHooks } from '@css-hooks/react'
import { WithHooks as BaseWithHooks } from '@css-hooks/core'
import { assignStyle } from 'css-in-js-utils'

import fallbackValuePlugin from './fallbackValuePlugin.js'
import getFallbackCSS from './getFallbackCSS.js'

import { T_Fallback, T_RawStyle } from '../types.js'

type WithHooks<Hooks, T> = BaseWithHooks<Hooks, T>

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

// Depth-limited recursive array type to preserve nested array support
// while bounding TypeScript's type instantiation cost
type Depth = 0 | 1 | 2 | 3 | 4 | 5
type Decrement = { 0: 0; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4 }

type StyleLeaf<T, Hooks> = WithHooks<Hooks, T> | undefined
type PropertiesDepth<T, Hooks, D extends Depth = 5> =
  | StyleLeaf<T, Hooks>
  | ReadonlyArray<PropertiesDepth<T, Hooks, Decrement[D]>>

export type Properties<T, Hooks> = PropertiesDepth<T, Hooks, 5>
export type CSSFunction<T, Hooks> = (
  ...style: Array<Properties<T, Hooks>>
) => T_RawStyle
export default function createRenderer<
  Hooks extends Record<string, string>,
  T extends Record<string, any> = T_RawStyle,
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
