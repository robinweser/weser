import getValueFromCache from './getValueFromCache.js'
import createStyleNode from './createStyleNode.js'
import getAnimationName from './getAnimationName.js'

import { T_Keyframe } from './types.js'

type Node = ReturnType<typeof createStyleNode>

export default function createKeyframe(
  style: T_Keyframe,
  nonce?: string
): [string, Node] {
  const animationName = getAnimationName(style)
  const css = getValueFromCache(animationName, style)
  const node = createStyleNode(animationName, css, nonce)

  return [animationName, node]
}
