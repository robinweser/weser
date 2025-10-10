'use client'
import { usePathname } from 'next/navigation'

import { T_PageStructureItem } from '@/utils/getPageStructure'
import Box from '@/components/system/Box'
import Click from './system/Click'

import theme from '@/utils/theme'

type Props = {
  item: T_PageStructureItem
  parent?: string
  offset?: number
}

export default function SidebarItem({ item, parent = '', offset = 0 }: Props) {
  const path = '/' + item.path
  const activePath = usePathname()

  const depth = parent.split('/').length

  return (
    <Box>
      <Box
        as={Click}
        action={path}
        padding={1.5}
        paddingLeft={3 + offset}
        bg={
          activePath === path
            ? theme.colors.background.sidebarActive
            : 'transparent'
        }
        style={{
          borderRadius: 4,
          fontWeight: depth === 1 ? 600 : 400,
          fontSize: depth > 2 ? 14 : 15,
          ':focus-visible': theme.focusRing,
        }}>
        {item.name || formatPath(item.path, parent)}
      </Box>

      <Box>
        {item.items?.map((i) => (
          <SidebarItem
            key={i.path}
            item={i}
            offset={offset + 4}
            parent={parent + '/' + formatPath(item.path, parent)}
          />
        ))}
      </Box>
    </Box>
  )
}

function formatPath(path: string, parent: string) {
  return path.replace(parent + '/', '')
}
