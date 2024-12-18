import getWordsCount from './getWordCount.js'

export default function getReadingDuration(
  markdown: string,
  wordsPerMinute: number = 200
) {
  const words = getWordsCount(markdown)
  return Math.ceil(words / wordsPerMinute)
}
