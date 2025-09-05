import React, { PropsWithChildren } from 'react'

import Box from '@/components/system/Box'
import theme from '@/utils/theme'

export default function CodeBlock({ children }: PropsWithChildren) {
  return (
    <Box
      data-id="code"
      marginLeft={[-5, , 0]}
      marginRight={[-5, , 0]}
      maxWidth={['calc(100% + 40px)', , '100%']}
      style={{
        '.code + &': {
          marginTop: 8,
        },
        '.note + &': {
          marginTop: -4,
        },
      }}>
      <Box
        bg={theme.colors.background.code}
        style={{
          borderRadius: [0, , 6],
        }}>
        {children}
      </Box>
    </Box>
  )
}
