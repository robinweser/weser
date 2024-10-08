'use client'
import { PropsWithChildren, useState } from 'react'

import { Coords, Data, ElementId, Nullable } from './types'

import DndContext, { DndListeners } from './DndContext.js'

type Props = DndListeners
export default function DndProvider({
  children,
  onDrop,
  onDragStart,
  onDragEnd,
  onDragMove,
  onDragOver,
}: PropsWithChildren<Props>) {
  const [activeId, setActiveId] = useState<Nullable<ElementId>>(null)
  const [activeOver, setActiveOver] = useState<Nullable<ElementId>>(null)
  const [origin, setOrigin] = useState<Nullable<Coords>>(null)
  const [delta, setDelta] = useState<Nullable<Coords>>(null)
  const [data, setData] = useState<Nullable<Data>>(null)
  const [dropzones, setDropzones] = useState<Record<ElementId, any>>([])

  const context = {
    activeId,
    setActiveId,
    activeOver,
    setActiveOver,
    origin,
    setOrigin,
    delta,
    setDelta,
    data,
    setData,
    dropzones,
    setDropzones,
    onDrop,
    onDragStart,
    onDragEnd,
    onDragMove,
    onDragOver,
  }

  return <DndContext.Provider value={context}>{children}</DndContext.Provider>
}
