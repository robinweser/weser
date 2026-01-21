import React from 'react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen, renderHook, cleanup } from '@testing-library/react'
import z from 'zod'

import createForm from '../createForm'

afterEach(() => {
  cleanup()
})

describe('createForm', () => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  })

  test('returns useForm, useFormContext, FormProvider, and Field', () => {
    const form = createForm(schema)

    expect(form.useForm).toBeDefined()
    expect(typeof form.useForm).toBe('function')
    expect(form.useFormContext).toBeDefined()
    expect(typeof form.useFormContext).toBe('function')
    expect(form.FormProvider).toBeDefined()
    expect(typeof form.FormProvider).toBe('function')
    expect(form.Field).toBeDefined()
    expect(typeof form.Field).toBe('function')
  })

  test('useForm returns form handlers', () => {
    const { useForm } = createForm(schema)

    const { result } = renderHook(() => useForm())

    expect(result.current.useFormField).toBeDefined()
    expect(result.current.handleSubmit).toBeDefined()
    expect(result.current.reset).toBeDefined()
    expect(result.current.checkDirty).toBeDefined()
  })

  test('FormProvider and useFormContext work together', () => {
    const { useForm, useFormContext, FormProvider } = createForm(schema)

    function FormContent() {
      const form = useFormContext()
      return (
        <div data-testid="form-available">
          {form ? 'Form Available' : 'No Form'}
        </div>
      )
    }

    function TestForm() {
      const form = useForm()
      return (
        <FormProvider value={form}>
          <FormContent />
        </FormProvider>
      )
    }

    render(<TestForm />)

    expect(screen.getByTestId('form-available').textContent).toBe(
      'Form Available'
    )
  })

  test('Field component renders with field data', () => {
    const { useForm, FormProvider, Field } = createForm(schema)

    function TestForm() {
      const form = useForm()
      return (
        <FormProvider value={form}>
          <Field name="name">
            {(field) => (
              <input
                data-testid="name-input"
                {...field.inputProps}
                placeholder="Name"
              />
            )}
          </Field>
        </FormProvider>
      )
    }

    render(<TestForm />)

    const input = screen.getByTestId('name-input')
    expect(input).toBeDefined()
    expect(input.getAttribute('name')).toBe('name')
  })

  test('Field component provides field state', () => {
    const { useForm, FormProvider, Field } = createForm(schema)

    function TestForm() {
      const form = useForm()
      return (
        <FormProvider value={form}>
          <Field name="email" value="test@example.com">
            {(field) => (
              <div>
                <input data-testid="email-input" {...field.inputProps} />
                <span data-testid="email-valid">{String(field.valid)}</span>
              </div>
            )}
          </Field>
        </FormProvider>
      )
    }

    render(<TestForm />)

    expect(screen.getByTestId('email-valid').textContent).toBe('true')
  })

  test('Field component shows error for invalid value', () => {
    const { useForm, FormProvider, Field } = createForm(schema)

    function TestForm() {
      const form = useForm()
      return (
        <FormProvider value={form}>
          <Field name="email" value="invalid-email" touched>
            {(field) => (
              <div>
                <input data-testid="email-input" {...field.inputProps} />
                <span data-testid="email-error">{field.errorMessage || ''}</span>
              </div>
            )}
          </Field>
        </FormProvider>
      )
    }

    render(<TestForm />)

    expect(screen.getByTestId('email-error').textContent).toBeTruthy()
  })

  test('useFormContext throws when used outside FormProvider', () => {
    const { useFormContext } = createForm(schema)

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useFormContext())
    }).toThrow()

    consoleSpy.mockRestore()
  })

  test('Field passes additional options to useField', () => {
    const { useForm, FormProvider, Field } = createForm(schema)

    function TestForm() {
      const form = useForm()
      return (
        <FormProvider value={form}>
          <Field name="name" disabled>
            {(field) => (
              <input
                data-testid="name-input"
                {...field.inputProps}
                data-disabled={String(field.disabled)}
              />
            )}
          </Field>
        </FormProvider>
      )
    }

    render(<TestForm />)

    expect(
      screen.getByTestId('name-input').getAttribute('data-disabled')
    ).toBe('true')
  })

  test('multiple Fields work correctly', () => {
    const { useForm, FormProvider, Field } = createForm(schema)

    function TestForm() {
      const form = useForm()
      return (
        <FormProvider value={form}>
          <Field name="name" value="John">
            {(field) => (
              <input data-testid="name-input" {...field.inputProps} />
            )}
          </Field>
          <Field name="email" value="john@example.com">
            {(field) => (
              <input data-testid="email-input" {...field.inputProps} />
            )}
          </Field>
        </FormProvider>
      )
    }

    render(<TestForm />)

    expect(
      (screen.getByTestId('name-input') as HTMLInputElement).value
    ).toBe('John')
    expect(
      (screen.getByTestId('email-input') as HTMLInputElement).value
    ).toBe('john@example.com')
  })
})

