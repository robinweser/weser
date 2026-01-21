import { describe, test, expect } from 'vitest'

import createVariableReference from '../createVariableReference'

describe('createVariableReference', () => {
  test('creates var() reference without fallback', () => {
    const [variable, reference] = createVariableReference('color')

    expect(variable).toBe('--color')
    expect(reference).toBe('var(--color)')
  })

  test('creates var() reference with fallback', () => {
    const [variable, reference] = createVariableReference('color', 'red')

    expect(variable).toBe('--color')
    expect(reference).toBe('var(--color, red)')
  })

  test('handles hyphenated names', () => {
    const [variable, reference] = createVariableReference('primary-color', 'blue')

    expect(variable).toBe('--primary-color')
    expect(reference).toBe('var(--primary-color, blue)')
  })

  test('handles complex fallback values', () => {
    const [variable, reference] = createVariableReference(
      'shadow',
      '0 2px 4px rgba(0,0,0,0.2)'
    )

    expect(variable).toBe('--shadow')
    expect(reference).toBe('var(--shadow, 0 2px 4px rgba(0,0,0,0.2))')
  })

  test('returns tuple of two strings', () => {
    const result = createVariableReference('test')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(typeof result[0]).toBe('string')
    expect(typeof result[1]).toBe('string')
  })
})

