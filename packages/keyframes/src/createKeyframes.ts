import getValueFromCache from './getValueFromCache.js'
import createStyleNode from './createStyleNode.js'
import getAnimationName from './getAnimationName.js'

import { T_Keyframe } from './types.js'

type Node = ReturnType<typeof createStyleNode>

export default function createKeyframes<T extends string>(
  keyframes: Record<T, T_Keyframe>,
  nonce?: string
): [Record<T, string>, Node] {
  const animationNameMap = {} as Record<T, string>
  let css = ''

  for (const key in keyframes) {
    const animationName = getAnimationName(keyframes[key])
    css += getValueFromCache(animationName, keyframes[key])
    animationNameMap[key] = animationName
  }

  const node = createStyleNode(Object.keys(keyframes).join('-'), css, nonce)

  return [animationNameMap, node]
}
