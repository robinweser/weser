'use client'
import { useContext } from 'react'

import LayerContext from './LayerContext.js'

export default function useLayerContext() {
  const context = useContext(LayerContext)

  if (!context) {
    throw new Error("You're using layer context outside of its provider.")
  }

  return context
}
