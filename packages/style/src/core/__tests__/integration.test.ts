import { describe, expect, it } from 'vitest'

import createRenderer from '../createRenderer.js'
import precompileConditions from '../precompileConditions.js'

describe('Integrating precompileConditions', () => {
  it('returns returns a tuple of the processed style object and a style node', () => {
    const [flagNode, flags] = precompileConditions([':hover'])
    const css = createRenderer({ precompiledConditions: flags })

    expect(flags).toEqual({ ':hover': '3dwc1p' })
    expect(flagNode).toMatchSnapshot()

    const [props, styleNode] = css({
      color: 'red',
      ':hover': { color: 'blue' },
    })

    expect(props.style).toEqual({
      color: 'var(--3dwc1p-1, blue) var(--3dwc1p-0, red)',
    })

    expect(styleNode).toBeNull()
  })
})
