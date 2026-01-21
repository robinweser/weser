import { describe, test, expect } from 'vitest'

import createTheme from '../createTheme'

describe('createTheme', () => {
  test('transforms tokens to CSS variables', () => {
    const tokens = { color: 'red', spacing: '16px' }
    const [theme, css] = createTheme(tokens)

    expect(theme.color).toBe('var(--color)')
    expect(theme.spacing).toBe('var(--spacing)')
  })

  test('generates CSS string with declarations', () => {
    const tokens = { color: 'red' }
    const [, css] = createTheme(tokens)

    expect(css).toContain(':root')
    expect(css).toContain('--color:red')
  })

  test('uses default :root selector', () => {
    const tokens = { color: 'red' }
    const [, css] = createTheme(tokens)

    expect(css.startsWith(':root{')).toBe(true)
  })

  test('uses custom selector', () => {
    const tokens = { color: 'red' }
    const [, css] = createTheme(tokens, { selector: '.dark' })

    expect(css.startsWith('.dark{')).toBe(true)
  })

  test('handles nested tokens', () => {
    const tokens = {
      colors: {
        primary: 'blue',
        secondary: 'green',
      },
    }
    const [theme, css] = createTheme(tokens)

    expect(theme.colors.primary).toBe('var(--colors-primary)')
    expect(theme.colors.secondary).toBe('var(--colors-secondary)')
    expect(css).toContain('--colors-primary:blue')
    expect(css).toContain('--colors-secondary:green')
  })

  test('handles deeply nested tokens', () => {
    const tokens = {
      theme: {
        colors: {
          brand: {
            primary: 'blue',
          },
        },
      },
    }
    const [theme, css] = createTheme(tokens)

    expect(theme.theme.colors.brand.primary).toBe(
      'var(--theme-colors-brand-primary)'
    )
    expect(css).toContain('--theme-colors-brand-primary:blue')
  })

  test('respects shouldTransformValue config', () => {
    const tokens = {
      colors: { primary: 'blue' },
      spacing: { small: '4px' },
    }
    const [theme, css] = createTheme(tokens, {
      shouldTransformValue: (path) => path === 'colors',
    })

    expect(theme.colors.primary).toBe('var(--colors-primary)')
    expect(theme.spacing.small).toBe('4px') // not transformed
    expect(css).toContain('--colors-primary:blue')
    expect(css).not.toContain('--spacing-small')
  })

  test('returns tuple of theme and CSS', () => {
    const tokens = { color: 'red' }
    const result = createTheme(tokens)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(typeof result[0]).toBe('object')
    expect(typeof result[1]).toBe('string')
  })

  // Test based on docs example
  test('handles color palette from docs example', () => {
    const tokens = {
      colors: {
        brand50: 'hsl(255, 100%, 97%)',
        brand100: 'hsl(255, 90%, 92%)',
        brand200: 'hsl(255, 85%, 85%)',
        brand300: 'hsl(255, 80%, 75%)',
        brand400: 'hsl(255, 75%, 65%)',
        brand500: 'hsl(255, 70%, 55%)',
        brand600: 'hsl(255, 65%, 45%)',
        brand700: 'hsl(255, 60%, 35%)',
        brand800: 'hsl(255, 55%, 25%)',
        brand900: 'hsl(255, 50%, 15%)',
        brand950: 'hsl(255, 45%, 8%)',
      },
    }

    const [theme, css] = createTheme(tokens)

    // As shown in docs: theme.colors.brand500 => 'var(--colors-brand500)'
    expect(theme.colors.brand500).toBe('var(--colors-brand500)')
    expect(theme.colors.brand50).toBe('var(--colors-brand50)')
    expect(theme.colors.brand950).toBe('var(--colors-brand950)')

    // CSS should contain all declarations
    expect(css).toContain('--colors-brand500:hsl(255, 70%, 55%)')
    expect(css).toContain('--colors-brand50:hsl(255, 100%, 97%)')
  })

  test('config example from docs with custom selector and shouldTransformValue', () => {
    const tokens = {
      colors: { primary: 'blue' },
      spacing: { small: '4px', medium: '8px' },
      other: { value: 'test' },
    }

    const [theme, css] = createTheme(tokens, {
      selector: '.light-theme',
      shouldTransformValue: (path) => path.startsWith('colors'),
    })

    // Only colors should be transformed
    expect(theme.colors.primary).toBe('var(--colors-primary)')
    expect(theme.spacing.small).toBe('4px') // not transformed
    expect(theme.other.value).toBe('test') // not transformed

    // CSS should use custom selector
    expect(css.startsWith('.light-theme{')).toBe(true)
  })
})

