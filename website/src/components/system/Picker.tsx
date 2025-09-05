import { ComponentProps, ReactNode, Ref, useRef, useState } from 'react'
import InputField from './InputField'
import { useKeyDown, useTrigger } from '@weser/hooks'
import InputButton from './InputButton'
import mergeRefs from '@/utils/mergeRefs'
import Popover from './Popover'
import { Box } from './core'
import TextInput from './TextInput'
import theme from '@/utils/theme'
import { Check, ChevronDown } from 'lucide-react'
import ActionButton from './ActionButton'
import { T_InputProps, T_InputContainerProps } from './InputContainer'

export type PickerChangeEvent<T> = {
  type: 'change'
  bubbles: true
  target: { value: T }
}
export type PickerChangeEventHandler<T> = (e: PickerChangeEvent<T>) => void
export type PickerOption<T> = {
  label: string
  value: T
}

type ValueProps<T> =
  | {
      multiple: true
      value: Array<T>
      options: Array<PickerOption<T>>
      onChange: PickerChangeEventHandler<Array<T>>
      renderValue?: (value: Array<PickerOption<T>>) => ReactNode
      renderOption?: (option: PickerOption<T>, active: boolean) => ReactNode
      onCreateItem?: (value: T) => void
    }
  | {
      multiple?: false
      value: T
      options: Array<PickerOption<T>>
      onChange: PickerChangeEventHandler<T>
      renderValue?: (value: PickerOption<T>) => ReactNode
      renderOption?: (option: PickerOption<T>, active: boolean) => ReactNode
      onCreateItem?: (value: T) => void
    }

type Props<T> = {
  align?: 'start' | 'center' | 'end' | 'stretch'
  placeholder?: ReactNode
  searchable?: boolean
  autoFocus?: boolean
  'aria-labelledby'?: string
} & ValueProps<T> &
  T_InputProps &
  Pick<T_InputContainerProps, 'prefix' | 'suffix'>

