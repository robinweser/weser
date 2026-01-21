import React, { useEffect } from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'

import LayerProvider from '../LayerProvider'
import useLayerContext from '../useLayerContext'
import useLayer from '../useLayer'

function TestConsumer() {
  const context = useLayerContext()
  return (
    <div data-testid="context">
      {context ? 'Context available' : 'No context'}
    </div>
  )
}

function LayerComponent({ visible }: { visible: boolean }) {
  useLayer<HTMLDivElement>(visible)
  return <div>Layer</div>
}

describe('LayerProvider', () => {
  test('provides context to children', () => {
    render(
      <LayerProvider>
        <TestConsumer />
      </LayerProvider>
    )

    expect(screen.getByTestId('context').textContent).toBe('Context available')
  })

  test('renders children', () => {
    render(
      <LayerProvider>
        <div data-testid="child">Child content</div>
      </LayerProvider>
    )

    expect(screen.getByTestId('child')).toBeDefined()
    expect(screen.getByTestId('child').textContent).toBe('Child content')
  })

  test('calls onLayerAdded when layer is added', async () => {
    const onLayerAdded = vi.fn()

    function TestApp() {
      const [visible, setVisible] = React.useState(false)
      return (
        <LayerProvider onLayerAdded={onLayerAdded}>
          <LayerComponent visible={visible} />
          <button onClick={() => setVisible(true)}>Show</button>
        </LayerProvider>
      )
    }

    render(<TestApp />)

    act(() => {
      screen.getByText('Show').click()
    })

    await waitFor(() => {
      expect(onLayerAdded).toHaveBeenCalled()
    })

    expect(onLayerAdded).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String) }),
      ])
    )
  })

  test('calls onLayerRemoved when layer is removed', async () => {
    const onLayerRemoved = vi.fn()

    function TestApp() {
      const [visible, setVisible] = React.useState(true)
      return (
        <LayerProvider onLayerRemoved={onLayerRemoved}>
          <LayerComponent visible={visible} />
          <button onClick={() => setVisible(false)}>Hide</button>
        </LayerProvider>
      )
    }

    render(<TestApp />)

    act(() => {
      screen.getByText('Hide').click()
    })

    await waitFor(() => {
      expect(onLayerRemoved).toHaveBeenCalled()
    })

    // After removal, layers array should be empty
    expect(onLayerRemoved).toHaveBeenCalledWith([])
  })

  test('context provides addLayer, removeLayer, hasLayer methods', () => {
    function TestMethods() {
      const context = useLayerContext()
      return (
        <div data-testid="methods">
          {context &&
          typeof context.addLayer === 'function' &&
          typeof context.removeLayer === 'function' &&
          typeof context.hasLayer === 'function'
            ? 'Methods available'
            : 'Missing methods'}
        </div>
      )
    }

    render(
      <LayerProvider>
        <TestMethods />
      </LayerProvider>
    )

    expect(screen.getByTestId('methods').textContent).toBe('Methods available')
  })

  test('context provides layers array', () => {
    function TestLayers() {
      const context = useLayerContext()
      return (
        <div data-testid="layers">
          {context && Array.isArray(context.layers)
            ? 'Layers available'
            : 'No layers'}
        </div>
      )
    }

    render(
      <LayerProvider>
        <TestLayers />
      </LayerProvider>
    )

    expect(screen.getByTestId('layers').textContent).toBe('Layers available')
  })
})

