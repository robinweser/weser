import { PropsWithChildren } from 'react'
import { alpha } from '@weser/theming'

import { Box, Text } from '@/components/system/core'

import theme from '@/utils/theme'

const BORDER_WIDTH = 3

type Props = {
  title?: string
  variant?: 'info' | 'warning' | 'destructive' | 'success'
}
export default function Callout({
  title,
  children,
  variant = 'info',
}: PropsWithChildren<Props>) {
  return (
    <Box
      className="note"
      marginBlock={4}
      bg={alpha(theme.colors.background[variant], 0.1)}
      marginInline={[-5, , , 0]}
      paddingLeft={4}
      paddingRight={5}
      paddingBlock={4}
      gap={2}
      position="relative"
      maxWidth="initial"
      style={{
        borderRadius: [0, , , 6],
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderLeftWidth: [4, , , BORDER_WIDTH],
        borderLeftStyle: 'solid',
        borderLeftColor: theme.colors.background[variant],
        'p + &': {
          marginTop: 0,
        },
        '.note + &': {
          marginTop: 0,
        },
        '[data-id="anchor"] + &': {
          marginTop: 0,
        },
      }}>
      {title && (
        <Text weight={600} color={theme.colors.foreground[variant]}>
          {title}
        </Text>
      )}
      <Text>{children}</Text>
    </Box>
  )
}
