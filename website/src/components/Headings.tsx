'use client'
import Box from '@/components/system/Box'
import Click from '@/components/system/Click'
import Text from '@/components/system/Text'

import { Heading } from '@/utils/getHeadings'

type Props = {
  headings: Array<Heading>
}
export default function Headings({ headings }: Props) {
  return (
    <Box overflow="auto">
      {headings.map(({ id, depth, children }) => (
        <Box
          as={Click}
          key={id + depth}
          paddingBlock={1.5}
          paddingLeft={(depth - 2) * 3}
          action={() => {
            // reset first to make sure the page actually scrolls to the correct position
            window.location.hash = ''
            window.location.hash = encodeURIComponent(id)
          }}>
          <Text size={depth === 2 ? 15 : depth === 3 ? 14 : 13} height={1.25}>
            {children}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
