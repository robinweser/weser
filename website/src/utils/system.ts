import { createHooks } from 'brandeur'
import prefixer, { fallbacks } from 'brandeur-plugin-prefixer'
import enforceLonghand from 'brandeur-plugin-enforce-longhand'
import debug from 'brandeur-plugin-debug'
import responsiveValue, {
  ResponsiveStyle,
} from 'brandeur-plugin-responsive-value'

import extend, { ExtendStyle } from 'fela-plugin-extend'
import unit from 'fela-plugin-unit'

import theme from '@/utils/theme'

export const breakpoints = {
  s: '@media (min-width: 480px)',
  m: '@media (min-width: 800px)',
  l: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1400px)',
  xxl: '@media (min-width: 1800px)',
} as const

const medias = {
  '@media (hover: hover)': '@media (hover: hover)',
  '@media (hover: none)': '@media (hover: none)',
} as const

const pseudoClasses = {
  ':hover': ':hover',
  ':focus': ':focus',
  ':active': ':active',
  ':focus-visible': ':focus-visible',
  ':focus-visible &': ':focus-visible &',
  ':focus-within > &': ':focus-within > &',
  ':focus-within': ':focus-within',
  ':has(:focus-visible)': ':has(:focus-visible)',
  ':last-child': ':last-child',
  ':first-child': ':first-child',
  'p + &': 'p + &',
  '.note &': '.note &',
  '.note + &': '.note + &',
  '.dark &': '.dark &',
  '.light &': '.light &',
  ':hover > &': ':hover > &',
  '& img': '& img',
  ':disabled': ':disabled',
  '* + &': '* + &',
  '[data-id="code"] + &': '[data-id="code"] + &',
  '[data-id="anchor"] + &': '[data-id="anchor"] + &',
  '[data-id="field"] &': '[data-id="field"] &',
} as const

const hooks = {
  ...breakpoints,
  ...medias,
  ...pseudoClasses,
} as const

export type T_Style =
  | ResponsiveStyle
  | ExtendStyle<ResponsiveStyle, typeof hooks>

const [styleSheet, css] = createHooks<T_Style, typeof hooks, typeof theme>({
  hooks,
  theme,
  fallbacks,
  plugins: [
    extend(),
    responsiveValue(Object.keys(breakpoints)),
    prefixer(),
    unit(),
    enforceLonghand(),
    // debug(),
  ],
})

export { css, styleSheet }
