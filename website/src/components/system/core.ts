import { css } from '@/utils/system'

export { default as El } from './El'
export { default as Box } from './Box'
export { default as Click } from './Click'
export { default as Grid } from './Grid'
export { default as VisuallyHidden } from './VisuallyHidden'
export { default as Overlay } from './Overlay'
export { default as Text } from './Text'

export type T_StyleProp = Parameters<typeof css>[0]
