'use client'
import { ComponentProps, Fragment, ReactNode, useId } from 'react'
import { Box, VisuallyHidden } from '@/components/system/core'

import FormMessage from '@/components/system/FormMessage'

import Label, { NecessityIndicator } from './Label'
import { T_StyleProp } from './core'
import { T_Style } from '@/utils/system'
import { T_InputContainerProps, T_InputProps } from './InputContainer'

const resetStyle: T_Style = {
  display: 'flex',
  appearance: 'none',
  border: 0,
  outline: 0,
  height: '100%',
  width: '100%',
  background: 'transparent',
  flexShrink: 1,
  fontFamily: 'inherit',
  lineHeight: 1.1,
  ':disabled': {
    color: 'currentColor',
  },
}

type InputProps = {
  style?: T_StyleProp
} & Omit<ComponentProps<'input'>, 'style'>

type Props = {
  label: string
  labelVisible?: boolean
  description?: string
  fill?: boolean
  errorMessage?: string
  synthetic?: boolean
  necessityIndicator?: NecessityIndicator
  style?: T_StyleProp
  children: (
    inputProps: InputProps,
    containerProps: T_InputProps & T_InputContainerProps
  ) => ReactNode
} & T_InputProps &
  Omit<T_InputContainerProps, 'focus'> &
  Pick<
    ComponentProps<'input'>,
    'autoComplete' | 'pattern' | 'autoFocus' | 'required'
  >

export default function InputField({
  label,
  labelVisible = true,
  errorMessage,
  description,
  children,
  valid = true,
  required = false,
  disabled = false,
  synthetic = false,
  loading = false,
  necessityIndicator,
  variant = 'default',
  fill = false,
  icon,
  iconPosition,
  prefix,
  suffix,
  autoFocus,
  style,
  ...other
}: Props) {
  const _id = useId()
  const _labelId = useId()
  const _descriptionId = useId()

  const labelId = synthetic ? _labelId : undefined
  const descriptionId = description ? _descriptionId : undefined
  const id = synthetic ? undefined : _id

  const inputProps = {
    ...other,
    variant,
    id,
    disabled,
    required,
    style: [resetStyle, style],
    'aria-describedby': descriptionId,
    'aria-labelledby': labelId,
    'data-autofocus': autoFocus,
    autoFocus,
  }

  const inputContainerProps = {
    variant,
    disabled,
    valid,
    loading,
    prefix,
    suffix,
    icon,
    iconPosition,
  }

  const LabelContainer = labelVisible ? Fragment : VisuallyHidden
  const gap = variant === 'inline' ? 1.25 : 1.5

  return (
    <Box
      data-id="field"
      width="100%"
      height={fill ? '100%' : 'auto'}
      shrink={1}
      gap={1.5}
      style={{ position: 'relative' }}>
      <Box
        as="label"
        id={labelId}
        grow={fill ? 1 : 0}
        htmlFor={id}
        gap={labelVisible ? gap : 0}>
        <LabelContainer>
          <Label required={required} necessityIndicator={necessityIndicator}>
            {label}
          </Label>
        </LabelContainer>
        {children(inputProps, inputContainerProps)}
      </Box>
      {(description || errorMessage) && (
        <Box gap={0.5}>
          {description && (
            <FormMessage id={descriptionId}>{description}</FormMessage>
          )}
          {errorMessage && (
            <FormMessage intent="error">{errorMessage}</FormMessage>
          )}
        </Box>
      )}
    </Box>
  )
}
