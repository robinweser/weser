import { ComponentProps, PropsWithChildren } from 'react'
import { Box, Text } from '@/components/system/core'

import { colors } from '@/utils/theme'

export const brushes = [
  'rose',
  'blush',
  'pink',
  'peach',
  'lemon',
  'lime',
  'mint',
  'turquoise',
  'aqua',
  'lavender',
  'lilac',
]

type TextProps = ComponentProps<typeof Text<'div'>>
type Props = {
  fill?: boolean
  variant?: TextProps['variant']
  color:
    | 'pink'
    | 'peach'
    | 'lemon'
    | 'lime'
    | 'aqua'
    | 'lavender'
    | 'rose'
    | 'mint'
    | 'turquoise'
    | 'lilac'
    | 'blush'
}

export default function Badge({
  color,
  variant = 'note',
  children,
}: PropsWithChildren<Props>) {
  const bg = colors[(color + '300') as keyof typeof colors]

  return (
    <Box
      bg={bg}
      width="max-content"
      maxWidth="100%"
      paddingInline={2}
      paddingBlock={1}
      style={{
        borderRadius: 4,
      }}>
      <Text
        variant={variant}
        height={1.2}
        style={{
          whiteSpace: 'nowrap',
          overflowX: 'hidden',
          textOverflow: 'ellipsis',
        }}>
        {children}
      </Text>
    </Box>
  )
}
