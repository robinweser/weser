import { describe, expect, it } from 'vitest'

import createRenderer from '../createRenderer.js'

describe('createRenderer', () => {
  it('returns a css function', () => {
    const css = createRenderer()

    expect(typeof css).toBe('function')
  })
})

describe('css function', () => {
  it('returns returns a tuple of the processed style object and a style node', () => {
    const css = createRenderer()

    const [props, node] = css({ color: 'red' })
    expect(props.style).toEqual({ color: 'red' })
    expect(node).toMatchSnapshot()
  })

  it('supports nested selectors', () => {
    const css = createRenderer()

    const [props, node] = css({ color: 'red', ':hover': { color: 'blue' } })
    expect(props.style).toEqual({
      color: 'var(--3dwc1p-1, blue) var(--3dwc1p-0, red)',
    })
    expect(node).toMatchSnapshot()
  })

  it('supports precompiled conditions', () => {
    const css = createRenderer({
      precompiledConditions: {
        ':hover': 'hover',
      },
    })

    const [props, node] = css({ color: 'red', ':hover': { color: 'blue' } })

    expect(props.style).toEqual({
      color: 'var(--hover-1, blue) var(--hover-0, red)',
    })
    expect(node).toBeNull()
  })
})
