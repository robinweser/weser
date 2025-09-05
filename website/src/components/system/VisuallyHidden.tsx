import { ElementType } from 'react'

import El, { ElProps } from './El'
import { T_Style } from '@/utils/system'

type Props<T extends ElementType> = Omit<ElProps<T>, 'style'>

export default function VisuallyHidden<T extends ElementType>(props: Props<T>) {
  return <El {...props} style={style} />
}

const style: T_Style = {
  clip: 'rect(1px, 1px, 1px, 1px)',
  clipPath: 'inset(50%)',
  position: 'absolute',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  border: 0,
  padding: 0,
  height: 1,
  width: 1,
}
