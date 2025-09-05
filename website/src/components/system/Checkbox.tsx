'use client'
import { ComponentProps, Fragment, Ref, useId } from 'react'
import { El, Box, Text, VisuallyHidden } from './core'

import theme from '@/utils/theme'

type Variant = 'small' | 'large'

const css = (
  variant: Variant
) => `input[type='checkbox'][data-variant="${variant}"]:checked::before {
  box-sizing: border-box;
  transform: translateY(${variant === 'small' ? -1.5 : -2}px) rotate(45deg);
  display: block;
  content: '';
  width: ${variant === 'small' ? 6 : 8}px;
  height: ${variant === 'small' ? 12 : 18}px;
  position: absolute;
  border-radius: 0px;
  border-right-width: 2px;
  border-right-style: solid;
  border-right-color: var(--background);
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: var(--background);
}`

const sizes = {
  small: 20,
  large: 28,
}

type Props = {
  ref?: Ref<HTMLInputElement>
  label: string
  labelVisible?: boolean
  labelVariant?: ComponentProps<typeof Text<'p'>>['variant']
  value: boolean
  variant?: Variant
  valid?: boolean
  errorMessage?: string
} & Omit<ComponentProps<'input'>, 'value'>

export default function Checkbox({
  ref,
  value,
  label,
  labelVariant,
  labelVisible = true,
  variant = 'small',
  valid,
  errorMessage,
  ...props
}: Props) {
  const id = useId()
  const size = sizes[variant]

  const LabelContainer = labelVisible ? Fragment : VisuallyHidden

  return (
    <Box alignItems="flex-start">
      <Box
        as="label"
        htmlFor={id}
        direction="row"
        gap={variant === 'small' ? 2 : 2.5}
        alignItems="center">
        <style dangerouslySetInnerHTML={{ __html: css(variant) }} />
        <El
          {...props}
          ref={ref}
          id={id}
          name={id}
          as="input"
          type="checkbox"
          data-variant={variant}
          checked={value}
          style={{
            outline: 0,
            boxSizing: 'border-box',
            cursor: 'pointer',
            appearance: 'none',
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            position: 'relative',
            zIndex: 0,
            width: size,
            height: size,
            borderWidth: 1,
            borderColor: 'black',
            borderStyle: 'solid',

            ':hover': {
              borderColor: theme.colors.foreground.primary,
            },
            ':focus': {
              outline: 'none',
              borderColor: theme.colors.foreground.primary,
            },

            '@media (hover: none)': {
              width: size + 4,
              height: size + 4,
            },

            extend: [
              {
                condition: value === true,
                style: {
                  borderColor: 'transparent',
                  backgroundColor: theme.colors.primary,
                  ':hover': {
                    borderColor: 'transparent',
                  },
                },
              },
            ],
          }}
        />

        <LabelContainer>
          <Text weight={400} variant={labelVariant}>
            {label}
          </Text>
        </LabelContainer>
      </Box>
    </Box>
  )
}
