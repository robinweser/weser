import { PropsWithChildren } from 'react'

import theme, { colors } from '@/utils/theme'
import { Text } from './core'

type Props = {
  intent?: 'info' | 'error'
  id?: string
}

export default function FormMessage({
  id,
  intent = 'info',
  children,
}: PropsWithChildren<Props>) {
  return (
    <Text
      id={id}
      variant="hint"
      color={
        intent === 'error' ? colors.red500 : theme.colors.foreground.secondary
      }>
      {children}
    </Text>
  )
}
