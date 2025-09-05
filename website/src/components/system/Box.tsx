import { ElementType } from 'react'
import El, { ElProps } from './El'

import applyMultiplier from '@/utils/applyMultiplier'
import theme from '@/utils/theme'
import { T_Style } from '@/utils/system'

type BoxProps = {
  bg: T_Style['backgroundColor']
  paddingX: T_Style['paddingInline']
  paddingY: T_Style['paddingBlock']
  marginX: T_Style['marginInline']
  marginY: T_Style['marginBlock']
  grow: T_Style['flexGrow']
  shrink: T_Style['flexShrink']
  basis: T_Style['flexBasis']
  direction: T_Style['flexDirection']
  wrap: T_Style['flexWrap']
} & Pick<
  T_Style,
  | 'backgroundColor'
  | 'gap'
  | 'position'
  | 'overflow'
  | 'overflowX'
  | 'overflowY'
  | 'padding'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingTop'
  | 'paddingInline'
  | 'paddingInlineStart'
  | 'paddingInlineEnd'
  | 'paddingBlock'
  | 'paddingBlockStart'
  | 'paddingBlockEnd'
  | 'margin'
  | 'marginLeft'
  | 'marginRight'
  | 'marginBottom'
  | 'marginTop'
  | 'marginInline'
  | 'marginInlineStart'
  | 'marginInlineEnd'
  | 'marginBlock'
  | 'marginBlockStart'
  | 'marginBlockEnd'
  | 'height'
  | 'width'
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight'
  | 'order'
  | 'alignContent'
  | 'justifyContent'
  | 'alignItems'
  | 'alignSelf'
  | 'flex'
  | 'display'
>

type Props<T extends ElementType = 'div'> = Partial<BoxProps> & ElProps<T>

export default function Box<T extends ElementType = 'div'>({
  style,
  bg,
  backgroundColor = bg,
  gap,
  position,
  overflow,
  overflowX,
  overflowY,
  padding,
  paddingLeft,
  paddingRight,
  paddingBottom,
  paddingTop,
  paddingX,
  paddingInline = paddingX,
  paddingInlineStart,
  paddingInlineEnd,
  paddingY,
  paddingBlock = paddingY,
  paddingBlockStart,
  paddingBlockEnd,
  margin,
  marginLeft,
  marginRight,
  marginBottom,
  marginTop,
  marginX,
  marginInline = marginX,
  marginInlineStart,
  marginInlineEnd,
  marginY,
  marginBlock = marginY,
  marginBlockStart,
  marginBlockEnd,
  height,
  width,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  order,
  alignContent,
  justifyContent,
  alignItems = 'stretch',
  alignSelf,
  flex,
  grow,
  shrink,
  basis = 'auto',
  direction = 'column',
  display = 'flex',
  wrap,
  ref,
  ...props
}: Props<T>) {
  const multiplier = applyMultiplier(theme.baselineGrid)

  return (
    <El
      {...props}
      ref={ref}
      style={[
        {
          boxSizing: 'border-box',
          backgroundColor,
          flexDirection: direction,
          flexWrap: wrap,
          flexGrow: grow,
          flexShrink: shrink,
          flexBasis: basis,
          flex,
          justifyContent,
          alignContent,
          alignItems,
          alignSelf,
          order,
          display,
          maxWidth,
          minWidth,
          width,
          maxHeight,
          minHeight,
          height,
          position,
          overflow,
          overflowX,
          overflowY,
          gap: multiplier(gap),
          padding: multiplier(padding),
          paddingLeft: multiplier(paddingLeft),
          paddingRight: multiplier(paddingRight),
          paddingBottom: multiplier(paddingBottom),
          paddingTop: multiplier(paddingTop),
          paddingInline: multiplier(paddingInline),
          paddingInlineStart: multiplier(paddingInlineStart),
          paddingInlineEnd: multiplier(paddingInlineEnd),
          paddingBlock: multiplier(paddingBlock),
          paddingBlockStart: multiplier(paddingBlockStart),
          paddingBlockEnd: multiplier(paddingBlockEnd),
          margin: multiplier(margin),
          marginLeft: multiplier(marginLeft),
          marginRight: multiplier(marginRight),
          marginBottom: multiplier(marginBottom),
          marginTop: multiplier(marginTop),
          marginInline: multiplier(marginInline),
          marginInlineStart: multiplier(marginInlineStart),
          marginInlineEnd: multiplier(marginInlineEnd),
          marginBlock: multiplier(marginBlock),
          marginBlockStart: multiplier(marginBlockStart),
          marginBlockEnd: multiplier(marginBlockEnd),
        },
        style,
      ]}
    />
  )
}
