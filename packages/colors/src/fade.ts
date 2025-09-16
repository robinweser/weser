import assignImmutable from './utils/assignImmutable.js'
import { T_Color } from './types.js'

export default function fade(color: T_Color, value: number) {
  return assignImmutable(color, { a: Math.max(0, color.a - color.a * value) })
}
