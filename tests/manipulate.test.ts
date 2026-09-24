import { describe, it, expect } from 'vitest'
import { hexToHsl, hexToRgb } from '../src/convert/index.js'
import {
  darken,
  desaturate,
  getAlpha,
  grayscale,
  invertColor,
  lighten,
  mixColors,
  rotateHue,
  saturate,
  setAlpha,
} from '../src/manipulate.js'

// ─── Manipulation ────────────────────────────────────────────────────────────

describe('lighten / darken', () => {
  it('lighten increases lightness', () => {
    const [, , l1] = hexToHsl('#3498db')
    const [, , l2] = hexToHsl(lighten('#3498db', 10))
    expect(l2).toBeGreaterThan(l1)
  })
  it('darken decreases lightness', () => {
    const [, , l1] = hexToHsl('#3498db')
    const [, , l2] = hexToHsl(darken('#3498db', 10))
    expect(l2).toBeLessThan(l1)
  })
  it('lighten clamps at 100', () => {
    const [, , l] = hexToHsl(lighten('#ffffff', 50))
    expect(l).toBe(100)
  })
  it('darken clamps at 0', () => {
    const [, , l] = hexToHsl(darken('#000000', 50))
    expect(l).toBe(0)
  })
})

describe('saturate / desaturate', () => {
  it('saturate increases saturation', () => {
    const [, s1] = hexToHsl('#888888')
    const [, s2] = hexToHsl(saturate('#888888', 20))
    expect(s2).toBeGreaterThanOrEqual(s1)
  })
  it('desaturate decreases saturation', () => {
    const [, s1] = hexToHsl('#ff0000')
    const [, s2] = hexToHsl(desaturate('#ff0000', 30))
    expect(s2).toBeLessThan(s1)
  })
})

describe('invertColor', () => {
  it('inverts black to white', () => expect(invertColor('#000000')).toBe('#ffffff'))
  it('inverts white to black', () => expect(invertColor('#ffffff')).toBe('#000000'))
  it('inverts red', () => expect(invertColor('#ff0000')).toBe('#00ffff'))
})

describe('grayscale', () => {
  it('gray is unchanged', () => {
    const result = grayscale('#808080')
    const [r, g, b] = hexToRgb(result)
    expect(r).toBe(g)
    expect(g).toBe(b)
  })
  it('colorful → r=g=b', () => {
    const result = grayscale('#3498db')
    const [r, g, b] = hexToRgb(result)
    expect(r).toBe(g)
    expect(g).toBe(b)
  })
})

describe('setAlpha / getAlpha', () => {
  it('setAlpha returns rgba string', () => {
    expect(setAlpha('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
  })
  it('getAlpha returns 1 for hex', () => expect(getAlpha('#ff0000')).toBe(1))
  it('getAlpha reads rgba alpha', () => expect(getAlpha('rgba(255,0,0,0.3)')).toBeCloseTo(0.3, 1))
})

describe('rotateHue', () => {
  it('180° rotation gives complement', () => {
    const [h1] = hexToHsl('#ff0000')
    const [h2] = hexToHsl(rotateHue('#ff0000', 180))
    expect(Math.abs(h2 - ((h1 + 180) % 360))).toBeLessThanOrEqual(1)
  })
  it('negative rotation', () => {
    expect(rotateHue('#ff0000', -30)).toBe(rotateHue('#ff0000', 330))
  })
})

describe('mixColors', () => {
  it('t=0 returns first color', () => expect(mixColors('#ff0000', '#0000ff', 0)).toBe('#ff0000'))
  it('t=1 returns second color', () => expect(mixColors('#ff0000', '#0000ff', 1)).toBe('#0000ff'))
  it('t=0.5 rgb midpoint black→white', () =>
    expect(mixColors('#000000', '#ffffff', 0.5)).toBe('#808080'))
  it('hsl mode returns valid hex', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'hsl' })).toMatch(/^#[0-9a-f]{6}$/))
  it('lab mode returns valid hex', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'lab' })).toMatch(/^#[0-9a-f]{6}$/))
  it('lch mode returns valid hex', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'lch' })).toMatch(/^#[0-9a-f]{6}$/))
  it('oklab mode returns valid hex', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'oklab' })).toMatch(/^#[0-9a-f]{6}$/))
  it('oklch mode returns valid hex', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'oklch' })).toMatch(/^#[0-9a-f]{6}$/))
  it('oklch shorter hue stays between endpoints', () => {
    const result = mixColors('#ff0000', '#00ff00', 0.5, {
      mode: 'oklch',
      hueInterpolation: 'shorter',
    })
    expect(result).toMatch(/^#[0-9a-f]{6}$/)
  })
  it('format rgb', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { format: 'rgb' })).toMatch(/^rgb\(/))
  it('format rgba', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { format: 'rgba' })).toMatch(/^rgba\(/))
  it('format hsl', () =>
    expect(mixColors('#ff0000', '#0000ff', 0.5, { format: 'hsl' })).toMatch(/^hsl\(/))
})
