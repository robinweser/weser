import { CSSProperties, createElement } from 'react'
import { cssifyObject } from 'css-in-js-utils'

import hash from './hash.js'

const cache = new Map()

function getValueFromCache(animationName: string, style: Keyframe) {
  if (!cache.has(animationName)) {
    const keyframe = Object.entries(style).reduce(
      (keyframe, [key, declaration = {}]) =>
        keyframe + key + '{' + cssifyObject(declaration as any) + '}',
      ''
    )

    const css = `@keyframes ${animationName}{${keyframe}}`

    cache.set(animationName, css)
  }

  return cache.get(animationName)
}

type Key = `${number}%` | 'from' | 'to'
export type Keyframe = Partial<Record<Key, CSSProperties>>

export default function createKeyframe(
  style: Keyframe,
  nonce?: string
): [string, ReturnType<typeof createElement>] {
  const animationName = '_' + hash(JSON.stringify(style))

  const css = getValueFromCache(animationName, style)

  const node = createElement('style', {
    dangerouslySetInnerHTML: { __html: css },
    precedence: 'low',
    href: animationName,
    nonce,
  })

  return [animationName, node]
}
