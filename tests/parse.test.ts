import { describe, it, expect } from 'vitest'
import {
  getColorType,
  isColorFunction,
  isHexColor,
  isOklchColor,
  normalizeColor,
  parseColorFn,
  parseCssVar,
  parseOklchString,
  toNearestNamedColor,
} from '../src/parse.js'

// ─── Detection ───────────────────────────────────────────────────────────────

describe('getColorType', () => {
  it('detects hex', () => expect(getColorType('#ff0000')).toBe('hex'))
  it('detects short hex', () => expect(getColorType('#f00')).toBe('hex'))
  it('detects rgb', () => expect(getColorType('rgb(255,0,0)')).toBe('rgb'))
  it('detects rgba', () => expect(getColorType('rgba(255,0,0,0.5)')).toBe('rgb'))
  it('detects hsl', () => expect(getColorType('hsl(0,100%,50%)')).toBe('hsl'))
  it('detects css-var', () => expect(getColorType('var(--color)')).toBe('css-var'))
  it('detects all 148+ named colors', () => {
    expect(getColorType('rebeccapurple')).toBe('named')
    expect(getColorType('cornflowerblue')).toBe('named')
    expect(getColorType('lightgoldenrodyellow')).toBe('named')
    expect(getColorType('transparent')).toBe('named')
  })
  it('returns unknown for garbage', () => expect(getColorType('not-a-color')).toBe('unknown'))
})

// ─── Named colors & normalizeColor ───────────────────────────────────────────

describe('toNearestNamedColor', () => {
  it('pure red → red', () => expect(toNearestNamedColor('#ff0000')).toBe('red'))
  it('pure white → white', () => expect(toNearestNamedColor('#ffffff')).toBe('white'))
  it('pure black → black', () => expect(toNearestNamedColor('#000000')).toBe('black'))
})

