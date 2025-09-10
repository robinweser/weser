export default function getWordCount(markdown: string) {
  return markdown.match(/[a-z]{2,}/gi)?.length || 0
}
