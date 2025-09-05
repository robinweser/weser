import { PropsWithChildren } from 'react'

import Box from '@/components/system/Box'
import theme from '@/utils/theme'

export default function Paragraph({ children }: PropsWithChildren) {
  return (
    <Box
      as="p"
      marginTop={1}
      marginBottom={3}
      style={{
        display: 'inline',

        wordBreak: 'keep-all',
        lineHeight: 1.5,
        color: theme.colors.foreground.primary,

        '[data-id="note"] &': {
          color: theme.colors.foreground.secondary,
          marginBottom: 0,
          marginTop: 0,
        },
        '[data-id="code"] + &': {
          marginTop: 12,
        },
      }}>
      {children}
    </Box>
  )
}
