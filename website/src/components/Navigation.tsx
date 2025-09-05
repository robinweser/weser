import Box from '@/components/system/Box'
import SidebarItem from '@/components/SidebarItem'

import { T_PageStructureItem } from '@/utils/getPageStructure'

type Props = {
  structure: Array<T_PageStructureItem>
  packageName: string
}
export default function Navigation({ structure, packageName }: Props) {
  return (
    <Box gap={2.5}>
      {structure.map((item) => (
        <SidebarItem key={item.path} item={item} parent={packageName} />
      ))}
    </Box>
  )
}
