import { describe, test, expect } from 'vitest'

import sortConditionPlugin, { sortMobileFirst } from '../sortCondition'

describe('sortConditionPlugin', () => {
  test('sorts conditions using provided sort function', () => {
    const plugin = sortConditionPlugin((a, b) => a.localeCompare(b))

    const style = {
      color: 'red',
      '@media (min-width: 800px)': { color: 'blue' },
      '@media (min-width: 400px)': { color: 'green' },
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    // Primitive properties should come first
    expect(keys[0]).toBe('color')
  })

  test('primitive properties come before nested', () => {
    const plugin = sortConditionPlugin(sortMobileFirst)

    const style = {
      '@media (min-width: 800px)': { color: 'blue' },
      color: 'red',
      fontSize: 16,
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys[0]).toBe('color')
    expect(keys[1]).toBe('fontSize')
  })

  test('recursively sorts nested conditions', () => {
    const plugin = sortConditionPlugin(sortMobileFirst)

    const style = {
      '@media (min-width: 800px)': {
        '@media (min-width: 400px)': { color: 'green' },
        color: 'blue',
      },
    }

    const result = plugin(style as any)
    const nestedKeys = Object.keys(result['@media (min-width: 800px)'])

    expect(nestedKeys[0]).toBe('color')
  })
})

describe('sortMobileFirst', () => {
  test('other selectors come before pseudo selectors', () => {
    const result = sortMobileFirst('[data-active]', ':hover')

    expect(result).toBeLessThan(0)
  })

  test('pseudo selectors come before media queries', () => {
    const result = sortMobileFirst(':hover', '@media (min-width: 800px)')

    expect(result).toBeLessThan(0)
  })

  test('media queries come before supports queries', () => {
    const result = sortMobileFirst(
      '@media (min-width: 800px)',
      '@supports (display: grid)'
    )

    expect(result).toBeLessThan(0)
  })

  test('pseudo selectors follow LVFHA order', () => {
    expect(sortMobileFirst(':link', ':visited')).toBeLessThan(0)
    expect(sortMobileFirst(':visited', ':focus')).toBeLessThan(0)
    expect(sortMobileFirst(':focus', ':hover')).toBeLessThan(0)
    expect(sortMobileFirst(':hover', ':active')).toBeLessThan(0)
  })

  test('media queries are sorted by min-width', () => {
    const result = sortMobileFirst(
      '@media (min-width: 400px)',
      '@media (min-width: 800px)'
    )

    expect(result).toBeLessThan(0)
  })
})

