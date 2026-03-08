import { describe, expect, it } from 'vitest'

import precompileConditions from '../precompileConditions.js'

describe('precompileConditions', () => {
  it('returns a tuple of the flags and the node', () => {
    const [node, flags] = precompileConditions([':hover'])
    expect(flags).toEqual({ ':hover': '3dwc1p' })
    expect(node).toMatchSnapshot()
  })

  it('returns a tuple of the flags and the node in dev mode', () => {
    const [node, flags] = precompileConditions([':hover'], true)
    expect(flags).toEqual({ ':hover': 'hover' })
    expect(node).toMatchSnapshot()
  })

  it('returns multiple flags', () => {
    const [node, flags] = precompileConditions([':hover', ':focus'])
    expect(flags).toEqual({ ':hover': '3dwc1p', ':focus': '1mkb03c' })
    expect(node).toMatchSnapshot()
  })
})
