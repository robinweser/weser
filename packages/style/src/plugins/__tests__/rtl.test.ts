import { describe, test, expect } from 'vitest'

import rtlPlugin from '../rtl'

describe('rtlPlugin', () => {
  test('transforms left to right for RTL', () => {
    const plugin = rtlPlugin('rtl')
    const style = { marginLeft: 10 }

    const result = plugin(style as any)

    expect(result.marginRight).toBe(10)
    expect(result.marginLeft).toBeUndefined()
  })

  test('transforms right to left for RTL', () => {
    const plugin = rtlPlugin('rtl')
    const style = { paddingRight: 20 }

    const result = plugin(style as any)

    expect(result.paddingLeft).toBe(20)
    expect(result.paddingRight).toBeUndefined()
  })

  test('does not transform when direction is ltr', () => {
    const plugin = rtlPlugin('ltr')
    const style = { marginLeft: 10 }

    const result = plugin(style as any)

    expect(result.marginLeft).toBe(10)
  })

  test('transforms textAlign left to right', () => {
    const plugin = rtlPlugin('rtl')
    const style = { textAlign: 'left' } as any

    const result = plugin(style)

    expect(result.textAlign).toBe('right')
  })

  test('transforms float left to right', () => {
    const plugin = rtlPlugin('rtl')
    const style = { float: 'left' } as any

    const result = plugin(style)

    expect(result.float).toBe('right')
  })

  test('handles border properties', () => {
    const plugin = rtlPlugin('rtl')
    const style = { borderLeft: '1px solid red' }

    const result = plugin(style as any)

    expect(result.borderRight).toBe('1px solid red')
    expect(result.borderLeft).toBeUndefined()
  })

  test('preserves non-directional properties', () => {
    const plugin = rtlPlugin('rtl')
    const style = { color: 'red', fontSize: 16 }

    const result = plugin(style as any)

    expect(result.color).toBe('red')
    expect(result.fontSize).toBe(16)
  })

  test('defaults to rtl direction', () => {
    const plugin = rtlPlugin()
    const style = { marginLeft: 10 }

    const result = plugin(style as any)

    expect(result.marginRight).toBe(10)
  })
})

