import assignImmutable from './utils/assignImmutable.js'
import { T_Color } from './types.js'

export default function saturate(color: T_Color, value: number) {
  return assignImmutable(color, { s: Math.min(1, color.s + color.s * value) })
}
