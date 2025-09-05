import Box from '@/components/system/Box'
import Text from '@/components/system/Text'
import Link from '@/components/system/Link'

import capitalize from '@/utils/capitalize'

type Props = {
  packages: Array<string>
}
export default function Footer({ packages }: Props) {
  return (
    <Box gap={8} paddingBlock={10}>
      <Box direction={['column', , 'row']} gap={8}>
        <Box gap={3} minWidth={260}>
          <Text weight={600}>Packages</Text>
          <Box gap={2}>
            <Link href="/" underline={false} showExternIcon={false}>
              All
            </Link>
            {packages.map((pkg) => (
              <Link
                key={pkg}
                href={`/${pkg}`}
                underline={false}
                showExternIcon={false}>
                {capitalize(pkg)}
              </Link>
            ))}
          </Box>
        </Box>
        <Box gap={3} minWidth={260}>
          <Text weight={600}>General</Text>
          <Box gap={2}>
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                underline={false}
                showExternIcon={false}>
                {label}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
      <Text variant="note">
        &copy; 2024-present{' '}
        <Link showExternIcon={false} href="https://weser.io">
          Robin Weser
        </Link>
        . All Rights Reserved.
      </Text>
    </Box>
  )
}

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/robinweser/weser',
  },
  {
    label: 'About Robin',
    href: 'https://weser.io',
  },
  {
    label: 'Privacy Policy',
    href: 'https://weser.io/privacy',
  },
  {
    label: 'Imprint',
    href: 'https://weser.io/imprint',
  },
]
