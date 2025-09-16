import hslToRgb from './utils/hslToRgb.js'
import { T_Color } from './types.js'

export default function toRgb(color: T_Color) {
  const rgb = hslToRgb(color.h, color.s, color.l)

  return 'rgba(' + [rgb[0], rgb[1], rgb[2], color.a].join(',') + ')'
}
