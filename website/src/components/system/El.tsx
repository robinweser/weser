import { ComponentProps, ElementType } from 'react'

import { css, T_StyleProp } from '@/utils/system'

import { DistributiveOmit } from '@/types/utils'

export type ElProps<T extends ElementType> = {
  as?: T
  style?: T_StyleProp
} & DistributiveOmit<
  ComponentProps<ElementType extends T ? 'div' : T>,
  'as' | 'style'
>

export default function El<T extends ElementType>(props: ElProps<T>) {
  const { as: Component = 'div', style, ...rest } = props

  return <Component {...rest} style={css(style)} />
}
