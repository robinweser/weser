import { CSSProperties } from 'react'

export type T_Fallback = {
  property: string | Array<string>
  values: Array<string>
  match?: string
}

type T_VariableStyle = {
  [key: `--${string}`]: string | number
}
type T_RawStyle = CSSProperties

export type T_Style = T_RawStyle & T_VariableStyle
