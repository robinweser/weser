import { PropsWithChildren, Ref } from 'react'

import { Box } from './core'
import theme from '@/utils/theme'

type Props = {
  style: Object
  ref: Ref<HTMLElement>
}
export default function Dialog({
  ref,
  style,
  children,
}: PropsWithChildren<Props>) {
  return (
    <Box
      as="section"
      ref={ref}
      tabIndex={-1}
      role="dialog"
      bg={theme.colors.background.input}
      grow={1}
      shrink={1}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
      }}
      style={[
        {
          overflow: 'hidden',
          boxShadow: '0 0 3px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)',
        },
        style,
      ]}>
      {children}
    </Box>
  )
}
