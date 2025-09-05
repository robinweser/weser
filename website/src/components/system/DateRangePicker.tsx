'use client'
import { ComponentProps, ReactNode, Ref } from 'react'
import { ArrowRight } from 'lucide-react'
import { format } from 'small-date'
import { useTrigger } from '@weser/hooks'

import InputButton from './InputButton'
import { T_InputProps } from './InputContainer'
import Popover from './Popover'
import Box from './Box'
import DatePicker from './DatePicker'
import InputField from './InputField'

type PopoverProps = ComponentProps<typeof Popover>

type SingleValue = Date | null
type Value = [SingleValue, SingleValue]

export type RangeChangeEvent = {
  type: 'change'
  bubbles: true
  target: { value: Value }
}
export type RangeChangeEventHandler = (e: RangeChangeEvent) => void

type Props = {
  ref?: Ref<HTMLButtonElement>
  value?: [SingleValue, SingleValue]
  onChange: RangeChangeEventHandler
  placeholder?: ReactNode
  autoFocus?: boolean
  'aria-labelledby'?: string
} & T_InputProps &
  Pick<PopoverProps, 'align'>

function DateRangeInput({
  placeholder,
  align = 'stretch',
  'aria-labelledby': ariaLabelledby,
  disabled,
  valid,
  value = [null, null],
  onChange,
}: Props) {
  const [visible, setVisible, triggerRef] = useTrigger<HTMLButtonElement>()

  const isEmpty = !value || value.filter(Boolean).length === 0
  const arrow = (
    <ArrowRight size={20} style={{ flexShrink: 0, strokeWidth: 1.5 }} />
  )

  const from = value[0]
  const to = value[1]

  return (
    <>
      <InputButton
        ref={triggerRef}
        aria-expanded={visible}
        aria-haspopup="dialog"
        aria-labelledby={ariaLabelledby}
        placeholder={placeholder}
        empty={isEmpty}
        disabled={disabled}
        valid={valid}
        action={() => setVisible(true)}>
        <Box
          direction="row"
          gap={2}
          alignItems="center"
          style={{ lineHeight: 1.2 }}>
          {from && format(from, 'MMMM dd, yyyy')}
          {arrow}
          {to && format(to, 'MMMM dd, yyyy')}
        </Box>
      </InputButton>
      <Popover
        anchor={triggerRef}
        visible={visible}
        align={align}
        offsetY={4}
        onClose={() => setVisible(false)}>
        <Box padding={4} direction="row" gap={2} alignItems="center">
          <DatePicker
            variant="inline"
            label="From"
            labelVisible={false}
            format="MMMM dd, yyyy"
            value={from}
            onChange={(e) =>
              onChange({
                type: 'change',
                bubbles: true,
                target: { value: [e.target.value, to] },
              })
            }
          />
          {arrow}
          <DatePicker
            variant="inline"
            label="To"
            labelVisible={false}
            format="MMMM dd, yyyy"
            value={to}
            onChange={(e) =>
              onChange({
                type: 'change',
                bubbles: true,
                target: { value: [from, e.target.value] },
              })
            }
          />
        </Box>
      </Popover>
    </>
  )
}

type InputFieldProps = Omit<
  ComponentProps<typeof InputField>,
  'children' | 'value' | 'onChange' | 'multiple' | 'ref'
>
export default function DateRangePicker({
  ref,
  value,
  onChange,
  ...inputFieldProps
}: InputFieldProps & Props) {
  return (
    <InputField {...inputFieldProps} synthetic>
      {(inputProps, containerProps) => (
        <DateRangeInput
          {...inputProps}
          {...containerProps}
          ref={ref}
          value={value}
          onChange={onChange}
        />
      )}
    </InputField>
  )
}
