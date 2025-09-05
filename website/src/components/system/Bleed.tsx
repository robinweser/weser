import { PropsWithChildren } from 'react'

import { Box } from '@/components/system/core'

type Size = number | Array<number | undefined>

type Props = {
  size: Size
}

function getResponsiveSize(size: Size) {
  if (typeof size === 'number') {
    return -size
  }

  return size.map((value) => (typeof value === 'number' ? -value : value))
}

export default function Bleed({ size, children }: PropsWithChildren<Props>) {
  return (
    <Box marginInline={getResponsiveSize(size)} maxWidth="100vw">
      {children}
    </Box>
  )
}
