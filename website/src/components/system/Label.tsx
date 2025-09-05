import { PropsWithChildren } from 'react'
import { Text } from './core'
import theme from '@/utils/theme'

export type NecessityIndicator = 'label' | 'icon'
function getNecessityElement(
  required: boolean,
  necessityIndicator?: NecessityIndicator
) {
  if (!necessityIndicator) {
    return ''
  }

  if (necessityIndicator === 'icon' && required) {
    return '*'
  }

  if (required) {
    return ' (required)'
  }

  return ' (optional)'
}

type Props = {
  required?: boolean
  necessityIndicator?: NecessityIndicator
}
export default function Label({
  required = false,
  necessityIndicator,
  children,
}: PropsWithChildren<Props>) {
  return (
    <Text variant="hint" height={1} color={theme.colors.foreground.secondary}>
      {children}
      {getNecessityElement(required, necessityIndicator)}
    </Text>
  )
}
