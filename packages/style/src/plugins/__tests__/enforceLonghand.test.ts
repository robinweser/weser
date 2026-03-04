import { describe, test, expect } from 'vitest'

import enforceLonghandPlugin from '../enforceLonghand'

describe('enforceLonghandPlugin', () => {
  test('returns a sort function', () => {
    const plugin = enforceLonghandPlugin()

    expect(typeof plugin).toBe('function')
  })

  test('sorts shorthand before longhand with default mode', () => {
    const plugin = enforceLonghandPlugin('none')

    const style = {
      marginLeft: 10,
      margin: 5,
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys[0]).toBe('margin')
    expect(keys[1]).toBe('marginLeft')
  })

  test('sorts padding shorthand before longhand', () => {
    const plugin = enforceLonghandPlugin()

    const style = {
      paddingTop: 10,
      padding: 5,
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys[0]).toBe('padding')
    expect(keys[1]).toBe('paddingTop')
  })

  test('handles border properties with longhand mode', () => {
    const plugin = enforceLonghandPlugin('longhand')

    const style = {
      borderColor: 'red',
      border: '1px solid black',
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    // With longhand mode, borderColor should come after border
    expect(keys.indexOf('border')).toBeLessThan(keys.indexOf('borderColor'))
  })

  test('handles border properties with directional mode', () => {
    const plugin = enforceLonghandPlugin('directional')

    const style = {
      borderTop: '1px solid red',
      border: '1px solid black',
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    // With directional mode, borderTop should come after border
    expect(keys.indexOf('border')).toBeLessThan(keys.indexOf('borderTop'))
  })

  test('handles flex properties', () => {
    const plugin = enforceLonghandPlugin()

    const style = {
      flexBasis: '100%',
      flex: '1 1 auto',
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys.indexOf('flex')).toBeLessThan(keys.indexOf('flexBasis'))
  })

  test('handles background properties', () => {
    const plugin = enforceLonghandPlugin()

    const style = {
      backgroundColor: 'red',
      background: 'blue',
    }

    const result = plugin(style as any)
    const keys = Object.keys(result)

    expect(keys.indexOf('background')).toBeLessThan(
      keys.indexOf('backgroundColor')
    )
  })

  test('handles nested styles', () => {
    const plugin = enforceLonghandPlugin()

    const style = {
      margin: 5,
      marginLeft: 10,
      ':hover': {
        padding: 5,
        paddingTop: 10,
      },
    }

    const result = plugin(style as any)
    const hoverKeys = Object.keys(result[':hover']!)

    expect(hoverKeys[0]).toBe('padding')
    expect(hoverKeys[1]).toBe('paddingTop')
  })
})
