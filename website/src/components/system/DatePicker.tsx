'use client'
import {
  ComponentProps,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { addDays, isSameDay, isToday } from 'date-fns'
import { format as formatDate } from 'small-date'

import InputButton from './InputButton'
import Popover from './Popover'
import theme, { colors } from '@/utils/theme'
import IconButton from './IconButton'
import { Nullable } from '@/types/utils'
import ActionButton from './ActionButton'
import InputField from './InputField'
import mergeRefs from '@/utils/mergeRefs'
import { useKeyDown, useTrigger } from '@weser/hooks'
import { Box, Click, Grid, Text } from './core'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { alpha } from '@weser/theming'
import { T_InputContainerProps, T_InputProps } from './InputContainer'

export type DateChangeEvent = {
  target: {
    value: Nullable<Date>
  }
}

type InputButtonProps = ComponentProps<typeof InputButton>
type PopoverProps = ComponentProps<typeof Popover>
type Props = {
  ref?: Ref<HTMLButtonElement>
  value: Nullable<Date>
  anchorDate?: Date
  onChange: (e: DateChangeEvent) => void
  format?: string | ((value: Date) => ReactNode)
  'aria-labelledby'?: string
  clearable?: boolean
} & T_InputProps &
  Pick<T_InputContainerProps, 'prefix'> &
  Pick<PopoverProps, 'align'> &
  Pick<InputButtonProps, 'empty' | 'placeholder' | 'tabIndex'>

function DateInput({
  ref,
  variant = 'default',
  value,
  anchorDate = new Date(),
  onChange,
  format = 'dd-MM-yyyy',
  align = 'start',
  placeholder,
  'aria-labelledby': ariaLabelledby,
  tabIndex,
  clearable = true,
  ...props
}: Props) {
  const [anchor, setAnchor] = useState(value || anchorDate)
  const [isVisible, setVisible, triggerRef] = useTrigger()

  const year = anchor.getFullYear()
  const month = anchor.getMonth()

  const options = useMemo(
    () => (isVisible ? getDates(year, month, value) : []),
    [value, anchor, isVisible]
  )

  const hasValue = options.some((option) => option.selected)

  useEffect(() => {
    setAnchor(value || anchorDate)
  }, [value, isVisible])

  useKeyDown(
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    (e) => {
      e.preventDefault()

      if (
        document.activeElement &&
        document.activeElement.getAttribute('data-id') === 'date-picker-day'
      ) {
        const date = new Date(document.activeElement.id)

        const days = {
          ArrowLeft: -1,
          ArrowRight: 1,
          ArrowUp: -7,
          ArrowDown: 7,
        }

        const newDate = addDays(date, days[e.key as keyof typeof days])

        const selected = document.getElementById(
          formatDate(newDate, 'yyyy-MM-dd')
        )

        if (selected) {
          selected.focus()
        }
      } else {
        if (value) {
          const selected = document.getElementById(
            formatDate(value, 'yyyy-MM-dd')
          )

          if (selected) {
            selected.focus()
          }
        } else {
          const anchorElement = document.getElementById(
            formatDate(anchor, 'yyyy-MM-dd')
          )
          if (anchorElement) {
            anchorElement.focus()
          }
        }
      }
    },
    {
      active: isVisible,
    }
  )

  const label =
    value &&
    (typeof format === 'function'
      ? format(value)
      : formatDate(value, format, { locale: 'en-US' }))

  return (
    <>
      <InputButton
        {...props}
        tabIndex={tabIndex}
        placeholder={placeholder}
        empty={!value}
        variant={variant}
        ref={mergeRefs(triggerRef, ref)}
        aria-expanded={isVisible}
        aria-haspopup="dialog"
        aria-labelledby={ariaLabelledby}
        icon={Calendar}
        action={() => setVisible(true)}>
        {label}
      </InputButton>
      <Popover
        offsetY={4}
        align={align}
        anchor={triggerRef}
        visible={isVisible}
        onClose={() => setVisible(false)}>
        <Box padding={3} gap={4} style={{ color: 'black' }}>
          <Box
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            gap={2}>
            <IconButton
              label="Previous month"
              icon={ChevronLeft}
              variant="function"
              intent="neutral"
              size="small"
              action={() => setAnchor(new Date(year, month - 1, 1))}
            />

            <Box grow={1} alignItems="center">
              <Text>{formatDate(anchor, 'MMMM yyyy')}</Text>
            </Box>
            <IconButton
              label="Next month"
              icon={ChevronRight}
              variant="function"
              intent="neutral"
              size="small"
              action={() => setAnchor(new Date(year, month + 1, 1))}
            />
          </Box>
          <Grid columns="repeat(7, 1fr)" gap={0.5}>
            {/* TODO: extract component */}
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <Box key={day} alignItems="center" paddingBottom={2}>
                <Text variant="note" color={colors.gray700}>
                  {day}
                </Text>
              </Box>
            ))}
            {/* TODO: extract component */}
            {options.map(
              ({ id, selected, first, value, month, today, day }) => (
                <Click
                  key={id}
                  id={id}
                  data-id="date-picker-day"
                  data-autofocus={selected}
                  tabIndex={hasValue ? (selected ? 0 : -1) : first ? 0 : -1}
                  style={{
                    width: 40,
                    height: 40,

                    fontSize: 16,
                    borderRadius: 4,
                    textAlign: 'center',
                    ':hover': {
                      backgroundColor: alpha(theme.colors.primary, 0.05),
                    },
                    ':focus-visible': { ...theme.focusRing, zIndex: 10 },
                    extend: [
                      {
                        condition: !month,
                        style: {
                          color: colors.gray500,
                        },
                      },
                      {
                        condition: today,
                        style: {
                          backgroundColor: colors.gray100,
                        },
                      },
                      {
                        condition: selected,
                        style: {
                          backgroundColor: theme.colors.primary,
                          color: 'white',
                          ':hover': {
                            backgroundColor: theme.colors.primary,
                          },
                        },
                      },
                    ],
                  }}
                  action={(e) => {
                    e.preventDefault()

                    onChange({ target: { value } })
                    setVisible(false)
                    setAnchor(value)
                  }}>
                  {day}
                </Click>
              )
            )}
          </Grid>
          {value && clearable && (
            <ActionButton
              variant="control"
              action={(e) => {
                e.preventDefault()

                onChange({ target: { value: null } })
                setAnchor(new Date())
                setVisible(false)
              }}>
              Clear
            </ActionButton>
          )}
        </Box>
      </Popover>
    </>
  )
}

