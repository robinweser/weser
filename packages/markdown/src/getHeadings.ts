import { arrayReduce, arrayMap } from 'fast-loops'
import { fromMarkdown as parseMarkdown } from 'mdast-util-from-markdown'
import matter from 'gray-matter'

export type T_Heading = {
  id: string
  children: string
  depth: number
}

type Config = {
  minDepth?: number
  maxDepth?: number
}
const defaultConfig = {
  minDepth: 1,
  maxDepth: 4,
}
export default function getHeadings(
  markdown: string,
  config?: Config
): Array<T_Heading> {
  const { minDepth, maxDepth } = {
    ...defaultConfig,
    ...config,
  }
  const { content } = matter(markdown)
  const ast = parseMarkdown(content)

  type Node = (typeof ast.children)[0]

  return arrayReduce<Node, Array<T_Heading>>(
    ast.children,
    (headings, child) => {
      if (
        child.type === 'heading' &&
        child.depth >= minDepth &&
        child.depth <= maxDepth
      ) {
        const content = getHeadingContent(child.children)

        headings.push({
          id: getHeadingId(content.join('-')),
          children: content.join(' '),
          depth: child.depth,
        })
      }

      return headings
    },
    []
  )
}

function getHeadingId(text: string) {
  return encodeURI(text.replace(/( |:)/gi, '-').toLowerCase())
}

function getNodeText(node: any) {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value.trim()
  }

  return ''
}

function getHeadingContent(children: any) {
  return arrayMap(children, getNodeText)
}