export function SelectInput<T>({
  options,
  variant = 'default',
  searchable = false,
  placeholder = '',
  autoFocus,
  align = 'stretch',
  'aria-labelledby': ariaLabelledby,
  renderOption,
  onCreateItem,
  disabled,
  valid,
  prefix,
  suffix,
  ...props
}: Props<T>) {
  const [visible, setVisible, triggerRef] = useTrigger()
  const [selected, setSelected] = useState<null | number>(null)
  const [search, setSearch] = useState<string>('')

  const ref = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const typeBuffer = useRef('')
  const typeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trackType = (char: string) => {
    if (typeTimeout.current) {
      clearTimeout(typeTimeout.current)
    }

    typeBuffer.current += char
    typeTimeout.current = setTimeout(() => {
      typeBuffer.current = ''
    }, 500)

    const match = options.find((option) =>
      option.label.toLowerCase().startsWith(typeBuffer.current.toLowerCase())
    )

    if (match) {
      select(match)
    }
  }

  const filteredOptions = options.filter((option) =>
    option.label.trim().toLowerCase().includes(search.trim().toLowerCase())
  )

  const arrayValue = ([] as Array<T>).concat(props.value)
  const activeOptions = options.filter((option) =>
    arrayValue.includes(option.value)
  )

  const isEmpty = activeOptions.length === 0

  const visualSelected =
    selected !== null
      ? selected >= filteredOptions.length
        ? filteredOptions.length - 1
        : selected
      : null

  const open = () => {
    if (ref.current) {
      ref.current.focus()
    }

    setSearch('')

    const defaultSelected =
      activeOptions.length === 1 ? filteredOptions.indexOf(activeOptions[0]) : 0
    setSelected(defaultSelected)
    setVisible(true)
  }

  const close = () => {
    setSelected(null)
    setVisible(false)

    // if (onBlur) {
    //   onBlur(value)
    // }
  }

  useKeyDown('Tab', (e) => {
    if (visible) {
      close()

      if (e.shiftKey && ref.current) {
        ref.current.focus()
      }
    }
  })

  function onEnter() {
    if (visible && visualSelected !== null) {
      select(filteredOptions[visualSelected])

      if (!props.multiple) {
        close()
      }
    } else {
      open()
    }
  }

  useKeyDown(
    'Enter',
    (e) => {
      e.preventDefault()
      onEnter()
    },
    {
      active: visible,
    }
  )

  useKeyDown(
    'ArrowDown',
    (e) => {
      e.preventDefault()
      if (selected !== null) {
        setSelected(Math.min(filteredOptions.length - 1, selected + 1))
      }
    },
    {
      active: visible,
    }
  )

  useKeyDown(
    'ArrowUp',
    (e) => {
      e.preventDefault()

      if (selected !== null) {
        setSelected(Math.max(0, selected - 1))
      }
    },
    { active: visible }
  )

  const select = (option: PickerOption<T>) => {
    if (props.multiple) {
      if (arrayValue.find((value) => option.value === value)) {
        // deselect
        props.onChange({
          type: 'change',
          bubbles: true,
          target: {
            value: arrayValue.filter((value) => option.value !== value),
          },
        })
      } else {
        props.onChange({
          type: 'change',
          bubbles: true,
          target: {
            value: [...props.value, option.value],
          },
        })
      }
    } else {
      props.onChange({
        type: 'change',
        bubbles: true,
        target: {
          value: option.value,
        },
      })
    }
  }

  return (
    <>
      <InputButton
        ref={mergeRefs(ref, triggerRef)}
        variant={variant}
        aria-expanded={visible}
        aria-haspopup="dialog"
        aria-labelledby={ariaLabelledby}
        prefix={prefix}
        suffix={suffix}
        placeholder={placeholder}
        empty={isEmpty}
        disabled={disabled}
        valid={valid}
        icon={ChevronDown}
        action={open}
        onKeyDown={(e) => {
          if (
            !visible &&
            e.key.length === 1 &&
            !e.metaKey &&
            !e.ctrlKey &&
            !e.altKey
          ) {
            trackType(e.key)
            return
          }

          if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
            e.preventDefault()

            if (!visible) {
              e.stopPropagation()
              open()
            }
          }
        }}
        style={{
          extend: {
            condition: !!props.renderValue,
            style: {
              paddingBlock: 8,
              height: 'auto',
            },
          },
        }}>
        {props.renderValue && activeOptions.length > 0
          ? props.multiple
            ? props.renderValue(activeOptions)
            : props.renderValue(activeOptions?.[0])
          : activeOptions.map((option) => option.label).join(', ')}
      </InputButton>
      <Popover
        aria-labelledby={ariaLabelledby}
        offsetY={5}
        visible={visible}
        anchor={ref}
        align={align}
        onClose={close}>
        <Box
          padding={1}
          shrink={1}
          style={{ overflow: searchable ? 'hidden' : 'auto' }}>
          {searchable && (
            <Box padding={2}>
              <TextInput
                ref={searchRef}
                label="Search"
                labelVisible={false}
                autoFocus
                name="search"
                variant="inline"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)

                  // TODO: reset selection
                }}
              />
            </Box>
          )}

          <Box role="listbox" shrink={1} style={{ overflow: 'auto' }}>
            {filteredOptions.map((option, index) => {
              const isSelected =
                visualSelected === index ||
                (visualSelected === null &&
                  activeOptions.length === 1 &&
                  activeOptions[0].value === option.value)

              return (
                <Box
                  role="option"
                  tabIndex={-1}
                  key={option.label}
                  aria-selected={isSelected}
                  onMouseOver={() => setSelected(index)}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.preventDefault()
                    select(option)

                    if (!props.multiple) {
                      close()
                    }
                  }}>
                  <Box
                    justifyContent="center"
                    paddingInline={2}
                    minHeight={
                      renderOption
                        ? variant === 'inline' || variant === 'function'
                          ? 36
                          : 40
                        : undefined
                    }
                    height={
                      renderOption
                        ? 'auto'
                        : variant === 'inline' || variant === 'function'
                          ? 36
                          : 40
                    }
                    style={{
                      borderRadius: 4,
                      extend: {
                        condition: isSelected,
                        style: {
                          backgroundColor: theme.colors.border,
                        },
                      },
                    }}>
                    <Box
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={3}>
                      <span>
                        {renderOption
                          ? renderOption(option, isSelected)
                          : option.label}
                      </span>
                      {activeOptions.find(
                        (item) => item.value === option.value
                      ) ? (
                        <Check size={20} />
                      ) : (
                        <div style={{ width: 20 }} />
                      )}
                    </Box>
                  </Box>
                </Box>
              )
            })}
            {onCreateItem && searchable && search.trim().length > 0 && (
              <Box paddingTop={1}>
                <ActionButton
                  variant="function"
                  size="small"
                  stretch
                  action={() => onCreateItem(search.trim() as T)}>
                  Create {search}
                </ActionButton>
              </Box>
            )}
          </Box>
        </Box>
      </Popover>
    </>
  )
}

type InputFieldProps = Omit<
  ComponentProps<typeof InputField>,
  'children' | 'value' | 'onChange' | 'multiple' | 'ref'
>

export default function Picker<T>(props: InputFieldProps & Props<T>) {
  const { value, onChange, multiple, ...inputFieldProps } = props

  return (
    <InputField {...inputFieldProps} synthetic>
      {({ multiple, ...inputProps }) => (
        <SelectInput<T> {...inputProps} {...props} />
      )}
    </InputField>
  )
}
