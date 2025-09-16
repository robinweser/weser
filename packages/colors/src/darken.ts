import assignImmutable from './utils/assignImmutable.js'
import { T_Color } from './types.js'

export default function darken(color: T_Color, value: number) {
  return assignImmutable(color, { l: Math.max(0, color.l - color.l * value) })
}