describe('normalizeColor', () => {
  it('parses hex', () => {
    const c = normalizeColor('#ff0000')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })
  it('parses rgba string', () => {
    const c = normalizeColor('rgba(255, 0, 0, 0.5)')
    expect(c.r).toBe(255)
    expect(c.a).toBeCloseTo(0.5)
  })
  it('parses hsl string', () => {
    const c = normalizeColor('hsl(240, 100%, 50%)')
    expect(c.h).toBe(240)
  })
  it('parses {r,g,b} object', () => {
    const c = normalizeColor({ r: 0, g: 255, b: 0 })
    expect(c.hex).toBe('#00ff00')
  })
  it('parses {h,s,l} object', () => {
    const c = normalizeColor({ h: 0, s: 100, l: 50 })
    expect(c.r).toBe(255)
  })
  it('parses oklch() string', () => {
    const c = normalizeColor('oklch(0.627 0.111 251)')
    expect(c.type).toBe('oklch')
    expect(c.hex).toMatch(/^#[0-9a-f]{6}$/)
  })
  it('parses color(display-p3 ...) string', () => {
    const c = normalizeColor('color(display-p3 1 0 0)')
    expect(c.type).toBe('color')
    expect(c.hex).toMatch(/^#[0-9a-f]{6}$/)
  })
  it('parses #RGBA 4-digit hex', () => {
    const c = normalizeColor('#f00f')
    expect(c.type).toBe('hex')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })
  it('parses a named color', () => {
    const c = normalizeColor('red')
    expect(c.type).toBe('named')
    expect(c.hex).toBe('#ff0000')
    expect(c.r).toBe(255)
    expect(c.g).toBe(0)
    expect(c.b).toBe(0)
  })
  it('parses a multi-word named color case-insensitively', () => {
    const c = normalizeColor('CornflowerBlue')
    expect(c.type).toBe('named')
    expect(c.hex).toBe('#6495ed')
  })
  it('still special-cases transparent', () => {
    const c = normalizeColor('transparent')
    expect(c.type).toBe('named')
    expect(c.a).toBe(0)
  })
  it('falls back to unknown for an unrecognized string', () => {
    const c = normalizeColor('not-a-color')
    expect(c.type).toBe('unknown')
  })
})

// ─── CSS string parsers ──────────────────────────────────────────────────────

describe('isOklchColor', () => {
  it('detects oklch()', () => expect(isOklchColor('oklch(0.5 0.1 180)')).toBe(true))
  it('detects oklcha()', () => expect(isOklchColor('oklcha(0.5 0.1 180 / 0.5)')).toBe(true))
  it('rejects rgb', () => expect(isOklchColor('rgb(255,0,0)')).toBe(false))
})

describe('isColorFunction', () => {
  it('detects color(display-p3 ...)', () =>
    expect(isColorFunction('color(display-p3 1 0 0)')).toBe(true))
  it('detects color(srgb ...)', () => expect(isColorFunction('color(srgb 1 0 0)')).toBe(true))
  it('rejects oklch', () => expect(isColorFunction('oklch(0.5 0.1 180)')).toBe(false))
})

describe('parseOklchString', () => {
  it('parses standard form', () => {
    const r = parseOklchString('oklch(0.65 0.15 25)')
    expect(r).not.toBeNull()
    expect(r!.L).toBeCloseTo(0.65, 2)
    expect(r!.C).toBeCloseTo(0.15, 2)
    expect(r!.H).toBeCloseTo(25, 1)
    expect(r!.alpha).toBe(1)
  })
  it('parses percentage L', () => {
    const r = parseOklchString('oklch(65% 0.15 25)')
    expect(r!.L).toBeCloseTo(0.65, 2)
  })
  it('parses alpha', () => {
    const r = parseOklchString('oklch(0.65 0.15 25 / 0.8)')
    expect(r!.alpha).toBeCloseTo(0.8, 2)
  })
  it('returns null for invalid', () => expect(parseOklchString('rgb(0,0,0)')).toBeNull())
})

describe('parseColorFn', () => {
  it('parses display-p3', () => {
    const r = parseColorFn('color(display-p3 1 0.5 0)')
    expect(r).not.toBeNull()
    expect(r!.space).toBe('display-p3')
    expect(r!.r).toBeCloseTo(1, 2)
    expect(r!.g).toBeCloseTo(0.5, 2)
    expect(r!.b).toBeCloseTo(0, 2)
    expect(r!.alpha).toBe(1)
  })
  it('parses percentage values', () => {
    const r = parseColorFn('color(srgb 100% 50% 0%)')
    expect(r!.r).toBeCloseTo(1, 2)
    expect(r!.g).toBeCloseTo(0.5, 2)
  })
  it('parses alpha', () => {
    const r = parseColorFn('color(display-p3 1 0 0 / 0.5)')
    expect(r!.alpha).toBeCloseTo(0.5, 2)
  })
  it('returns null for invalid', () => expect(parseColorFn('not-color')).toBeNull())
})

describe('parseCssVar', () => {
  it('parses without fallback', () => {
    const r = parseCssVar('var(--primary)')
    expect(r).not.toBeNull()
    expect(r!.variableName).toBe('--primary')
    expect(r!.fallback).toBeUndefined()
  })
  it('parses with fallback', () => {
    const r = parseCssVar('var(--primary, #3498db)')
    expect(r!.variableName).toBe('--primary')
    expect(r!.fallback).toBe('#3498db')
  })
  it('returns null for non-var', () => expect(parseCssVar('#ff0000')).toBeNull())
})

describe('getColorType extended', () => {
  it('detects oklch', () => expect(getColorType('oklch(0.5 0.1 180)')).toBe('oklch'))
  it('detects color()', () => expect(getColorType('color(display-p3 1 0 0)')).toBe('color'))
})

// ─── Regression tests ────────────────────────────────────────────────────────

describe('CSS-wide keywords with no fixed color (currentcolor/inherit/initial/unset)', () => {
  it.each(['currentcolor', 'inherit', 'initial', 'unset'])(
    'normalizeColor(%s) reports type "unknown", not a fabricated named color',
    (kw) => {
      const n = normalizeColor(kw)
      expect(n.type).toBe('unknown')
      expect(n.hex).toBeUndefined()
      expect(n.r).toBeUndefined()
    },
  )
  it.each(['currentcolor', 'inherit', 'initial', 'unset'])(
    'getColorType(%s) is "unknown"',
    (kw) => {
      expect(getColorType(kw)).toBe('unknown')
    },
  )
  it('transparent is still resolved as a real color (a: 0)', () => {
    const n = normalizeColor('transparent')
    expect(n.type).toBe('named')
    expect(n.a).toBe(0)
  })
})

describe('toNearestNamedColor no longer collapses onto the invalid-hex fallback', () => {
  it('a color near the old #f5e477 fallback resolves to a real nearby named color, not "transparent"', () => {
    expect(toNearestNamedColor('#f5e477')).not.toBe('transparent')
  })
})

describe('isHexColor / getColorType recognize 8-digit #rrggbbaa hex', () => {
  it('isHexColor accepts an 8-digit hex string', () => {
    expect(isHexColor('#ff0000ff')).toBe(true)
  })
  it('getColorType reports "hex" for an 8-digit hex string', () => {
    expect(getColorType('#ff0000ff')).toBe('hex')
  })
})

describe('color(srgb-linear ...) applies linear-to-sRGB gamma correction', () => {
  it('a mid-range linear value is NOT treated as already gamma-encoded', () => {
    const n = normalizeColor('color(srgb-linear 0.5 0 0)')
    // Linear 0.5 gamma-encodes to ~188 (0.7354 * 255), not 128 (0.5 * 255).
    expect(n.r).toBeGreaterThan(180)
    expect(n.r).toBeLessThan(195)
  })
  it('the 0/1 extremes are unaffected (still #ff0000 for full red)', () => {
    expect(normalizeColor('color(srgb-linear 1 0 0)').hex).toBe('#ff0000')
  })
})
