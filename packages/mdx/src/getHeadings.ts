import { arrayReduce, arrayMap } from 'fast-loops'
import { fromMarkdown as parseMarkdown } from 'mdast-util-from-markdown'
import matter from 'gray-matter'

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

const MIN_DEPTH = 2
const MAX_DEPTH = 4

type Heading = {
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
