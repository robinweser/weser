import TextAreaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'

import { ComponentProps, ComponentType, Ref } from 'react'

import InputField from '@/components/system/InputField'
import InputContainer from '@/components/system/InputContainer'
import { Box } from './core'

function TextAreaAutoSize(
  props: { style: { minHeight: any } } & TextareaAutosizeProps
) {
  const { minHeight, ...style } = props.style
  const minRows = props.minRows || 3

  return <TextAreaAutosize {...props} style={style} minRows={minRows} />
}

type InputFieldProps = Omit<ComponentProps<typeof InputField>, 'children'>
type Props = {
  ref?: Ref<HTMLTextAreaElement>
  autoSize?: boolean
  minRows?: number
}
export default function TextArea({
  ref,
  autoSize = false,
  ...props
}: Props & InputFieldProps) {
  const as = autoSize ? TextAreaAutoSize : 'textarea'

  return (
    <InputField
      {...props}
      style={{
        lineHeight: 1.4,
        height: '100%',
        resize: 'none',
      }}>
      {(props, containerProps) => (
        <InputContainer focus=":focus-within" {...containerProps}>
          {/* @ts-ignore */}
          <Box as={as} ref={ref} grow={1} {...props} />
        </InputContainer>
      )}
    </InputField>
  )
}
