import { ElementType } from 'react'

import El, { ElProps } from '@/components/system/El'

import { T_Style, T_StyleProp } from '@/utils/system'

type OverlayStyleProps = Pick<
  T_Style,
  'inset' | 'top' | 'left' | 'bottom' | 'right' | 'zIndex'
>
type OverlayProps = {
  visible: boolean
} & OverlayStyleProps

type Props<T extends ElementType> = Partial<OverlayProps> & ElProps<T>

export default function Overlay<T extends ElementType>({
  children,
  visible = false,
  zIndex,
  inset,
  top,
  left,
  bottom,
  right,
  style,
  ref,
  ...props
}: Props<T>) {
  if (!visible) {
    return null
  }

  return (
    <El
      ref={ref}
      {...props}
      style={[
        style,
        containerStyle({
          zIndex,
          top,
          left,
          bottom,
          right,
          inset,
        }),
      ]}>
      {children}
    </El>
  )
}

const containerStyle = ({
  zIndex,
  inset,
  top,
  left,
  bottom,
  right,
}: OverlayStyleProps): T_StyleProp => ({
  position: 'fixed',
  maxHeight: '100%',
  zIndex,
  inset,
  top,
  left,
  bottom,
  right,
  paddingRight: 'env(safe-area-inset-right)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)',
})
