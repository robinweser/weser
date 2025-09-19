import type { T_Fallback } from '../types.js'

export default function fallbackValue(
  property: T_Fallback['property'],
  values: T_Fallback['values'],
  match?: T_Fallback['match']
) {
  return {
    property,
    values,
    match,
  }
}
