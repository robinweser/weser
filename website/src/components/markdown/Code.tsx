'use client'
import { createContext, PropsWithChildren, useContext } from 'react'

import CodeBlock from '@/components/markdown/CodeBlock'
import InlineCode from '@/components/markdown/InlineCode'

import '../../../public/fonts/dank/dmvendor.css'

export const CodeBlockContext = createContext<boolean>(false)

type Props = {
  code: string
  language: string
}
export default function Code({ children, code }: PropsWithChildren<Props>) {
  const isCodeBlock = useContext(CodeBlockContext)

  if (isCodeBlock) {
    return <CodeBlock>{children}</CodeBlock>
  }

  return <InlineCode>{code}</InlineCode>
}

export function pre({ children }: PropsWithChildren) {
  return (
    <CodeBlockContext.Provider value={true}>
      {children}
    </CodeBlockContext.Provider>
  )
}
