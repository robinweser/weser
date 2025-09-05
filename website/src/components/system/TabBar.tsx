'use client'
import { useId } from 'react'

import { Box, Text } from './core'
import FormMessage from './FormMessage'
import theme from '@/utils/theme'

type TabBarItemProps = {
  label: string
  id: string
  value: string
  selected: boolean
}
function TabBarItem({ label, id, value, selected }: TabBarItemProps) {
  return (
    <Box
      grow={1}
      shrink={1}
      basis={0}
      alignItems="center"
      as="label"
      paddingBlock={2}
      paddingInline={2}
      htmlFor={id + value}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderBottomWidth: 3,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.border,
        cursor: 'pointer',

        ':hover': {
          backgroundColor: theme.colors.background.alternate,
        },
        ':has(:focus-visible)': theme.focusRing,

        extend: [
          {
            condition: selected,
            style: {
              borderBottomColor: theme.colors.primary,
            },
          },
        ],
      }}>
      <Box
        as="input"
        type="radio"
        name={id}
        id={id + value}
        value={value}
        style={{ appearance: 'none' }}
      />
      <Text>{label}</Text>
    </Box>
  )
}

type Option<Value extends string = string> = {
  label: string
  value: Value
}

type Props<Options extends readonly Option[]> = {
  name: string
  options: Options
  value?: Options[number]['value']
  onChange: (
    e: React.ChangeEvent<HTMLInputElement> & {
      target: { value: Options[number]['value'] }
    }
  ) => void
}

export default function TabBar<Options extends readonly Option[]>({
  value,
  options,
  ...props
}: Props<Options>) {
  const id = useId()

  return (
    <Box {...props} direction="row">
      {options.map((option) => (
        <TabBarItem
          key={option.value}
          id={id}
          selected={option.value === value}
          {...option}
        />
      ))}
    </Box>
  )
}
