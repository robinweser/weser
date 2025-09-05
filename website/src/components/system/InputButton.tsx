import {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  Ref,
  KeyboardEvent,
} from 'react'

import { El } from './core'
import InputContainer, {
  T_InputProps,
  T_InputContainerProps,
} from './InputContainer'

import mergeRefs from '@/utils/mergeRefs'
import { colors } from '@/utils/theme'
import { T_StyleProp } from '@/utils/system'

function getProps(isButton: boolean, loading: boolean) {
  if (isButton) {
    return {
      type: 'button',
    }
  }

  return {
    role: 'button',
    tabIndex: !loading ? 0 : undefined,
  }
}

type ButtonProps = {
  as?: 'button'
  ref?: Ref<HTMLButtonElement>
}

type DivProps = {
  as: 'div'
  ref?: Ref<HTMLDivElement>
}

type Props = {
  action: () => void
  style?: T_StyleProp
  placeholder?: ReactNode
  empty?: boolean
} & (ButtonProps | DivProps) &
  T_InputProps &
  T_InputContainerProps &
  Omit<ComponentProps<'input'>, 'placeholder' | 'prefix' | 'ref'>

export default function InputButton({
  ref,
  action,
  style,
  children,
  placeholder,
  empty = false,
  loading = false,
  disabled = false,
  autoFocus = false,
  as = 'button',
  onKeyDown,
  ...props
}: Props) {
  const innerRef = useRef<HTMLButtonElement>(null)

  const isButton = as === 'button'
  const extraProps = getProps(isButton, loading)

  useEffect(() => {
    if (autoFocus && ref && innerRef.current) {
      innerRef.current.focus()
    }
  }, [innerRef])

  return (
    <InputContainer
      {...props}
      {...extraProps}
      focus={isButton ? ':focus-visible' : ':focus'}
      disabled={disabled || loading}
      loading={loading}
      ref={mergeRefs(ref, innerRef)}
      as={as}
      onClick={action}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          if (loading) {
            e.preventDefault()
            return
          }

          if (as !== 'button') {
            action()
          }
        }

        if (onKeyDown) {
          onKeyDown(e)
        }
      }}
      style={[
        {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          extend: [
            {
              condition: !loading && !disabled && !!empty && !!placeholder,
              style: {
                color: colors.gray600,
              },
            },
          ],
        },
        style,
      ]}>
      <El
        style={{
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.2,
          color: loading ? 'transparent' : 'currentColor',
          userSelect: empty ? 'none' : undefined,
        }}>
        {empty ? placeholder : children}
      </El>
    </InputContainer>
  )
}
