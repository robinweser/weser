import { describe, test, expect } from 'vitest'

import createThemes from '../createThemes'

describe('createThemes', () => {
  test('creates multiple themes', () => {
    const themes = {
      light: { color: 'black', bg: 'white' },
      dark: { color: 'white', bg: 'black' },
    }
    const [theme, css] = createThemes(themes)

    expect(css).toContain('.light{')
    expect(css).toContain('.dark{')
  })

  test('uses class selectors by default', () => {
    const themes = {
      primary: { color: 'blue' },
    }
    const [, css] = createThemes(themes)

    expect(css.startsWith('.primary{')).toBe(true)
  })

  test('uses custom getSelector function', () => {
    const themes = {
      light: { color: 'black' },
      dark: { color: 'white' },
    }
    const [, css] = createThemes(themes, {
      getSelector: (name) => `[data-theme="${name}"]`,
    })

    expect(css).toContain('[data-theme="light"]')
    expect(css).toContain('[data-theme="dark"]')
  })

  test('transforms all theme tokens', () => {
    const themes = {
      theme1: { primary: 'blue' },
      theme2: { primary: 'green' },
    }
    const [theme, css] = createThemes(themes)

    expect(theme.primary).toBe('var(--primary)')
    expect(css).toContain('--primary:blue')
    expect(css).toContain('--primary:green')
  })

  test('respects shouldTransformValue config', () => {
    const themes = {
      main: {
        colors: { primary: 'blue' },
        spacing: { small: '4px' },
      },
    }
    const [theme, css] = createThemes(themes, {
      shouldTransformValue: (path) => path === 'colors',
    })

    expect(theme.colors.primary).toBe('var(--colors-primary)')
    expect(theme.spacing.small).toBe('4px')
  })

  test('handles single theme', () => {
    const themes = {
      only: { color: 'red' },
    }
    const [theme, css] = createThemes(themes)

    expect(theme.color).toBe('var(--color)')
    expect(css).toContain('.only{')
  })

  test('returns last theme as the returned theme object', () => {
    const themes = {
      a: { value: 'a' },
      b: { value: 'b' },
    }
    const [theme] = createThemes(themes)

    // The theme object should have transformed values
    expect(theme.value).toBe('var(--value)')
  })

  // Test based on docs example
  test('handles light/dark theme from docs example', () => {
    const light = {
      colors: {
        foreground: 'black',
        background: 'white',
      },
    }

    const dark = {
      colors: {
        foreground: 'white',
        background: 'black',
      },
    }

    const themes = { light, dark }

    const [theme, css] = createThemes(themes, {
      getSelector: (name) => '.' + name,
    })

    // As shown in docs: theme.colors.foreground => 'var(--colors-foreground)'
    expect(theme.colors.foreground).toBe('var(--colors-foreground)')
    expect(theme.colors.background).toBe('var(--colors-background)')

    // CSS should contain both theme selectors
    expect(css).toContain('.light{')
    expect(css).toContain('.dark{')

    // CSS should contain the variable declarations
    expect(css).toContain('--colors-foreground:black')
    expect(css).toContain('--colors-foreground:white')
    expect(css).toContain('--colors-background:white')
    expect(css).toContain('--colors-background:black')
  })

  test('handles data attribute selector pattern', () => {
    const themes = {
      light: { color: 'black' },
      dark: { color: 'white' },
    }

    const [, css] = createThemes(themes, {
      getSelector: (name) => `[data-theme="${name}"]`,
    })

    expect(css).toContain('[data-theme="light"]')
    expect(css).toContain('[data-theme="dark"]')
  })

  test('config example from docs with shouldTransformValue', () => {
    const themes = {
      main: {
        colors: { primary: 'blue' },
        spacing: { small: '4px' },
      },
    }

    const [theme, css] = createThemes(themes, {
      shouldTransformValue: (path) => path === 'colors',
    })

    // Only colors should be transformed
    expect(theme.colors.primary).toBe('var(--colors-primary)')
    expect(theme.spacing.small).toBe('4px')
  })
})

