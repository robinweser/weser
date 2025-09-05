import { ElementType } from 'react'

import El, { ElProps } from '@/components/system/El'
import { T_Style } from '@/utils/system'
import { typography } from '@/utils/theme'

type Typography = typeof typography
type Variant = keyof Typography | Array<keyof Typography | undefined>

type TextProps = {
  variant: Variant
  color: T_Style['color']
  weight: T_Style['fontWeight']
  align: T_Style['textAlign']
  decoration: T_Style['textDecoration']
  size: T_Style['fontSize']
  height: T_Style['lineHeight']
}

type Props<T extends ElementType> = Partial<TextProps> &
  Omit<ElProps<T>, 'variant'>

export default function Text<T extends ElementType>({
  variant,
  color,
  weight,
  decoration,
  size,
  height,
  children,
  style,
  ref,
  ...props
}: Props<T>) {
  const getPropertyStyle = getVariantStyle(typography, variant)

  return (
    <El
      ref={ref}
      {...props}
      style={[
        {
          // @ts-ignore
          '--tehlu_text-size': size || getPropertyStyle('fontSize'),
          fontFamily: getPropertyStyle('fontFamily'),
          fontVariant: getPropertyStyle('fontVariant'),
          fontStretch: getPropertyStyle('fontStretch'),
          color: color || getPropertyStyle('color'),
          fontWeight: weight || getPropertyStyle('fontWeight'),
          textDecoration: decoration || getPropertyStyle('textDecoration'),
          lineHeight: height || getPropertyStyle('lineHeight'),
          display: 'var(--tehlu_text-inner-display, block)',
          fontSize: 'var(--tehlu_text-size, 1rem)',
        } as T_Style,
        style,
      ]}>
      <span
        style={{
          display: 'contents',
          // @ts-ignore
          '--tehlu_text-inner-display': 'inline-block',
        }}>
        {children}
      </span>
    </El>
  )
}

function getVariantStyle(typography: Typography, variant?: Variant) {
  return function getPropertyStyle(property: string) {
    const responsiveVariant = ([] as (keyof Typography | undefined)[]).concat(
      variant
    )

    return responsiveVariant.map((variant) => {
      if (variant !== undefined) {
        const theme = typography?.[variant]

        if (theme) {
          if (theme.hasOwnProperty(property)) {
            return theme[property as keyof typeof theme]
          }

          return 'inherit'
        }
      }
    })
  }
}
