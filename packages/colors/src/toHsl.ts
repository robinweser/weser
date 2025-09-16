import { T_Color } from './types.js'

export default function toHsl(color: T_Color) {
  return (
    'hsla(' +
    [color.h, color.s * 100 + '%', color.l * 100 + '%', color.a].join(',') +
    ')'
  )
}
