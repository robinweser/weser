import { useEffect, useRef } from 'react'

import useDndContext from './useDndContext.js'
import { Data, ElementId } from './types.js'

export default function useDraggable({
  id,
  data = {},
  delay = 0,
  disabled = false,
}: {
  id: ElementId
  data?: Data
  delay?: number
  disabled?: boolean
}) {
  const {
    delta,
    origin,
    dropzones,
    activeId,
    activeOver,
    setActiveId,
    setActiveOver,
    setOrigin,
    setDelta,
    setData,
    onDrop,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragMove,
  } = useDndContext()
  const delayRef = useRef<number | null>(null)

  const isDragging = activeId === id
  const transform = {
    top: origin && delta ? origin.y + delta.y : 0,
    left: origin && delta ? origin.x + delta.x : 0,
  }

  const ref = useRef<HTMLElement>(null)
  const attributes = {}

  function onPointerDown(e: PointerEvent) {
    setOrigin({
      x: e.pageX,
      y: e.pageY,
    })

    delayRef.current = window.setTimeout(() => {
      setData(data)
      setActiveId(id)
      setDelta({
        x: 0,
        y: 0,
      })

      if (onDragStart) {
        onDragStart()
      }

      delayRef.current = -1
    }, delay)
  }

  function onClickCapture(e: MouseEvent) {
    if (delayRef.current === -1) {
      e.stopPropagation()
    }
  }

  const listeners = {
    // TODO: add touch events
    onPointerDown,
    onClickCapture,
  }

  useEffect(() => {
    function onPointerUp(e: MouseEvent) {
      if (delayRef.current !== null) {
        clearTimeout(delayRef.current)
        delayRef.current = null
      } else {
        e.stopPropagation()
      }

      if (onDrop && activeId) {
        onDrop(activeId, activeOver)
      }

      if (onDragEnd) {
        onDragEnd()
      }

      setOrigin(null)
      setActiveId(null)
      setActiveOver(null)
      setDelta(null)
      setData(null)
    }

    document.addEventListener('pointerup', onPointerUp)
    return () => document.removeEventListener('pointerup', onPointerUp)
  }, [onDrop, activeId, activeOver, data])

  useEffect(() => {
    // TODO: implement auto-scroll
    function onPointerMove(e: MouseEvent) {
      if (origin) {
        setDelta({
          x: e.pageX - origin.x,
          y: e.pageY - origin.y,
        })

        if (activeId === id) {
          if (onDragMove) {
            onDragMove()
          }

          if (ref.current) {
            for (const id in dropzones) {
              const target = dropzones[id]

              // TODO: cache bounding client rect
              // TODO: update on resize / scroll
              const rect = target.getBoundingClientRect()

              const collidesX =
                e.clientX >= rect.left && e.clientX <= rect.right
              const collidesY =
                e.clientY >= rect.top && e.clientY <= rect.bottom

              // TODO: more collision algorithms
              if (collidesX && collidesY) {
                if (onDragOver && id !== activeOver) {
                  onDragOver(activeId, id)
                }

                setActiveOver(id)
                return
              }
            }
          }

          setActiveOver(null)
        }
      }
    }

    document.addEventListener('pointermove', onPointerMove)
    return () => document.removeEventListener('pointermove', onPointerMove)
  }, [origin, dropzones, ref, activeId, activeOver])

  return {
    isDragging,
    attributes,
    listeners: disabled ? {} : listeners,
    transform,
    ref,
  }
}
