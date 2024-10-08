'use client'
import useDndContext from './useDndContext.js'

// TODO: use memo to prevent unnecessary rerenders
export default function useDndState() {
  const { activeId, activeOver, origin, delta, data } = useDndContext()

  const isDragging = activeId !== null

  return {
    isDragging,
    active: activeId,
    over: activeOver,
    origin,
    delta,
    data,
  }
}
