'use client'
import { ComponentProps } from 'react'
import { Github, Menu, X } from 'lucide-react'
import { useLayer } from '@weser/layers'
import {
  useFocusTrap,
  useScrollBlocking,
  useKeyDown,
  useTrigger,
} from '@weser/hooks'

import { Box, Overlay, Text } from '@/components/system/core'
import IconButton from '@/components/system/IconButton'
import Navigation from '@/components/Navigation'
import PackagesPicker from '@/components/PackagesPicker'
import Bleed from '@/components/system/Bleed'

import capitalize from '@/utils/capitalize'
import theme from '@/utils/theme'
import ThemeToggle from './ThemeToggle'

type T_HierarchyItem = {
  title: string
  path: string
}

type NavigationProps = ComponentProps<typeof Navigation>
type Props = NavigationProps & {
  packages: Array<string>
  hierarchy: Array<T_HierarchyItem>
}
export default function MobileNavigation({
  structure,
  packageName,
  packages,
  hierarchy,
}: Props) {
  const [isVisible, setVisible] = useTrigger()
  const [menuRef, active] = useLayer<HTMLDivElement>(isVisible)

  useScrollBlocking(isVisible)

  useFocusTrap(menuRef, active, {
    visible: isVisible,
  })

  useKeyDown(
    'Escape',
    (e: Event) => {
      if (active) {
        e.preventDefault()
        setVisible(false)
      }
    },
    {
      active,
    }
  )

  return (
    <>
      <Overlay
        visible={isVisible}
        zIndex={theme.zIndex.OVERLAY_1}
        inset={0}
        bottom={0}
        style={{ backgroundColor: theme.colors.background.menu }}>
        <Box
          ref={menuRef}
          paddingInline={5}
          paddingBlock={3.5}
          gap={2}
          marginTop={-1}>
          <Box
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingBottom={2}>
            <Text variant="highlight" weight={600}>
              Weser Packages
            </Text>
            <Bleed size={3}>
              <IconButton
                variant="function"
                label="Close navigation"
                icon={X}
                iconSize={30}
                action={() => setVisible(false)}
              />
            </Bleed>
          </Box>

          <Box alignSelf={['stretch', 'flex-start']} minWidth={['auto', 250]}>
            <PackagesPicker packages={packages} activePackage={packageName} />
          </Box>
          <Box paddingTop={5}>
            <Navigation structure={structure} packageName={packageName} />
          </Box>
        </Box>
      </Overlay>
      <Box
        position="sticky"
        style={{
          top: 0,
          zIndex: theme.zIndex.HEADER,
        }}>
        <Box
          as="header"
          role="banner"
          paddingBlock={[3.5, , , 4.5]}
          marginTop={-1}
          paddingInline={5}>
          <Box
            direction="row"
            gap={4}
            justifyContent="space-between"
            alignItems="center">
            <Text>
              <Text weight={600}>{capitalize(packageName)}</Text>
              {hierarchy.length > 0 ? ' / ' : ''}
              {hierarchy.map((item) => item.title).join(' / ')}
            </Text>

            <Box direction="row" gap={4} alignItems="center">
              <ThemeToggle variant="icon" />

              <Bleed size={3}>
                <IconButton
                  // ref={trigger}
                  variant="function"
                  iconSize={30}
                  icon={Menu}
                  label="Open menu"
                  action={() => setVisible(true)}
                />
              </Bleed>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
