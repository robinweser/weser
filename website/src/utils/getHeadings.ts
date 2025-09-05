import { arrayReduce } from 'fast-loops'
import { fromMarkdown as parseMarkdown } from 'mdast-util-from-markdown'
import matter from 'gray-matter'

import getHeadingId from '@/utils/getHeadingId'
import getHeadingContent from '@/utils/getHeadingContent'

const MIN_DEPTH = 1
const MAX_DEPTH = 4

export type Heading = {
  id: string
  children: string
  depth: number
}

export default function getHeadings(markdown: string): Array<Heading> {
  const { content } = matter(markdown)
  const ast = parseMarkdown(content)

  return arrayReduce<(typeof ast.children)[0], Array<Heading>>(
    ast.children,
    (headings, child) => {
      if (
        child.type === 'heading' &&
        child.depth >= MIN_DEPTH &&
        child.depth <= MAX_DEPTH
      ) {
        const content = getHeadingContent(child.children)

        const [children, customId = ''] = content
          .join(' ')
          .split('//')
          .map((item) => item.trim())

        headings.push({
          id: customId.toLowerCase() || getHeadingId(children),
          depth: child.depth,
          children,
        })
      }

      return headings
    },
    []
  )
}
