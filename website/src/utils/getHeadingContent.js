import { arrayMap } from 'fast-loops'

function getNodeText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value.trim()
  }

  return ''
}

export default function getHeadingContent(children) {
  return arrayMap(children, getNodeText)
}
