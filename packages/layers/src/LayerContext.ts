'use client'
import { createContext } from 'react'

export type T_Layer = {
  id: string
  element: Object
  data?: Record<string, any>
}

type LayerContext = {
  layers: Array<T_Layer>
  addLayer: (layer: T_Layer) => void
  removeLayer: (id: T_Layer['id']) => void
  hasLayer: (id: T_Layer['id']) => boolean
}

export default createContext<LayerContext | null>(null)
