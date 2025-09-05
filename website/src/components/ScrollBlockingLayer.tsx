'use client'
import { PropsWithChildren } from 'react'
import { useScrollBlocking } from '@weser/hooks'
import { useLayerContext } from '@weser/layers'

export default function ScrollBlockingLayer({ children }: PropsWithChildren) {
  const { layers } = useLayerContext()
  useScrollBlocking(layers.length > 0)

  return children
}
