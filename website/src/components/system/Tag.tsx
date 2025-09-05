import { X } from 'lucide-react'
import { Box, Text } from './core'
import IconButton from './IconButton'

type Props = {
  title: string
  onRemove?: () => void
}

export default function Tag({ title, onRemove }: Props) {
  return (
    <Box
      direction="row"
      gap={2}
      alignItems="center"
      paddingLeft={2}
      alignSelf="flex-start"
      style={{ border: '1px solid grey', borderRadius: 10 }}>
      <Text>{title}</Text>

      {onRemove && (
        <IconButton
          variant="function"
          label="Remove"
          intent="destructive"
          size="small"
          icon={X}
          action={onRemove}
        />
      )}
    </Box>
  )
}
