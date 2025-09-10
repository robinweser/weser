import test from 'ava'

import toZod from '../../dist/toZod.js'

function run(schema, value) {
  return () => {
    const result = toZod(schema).safeParse(value)

    if (!result.success) {
      throw Error(result.error)
    }
  }
}

test('converting JSON schema to zod should convert enums', (t) => {
  // basic
  t.notThrows(
    run(
      {
        enum: ['foo', 'bar'],
      },
      'foo'
    )
  )
  t.throws(
    run(
      {
        enum: ['foo', 'bar'],
      },
      'baz'
    )
  )

  // default
  t.notThrows(run({ enum: ['foo', 'bar'], default: 'foo' }))
})

test('converting JSON schema to zod should convert strings', (t) => {
  // basic
  t.notThrows(
    run(
      {
        type: 'string',
      },
      'foo'
    )
  )

  // minLength
  t.throws(
    run(
      {
        type: 'string',
        minLength: 4,
      },
      'foo'
    )
  )
  t.notThrows(
    run(
      {
        type: 'string',
        minLength: 4,
      },
      'fooo'
    )
  )

  // default
  t.notThrows(run({ type: 'string', minLength: 3, default: 'foo' }))
})

test('converting JSON schema to zod should convert uri strings', (t) => {
  t.notThrows(
    run(
      {
        type: 'string',
        format: 'uri',
      },
      'https://example.com'
    )
  )
  t.throws(
    run(
      {
        type: 'string',
        format: 'uri',
      },
      'not-a-url'
    )
  )
})

test('converting JSON schema to zod should convert numbers', (t) => {
  // basic
  t.notThrows(
    run(
      {
        type: 'number',
      },
      3
    )
  )

  // minimum
  t.throws(
    run(
      {
        type: 'number',
        minimum: 4,
      },
      3
    )
  )
  t.notThrows(
    run(
      {
        type: 'number',
        minimum: 4,
      },
      5
    )
  )

  // maximum
  t.throws(
    run(
      {
        type: 'number',
        maximum: 5,
      },
      6
    )
  )
  t.notThrows(
    run(
      {
        type: 'number',
        maximum: 5,
      },
      5
    )
  )

  // default
  t.notThrows(run({ type: 'number', minimum: 3, default: 5 }))
})

test('converting JSON schema to zod should convert objects', (t) => {
  // basic
  t.notThrows(
    run(
      {
        type: 'object',
        properties: {
          foo: { type: 'string', minLength: 3 },
          bar: { enum: ['bar', 'baz'] },
        },
      },
      {
        foo: 'foo',
        bar: 'baz',
      }
    )
  )
  t.throws(
    run(
      {
        type: 'object',
        properties: {
          foo: { type: 'string', minLength: 3 },
          bar: { enum: ['bar', 'baz'] },
        },
      },
      {
        foo: 'fo',
        bar: 'foo',
      }
    )
  )
})

test('converting JSON schema to zod should convert booleans', (t) => {
  // basic
  t.notThrows(
    run(
      {
        type: 'boolean',
      },
      true
    )
  )
  t.throws(
    run(
      {
        type: 'boolean',
      },
      'true'
    )
  )

  // default
  t.notThrows(run({ type: 'boolean', default: true }))
})
