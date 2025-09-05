import { getHighlighter, DecorationItem } from 'shiki'

import './shiki.css'

type Props = {
  code: string
  language: string
  decorations?: Array<DecorationItem>
}
export default async function CodeBox({ code, language, decorations }: Props) {
  const markup = await highlight(code, language, decorations)

  return (
    <div className={language} dangerouslySetInnerHTML={{ __html: markup }} />
  )
}

let highlighter: any
async function highlight(
  code: string,
  language: string,
  decorations?: Array<DecorationItem>
) {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ['github-light', 'nord'],
      langs: [
        'javascript',
        'bash',
        'graphql',
        'css',
        'typescript',
        'jsx',
        'json',
        'html',
        'tsx',
        'sh',
        'xml',
        'yaml',
        'sql',
        'md',
      ],
    })
  }

  return await highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      // min-light
      light: 'github-light',
      dark: 'nord',
    },
    decorations,
  })
}
