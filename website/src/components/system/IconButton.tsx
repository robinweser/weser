import { ComponentProps } from 'react'
import { LucideIcon } from 'lucide-react'
import { alpha } from '@weser/theming'

import Click from './Click'
import { VisuallyHidden } from './core'

import theme, { colors } from '@/utils/theme'

type ClickProps = ComponentProps<typeof Click>
type Props = {
  label: string
  icon: LucideIcon
  iconSize?: number
  rounded?: boolean
  size?: 'large' | 'default' | 'small'
  variant?: 'primary' | 'control' | 'function'
  intent?: 'positive' | 'neutral' | 'destructive'
  tabIndex?: number
} & ClickProps

export default function IconButton({
  icon: Icon,
  label,
  variant = 'primary',
  intent = 'positive',
  size = 'default',
  rounded = false,
  iconSize,
  tabIndex,
  disabled,
  ...props
}: Props) {
  const dimensions = size === 'large' ? 50 : size === 'default' ? 44 : 36

  return (
    <Click
      {...props}
      disabled={disabled}
      tabIndex={tabIndex}
      style={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: rounded ? dimensions : 6,
        width: dimensions,
        height: dimensions,
        color: 'white',

        outlineOffset: 0,
        ':focus-visible': theme.focusRing,
        ':active': {
          transform: 'scale(0.98)',
        },

        extend: [
          {
            condition: !disabled,
            style: {
              ':active': {
                color: 'white',
              },
            },
          },
          {
            condition: variant === 'control',
            style: {
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
                    borderColor: colors.gray400,
                    color: colors.gray500,
                    ':hover': {
                      backgroundColor: colors.gray50,
                    },
                  },
                },
                {
                  condition: variant === 'function',
                  style: {
                    color: colors.gray700,
                    ':hover': {
                      backgroundColor: alpha(theme.colors.primary, 0.05),
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
                    backgroundColor: theme.colors.primary,
                    ':hover': {
                      backgroundColor: theme.colors.primaryHover,
                    },
                  },
                },
                {
                  condition: variant === 'control',
                  style: {
                    borderColor: colors.brand400,
                    color: colors.brand700,
                    ':hover': {
                      backgroundColor: colors.brand50,
                    },
                  },
                },
                {
                  condition: variant === 'function',
                  style: {
                    color: theme.colors.primary,
                    ':hover': {
                      color: theme.colors.primaryHover,
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
                      backgroundColor: colors.red500, // 600?
                    },
                  },
                },
                {
                  condition: variant === 'control',
                  style: {
                    borderColor: colors.red500,
                    color: colors.red700,
                    ':hover': {
                      backgroundColor: colors.red50,
                    },
                  },
                },
                {
                  condition: variant === 'function',
                  style: {
                    color: colors.red500,
                    ':hover': {
                      color: colors.red600,
                      backgroundColor: colors.red50,
                    },
                  },
                },
              ],
            },
          },
        ],
      }}>
      <Icon
        size={
          iconSize ?? (size === 'large' ? 30 : size === 'default' ? 26 : 22)
        }
        focusable={false}
        strokeWidth={1.5}
        style={{
          pointerEvents: 'none',
        }}
      />
      <VisuallyHidden>{label}</VisuallyHidden>
    </Click>
  )
}
