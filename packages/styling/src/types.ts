import { CSSProperties } from 'react'

export type T_Fallback = {
  property: string | Array<string>
  values: Array<string>
  match?: string
}

type T_VariableStyle = {
  [key: `--${string}`]: any
}

export type T_RawStyle = CSSProperties

export type T_Style = T_RawStyle & T_VariableStyle
