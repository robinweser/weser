import Box from '@/components/system/Box'
import Heading from '@/components/markdown/Heading'
import Headings from '@/components/Headings'
import Text from '@/components/system/Text'
import MobileNavigation from '@/components/MobileNavigation'
import ThemeToggle from '@/components/ThemeToggle'
import Bleed from '@/components/system/Bleed'

import getPageStructure from '@/utils/getPageStructure'
import getAllPackages from '@/utils/getAllPackages'
import getPageById from '@/utils/getPageById'
import BackToTop from '@/components/BackTopTop'

import capitalize from '@/utils/capitalize'

type Props = {
  params: Promise<{
    package: string
    slug: Array<string>
  }>
}
export async function generateMetadata({ params }: Props) {
  const { package: packageName, slug } = await params

  const [error, data] = await getPageById([packageName, ...slug].join('/'))

  if (error !== null) {
    return
  }

  return {
    title: capitalize(packageName) + ' / ' + data.meta.title,
  }
}

export default async function Page({ params }: Props) {
  const { slug, package: packageName } = await params

  const [error, data] = await getPageById([packageName, ...slug].join('/'))
  const structure = await getPageStructure(packageName)
  const hierarchy = await getPageHierarchy(packageName, slug)
  const packages = await getAllPackages()

  if (error !== null) {
    return <Box>Error loading page</Box>
  }

  const { meta, content, headings } = data

  return (
    <Box direction="column" grow={1}>
      <div id="top" />
      <Box display={['flex', , , 'none']}>
        <MobileNavigation
          structure={structure}
          packageName={packageName}
          packages={packages}
          hierarchy={hierarchy}
        />
      </Box>
      <Box
        direction="row"
        paddingLeft={[5, , 12, 16, 20, 25]}
        paddingRight={[5, , 12, , , 25]}
        width="100%"
        shrink={1}
        grow={1}
        gap={[5, , 12, 16, 20, 25]}
        justifyContent="space-between">
        <Box grow={1} shrink={1} alignItems="center">
          <Box
            paddingTop={[4, , , 12]}
            paddingBottom={[16, , , 20]}
            maxWidth={800}
            width="100%"
            shrink={1}>
            <Box gap={4} shrink={1} grow={1}>
              <Box gap={[0, , , 6]}>
                <Box display={['none', , , 'flex']}>
                  <Text variant="highlight">
                    <Text weight={600}>{capitalize(packageName)}</Text>
                    {hierarchy.length > 0 ? ' / ' : ''}
                    {hierarchy.map((item) => item.title).join(' / ')}
                  </Text>
                </Box>
                <Heading level={1}>{meta.title}</Heading>
              </Box>
              <Box style={{ fontSize: 16 }} shrink={1} grow={1}>
                {content}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          display={['none', , , 'flex']}
          position="sticky"
          alignSelf="flex-start"
          maxHeight="100vh"
          minWidth={250}
          maxWidth={250}
          shrink={1}
          paddingTop={8}
          paddingBottom={12}
          gap={6}
          style={{ top: 0 }}>
          <Bleed size={3.5}>
            <ThemeToggle />
          </Bleed>
          <Box gap={2} overflow="hidden">
            {headings.length > 0 && (
              <Text variant="heading4">On this page</Text>
            )}
            <Headings headings={headings} />
          </Box>
          <BackToTop />
        </Box>
      </Box>
    </Box>
  )
}

async function getPageHierarchy(packageName: string, slugs: Array<string>) {
  const hierarchy = []

  for (let i = 1; i < slugs.length; ++i) {
    const path = [packageName, ...slugs.slice(0, i)].join('/')

    const [error, data] = await getPageById(path)

    if (error !== null || data.meta.title === undefined) {
      // TODO: throw error
      continue
    }

    hierarchy.push({
      title: data.meta.title,
      path,
    })
  }

  return hierarchy
}
