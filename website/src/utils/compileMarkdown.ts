'use server'
import { createElement } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import * as components from '@/components/markdown'
import getHeadings from '@/utils/getHeadings'

type Scope = {
  id: string
}

const Img = components.img

export default async function compileMarkdown<MetaData>(
  markdown: string,
  scope?: Scope
) {
  const { content, frontmatter } = await compileMDX<MetaData>({
    source: markdown,
    // @ts-ignore
    components: {
      ...components,
      // @ts-ignore
      img: (props) => createElement(components.img, { ...props, ...scope }),
    },
    options: {
      scope,
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  const headings = getHeadings(markdown)
  const words = markdown.match(/[a-z]{2,}/gi)?.length || 0
  const duration = Math.ceil(words / 200)

  return {
    content,
    words,
    duration,
    headings,
    meta: { ...frontmatter, words, duration },
  }
}
