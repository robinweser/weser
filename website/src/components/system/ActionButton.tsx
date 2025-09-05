'use client'
import { ComponentProps, PropsWithChildren } from 'react'
import { LucideIcon } from 'lucide-react'
import { alpha } from '@weser/theming'

import theme, { colors } from '@/utils/theme'
import Click from './Click'
import { Box, El } from './core'
import Loading from './Loading'
import { T_Style } from '@/utils/system'

type ClickProps = ComponentProps<typeof Click>
type Props = {
  size?: 'default' | 'small' | 'large'
  variant?: 'primary' | 'control' | 'function'
  intent?: 'positive' | 'neutral' | 'destructive'
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  stretch?: boolean
} & Omit<ClickProps, 'size'>

export default function ActionButton({
  children,
  size = 'default',
  variant = 'primary',
  intent = 'positive',
  icon: Icon,
  iconPosition = 'left',
  disabled,
  autoFocus = false,
  stretch = false,
  loading,
  ...props
}: PropsWithChildren<Props>) {
  const styleProps = {
    size,
    variant,
    intent,
    loading,
    disabled,
    stretch,
  }

  const icon = Icon ? <Icon size={20} /> : undefined

  return (
    <Click
      {...props}
      autoFocus={autoFocus}
      data-autofocus={autoFocus}
      disabled={disabled || loading}
      style={style(styleProps)}>
      <Box
        as="span"
        direction="row"
        alignItems="center"
        gap={2}
        style={{ color: loading ? 'transparent' : 'currentColor' }}>
        {iconPosition === 'left' && icon}
        {children}
        {iconPosition === 'right' && icon}
      </Box>
      {loading && (
        <El as="span" style={{ position: 'absolute' }}>
          <Loading
            size={size === 'large' ? 36 : size === 'default' ? 30 : 24}
            color={variant === 'primary' ? 'white' : 'currentColor'}
          />
        </El>
      )}
    </Click>
  )
}

function getSpacing(
  size: Props['size'],
  variant: Props['variant'],
  borderWidth = 0
) {
  if (size === 'small' || variant === 'function') {
    return {
      height: 36,
      paddingInline: 14 - borderWidth,
    }
  }

  if (size === 'large') {
    return {
      height: 50,
      paddingInline: 20 - borderWidth,
    }
  }

  return {
    height: 44,
    paddingInline: 16 - borderWidth,
  }
}

function style({
  variant,
  size,
  intent,
  loading,
  disabled,
  stretch,
}: Partial<Props>): T_Style {
  return {
    ...getSpacing(size, variant),
    // @ts-ignore
    '--system-button-foreground': 'white',
    color: 'var(--system-button-foreground)',
    display: 'inline-flex',
    minWidth: 60,
    width: stretch ? '100%' : 'max-content',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    borderWidth: 0,
    appearance: 'none',
    fontSize: size === 'large' ? 18 : 16,
    fontWeight: 500,
    fontFamily: 'inherit',
    lineHeight: 1,
    textAlign: 'center',
    borderRadius: 6,
    outlineOffset: 0,
    ':active': {
      transform: 'scale(0.99)',
    },
    ':focus-visible': theme.focusRing,

    extend: [
      {
        condition: variant === 'control',
        style: {
          ...getSpacing(size, variant, 1),
          borderWidth: 1,
          borderStyle: 'solid',
        },
      },

      {
        condition: intent === 'neutral',
        style: {
          extend: [
            {
              condition: variant === 'primary',
              style: {
                backgroundColor: colors.gray800,
                ':hover': {
                  backgroundColor: colors.gray900,
                },
              },
            },
            {
              condition: variant === 'control',
              style: {
                borderColor: colors.gray800,
                // @ts-ignore
                '--system-button-foreground': theme.colors.foreground.primary,
                ':hover': {
                  backgroundColor: theme.colors.background.secondary,
                },
              },
            },
            {
              condition: variant === 'function',
              style: {
                // @ts-ignore
                '--system-button-foreground': colors.gray800,
                ':hover': {
                  // @ts-ignore
                  '--system-button-foreground': colors.gray900,
                  backgroundColor: colors.gray50,
                },
              },
            },
          ],
        },
      },

      {
        condition: intent === 'positive',
        style: {
          extend: [
            {
              condition: variant === 'primary',
              style: {
                // @ts-ignore
                '--system-button-foreground': theme.colors.background.primary,
                backgroundColor: theme.colors.primary,
                ':hover': {
                  backgroundColor: theme.colors.primaryHover,
                },
              },
            },
            {
              condition: variant === 'control',
              style: {
                borderColor: theme.colors.primaryHover,
                // @ts-ignore
                '--system-button-foreground': theme.colors.primaryHover,
                ':hover': {
                  backgroundColor: alpha(theme.colors.primary, 0.05),
                },
              },
            },
            {
              condition: variant === 'function',
              style: {
                // @ts-ignore
                '--system-button-foreground': theme.colors.primaryHover,
                ':hover': {
                  backgroundColor: alpha(theme.colors.primary, 0.05),
                },
              },
            },
          ],
        },
      },
      {
        condition: intent === 'destructive',
        style: {
          extend: [
            {
              condition: variant === 'primary',
              style: {
                backgroundColor: colors.red500,
                ':hover': {
                  backgroundColor: colors.red600,
                },
              },
            },
            {
              condition: variant === 'control',
              style: {
                borderColor: colors.red500,
                // @ts-ignore
                '--system-button-foreground': colors.red600,
                ':hover': {
                  backgroundColor: colors.red50,
                },
              },
            },
            {
              condition: variant === 'function',
              style: {
                // @ts-ignore
                '--system-button-foreground': colors.red500,
                ':hover': {
                  // @ts-ignore
                  '--system-button-foreground': colors.red600,
                  backgroundColor: colors.red50,
                },
              },
            },
          ],
        },
      },

      {
        condition: !!loading,
        style: {
          pointerEvents: 'none',
          userSelect: 'none',
        },
      },
      {
        condition: !!(!loading && disabled),
        style: {
          pointerEvents: 'none',
          borderColor: colors.gray300,
          // @ts-ignore
          '--system-button-foreground': colors.gray500,

          ':disabled': {
            // @ts-ignore
            '--system-button-foreground': colors.gray500,
          },
          extend: [
            {
              condition: variant === 'primary',
              style: {
                backgroundColor: colors.gray200,
              },
            },
          ],
        },
      },
      {
        condition: !disabled,
        style: {
          ':active': {
            color: 'var(--system-button-foreground)',
          },
        },
      },
    ],
  }
}
