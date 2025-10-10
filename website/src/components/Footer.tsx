import Box from '@/components/system/Box'
import Text from '@/components/system/Text'
import Link from '@/components/system/Link'

export default function Footer() {
  return (
    <Box gap={8} paddingBlock={10}>
      <Box gap={2} style={{ fontSize: 15 }}>
        {links.map(({ label, href }) => (
          <Link key={href} href={href} underline={false} showExternIcon={false}>
            {label}
          </Link>
        ))}
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
    label: 'All Packages',
    href: '/',
  },
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
