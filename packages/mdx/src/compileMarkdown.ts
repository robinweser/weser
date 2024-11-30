'use server'
import { createElement } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'
import getHeadings from './getHeadings'

export default async function compileMarkdown<
  MetaData,
  Scope extends Record<string, any>,
>(markdown: string, components: any, scope?: Scope) {
  const { content, frontmatter } = await compileMDX<MetaData>({
    source: markdown,
    // @ts-ignore
    components: {
      ...components,
      img: (props: any) =>
        createElement(components.img, { ...props, ...scope }),
    },
    options: {
      scope,
      parseFrontmatter: true,
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
