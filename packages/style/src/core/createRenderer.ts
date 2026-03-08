import { each } from '@weser/object'
import { reduce } from '@weser/array'
import { assignStyle } from 'css-in-js-utils'
import { CSSProperties, ReactNode } from 'react'

import createStyleNode from './createStyleNode'
import hash from '../helpers/hash'
import { T_Style, T_Props, T_Context } from '../types'
import { createFlagNode } from '../helpers/flags'

type StyleInput<T = T_Style> = undefined | T | Array<StyleInput<T>>

type Plugin = (style: T_Style, context: T_Context) => T_Style
type Config = {
  plugins?: Array<Plugin>
  mergeStyle?: typeof assignStyle
  precompiledConditions?: Record<string, string>
  devMode?: boolean
}

export default function createRenderer<T extends Record<string, any> = T_Style>(
  config: Config = {}
) {
  const {
    plugins = [],
    mergeStyle = assignStyle,
    precompiledConditions = {},
    devMode = false,
  } = config

  return function css(...style: Array<StyleInput<T>>) {
    const flags: Record<string, string> = {}
    // we use a map to cache nodes to avoid duplicate
    const nodes: Map<string, ReactNode> = new Map()
    const props: T_Props = {
      style: {},
    }

    function createNode(css: string) {
      const id = hash(css)
      const node = createStyleNode(id, css)
      nodes.set(id, node)
    }

    const context: T_Context = {
      devMode,
      createNode,
      props,
      mergeStyle,
    }

    // we ignore the "Type instantiation is excessively deep and possibly infinite."
    // @ts-ignore
    const flattened = style.flat(Infinity)
    const filtered = flattened.filter(Boolean)
    // @ts-ignore
    const merged = mergeStyle({} as T, ...filtered)
    const resolved = resolveStyle(
      merged as T,
      plugins,
      flags,
      context,
      precompiledConditions
    )

    props.style = resolved

    if (Object.keys(flags).length === 0) {
      return [props, nodes.size > 0 ? nodes.values() : null] as const
    }

    const node = createFlagNode(flags, devMode)

    return [props, [...nodes.values(), node]] as const
  }
}

function resolveStyle(
  style: T_Style,
  plugins: Array<Plugin>,
  flags: Record<string, string> = {},
  context: T_Context,
  precompiledConditions: Record<string, string> = {}
): CSSProperties {
  const processed = reduce(
    plugins,
    (style, plugin) => plugin(style, context),
    style
  )

  each(processed, (value, property) => {
    if (typeof value === 'object' && value !== null) {
      const resolved = resolveStyle(
        value,
        plugins,
        flags,
        context,
        precompiledConditions
      )

      const flag = getFlag(property, context, precompiledConditions)

      if (!precompiledConditions[property]) {
        flags[property] = flag
      }

      each(resolved, (value, key) => {
        const fallback = processed[key] ?? 'unset'
        processed[key as keyof T_Style] =
          `var(--${flag}-1, ${value}) var(--${flag}-0, ${fallback})`
      })

      delete processed[property]
    }
  })

  return processed
}

function getFlag(
  property: string,
  { devMode }: T_Context,
  precompiledConditions: Record<string, string>
) {
  if (precompiledConditions[property]) {
    return precompiledConditions[property]
  }

  return devMode
    ? property.replace(/ /g, '-').replace(/[^a-z0-9-]/gi, '')
    : hash(property as string)
}
