'use client'
import { createContext, Dispatch, SetStateAction } from 'react'

import { Coords, ElementId, Data, Nullable } from './types.js'

export type DndListeners = {
  onDrop?: (active: ElementId, over: Nullable<ElementId>) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragMove?: () => void
  onDragOver?: (over: ElementId, id: ElementId) => void
}

export type DndContext = {
  activeId: Nullable<ElementId>
  setActiveId: Dispatch<SetStateAction<Nullable<ElementId>>>
  activeOver: Nullable<ElementId>
  setActiveOver: Dispatch<SetStateAction<Nullable<ElementId>>>
  origin: Nullable<Coords>
  setOrigin: Dispatch<SetStateAction<Nullable<Coords>>>
  delta: Nullable<Coords>
  setDelta: Dispatch<SetStateAction<Nullable<Coords>>>
  data: Nullable<Data>
  setData: Dispatch<SetStateAction<Nullable<Data>>>
  dropzones: Record<ElementId, any>
  setDropzones: Dispatch<SetStateAction<Record<ElementId, any>>>
} & DndListeners

export default createContext<Nullable<DndContext>>(null)
