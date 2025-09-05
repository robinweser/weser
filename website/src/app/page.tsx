import ActionButton from '@/components/system/ActionButton'
import Box from '@/components/system/Box'
import Card from '@/components/system/Card'
import Text from '@/components/system/Text'
import Grid from '@/components/system/Grid'

import theme from '@/utils/theme'
import getAllPackages from '@/utils/getAllPackages'
import capitalize from '@/utils/capitalize'
import Click from '@/components/system/Click'
import { Children, ComponentProps, PropsWithChildren } from 'react'
import Bleed from '@/components/system/Bleed'
import ThemeToggle from '@/components/ThemeToggle'
import Footer from '@/components/Footer'

export default async function Page() {
  const packages = await getAllPackages()

  return (
    <Box>
      <Layout alignItems="flex-end">
        <Bleed size={3.5}>
          <ThemeToggle />
        </Bleed>
      </Layout>

      <Layout>
        <Box
          paddingBlock="10%"
          alignItems="center"
          justifyContent="center"
          gap={4}>
          <Text as="h1" variant="heading1" align="center">
            Weser Packages
          </Text>
          <Text as="p" variant="highlight" size={24} align="center">
            A collection of packages that make it easy to build web
            applications.
          </Text>
          <Box
            direction={['column', 'row']}
            width={['100%', 300]}
            gap={[2, 4]}
            paddingTop={2}>
            <ActionButton stretch size="large" action="/actions">
              Get Started
            </ActionButton>

            <ActionButton
              stretch
              action="https://github.com/robinweser/weser"
              intent="neutral"
              variant="control">
              GitHub
            </ActionButton>
          </Box>
        </Box>
      </Layout>
      <Box
        width="100%"
        bg={theme.colors.background.alternate}
        paddingTop={8}
        paddingBottom={12}>
        <Layout gap={6}>
          <Text as="h2" variant="heading2" align="center">
            All Packages
          </Text>
          <Grid columns={['1fr', , '1fr 1fr', '1fr 1fr 1fr']} gap={[3, , 4]}>
            {packages.map((pkg) => (
              <Click key={pkg} action={`/${pkg}`}>
                <Card>
                  <Box paddingInline={5} paddingBlock={[3.5, , 5]}>
                    <Text weight={500} size={20}>
                      {capitalize(pkg)}
                    </Text>
                  </Box>
                </Card>
              </Click>
            ))}
          </Grid>
        </Layout>
      </Box>
      <Layout>
        <Footer packages={packages} />
      </Layout>
    </Box>
  )
}

type LayoutProps = ComponentProps<typeof Box<'div'>>
function Layout({ children, ...props }: PropsWithChildren<LayoutProps>) {
  return (
    <Box alignItems="center">
      <Box maxWidth={1200} width="100%" padding={5} {...props}>
        {children}
      </Box>
    </Box>
  )
}
