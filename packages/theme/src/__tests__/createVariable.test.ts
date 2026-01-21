import { describe, test, expect } from 'vitest'

import createVariable from '../createVariable'

describe('createVariable', () => {
  test('creates CSS variable reference and declaration', () => {
    const [reference, declaration] = createVariable('color', 'red')

    expect(reference).toBe('var(--color)')
    expect(declaration).toBe('--color:red')
  })

  test('handles hyphenated names', () => {
    const [reference, declaration] = createVariable('primary-color', 'blue')

    expect(reference).toBe('var(--primary-color)')
    expect(declaration).toBe('--primary-color:blue')
  })

  test('handles complex values', () => {
    const [reference, declaration] = createVariable('shadow', '0 2px 4px rgba(0,0,0,0.2)')

    expect(reference).toBe('var(--shadow)')
    expect(declaration).toBe('--shadow:0 2px 4px rgba(0,0,0,0.2)')
  })

  test('handles numeric values as strings', () => {
    const [reference, declaration] = createVariable('spacing', '16px')

    expect(reference).toBe('var(--spacing)')
    expect(declaration).toBe('--spacing:16px')
  })

  test('returns tuple of two strings', () => {
    const result = createVariable('test', 'value')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(typeof result[0]).toBe('string')
    expect(typeof result[1]).toBe('string')
  })
})

