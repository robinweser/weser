import { PropsWithChildren } from 'react'
import { alpha } from '@weser/theming'

import { Box } from '@/components/system/core'
import theme from '@/utils/theme'

type Props = {
  disabled?: boolean
  shadow?: keyof typeof theme.shadows
  zoom?: boolean
}
export default function Card({
  children,
  shadow = 'medium',
  disabled = false,
  zoom = true,
}: PropsWithChildren<Props>) {
  return (
    <Box
      bg={alpha(theme.colors.background.primary, disabled ? 0.75 : 1)}
      overflow="hidden"
      grow={1}
      style={{
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.border,
        boxShadow: theme.shadows[disabled ? 'small' : shadow],
        color: theme.colors.foreground.primary,
        textDecoration: 'none',
        transition: '100ms ease-in-out all',
        outlineOffset: 0,
        extend: [
          {
            condition: shadow !== 'small' && !disabled && zoom === true,
            style: {
              ':hover': {
                transform: 'scale(1.01)',
                boxShadow: theme.shadows.large,
              },
            },
          },
        ],
      }}>
      {children}
    </Box>
  )
}
