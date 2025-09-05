import { useLayoutEffect, useState, CSSProperties } from 'react'
import { useClickAway, useFocusTrap, useKeyDown } from '@weser/hooks'
import { useLayer } from '@weser/layers'

import Portal from '@/components/system/Portal'
import { Overlay } from '@/components/system/core'
import Dialog from '@/components/system/Dialog'

import theme from '@/utils/theme'

type Position = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'center' | 'end' | 'stretch'

const EDGE_OFFSET = 16

type Props = {
  children: any
  visible: boolean
  anchor: any
  offsetY?: number
  offsetX?: number
  position?: Position
  rerender?: any
  align?: Align
  onClose: () => void
  automatic?: boolean
}
export default function Popover({
  children,
  visible,
  anchor,
  position = 'bottom',
  align = 'center',
  offsetX = 0,
  offsetY = 0,
  rerender = 0,
  onClose,
  automatic = false,
}: Props) {
  const [style, setStyle] = useState({})
  const [ref, active] = useLayer(visible)

  const close = () => {
    if (onClose) {
      onClose()
    }
  }

  useClickAway(ref, close, active)
  useFocusTrap(ref, active, {
    visible,
  })

  useKeyDown(
    'Escape',
    (e: Event) => {
      if (active) {
        e.preventDefault()
        close()
      }
    },
    {
      active,
    }
  )

  const updateStyle = () => {
    if (!visible) {
      return
    }

    if (anchor?.current && ref?.current) {
      setStyle(
        calculatePopoverStyle({
          anchor: anchor.current,
          element: ref.current,
          position,
          align,
          offsetX,
          offsetY,
          automatic,
        })
      )
    }
  }

  useLayoutEffect(() => {
    updateStyle()

    if (visible) {
      window.addEventListener('resize', updateStyle)
    }
    return () => {
      window.removeEventListener('resize', updateStyle)
    }
  }, [
    visible,
    ref,
    anchor,
    position,
    align,
    offsetX,
    offsetY,
    rerender,
    automatic,
  ])

  return (
    <Portal>
      <Overlay
        inset={0}
        visible={visible}
        zIndex={theme.zIndex.OVERLAY_2}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Dialog
          ref={ref}
          style={{
            position: 'absolute',
            borderRadius: 4,
            ...style,
          }}>
          {children}
        </Dialog>
      </Overlay>
    </Portal>
  )
}

