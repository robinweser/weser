import { describe, test, expect } from 'vitest'

import alpha from '../alpha'
import hue from '../hue'
import saturation from '../saturation'
import lightness from '../lightness'
import lighten from '../lighten'
import darken from '../darken'
import saturate from '../saturate'
import desaturate from '../desaturate'
import rotate from '../rotate'
import opacify from '../opacify'
import transparentize from '../transparentize'
import grayscale, { greyscale } from '../grayscale'
import complement from '../complement'
import invert from '../invert'

describe('alpha', () => {
  test('setting alpha should work', () => {
    expect(alpha('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h s l / max(0, min(1, 0.2)))'
    )
  })

  test('setting alpha to 1 should work', () => {
    expect(alpha('red', 1)).toBe('hsl(from red h s l / max(0, min(1, 1)))')
  })
})

describe('hue', () => {
  test('setting absolute hue should work', () => {
    expect(hue('var(--red)', 180)).toBe('hsl(from var(--red) 180 s l)')
  })

  test('setting hue to 0 should work', () => {
    expect(hue('red', 0)).toBe('hsl(from red 0 s l)')
  })
})

describe('saturation', () => {
  test('setting absolute saturation should work', () => {
    expect(saturation('var(--red)', 50)).toBe('hsl(from var(--red) h 50% l)')
  })

  test('setting saturation to 100 should work', () => {
    expect(saturation('red', 100)).toBe('hsl(from red h 100% l)')
  })
})

describe('lightness', () => {
  test('setting absolute lightness should work', () => {
    expect(lightness('var(--red)', 50)).toBe('hsl(from var(--red) h s 50%)')
  })

  test('setting lightness to 0 should work', () => {
    expect(lightness('red', 0)).toBe('hsl(from red h s 0%)')
  })
})

describe('lighten', () => {
  test('lightening a color should work', () => {
    expect(lighten('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h s calc(max(0, min(100, l + 20))))'
    )
  })

  test('lightening by 50% should work', () => {
    expect(lighten('red', 0.5)).toBe(
      'hsl(from red h s calc(max(0, min(100, l + 50))))'
    )
  })
})

describe('darken', () => {
  test('darkening a color should work', () => {
    expect(darken('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h s calc(max(0, min(100, l - 20))))'
    )
  })

  test('darkening by 50% should work', () => {
    expect(darken('red', 0.5)).toBe(
      'hsl(from red h s calc(max(0, min(100, l - 50))))'
    )
  })
})

describe('saturate', () => {
  test('saturating a color should work', () => {
    expect(saturate('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h calc(max(0, min(100, s + 20))) l)'
    )
  })

  test('saturating by 50% should work', () => {
    expect(saturate('red', 0.5)).toBe(
      'hsl(from red h calc(max(0, min(100, s + 50))) l)'
    )
  })
})

describe('desaturate', () => {
  test('desaturating a color should work', () => {
    expect(desaturate('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h calc(max(0, min(100, s - 20))) l)'
    )
  })

  test('desaturating by 50% should work', () => {
    expect(desaturate('red', 0.5)).toBe(
      'hsl(from red h calc(max(0, min(100, s - 50))) l)'
    )
  })
})

describe('rotate', () => {
  test('rotating hue should work', () => {
    expect(rotate('var(--red)', 90)).toBe(
      'hsl(from var(--red) calc(h + 90) s l)'
    )
  })

  test('rotating by negative degrees should work', () => {
    expect(rotate('red', -45)).toBe('hsl(from red calc(h + -45) s l)')
  })
})

describe('opacify', () => {
  test('increasing alpha should work', () => {
    expect(opacify('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h s l / max(0, min(1, calc(alpha + 0.2))))'
    )
  })

  test('opacifying by 0.5 should work', () => {
    expect(opacify('red', 0.5)).toBe(
      'hsl(from red h s l / max(0, min(1, calc(alpha + 0.5))))'
    )
  })
})

describe('transparentize', () => {
  test('decreasing alpha should work', () => {
    expect(transparentize('var(--red)', 0.2)).toBe(
      'hsl(from var(--red) h s l / max(0, min(1, calc(alpha - 0.2))))'
    )
  })

  test('transparentizing by 0.5 should work', () => {
    expect(transparentize('red', 0.5)).toBe(
      'hsl(from red h s l / max(0, min(1, calc(alpha - 0.5))))'
    )
  })
})

describe('grayscale', () => {
  test('removing saturation should work', () => {
    expect(grayscale('var(--red)')).toBe('hsl(from var(--red) h 0% l)')
  })

  test('grayscale on named color should work', () => {
    expect(grayscale('red')).toBe('hsl(from red h 0% l)')
  })

  test('greyscale alias should work', () => {
    expect(greyscale('red')).toBe('hsl(from red h 0% l)')
  })
})

describe('complement', () => {
  test('getting complement should work', () => {
    expect(complement('var(--red)')).toBe('hsl(from var(--red) calc(h + 180) s l)')
  })

  test('complement on named color should work', () => {
    expect(complement('red')).toBe('hsl(from red calc(h + 180) s l)')
  })
})

describe('invert', () => {
  test('inverting a color should work', () => {
    expect(invert('var(--red)')).toBe(
      'hsl(from var(--red) calc(h + 180) s calc(100% - l))'
    )
  })

  test('invert on named color should work', () => {
    expect(invert('red')).toBe('hsl(from red calc(h + 180) s calc(100% - l))')
  })
})

