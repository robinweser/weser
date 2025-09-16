import assignImmutable from './utils/assignImmutable.js'
import { T_Color } from './types.js'

export default function opaquer(color: T_Color, value: number) {
  return assignImmutable(color, { a: Math.min(1, color.a + color.a * value) })
}
