import { describe, test, expect } from 'vitest'

import getReadingDuration from '../getReadingDuration'

describe('getReadingDuration', () => {
  test('calculates duration with default words per minute', () => {
    // 200 words at 200 WPM = 1 minute
    const markdown = Array(200).fill('word').join(' ')
    const result = getReadingDuration(markdown)

    expect(result).toBe(1)
  })

  test('uses custom words per minute', () => {
    // 100 words at 100 WPM = 1 minute
    const markdown = Array(100).fill('word').join(' ')
    const result = getReadingDuration(markdown, 100)

    expect(result).toBe(1)
  })

  test('rounds up partial minutes', () => {
    // 201 words at 200 WPM = 1.005 minutes -> should round up to 2
    const markdown = Array(201).fill('word').join(' ')
    const result = getReadingDuration(markdown)

    expect(result).toBe(2)
  })

  test('handles empty string', () => {
    const result = getReadingDuration('')

    expect(result).toBe(0)
  })

  test('handles very short content', () => {
    const markdown = 'Hello world'
    const result = getReadingDuration(markdown)

    expect(result).toBe(1) // 2 words / 200 = 0.01, ceil = 1
  })

  test('handles faster reading speed', () => {
    // 400 words at 400 WPM = 1 minute
    const markdown = Array(400).fill('word').join(' ')
    const result = getReadingDuration(markdown, 400)

    expect(result).toBe(1)
  })
})

