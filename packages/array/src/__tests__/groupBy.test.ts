import { describe, test, expect } from 'vitest'

import groupBy from '../groupBy'

describe('groupBy', () => {
  test('groups by string key', () => {
    const arr = [
      { category: 'fruit', name: 'apple' },
      { category: 'vegetable', name: 'carrot' },
      { category: 'fruit', name: 'banana' },
    ]

    const result = groupBy(arr, 'category')

    expect(result).toEqual({
      fruit: [
        { category: 'fruit', name: 'apple' },
        { category: 'fruit', name: 'banana' },
      ],
      vegetable: [{ category: 'vegetable', name: 'carrot' }],
    })
  })

  test('groups by function', () => {
    const arr = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
    ]

    const result = groupBy(arr, (item) => (item.value % 2 === 0 ? 'even' : 'odd'))

    expect(result).toEqual({
      odd: [{ value: 1 }, { value: 3 }],
      even: [{ value: 2 }, { value: 4 }],
    })
  })

  test('handles empty array', () => {
    const arr: Array<{ type: string }> = []
    const result = groupBy(arr, 'type')

    expect(result).toEqual({})
  })

  test('handles single item', () => {
    const arr = [{ type: 'a', value: 1 }]
    const result = groupBy(arr, 'type')

    expect(result).toEqual({
      a: [{ type: 'a', value: 1 }],
    })
  })

  test('preserves order within groups', () => {
    const arr = [
      { type: 'a', order: 1 },
      { type: 'a', order: 2 },
      { type: 'a', order: 3 },
    ]

    const result = groupBy(arr, 'type')

    expect(result.a[0].order).toBe(1)
    expect(result.a[1].order).toBe(2)
    expect(result.a[2].order).toBe(3)
  })
})

