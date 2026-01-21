import { describe, test, expect } from 'vitest'

import hash from '../hash'

describe('hash', () => {
  test('generates consistent hash for same input', () => {
    const input = 'test string'
    const hash1 = hash(input)
    const hash2 = hash(input)

    expect(hash1).toBe(hash2)
  })

  test('generates different hashes for different inputs', () => {
    const hash1 = hash('input1')
    const hash2 = hash('input2')

    expect(hash1).not.toBe(hash2)
  })

  test('returns string starting with x', () => {
    const result = hash('test')

    expect(result.startsWith('x')).toBe(true)
  })

  test('handles empty string', () => {
    const result = hash('')

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  test('handles long strings', () => {
    const longString = 'a'.repeat(10000)
    const result = hash(longString)

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  test('handles special characters', () => {
    const result = hash('!@#$%^&*(){}[]')

    expect(typeof result).toBe('string')
  })

  test('handles unicode characters', () => {
    const result = hash('日本語テスト')

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

