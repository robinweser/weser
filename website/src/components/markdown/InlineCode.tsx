import El from '@/components/system/El'
import { PropsWithChildren } from 'react'
import theme from '@/utils/theme'

export default function InlineCode({ children }: PropsWithChildren) {
  return (
    <El
      as="code"
      style={{
        backgroundColor: theme.colors.background.inlineCode,
        fontFamily: 'dm, Dank, Dank Mono, Fira Code, Hack, Consolas, monospace',
        textRendering: 'optimizeLegibility',
        whiteSpace: 'break-spaces',
      }}>
      {children}
    </El>
  )
}
