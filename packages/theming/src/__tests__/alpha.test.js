import test from 'ava'

import alpha from '../../dist/alpha.js'

test('alterating alpha should work', (t) => {
  t.is(
    alpha('var(--red)', 0.2),
    'hsl(from var(--red) h s l / max(0, min(1, 0.2)))'
  )
})
