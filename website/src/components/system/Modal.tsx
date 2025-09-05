'use client'
import { ReactNode, ComponentProps, PropsWithChildren } from 'react'

import { Box, Overlay, Text } from './core'

import Portal from './Portal'
import { useLayer, useLayerContext } from '@weser/layers'
import {
  useClickAway,
  useFocusTrap,
  useKeyDown,
  useScrollBlocking,
} from '@weser/hooks'
import Dialog from './Dialog'
import IconButton from './IconButton'
import { X } from 'lucide-react'

type BoxProps = ComponentProps<typeof Box<'div'>>
type OverlayProps = ComponentProps<typeof Overlay<'div'>>
type Props = {
  visible: boolean
  title?: ReactNode
  actions?: Array<ReactNode>
  onClose?: () => void
  maxWidth?: BoxProps['maxWidth']
  minHeight?: BoxProps['minHeight']
  height?: BoxProps['height']
  width?: BoxProps['width']
  zIndex?: OverlayProps['zIndex']
}
export default function Modal({
  visible,
  onClose,
  title,
  maxWidth = 800,
  minHeight = 400,
  height = 'auto',
  width = '100%',
  zIndex = 10,
  actions,
  children,
}: PropsWithChildren<Props>) {
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

  return (
    <Portal>
      <Overlay
        inset={0}
        visible={visible}
        zIndex={zIndex}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          animationName: 'shadeIn',
          animationDuration: '80ms',
          animationTimingFunction: 'ease-out',
        }}>
        <Box
          padding={[4, , , 0]}
          maxHeight={`min(800px, 90vh)`}
          minHeight={minHeight}
          height={height}
          maxWidth={maxWidth}
          width={width}>
          <Dialog
            ref={ref}
            style={{
              borderRadius: 10,
              animationName: 'slideIn',
              animationDuration: '80ms',
              animationTimingFunction: 'ease-out',
            }}>
            <Box
              paddingBlock={2}
              paddingLeft={5}
              paddingRight={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              style={{
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'lightgrey',
              }}>
              <Text variant="highlight" weight={500}>
                {title}
              </Text>
              {onClose ? (
                <IconButton
                  variant="function"
                  label="Close modal"
                  action={close}
                  icon={X}
                />
              ) : (
                <div style={{ height: 40 }} />
              )}
            </Box>
            <Box
              grow={1}
              shrink={1}
              padding={5}
              style={{ overflowY: 'auto', overflowX: 'hidden' }}>
              {children}
            </Box>
            {actions && (
              <Box
                padding={4}
                gap={3}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                style={{ borderTop: '1px solid lightgrey' }}>
                {actions}
              </Box>
            )}
          </Dialog>
        </Box>
      </Overlay>
    </Portal>
  )
}
