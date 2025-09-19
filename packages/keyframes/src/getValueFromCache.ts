import { cssifyObject } from 'css-in-js-utils'

import { T_Keyframe } from './types.js'

const cache = new Map()

export default function getValueFromCache(
  animationName: string,
  style: T_Keyframe
) {
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
