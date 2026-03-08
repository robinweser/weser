export { default as createRenderer } from './core/createRenderer'
export { default as precompileConditions } from './core/precompileConditions'

// plugins
export {
  default as customPropertyPlugin,
  type T_CustomStyle,
} from './plugins/customProperty'
export { default as debugPlugin, type T_DebugStyle } from './plugins/debug'
export {
  default as embeddedPlugin,
  type T_EmbeddedStyle,
} from './plugins/embedded'
export { default as enforceLonghandPlugin } from './plugins/enforceLonghand'
export {
  default as fallbackValuePlugin,
  type T_Fallback,
} from './plugins/fallbackValue'
export { default as loggerPlugin } from './plugins/logger'
export {
  default as prefixerPlugin,
  fallbacks as prefixerFallbacks,
} from './plugins/prefixer'
export { default as pseudoElementPlugin } from './plugins/pseudoElement'
export {
  default as responsiveValuePlugin,
  responsiveValue,
  type T_ResponsiveValue,
  type T_ResponsiveStyle,
} from './plugins/responsiveValue'
export { default as rtlPlugin } from './plugins/rtl'
export {
  default as sortConditionPlugin,
  sortMobileFirst,
} from './plugins/sortCondition'
export { default as sortPropertyPlugin } from './plugins/sortProperty'
export { default as unitPlugin } from './plugins/unit'

// helpers
export { default as extend } from './helpers/extend'
export { default as useCSSVariable } from './helpers/useCSSVariable'

// types
export type { T_Style } from './types'
