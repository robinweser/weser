'use client'
import { PropsWithChildren, ReactElement } from 'react'

import Text from '@/components/system/Text'
import Anchor from '@/components/system/Anchor'

import getHeadingId from '@/utils/getHeadingId'
import { typography } from '@/utils/theme'

type Level = 1 | 2 | 3 | 4 | 5

const variantMap = {
  1: 'heading1',
  2: 'heading2',
  3: 'heading3',
  4: 'heading4',
  5: 'heading5',
} as Record<number, keyof typeof typography>

type Props = {
  level: Level
}

export default function Heading({ level, children }: PropsWithChildren<Props>) {
  const id =
    level > 1
      ? getHeadingId(getStringyChildren(children as ReactElement))
      : undefined

  return (
    <Anchor id={id} offset={30}>
      <Text
        as={('h' + level) as 'h2'}
        variant={variantMap[level as keyof typeof variantMap]}
        onClick={() => {
          // @ts-ignore
          window.location.hash = encodeURIComponent(id)
        }}
        style={{
          display: 'block',
          cursor: id ? 'pointer' : 'inherit',
          paddingTop:
            level === 1
              ? 0
              : level === 2
                ? '3rem'
                : level === 3
                  ? '2.5rem'
                  : '1rem',
          paddingBottom: level === 2 ? 16 : level === 3 ? 12 : 8,
          lineHeight: 1.0,
        }}>
        {typeof children === 'string'
          ? children.split('//')[0].trim()
          : children}
      </Text>
    </Anchor>
  )
}

function getStringyChildren(children: ReactElement): string {
  if (typeof children === 'string') {
    const [content, customId] = (children as string)
      .split('//')
      .map((item) => item.trim())

    return customId || content
  }

  if (Array.isArray(children)) {
    return children.map(getStringyChildren).join('')
  }

  if (typeof children === 'object') {
    if (children.props && children.props.children) {
      return getStringyChildren(children.props.children)
    }
  }

  return ''
}
