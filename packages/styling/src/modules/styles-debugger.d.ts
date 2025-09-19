declare module 'styles-debugger' {
  import { T_Style } from '../types.js'

  export type Config = {
    enabled?: boolean
    position?: 1 | 2 | 3 | 4
    color?: string
    debugWith?: 'border' | 'background'
    borderSize?: number
    showText?: boolean
    styles?: T_Style
  }
  export function CreateStylesDebugger(config: Config): T_Style
}
