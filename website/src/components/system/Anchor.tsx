import { PropsWithChildren } from 'react'

import { Box } from './core'

type Props = {
  id?: string
  offset?: number
}
export default function Anchor({
  id,
  offset = 30,
  children,
}: PropsWithChildren<Props>) {
  if (!id) {
    return children
  }

  return (
    <Box data-id="anchor">
      <Box
        as="span"
        id={id}
        position="relative"
        style={{
          top: '2rem',
          zIndex: -1,
          marginTop: -offset,
          paddingBottom: offset,
        }}
      />
      {children}
    </Box>
  )
}
