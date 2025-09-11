import { codeToHtml } from 'shiki'

import useMode from '@/hooks/useMode'

import './shiki.css'

type Props = {
  code: string
  language: string
}
export default async function CodeBox({ code, language }: Props) {
  const markup = await highlight(code, language)

  return (
    <div className={language} dangerouslySetInnerHTML={{ __html: markup }} />
  )
}

async function highlight(code: string, language: string) {
  return await codeToHtml(code, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'nord',
    },
  })
}
