import { createElement } from 'react'

export default function createStyleNode(
  animationName: string,
  css: string,
  nonce?: string
) {
  return createElement('style', {
    dangerouslySetInnerHTML: { __html: css },
    precedence: 'low',
    href: animationName,
    nonce,
  })
}
