import { PropsWithChildren } from 'react'
import Image from 'next/image'

import Heading from '@/components/markdown/Heading'
import Box from '@/components/system/Box'
import Code from '@/components/markdown/Code'
import CodeBox from '@/components/markdown/CodeBox'
import theme from '@/utils/theme'

export { default as Image } from 'next/image'
export { default as Head } from 'next/head'
export { Box, Grid } from '@/components/system/core'
export { default as blockquote } from '@/components/markdown/Callout'
export { default as Callout } from '@/components/markdown/Callout'
export { default as a } from '@/components/system/Link'
export { default as p } from '@/components/markdown/Paragraph'
export { default as PackageBadges } from '@/components/PackageBadges'
export { pre } from '@/components/markdown/Code'

export const h1 = ({ children }: PropsWithChildren) => (
  <Heading level={1}>{children}</Heading>
)
export const h2 = ({ children }: PropsWithChildren) => (
  <Heading level={2}>{children}</Heading>
)
export const h3 = ({ children }: PropsWithChildren) => (
  <Heading level={3}>{children}</Heading>
)
export const h4 = ({ children }: PropsWithChildren) => (
  <Heading level={4}>{children}</Heading>
)
export const h5 = ({ children }: PropsWithChildren) => (
  <Heading level={5}>{children}</Heading>
)

export const ul = ({ children }: PropsWithChildren) => (
  <Box
    as="ul"
    gap={1}
    marginTop={2.5}
    marginBottom={2.5}
    paddingLeft={4.5}
    style={{
      lineHeight: 1.5,
      'p + &': {
        marginTop: -6,
      },
    }}>
    {children}
  </Box>
)

export const ol = ({ children }: PropsWithChildren) => (
  <Box
    as="ol"
    gap={1}
    marginTop={2.5}
    marginBottom={2.5}
    paddingLeft={6}
    style={{
      lineHeight: 1.5,
      'p + &': {
        marginTop: -6,
      },
    }}>
    {children}
  </Box>
)

export const strong = ({ children }: PropsWithChildren) => (
  <strong style={{ display: 'inline', fontWeight: 600 }}>{children}</strong>
)

type ImgProps = {
  id: string
  src: string
  alt: string
}
function Img({ src, alt }: Omit<ImgProps, 'id'>) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

export async function img({ id, src, alt }: ImgProps) {
  const isExtern = src.startsWith('http')

  // if (!isExtern) {
  //   const image = await import('../../public/posts/' + id + '/' + src)

  //   return (
  //     <Box
  //       as="span"
  //       style={{ position: 'relative' }}
  //       marginLeft={[-5, , 0]}
  //       marginRight={[-5, , 0]}
  //       maxWidth={['calc(100% + 40px)', , '100%']}>
  //       <Img src={image} alt={alt} />
  //     </Box>
  //   )
  // }

  return (
    <Box
      as="span"
      style={{ position: 'relative' }}
      marginLeft={[-5, , 0]}
      marginRight={[-5, , 0]}
      maxWidth={['calc(100% + 40px)', , '100%']}>
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  )
}

type CodeProps = {
  className: string
  children: string
}
export function code({ children, className = '' }: CodeProps) {
  const language = className.replace(/language-/, '')

  return (
    <Code language={language} code={children}>
      <CodeBox language={language} code={children} />
    </Code>
  )
}

export function tr({ children }: PropsWithChildren) {
  return (
    <Box
      as="tr"
      display="table-row"
      style={{
        border: 0,
      }}>
      {children}
    </Box>
  )
}

export function td({ children }: PropsWithChildren) {
  return (
    <Box
      as="td"
      display="table-cell"
      style={{
        textAlign: 'left',
        overflow: 'auto',
        lineHeight: 1.4,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderStyle: 'solid',
        borderColor: theme.colors.border,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        ':first-child': {
          borderLeftWidth: 0,
          paddingLeft: [20, , 8],
        },
        ':last-child': {
          paddingRight: [20, , 8],
        },
      }}>
      {children}
    </Box>
  )
}

export function th({ children }: PropsWithChildren) {
  return (
    <Box
      as="th"
      bg={theme.colors.background.tableHeader}
      display="table-cell"
      style={{
        textAlign: 'left',
        overflow: 'auto',
        lineHeight: 1.4,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 0,
        borderStyle: 'solid',
        fontWeight: 600,
        borderColor: theme.colors.border,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        ':first-child': {
          borderLeftWidth: 0,
          paddingLeft: [20, , 8],
        },
        ':last-child': {
          paddingRight: [20, , 8],
        },
      }}>
      {children}
    </Box>
  )
}

export function table({ children }: PropsWithChildren) {
  return (
    <Box
      data-id="table"
      overflow="auto"
      marginLeft={[-5, , 0]}
      marginRight={[-5, , 0]}
      maxWidth={['calc(100% + 40px)', , '100%']}>
      <Box
        as="table"
        display="table"
        marginTop={1}
        width="100%"
        style={{ borderCollapse: 'collapse' }}>
        {children}
      </Box>
    </Box>
  )
}
