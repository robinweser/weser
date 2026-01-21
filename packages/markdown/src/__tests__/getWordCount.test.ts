import { describe, test, expect } from 'vitest'

import getWordCount from '../getWordCount'

describe('getWordCount', () => {
  test('counts words correctly', () => {
    const markdown = 'This is a test sentence with some words'
    const result = getWordCount(markdown)

    expect(result).toBe(7) // 'is', 'test', 'sentence', 'with', 'some', 'words', 'This'
  })

  test('handles empty string', () => {
    const result = getWordCount('')

    expect(result).toBe(0)
  })

  test('ignores single character words', () => {
    const markdown = 'I a x y z have two words'
    const result = getWordCount(markdown)

    expect(result).toBe(3) // 'have', 'two', 'words'
  })

  test('handles markdown syntax', () => {
    const markdown = '# Heading\n\nThis is **bold** and *italic* text.'
    const result = getWordCount(markdown)

    // 'Heading', 'This', 'is', 'bold', 'and', 'italic', 'text'
    expect(result).toBe(7)
  })

  test('handles code blocks', () => {
    const markdown = '```js\nconst foo = bar\n```\nSome text'
    const result = getWordCount(markdown)

    // 'js', 'const', 'foo', 'bar', 'Some', 'text'
    expect(result).toBe(6)
  })

  test('handles mixed case', () => {
    const markdown = 'Hello WORLD Test'
    const result = getWordCount(markdown)

    expect(result).toBe(3)
  })

  test('handles numbers mixed with text', () => {
    const markdown = 'test123 hello456world'
    const result = getWordCount(markdown)

    // 'test', 'hello', 'world' - the regex matches sequences of 2+ letters
    expect(result).toBe(3)
  })
})

