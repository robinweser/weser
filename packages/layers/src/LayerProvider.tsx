'use client'
import { PropsWithChildren, useState } from 'react'

import LayerContext, { T_Layer } from './LayerContext.js'

type Props = {
  onLayerAdded?: (layers: Array<T_Layer>) => void
  onLayerRemoved?: (layers: Array<T_Layer>) => void
}
export default function LayerProvider({
  children,
  onLayerAdded,
  onLayerRemoved,
}: PropsWithChildren<Props>) {
  const [layers, setLayers] = useState<Array<T_Layer>>([])

  function addLayer(layer: T_Layer) {
    setLayers((prevLayers) => {
      const filteredLayers = prevLayers.filter((item) => item.id !== layer.id)
      const newLayers = [...filteredLayers, layer]

      if (onLayerAdded) {
        onLayerAdded(newLayers)
      }

      return newLayers
    })
  }

  function removeLayer(id: T_Layer['id']) {
    setLayers((prevLayers) => {
      const newLayers = prevLayers.filter((item) => item.id !== id)

      if (onLayerRemoved) {
        onLayerRemoved(newLayers)
      }

      return newLayers
    })
  }

  function hasLayer(id: T_Layer['id']) {
    return layers.find((item) => item.id === id) !== undefined
  }

  return (
    <LayerContext.Provider
      value={{
        addLayer,
        removeLayer,
        hasLayer,
        layers,
      }}>
      {children}
    </LayerContext.Provider>
  )
}
