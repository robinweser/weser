import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import z from 'zod'

import useField from '../useField'

describe('useField', () => {
  const stringSchema = z.string().min(1)
  const emailSchema = z.string().email()

  test('initializes with default values', () => {
    const { result } = renderHook(() => useField(stringSchema))

    expect(result.current.value).toBe('')
    expect(result.current.touched).toBe(false)
    expect(result.current.dirty).toBe(false)
    expect(result.current.disabled).toBe(false)
  })

  test('initializes with provided value', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { value: 'initial' })
    )

    expect(result.current.value).toBe('initial')
  })

  test('update changes the value', () => {
    const { result } = renderHook(() => useField(stringSchema))

    act(() => {
      result.current.update({ value: 'new value' })
    })

    expect(result.current.value).toBe('new value')
  })

  test('tracks dirty state', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { value: 'initial' })
    )

    expect(result.current.dirty).toBe(false)

    act(() => {
      result.current.update({ value: 'changed' })
    })

    expect(result.current.dirty).toBe(true)
  })

  test('validates against schema', () => {
    const { result } = renderHook(() =>
      useField(emailSchema, { value: 'invalid', touched: true })
    )

    expect(result.current.valid).toBe(false)
    expect(result.current.errorMessage).toBeDefined()
  })

  test('shows valid for valid input', () => {
    const { result } = renderHook(() =>
      useField(emailSchema, { value: 'test@example.com', touched: true })
    )

    expect(result.current.valid).toBe(true)
    expect(result.current.errorMessage).toBeUndefined()
  })

  test('reset returns to initial state', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { value: 'initial' })
    )

    act(() => {
      result.current.update({ value: 'changed' })
    })

    expect(result.current.value).toBe('changed')

    act(() => {
      result.current.reset()
    })

    expect(result.current.value).toBe('initial')
    expect(result.current.dirty).toBe(false)
  })

  test('provides inputProps for form binding', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { name: 'test-field' })
    )

    expect(result.current.inputProps).toHaveProperty('value')
    expect(result.current.inputProps).toHaveProperty('onChange')
    expect(result.current.inputProps).toHaveProperty('name', 'test-field')
    expect(result.current.inputProps).toHaveProperty('disabled', false)
  })

  test('provides props with validation info', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { name: 'test' })
    )

    expect(result.current.props).toHaveProperty('valid')
    expect(result.current.props).toHaveProperty('errorMessage')
  })

  test('validate returns safeParse result', () => {
    const { result } = renderHook(() =>
      useField(emailSchema, { value: 'invalid' })
    )

    const validation = result.current.validate()
    expect(validation.success).toBe(false)
    expect(validation.error).toBeDefined()
  })

  test('validate returns success for valid input', () => {
    const { result } = renderHook(() =>
      useField(emailSchema, { value: 'test@example.com' })
    )

    const validation = result.current.validate()
    expect(validation.success).toBe(true)
  })

  test('showValidationOn change marks touched on value change', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { showValidationOn: 'change' })
    )

    expect(result.current.touched).toBe(false)

    act(() => {
      result.current.update({ value: 'changed' })
    })

    expect(result.current.touched).toBe(true)
  })

  test('showValidationOn submit does not mark touched on value change', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { showValidationOn: 'submit' })
    )

    expect(result.current.touched).toBe(false)

    act(() => {
      result.current.update({ value: 'changed' })
    })

    expect(result.current.touched).toBe(false)
  })

  test('showValidationOn blur provides onFocus and onBlur in inputProps', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { showValidationOn: 'blur' })
    )

    expect(result.current.inputProps).toHaveProperty('onFocus')
    expect(result.current.inputProps).toHaveProperty('onBlur')
  })

  test('formatErrorMessage customizes error message', () => {
    const customFormat = (error: any, value: any, name?: string) =>
      `Custom error for ${name}: ${error.code}`

    const { result } = renderHook(() =>
      useField(emailSchema, {
        name: 'email',
        value: 'invalid',
        touched: true,
        formatErrorMessage: customFormat,
      })
    )

    expect(result.current.errorMessage).toContain('Custom error for email')
  })

  test('formatValue transforms value for display', () => {
    const formatValue = (value: string) => value.toUpperCase()

    const { result } = renderHook(() =>
      useField(stringSchema, {
        value: 'hello',
        formatValue,
      })
    )

    expect(result.current.inputProps.value).toBe('HELLO')
  })

  test('parseEvent extracts value from custom event', () => {
    const parseEvent = (e: { checked: boolean }) => (e.checked ? 'yes' : 'no')

    const { result } = renderHook(() =>
      useField<string, { checked: boolean }>(stringSchema, {
        value: 'no',
        parseEvent,
      })
    )

    act(() => {
      result.current.inputProps.onChange({ checked: true })
    })

    expect(result.current.value).toBe('yes')
  })

  test('disabled state is reflected in inputProps', () => {
    const { result } = renderHook(() =>
      useField(stringSchema, { disabled: true })
    )

    expect(result.current.inputProps.disabled).toBe(true)
    expect(result.current.disabled).toBe(true)
  })

  // Tests based on docs examples for generic types
  describe('Generic Types (from docs)', () => {
    test('handles boolean values for checkbox (docs example)', () => {
      const booleanSchema = z.boolean()
      type CheckboxEvent = { target: { checked: boolean } }

      const { result } = renderHook(() =>
        useField<boolean, CheckboxEvent>(booleanSchema, {
          parseEvent: (e) => e.target.checked,
          value: false,
        })
      )

      expect(result.current.value).toBe(false)

      act(() => {
        result.current.inputProps.onChange({ target: { checked: true } })
      })

      expect(result.current.value).toBe(true)
    })

    test('validates boolean field correctly', () => {
      // Require true (like terms acceptance)
      const acceptTermsSchema = z.literal(true)
      type CheckboxEvent = { target: { checked: boolean } }

      const { result } = renderHook(() =>
        useField<boolean, CheckboxEvent>(acceptTermsSchema, {
          parseEvent: (e) => e.target.checked,
          value: false,
          touched: true,
        })
      )

      expect(result.current.valid).toBe(false)

      act(() => {
        result.current.inputProps.onChange({ target: { checked: true } })
      })

      expect(result.current.valid).toBe(true)
    })

    test('handles array values (docs example)', () => {
      const tagsSchema = z.array(z.string())
      type ArrayChangeEvent = Array<string>

      const { result } = renderHook(() =>
        useField<Array<string>, ArrayChangeEvent>(tagsSchema, {
          parseEvent: (value) => value,
          value: [],
        })
      )

      expect(result.current.value).toEqual([])

      act(() => {
        result.current.inputProps.onChange(['tag1', 'tag2'])
      })

      expect(result.current.value).toEqual(['tag1', 'tag2'])
    })

    test('validates array with minimum items', () => {
      const tagsSchema = z.array(z.string()).min(1, 'At least one tag required')
      type ArrayChangeEvent = Array<string>

      const { result } = renderHook(() =>
        useField<Array<string>, ArrayChangeEvent>(tagsSchema, {
          parseEvent: (value) => value,
          value: [],
          touched: true,
        })
      )

      expect(result.current.valid).toBe(false)
      expect(result.current.errorMessage).toBeDefined()

      act(() => {
        result.current.inputProps.onChange(['tag1'])
      })

      expect(result.current.valid).toBe(true)
      expect(result.current.errorMessage).toBeUndefined()
    })

    test('number type with custom parsing', () => {
      const numberSchema = z.number().min(0).max(100)
      type NumberEvent = { target: { value: string } }

      const { result } = renderHook(() =>
        useField<number, NumberEvent>(numberSchema, {
          parseEvent: (e) => parseInt(e.target.value) || 0,
          value: 50,
        })
      )

      expect(result.current.value).toBe(50)

      act(() => {
        result.current.inputProps.onChange({ target: { value: '75' } })
      })

      expect(result.current.value).toBe(75)
    })
  })
})
