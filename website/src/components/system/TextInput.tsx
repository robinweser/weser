import { ComponentProps } from 'react'

import InputField from '@/components/system/InputField'
import InputContainer from '@/components/system/InputContainer'
import { Box } from './core'

type InputFieldProps = Omit<ComponentProps<typeof InputField>, 'children'>
type Props = InputFieldProps & ComponentProps<'input'>

export default function TextInput({ ref, ...props }: Props) {
  return (
    <InputField {...props}>
      {(inputProps, containerProps) => (
        <InputContainer focus=":focus-within" {...containerProps}>
          <Box as="input" ref={ref} {...inputProps} />
        </InputContainer>
      )}
    </InputField>
  )
}
