'use client'
import { RefObject, useEffect, useId, useRef } from 'react'

import useLayerContext from './useLayerContext.js'

export default function useLayer(
  visible: boolean
): [RefObject<HTMLElement>, boolean] {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const { layers, addLayer, removeLayer, hasLayer } = useLayerContext()

  useEffect(() => {
    if (visible) {
      addLayer({ id, element: ref })
    } else {
      if (hasLayer(id)) {
        removeLayer(id)
      }
    }
  }, [visible])

  const active = layers[layers.length - 1]?.id === id

  return [ref, active]
}