type InputFieldProps = Omit<
  ComponentProps<typeof InputField>,
  'onChange' | 'value' | 'children' | 'placeholder' | 'ref'
>
export default function DatePicker({
  ref,
  onChange,
  value,
  placeholder,
  ...props
}: InputFieldProps & Props) {
  return (
    <InputField {...props} synthetic>
      {(inputProps, containerProps) => (
        <DateInput
          {...inputProps}
          {...containerProps}
          ref={ref}
          onChange={onChange}
          value={value}
        />
      )}
    </InputField>
  )
}

type DateOptions = {
  id: string
  value: Date
  first: boolean
  month: boolean
  today: boolean
  selected: boolean
  day: number
}

function getDates(
  year: number,
  month: number,
  value: Nullable<Date>
): Array<DateOptions> {
  const dates = []
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const totalDays = lastDayOfMonth.getDate()
  const firstWeekday = firstDayOfMonth.getDay()
  const lastWeekday = lastDayOfMonth.getDay()

  for (let i = 0; i < firstWeekday; ++i) {
    const date = new Date(year, month, i - firstWeekday + 1)

    dates.push({
      id: formatDate(date, 'yyyy-MM-dd'),
      value: date,
      today: isToday(date),
      month: false,
      selected: false,
      first: false,
      day: date.getDate(),
    })
  }

  for (let i = 1; i <= totalDays; ++i) {
    const date = new Date(year, month, i)
    dates.push({
      id: formatDate(date, 'yyyy-MM-dd'),
      value: date,
      today: isToday(date),
      month: true,
      selected: value ? isSameDay(date, value) : false,
      first: i === 1,
      day: date.getDate(),
    })
  }

  const limit = lastWeekday === 6 ? 7 : 6 - lastWeekday
  for (let i = 0; i < limit; ++i) {
    const date = new Date(year, month, totalDays + i + 1)

    dates.push({
      id: formatDate(date, 'yyyy-MM-dd'),
      value: date,
      today: isToday(date),
      month: false,
      selected: false,
      first: false,
      day: date.getDate(),
    })
  }

  return dates
}
