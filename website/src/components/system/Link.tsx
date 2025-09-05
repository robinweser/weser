'use client'
import { ComponentProps, PropsWithChildren } from 'react'
import NextLink from 'next/link'

import { Box, VisuallyHidden } from '@/components/system/core'
import theme from '@/utils/theme'
import { alpha } from '@weser/theming'

type Props = {
  href: string
  showExternIcon?: boolean
  underline?: boolean
  isIcon?: boolean
  track?: boolean
  nowrap?: boolean
  style?: Object
} & Omit<ComponentProps<typeof Box>, 'ref' | 'children'>

export default function Link({
  href,
  children,
  showExternIcon = true,
  underline = true,
  isIcon = false,
  nowrap = false,
  style,
  ...props
}: PropsWithChildren<Props>) {
  const isExtern =
    href.indexOf('http') === 0 || href.startsWith('mailto') || isIcon

  const linkStyle = {
    display: 'inline',
    textDecoration: 'none',
    color: theme.colors.foreground.link,
    whiteSpace: nowrap ? 'nowrap' : undefined,
    ':hover': {
      color: theme.colors.foreground.primary,
    },
    extend: {
      condition: underline,
      style: {
        textDecorationLine: 'underline',
        textDecorationColor: alpha(theme.colors.foreground.link, 0.2),
        textUnderlineOffset: 2,
        ':hover': {
          textDecorationColor: theme.colors.foreground.primary,
        },
      },
    },
  }

  // function track() {
  //   if (window?.sa_event) {
  //     window.sa_event('clicked_' + href)
  //   }
  // }

  if (isExtern) {
    return (
      <Box
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        // onClick={track}
        href={href}
        style={[linkStyle, style]}>
        {children}
        <span title="Opens a new tab">
          <Box
            as="svg"
            display={!showExternIcon ? 'none' : 'inline-block'}
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 32 32"
            style={{
              marginLeft: -3,
              marginRight: -2,
              transform: 'translateY(3px)',
              color: 'inherit',
              width: 16,
              height: 16,
              stroke: theme.colors.foreground.primary,
              strokeWidth: 2,
            }}>
            <path d="M22 11L10.5 22.5M10.44 11H22v11.56" fill="none" />
          </Box>
          <VisuallyHidden as="span"> (new tab)</VisuallyHidden>
        </span>
      </Box>
    )
  }

  return (
    <Box as={NextLink} href={href} style={[linkStyle, style]}>
      {children}
    </Box>
  )
}
