'use client'
import { RefObject, useEffect, useId, useRef } from 'react'

import useLayerContext from './useLayerContext.js'

export default function useLayer<T extends HTMLElement>(
  visible: boolean,
  data?: Record<string, any>
): [RefObject<T>, boolean, string] {
  const id = useId()
  const ref = useRef<T>(null)
  const { layers, addLayer, removeLayer, hasLayer } = useLayerContext()

  useEffect(() => {
    if (visible) {
      addLayer({ id, element: ref, data })
    } else {
      if (hasLayer(id)) {
        removeLayer(id)
      }
    }

    return () => removeLayer(id)
  }, [visible])

  const active = layers[layers.length - 1]?.id === id

  return [ref, active, id]
}
