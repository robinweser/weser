import { describe, test, expect } from 'vitest'

import sortPropertyPlugin from '../sortProperty'

describe('sortPropertyPlugin', () => {
  test('sorts properties by priority', () => {
    const plugin = sortPropertyPlugin({
      background: 1,
      backgroundColor: 2,
    } as any)

    const style = { backgroundColor: 'red', background: 'blue' }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys[0]).toBe('background')
    expect(keys[1]).toBe('backgroundColor')
  })

  test('properties without priority come first', () => {
    const plugin = sortPropertyPlugin({
      marginLeft: 2,
    } as any)

    const style = { marginLeft: 10, color: 'red' }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys[0]).toBe('color')
    expect(keys[1]).toBe('marginLeft')
  })

  test('handles nested style objects', () => {
    const plugin = sortPropertyPlugin({
      padding: 1,
      paddingLeft: 2,
    } as any)

    const style = {
      paddingLeft: 10,
      padding: 5,
      ':hover': {
        paddingLeft: 15,
        padding: 10,
      },
    }

    const result = plugin(style as any)
    const hoverKeys = Object.keys(result[':hover'])

    expect(hoverKeys[0]).toBe('padding')
    expect(hoverKeys[1]).toBe('paddingLeft')
  })

  test('preserves property values', () => {
    const plugin = sortPropertyPlugin({
      a: 1,
      b: 2,
    } as any)

    const style = { b: 'second', a: 'first' }

    const result = plugin(style as any)

    expect(result.a).toBe('first')
    expect(result.b).toBe('second')
  })

  test('handles equal priorities', () => {
    const plugin = sortPropertyPlugin({
      margin: 1,
      padding: 1,
    } as any)

    const style = { padding: 10, margin: 5 }

    const result = plugin(style as any)

    // Both have same priority, order may vary but both should exist
    expect(result.margin).toBe(5)
    expect(result.padding).toBe(10)
  })
})

