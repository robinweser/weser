import test from 'ava'

import createKeyframe from '../../dist/createKeyframe.js'

test('creating keyframes should return a unique animationName', (t) => {
  const [animationName, node] = createKeyframe({
    from: {
      color: 'blue',
    },
    to: { fontSize: '16px', color: 'red' },
  })

  t.is(animationName, '_x9ioxkw')
  t.snapshot(node)
})

test('creating keyframes should re-use values from cache', (t) => {
  const [_1] = createKeyframe({
    to: { color: 'red' },
  })

  const [_2] = createKeyframe({
    to: { color: 'red' },
  })

  t.is(_1, '_x1nwcv5g')
  t.is(_1, _2)
})

test('creating keyframes should accept a nonce', (t) => {
  const nonce = 'NONCE'

  const [_, node] = createKeyframe(
    {
      to: { color: 'red' },
    },
    nonce
  )

  t.is(node.props.nonce, nonce)
})
