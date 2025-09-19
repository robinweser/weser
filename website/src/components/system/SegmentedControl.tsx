'use client'
import { ComponentProps, Fragment, useId } from 'react'
import { Box, Text, VisuallyHidden } from './core'
import FormMessage from './FormMessage'
import Label from './Label'
import theme from '@/utils/theme'
import { LucideIcon } from 'lucide-react'

type Option = {
  label: string
  value: string
}

type InputProps = ComponentProps<'input'>
type Props = {
  variant?: 'default' | 'inline'
  label?: string
  labelVisible?: boolean
  options: Array<Option>
  errorMessage?: string
  description?: string
  autoFocus?: boolean
  valid?: boolean
  value?: string
  onChange: InputProps['onChange']
}

// TODO: use InputField
export default function SegmentedControl({
  variant = 'default',
  label,
  labelVisible = true,
  value,
  valid = true,
  options,
  description,
  errorMessage,
  onChange,
}: Props) {
  const LabelContainer = labelVisible ? Fragment : VisuallyHidden
  const gap = variant === 'inline' ? 1.25 : 1.5

  return (
    <Box gap={gap}>
      <LabelContainer>
        <Label>{label}</Label>
      </LabelContainer>

      <Box
        direction="row"
        padding={1}
        bg="rgb(240, 240, 240)"
        style={{ borderRadius: 6 }}>
        {options.map((option) => (
          <Segment
            variant={variant}
            key={option.value}
            selected={value === option.value}
            onChange={onChange}
            {...option}
          />
        ))}
      </Box>
      {(description || errorMessage) && (
        <Box gap={1}>
          {errorMessage && (
            <FormMessage intent="error">{errorMessage}</FormMessage>
          )}
          {description && <FormMessage>{description}</FormMessage>}
        </Box>
      )}
    </Box>
  )
}

type SegmentProps = {
  icon?: LucideIcon
  label: string
  value: string
  selected: boolean
  variant?: 'default' | 'inline'
  onChange: Props['onChange']
}
function Segment({
  label,
  value,
  icon: Icon,
  selected,
  variant = 'default',
  onChange,
}: SegmentProps) {
  const name = useId()
  const id = name + value

  return (
    <Box
      grow={1}
      shrink={1}
      basis={0}
      alignItems="center"
      as="label"
      paddingBlock={(variant === 'default' ? 2.5 : 1.5) - (Icon ? 0.5 : 0)}
      paddingInline={2}
      htmlFor={id}
      style={{
        cursor: 'pointer',
        borderRadius: 4,
        color: 'grey',
        ':has(:focus-visible)': theme.focusRing,

        extend: [
          {
            condition: selected,
            style: {
              backgroundColor: 'white',
              color: 'black',
            },
          },
        ],
      }}>
      <Box
        as="input"
        type="radio"
        name={name}
        id={id}
        checked={selected}
        value={value}
        onChange={onChange}
        style={{ appearance: 'none' }}
      />
      {Icon ? (
        <Icon size={20} style={{ pointerEvents: 'none' }} />
      ) : (
        <Text height={1}>{label}</Text>
      )}
    </Box>
  )
}
