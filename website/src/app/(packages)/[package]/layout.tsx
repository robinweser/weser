import { PropsWithChildren } from 'react'
import { Github } from 'lucide-react'

import Box from '@/components/system/Box'
import Navigation from '@/components/Navigation'
import Text from '@/components/system/Text'
import IconButton from '@/components/system/IconButton'
import Bleed from '@/components/system/Bleed'
import Click from '@/components/system/Click'
import PackagesPicker from '@/components/PackagesPicker'
import Footer from '@/components/Footer'

import getPageStructure from '@/utils/getPageStructure'
import getAllPackages from '@/utils/getAllPackages'
import theme from '@/utils/theme'

type Props = {
  params: Promise<{
    package: string
  }>
}
export default async function Layout({
  params,
  children,
}: PropsWithChildren<Props>) {
  const { package: packageName } = await params

  const packages = await getAllPackages()
  const structure = await getPageStructure(packageName)

  return (
    <Box direction="row" grow={1} minHeight="100vh">
      <Box
        display={['none', , , 'flex']}
        bg={theme.colors.background.sidebar}
        width={280}
        shrink={0}
        maxHeight="100vh"
        minHeight="100vh"
        position="sticky"
        padding={5}
        gap={5}
        style={{ top: 0 }}>
        <Box gap={2}>
          <Box
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Click action="/">
              <Text variant="highlight" weight={600}>
                Weser Packages
              </Text>
            </Click>

            <Bleed size={2}>
              <IconButton
                size="small"
                variant="function"
                intent="neutral"
                icon={Github}
                action="https://github.com/robinweser/weser"
                label="GitHub"
              />
            </Bleed>
          </Box>
          <PackagesPicker packages={packages} activePackage={packageName} />
        </Box>

        <Box overflow="auto" paddingBottom={5}>
          <Navigation structure={structure} packageName={packageName} />
        </Box>
      </Box>
      <Box
        grow={1}
        shrink={1}
        as="main"
        id="main"
        role="main"
        aria-label="Main content">
        <Box grow={1} minHeight="100vh">
          {children}
        </Box>
        <Box
          paddingLeft={[5, , 12, 16, 20, 25]}
          paddingRight={[5, , 12, , , 25]}
          gap={[5, , 12, 16, 20, 25]}
          direction="row"
          style={{
            borderTopWidth: 2,
            borderTopStyle: 'solid',
            borderTopColor: theme.colors.border,
          }}>
          <Box grow={1} shrink={1} alignItems="center">
            <Box width="100%" maxWidth={800}>
              <Footer />
            </Box>
          </Box>
          <Box display={['none', , , , 'flex']} width={250} shrink={0} />
        </Box>
      </Box>
    </Box>
  )
}
