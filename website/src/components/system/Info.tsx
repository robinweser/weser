import { PropsWithChildren } from 'react'

import theme, { colors } from '@/utils/theme'
import { Box, Text } from './core'

type Props = {
  title?: string
  intent?: 'info' | 'success' | 'warning' | 'destructive'
  variant?: 'prominent' | 'default'
}

const intents = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  destructive: 'red',
}

export default function Info({
  intent = 'info',
  variant = 'default',
  title,
  children,
}: PropsWithChildren<Props>) {
  const baseColor = intents[intent]

  const isProminent = variant === 'prominent'
  const foreground = isProminent
    ? colors.white
    : colors[(baseColor + '800') as keyof typeof colors]

  return (
    <Box
      padding={4}
      bg={
        colors[
          (baseColor + (isProminent ? '700' : '50')) as keyof typeof colors
        ]
      }
      style={{ borderRadius: 6 }}>
      {title && (
        <Text variant="note" color={foreground} weight={700}>
          {title}
        </Text>
      )}
      <Text variant="note" color={foreground}>
        {children}
      </Text>
    </Box>
  )
}
