import hash from './hash.js'

import { T_Keyframe } from './types.js'

export default function getAnimationName(style: T_Keyframe) {
  return '_' + hash(JSON.stringify(style))
}
