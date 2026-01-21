import { describe, test, expect } from 'vitest'

import prefixerPlugin from '../prefixer'

describe('prefixerPlugin', () => {
  test('adds webkit prefix to appropriate properties', () => {
    const plugin = prefixerPlugin()
    const style = { appearance: 'none' }

    const result = plugin(style as any)

    expect(result.WebkitAppearance).toBe('none')
    expect(result.appearance).toBe('none')
  })

  test('adds webkit prefix to userSelect', () => {
    const plugin = prefixerPlugin()
    const style = { userSelect: 'none' }

    const result = plugin(style as any)

    expect(result.WebkitUserSelect).toBe('none')
    expect(result.userSelect).toBe('none')
  })

  test('adds webkit prefix to backdropFilter', () => {
    const plugin = prefixerPlugin()
    const style = { backdropFilter: 'blur(10px)' }

    const result = plugin(style as any)

    expect(result.WebkitBackdropFilter).toBe('blur(10px)')
    expect(result.backdropFilter).toBe('blur(10px)')
  })

  test('adds moz prefix to tabSize', () => {
    const plugin = prefixerPlugin()
    const style = { tabSize: 4 }

    const result = plugin(style as any)

    expect(result.MozTabSize).toBe(4)
    expect(result.tabSize).toBe(4)
  })

  test('does not prefix standard properties', () => {
    const plugin = prefixerPlugin()
    const style = { color: 'red', fontSize: 16 }

    const result = plugin(style as any)

    expect(result.WebkitColor).toBeUndefined()
    expect(result.color).toBe('red')
  })

  test('handles nested style objects', () => {
    const plugin = prefixerPlugin()
    const style = {
      appearance: 'none',
      ':hover': { userSelect: 'text' },
    }

    const result = plugin(style as any)

    expect(result.WebkitAppearance).toBe('none')
    expect(result[':hover'].WebkitUserSelect).toBe('text')
  })

  test('prefixes mask properties', () => {
    const plugin = prefixerPlugin()
    const style = { maskImage: 'url(mask.png)' }

    const result = plugin(style as any)

    expect(result.WebkitMaskImage).toBe('url(mask.png)')
    expect(result.maskImage).toBe('url(mask.png)')
  })

  test('prefixes clipPath', () => {
    const plugin = prefixerPlugin()
    const style = { clipPath: 'circle(50%)' }

    const result = plugin(style as any)

    expect(result.WebkitClipPath).toBe('circle(50%)')
    expect(result.clipPath).toBe('circle(50%)')
  })
})

