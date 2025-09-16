import assignImmutable from './utils/assignImmutable.js'
import { T_Color } from './types.js'

export default function desaturate(color: T_Color, value: number) {
  return assignImmutable(color, { s: Math.max(0, color.s - color.s * value) })
}
