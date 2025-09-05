import { ElementType } from 'react'

import El, { ElProps } from './El'
import applyMultiplier from '@/utils/applyMultiplier'
import theme from '@/utils/theme'
import { T_Style } from '@/utils/system'

type GridProps = {
  columns: T_Style['gridTemplateColumns']
  rows: T_Style['gridTemplateRows']
  areas: T_Style['gridTemplateAreas']
} & Pick<T_Style, 'gap'>

type Props<T extends ElementType> = Partial<GridProps> & ElProps<T>

export default function Grid<T extends ElementType>({
  style,
  columns,
  rows,
  areas,
  gap,
  ref,
  children,
  ...props
}: Props<T>) {
  const multiplier = applyMultiplier(theme.baselineGrid)

  return (
    <El
      ref={ref}
      {...props}
      style={[
        {
          boxSizing: 'border-box',
          display: 'grid',
          gridGap: multiplier(gap),
          gridTemplateColumns: columns,
          gridTemplateRows: rows,
          gridTemplateAreas: areas,
        },
        style,
      ]}>
      {children}
    </El>
  )
}
