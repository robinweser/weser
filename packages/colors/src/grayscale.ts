import desaturate from './desaturate.js'
import { T_Color } from './types.js'

export default function greyscale(color: T_Color) {
  return desaturate(color, 1)
}
