'use client'
import { RefObject, useEffect, useId, useRef } from 'react'

import useLayerContext from './useLayerContext.js'

export default function useLayer<E extends HTMLElement>(
  visible: boolean
): [RefObject<E>, boolean] {
  const id = useId()
  const ref = useRef<E>(null)
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
