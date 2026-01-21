import { describe, test, expect } from 'vitest'

import getHeadings from '../getHeadings'

describe('getHeadings', () => {
  test('extracts headings with correct depth', () => {
    const markdown = `# Heading 1
## Heading 2
### Heading 3`

    const result = getHeadings(markdown)

    expect(result).toHaveLength(3)
    expect(result[0].depth).toBe(1)
    expect(result[1].depth).toBe(2)
    expect(result[2].depth).toBe(3)
  })

  test('extracts heading text as children', () => {
    const markdown = '# Hello World'

    const result = getHeadings(markdown)

    expect(result[0].children).toBe('Hello World')
  })

  test('generates URL-safe IDs', () => {
    const markdown = '# Hello World'

    const result = getHeadings(markdown)

    expect(result[0].id).toBe('hello-world')
  })

  test('handles colons in headings', () => {
    const markdown = '# Section: Introduction'

    const result = getHeadings(markdown)

    expect(result[0].id).toBe('section--introduction')
  })

  test('respects minDepth config', () => {
    const markdown = `# Heading 1
## Heading 2
### Heading 3`

    const result = getHeadings(markdown, { minDepth: 2 })

    expect(result).toHaveLength(2)
    expect(result[0].depth).toBe(2)
  })

  test('respects maxDepth config', () => {
    const markdown = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5`

    const result = getHeadings(markdown, { maxDepth: 3 })

    expect(result).toHaveLength(3)
    expect(result.every((h) => h.depth <= 3)).toBe(true)
  })

  test('respects both minDepth and maxDepth', () => {
    const markdown = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4`

    const result = getHeadings(markdown, { minDepth: 2, maxDepth: 3 })

    expect(result).toHaveLength(2)
    expect(result[0].depth).toBe(2)
    expect(result[1].depth).toBe(3)
  })

  test('handles empty markdown', () => {
    const result = getHeadings('')

    expect(result).toEqual([])
  })

  test('handles markdown without headings', () => {
    const markdown = 'Just some paragraph text without any headings.'

    const result = getHeadings(markdown)

    expect(result).toEqual([])
  })

  test('handles inline code in headings', () => {
    const markdown = '# Using `useState` Hook'

    const result = getHeadings(markdown)

    expect(result[0].children).toBe('Using useState Hook')
  })

  test('strips frontmatter', () => {
    const markdown = `---
title: Test
---

# Real Heading`

    const result = getHeadings(markdown)

    expect(result).toHaveLength(1)
    expect(result[0].children).toBe('Real Heading')
  })
})

