import assignImmutable from './utils/assignImmutable.js'
import { T_Color } from './types.js'

export default function lighten(color: T_Color, value: number) {
  return assignImmutable(color, { l: Math.min(1, color.l + color.l * value) })
}
