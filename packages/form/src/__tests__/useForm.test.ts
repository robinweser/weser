import { describe, test, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import z from 'zod'

import useForm from '../useForm'

describe('useForm', () => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  })

  test('provides useFormField hook', () => {
    const { result } = renderHook(() => useForm(schema))

    expect(result.current.useFormField).toBeDefined()
    expect(typeof result.current.useFormField).toBe('function')
  })

  test('provides handleSubmit function', () => {
    const { result } = renderHook(() => useForm(schema))

    expect(result.current.handleSubmit).toBeDefined()
    expect(typeof result.current.handleSubmit).toBe('function')
  })

  test('provides reset function', () => {
    const { result } = renderHook(() => useForm(schema))

    expect(result.current.reset).toBeDefined()
    expect(typeof result.current.reset).toBe('function')
  })

  test('provides checkDirty function', () => {
    const { result } = renderHook(() => useForm(schema))

    expect(result.current.checkDirty).toBeDefined()
    expect(typeof result.current.checkDirty).toBe('function')
  })

  test('isValidating is initially false', () => {
    const { result } = renderHook(() => useForm(schema))

    expect(result.current.isValidating).toBe(false)
  })

  test('useFormField creates a field with schema validation', () => {
    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      const emailField = form.useFormField('email')
      return { form, nameField, emailField }
    })

    expect(result.current.nameField.value).toBe('')
    expect(result.current.emailField.value).toBe('')
  })

  test('useFormField updates work correctly', () => {
    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      return { form, nameField }
    })

    act(() => {
      result.current.nameField.update({ value: 'John' })
    })

    expect(result.current.nameField.value).toBe('John')
  })

  test('checkDirty returns false when no fields are modified', () => {
    const { result } = renderHook(() => {
      const form = useForm(schema)
      form.useFormField('name')
      form.useFormField('email')
      return form
    })

    expect(result.current.checkDirty()).toBe(false)
  })

  test('checkDirty returns true when a field is modified', () => {
    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      return { form, nameField }
    })

    act(() => {
      result.current.nameField.update({ value: 'Modified' })
    })

    expect(result.current.form.checkDirty()).toBe(true)
  })

  test('reset resets all fields to initial state', () => {
    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      const emailField = form.useFormField('email')
      return { form, nameField, emailField }
    })

    act(() => {
      result.current.nameField.update({ value: 'John' })
      result.current.emailField.update({ value: 'john@example.com' })
    })

    expect(result.current.nameField.value).toBe('John')
    expect(result.current.emailField.value).toBe('john@example.com')

    act(() => {
      result.current.form.reset()
    })

    expect(result.current.nameField.value).toBe('')
    expect(result.current.emailField.value).toBe('')
  })

  test('handleSubmit calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn()
    const onError = vi.fn()

    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      const emailField = form.useFormField('email')
      return { form, nameField, emailField }
    })

    act(() => {
      result.current.nameField.update({ value: 'John' })
      result.current.emailField.update({ value: 'john@example.com' })
    })

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as any

    await act(async () => {
      await result.current.form.handleSubmit(onSubmit, onError)(mockEvent)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    })
    expect(onError).not.toHaveBeenCalled()
  })

  test('handleSubmit calls onError with invalid data', async () => {
    const onSubmit = vi.fn()
    const onError = vi.fn()

    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      const emailField = form.useFormField('email')
      return { form, nameField, emailField }
    })

    // Leave fields empty (invalid)

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as any

    await act(async () => {
      await result.current.form.handleSubmit(onSubmit, onError)(mockEvent)
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalled()
  })

  test('handleSubmit touches all fields on submit', async () => {
    const { result } = renderHook(() => {
      const form = useForm(schema)
      const nameField = form.useFormField('name')
      const emailField = form.useFormField('email')
      return { form, nameField, emailField }
    })

    expect(result.current.nameField.touched).toBe(false)
    expect(result.current.emailField.touched).toBe(false)

    const mockEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as any

    await act(async () => {
      await result.current.form.handleSubmit(vi.fn(), vi.fn())(mockEvent)
    })

    expect(result.current.nameField.touched).toBe(true)
    expect(result.current.emailField.touched).toBe(true)
  })

  test('formatErrorMessage config customizes error messages', () => {
    const customFormat = () => 'Custom error'

    const { result } = renderHook(() => {
      const form = useForm(schema, { formatErrorMessage: customFormat })
      const nameField = form.useFormField('name', { touched: true })
      return { form, nameField }
    })

    // Name is empty, so should be invalid
    expect(result.current.nameField.errorMessage).toBe('Custom error')
  })
})
