import { ComponentProps } from 'react'
import TextInput from './TextInput'

type TextInputProps = ComponentProps<typeof TextInput>
type Props = Omit<TextInputProps, 'prefix' | 'suffix'>

export default function RegexInput(props: Props) {
  return <TextInput prefix="/" suffix="/gi" {...props} />
}
