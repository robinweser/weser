import { DistributiveOmit } from '@/types/utils'
import { ComponentProps, ElementType } from 'react'
import { css } from '../../utils/system'
import { T_StyleProp } from './core'

export type ElProps<T extends ElementType> = {
  as?: T
  style?: T_StyleProp
} & DistributiveOmit<
  ComponentProps<ElementType extends T ? 'div' : T>,
  'as' | 'style'
>

export default function El<T extends ElementType>(props: ElProps<T>) {
  const { as: Component = 'div', style, ...rest } = props

  // @ts-ignore
  return <Component {...rest} style={css(style)} />
}