function calculatePopoverStyle({
  anchor,
  element,
  position,
  align,
  offsetX,
  offsetY,
  automatic = false,
}: {
  anchor: HTMLElement
  element: HTMLElement
  position: Position
  align: Align
  offsetX: number
  offsetY: number
  automatic?: boolean
}): CSSProperties {
  const { width, height, top, left, right, bottom } =
    anchor.getBoundingClientRect()
  const currentRect = element.getBoundingClientRect()
  const { clientHeight, clientWidth } = document.documentElement

  let finalPosition: Position = position

  if (automatic) {
    const spaceTop = top - EDGE_OFFSET - offsetY
    const spaceBottom = clientHeight - bottom - EDGE_OFFSET - offsetY
    const spaceLeft = left - EDGE_OFFSET - offsetX
    const spaceRight = clientWidth - right - EDGE_OFFSET - offsetX

    if (
      position === 'bottom' &&
      currentRect.height > spaceBottom &&
      spaceTop > spaceBottom
    ) {
      finalPosition = 'top'
    } else if (
      position === 'top' &&
      currentRect.height > spaceTop &&
      spaceBottom > spaceTop
    ) {
      finalPosition = 'bottom'
    } else if (
      position === 'right' &&
      currentRect.width > spaceRight &&
      spaceLeft > spaceRight
    ) {
      finalPosition = 'left'
    } else if (
      position === 'left' &&
      currentRect.width > spaceLeft &&
      spaceRight > spaceLeft
    ) {
      finalPosition = 'right'
    }
  }

  const horizontal = finalPosition === 'top' || finalPosition === 'bottom'

  const refWidth =
    horizontal && align === 'stretch'
      ? currentRect.width > width
        ? currentRect.width
        : width
      : currentRect.width

  const refHeight =
    !horizontal && align === 'stretch'
      ? currentRect.height > height
        ? currentRect.height
        : height
      : currentRect.height

  function getX() {
    if (align === 'start') {
      return Math.max(left + offsetX, EDGE_OFFSET)
    }

    if (
      align === 'center' ||
      (align === 'stretch' && currentRect.width > width)
    ) {
      return left + offsetX + width / 2 - refWidth / 2
    }

    if (align === 'end') {
      return left + (width - refWidth) + offsetX
    }

    if (align === 'stretch') {
      return left + offsetX
    }
  }

  function getY() {
    if (align === 'start') {
      return Math.max(top + offsetY, EDGE_OFFSET)
    }

    if (
      align === 'center' ||
      (align === 'stretch' && currentRect.height > height)
    ) {
      return top + offsetY + height / 2 - refHeight / 2
    }

    if (align === 'end') {
      return top + height - refHeight + offsetY
    }

    if (align === 'stretch') {
      return top + offsetY
    }
  }

  if (finalPosition === 'bottom') {
    const x = Math.max(getX()!, EDGE_OFFSET)
    const maxSpaceX = clientWidth - x - EDGE_OFFSET - offsetX

    const y = top + height + offsetY
    const maxSpaceY = clientHeight - y - EDGE_OFFSET - offsetY

    return {
      top: y - Math.max(currentRect.height - maxSpaceY, 0),
      left: x - Math.max(refWidth - maxSpaceX, 0),
      minWidth: refWidth,
      maxWidth: clientWidth - EDGE_OFFSET * 2,
      maxHeight: clientHeight - EDGE_OFFSET * 2,
    }
  }

  if (finalPosition === 'top') {
    const x = Math.max(getX()!, EDGE_OFFSET)
    const maxSpaceX = clientWidth - x - EDGE_OFFSET - offsetX

    const y = clientHeight - top + offsetY
    const maxSpaceY = top - EDGE_OFFSET - offsetY

    return {
      bottom: y - Math.max(currentRect.height - maxSpaceY, 0),
      left: x - Math.max(refWidth - maxSpaceX, 0),
      minWidth: refWidth,
      maxWidth: clientWidth - EDGE_OFFSET * 2,
      maxHeight: clientHeight - EDGE_OFFSET * 2,
    }
  }

  if (finalPosition === 'right') {
    const y = Math.max(getY()!, EDGE_OFFSET)
    const maxSpaceY = clientHeight - y - EDGE_OFFSET - offsetY

    const x = right + offsetX
    const maxSpaceX = clientWidth - x - EDGE_OFFSET - offsetX

    return {
      left: x - Math.max(currentRect.width - maxSpaceX, 0),
      top: y - Math.max(refHeight - maxSpaceY, 0),
      minHeight: refHeight,
      maxWidth: clientWidth - EDGE_OFFSET * 2,
      maxHeight: clientHeight - EDGE_OFFSET * 2,
    }
  }

  if (finalPosition === 'left') {
    const y = Math.max(getY()!, EDGE_OFFSET)
    const maxSpaceY = clientHeight - y - EDGE_OFFSET - offsetY

    const x = clientWidth - left + offsetX
    const maxSpaceX = left - EDGE_OFFSET - offsetX

    return {
      right: x - Math.max(currentRect.width - maxSpaceX, 0),
      top: y - Math.max(refHeight - maxSpaceY, 0),
      minHeight: refHeight,
      maxWidth: clientWidth - EDGE_OFFSET * 2,
      maxHeight: clientHeight - EDGE_OFFSET * 2,
    }
  }

  return {}
}
