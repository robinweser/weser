import { T_InputProps } from '@/components/system/InputContainer'
import { T_Style } from './system'
import theme, { colors } from './theme'

export type T_InputVariant = 'default' | 'inline' | 'function'

function getSpacing(variant: T_InputVariant, borderWidth: number) {
  const isSmall = variant === 'inline' || variant === 'function'
  const block = isSmall ? 6 : 10
  const inline = variant === 'function' ? 6 : 10
  const offset = 1 - borderWidth
  const defaultBorder = 1

  return {
    minHeight: isSmall ? 36 : 44,
    paddingBlock: block + defaultBorder + offset,
    paddingInline: inline + defaultBorder + offset,
  }
}

export function inputStyle(
  {
    variant = 'default',
    valid = true,
    loading = false,
    disabled = false,
  }: T_InputProps,
  focus = ':focus-visible'
) {
  const baseStyle = {
    background: 'transparent',
    width: '100%',
    flexShrink: 1,
    borderWidth: 0,
    borderStyle: 'none',
    appearance: 'none',
    fontFamily: 'inherit',

    lineHeight: 1.1,
    outline: 0,
    outlineOffset: 0,
    ':disabled': {
      color: 'currentColor',
    },
    extend: [
      {
        condition: !!loading,
        style: {
          userSelect: 'none',
          pointerEvents: 'none',
          alignItems: 'center',
          position: 'relative',
        },
      },
      {
        condition: !loading && disabled,
        style: {
          pointerEvents: 'none',
          borderColor: colors.gray300,
          color: colors.gray500,
          extend: {
            condition: disabled,
            style: {
              color: colors.gray500,
            },
          },
        },
      },
    ],
  } as const

  if (variant === 'function') {
    const spacing = getSpacing(variant, 0)
    const width = `calc(100% + ${spacing.paddingInline * 2}px)`

    return {
      ...baseStyle,
      ...spacing,
      justifyContent: 'center',
      marginInline: -spacing.paddingInline,
      width,
      maxWidth: width,
      borderRadius: 4,
      fontSize: 16,
      ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
      '[data-id="field"] &': {
        marginTop: -2,
        marginBottom: -2,
      },
      outlineOffset: -2,
      [focus]: {
        ...theme.focusRing,
        outlineOffset: 0,
      },
    } as const
  }

  return {
    ...baseStyle,
    ...getSpacing(variant, 1),
    justifyContent: 'center',
    backgroundColor: theme.colors.background.input,
    boxShadow: theme.shadows.small,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
    borderStyle: 'solid',
    outlineOffset: 0,
    [focus]: theme.focusRing,

    extend: [
      // @ts-ignore
      ...baseStyle.extend,
      {
        condition: disabled && !loading,
        style: {
          backgroundColor: colors.gray50,
        },
      },
      {
        condition: !disabled && !valid,
        style: {
          borderColor: colors.red500,
          borderWidth: 2,
          ...getSpacing(variant, 2),
          ':hover': {
            borderColor: colors.red500,
          },
        },
      },
    ],
  } as const
}
