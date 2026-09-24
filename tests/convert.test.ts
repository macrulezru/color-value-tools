import { describe, it, expect } from 'vitest'
import { normalizeColor } from '../src/parse.js'
import {
  displayP3ToRgb,
  hexToHsl,
  hexToRgb,
  hslToHex,
  hslToRgb,
  hsvToRgb,
  hwbToRgb,
  normalizeHex,
  oklabToRgb,
  oklchToRgb,
  rgbToDisplayP3,
  rgbToHsl,
  rgbToHsv,
  rgbToHwb,
  rgbToOklab,
  rgbToOklch,
  rgbaStringToRgba,
  shortHexToRgba,
  toColorP3String,
  toDisplayP3Hex,
  toHslString,
  toHwbString,
  toOklchString,
} from '../src/convert/index.js'

// ─── Hex normalization ───────────────────────────────────────────────────────

describe('normalizeHex', () => {
  it('expands 3-digit hex', () => expect(normalizeHex('#f00')).toBe('#ff0000'))
  it('lowercases', () => expect(normalizeHex('#FF0000')).toBe('#ff0000'))
  it('adds # if missing', () => expect(normalizeHex('ff0000')).toBe('#ff0000'))
  it('fallback on invalid', () => expect(normalizeHex('#zzz')).toBe('#f5e477'))
})

// ─── Conversions ─────────────────────────────────────────────────────────────

describe('hexToRgb', () => {
  it('converts red', () => expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]))
  it('converts white', () => expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]))
  it('converts black', () => expect(hexToRgb('#000000')).toEqual([0, 0, 0]))
})

describe('hexToHsl / hslToHex round-trip', () => {
  it('red round-trip', () => {
    const [h, s, l] = hexToHsl('#ff0000')
    expect(hslToHex(h, s, l)).toBe('#ff0000')
  })
  it('hue is 0 for red', () => expect(hexToHsl('#ff0000')[0]).toBe(0))
  it('saturation is 100 for red', () => expect(hexToHsl('#ff0000')[1]).toBe(100))
  it('lightness is 50 for red', () => expect(hexToHsl('#ff0000')[2]).toBe(50))
})

describe('hslToHex handles negative hue', () => {
  it('-30° == 330°', () => expect(hslToHex(-30, 100, 50)).toBe(hslToHex(330, 100, 50)))
  it('-360° == 0°', () => expect(hslToHex(-360, 100, 50)).toBe(hslToHex(0, 100, 50)))
})

describe('hslToRgb / rgbToHsl round-trip', () => {
  it('blue round-trip', () => {
    const { r, g, b } = hslToRgb(240, 100, 50)
    const [h, s, l] = rgbToHsl({ r, g, b })
    expect(h).toBe(240)
    expect(s).toBe(100)
    expect(l).toBe(50)
  })
  it('handles negative hue', () => {
    const a = hslToRgb(-120, 100, 50)
    const b = hslToRgb(240, 100, 50)
    expect(a).toEqual(b)
  })
})

describe('rgbToHsv / hsvToRgb round-trip', () => {
  it('green round-trip', () => {
    const [h, s, v] = rgbToHsv({ r: 0, g: 255, b: 0 })
    const { r, g, b } = hsvToRgb(h, s, v)
    expect(r).toBe(0)
    expect(g).toBe(255)
    expect(b).toBe(0)
  })
  it('handles negative hue in hsvToRgb', () => {
    expect(hsvToRgb(-120, 100, 100)).toEqual(hsvToRgb(240, 100, 100))
  })
})

describe('rgbToHwb / hwbToRgb round-trip', () => {
  it('red round-trip', () => {
    const [H, W, B] = rgbToHwb({ r: 255, g: 0, b: 0 })
    const { r, g, b } = hwbToRgb(H, W, B)
    expect(r).toBe(255)
    expect(g).toBe(0)
    expect(b).toBe(0)
  })
  it('gray when W+B >= 100', () => {
    const { r, g, b } = hwbToRgb(0, 50, 50)
    expect(r).toBe(g)
    expect(g).toBe(b)
  })
})

describe('rgbToOklab / oklabToRgb round-trip', () => {
  it('blue round-trip (within 1 unit)', () => {
    const lab = rgbToOklab({ r: 0, g: 0, b: 255 })
    const { r, g, b } = oklabToRgb(lab)
    expect(Math.abs(r - 0)).toBeLessThanOrEqual(1)
    expect(Math.abs(g - 0)).toBeLessThanOrEqual(1)
    expect(Math.abs(b - 255)).toBeLessThanOrEqual(1)
  })
})

describe('rgbToOklch / oklchToRgb round-trip', () => {
  it('green round-trip (within 1 unit)', () => {
    const lch = rgbToOklch({ r: 0, g: 200, b: 0 })
    const { r, g, b } = oklchToRgb(lch)
    expect(Math.abs(r - 0)).toBeLessThanOrEqual(2)
    expect(Math.abs(g - 200)).toBeLessThanOrEqual(2)
    expect(Math.abs(b - 0)).toBeLessThanOrEqual(2)
  })
})

// ─── CSS formatting ──────────────────────────────────────────────────────────

describe('toHslString', () => {
  it('no alpha', () => expect(toHslString(0, 100, 50)).toBe('hsl(0, 100%, 50%)'))
  it('with alpha', () => expect(toHslString(0, 100, 50, 0.5)).toBe('hsla(0, 100%, 50%, 0.5)'))
})

describe('toHwbString', () => {
  it('no alpha', () => expect(toHwbString(120, 0, 0)).toBe('hwb(120 0% 0%)'))
  it('with alpha', () => expect(toHwbString(120, 0, 0, 0.5)).toBe('hwb(120 0% 0% / 0.5)'))
})

// ─── Hex with alpha ──────────────────────────────────────────────────────────

describe('shortHexToRgba', () => {
  it('expands #f0f0 correctly', () => {
    const r = shortHexToRgba('#f0f0')
    expect(r).not.toBeNull()
    expect(r!.r).toBe(255)
    expect(r!.g).toBe(0)
    expect(r!.b).toBe(255)
    expect(r!.a).toBe(0)
  })
  it('expands #ffff → fully opaque white', () => {
    const r = shortHexToRgba('#ffff')
    expect(r!.r).toBe(255)
    expect(r!.g).toBe(255)
    expect(r!.b).toBe(255)
    expect(r!.a).toBeCloseTo(1, 1)
  })
  it('returns null for wrong length', () => expect(shortHexToRgba('#fff')).toBeNull())
})

// ─── Display P3 ──────────────────────────────────────────────────────────────

describe('rgbToDisplayP3 / displayP3ToRgb round-trip', () => {
  it('red round-trip (within 0.01)', () => {
    const p3 = rgbToDisplayP3({ r: 255, g: 0, b: 0 })
    const back = displayP3ToRgb(p3)
    expect(Math.abs(back.r - 255)).toBeLessThan(2)
    expect(Math.abs(back.g - 0)).toBeLessThan(2)
    expect(Math.abs(back.b - 0)).toBeLessThan(2)
  })
  it('black stays black', () => {
    const p3 = rgbToDisplayP3({ r: 0, g: 0, b: 0 })
    expect(p3.r).toBeCloseTo(0, 3)
    expect(p3.g).toBeCloseTo(0, 3)
    expect(p3.b).toBeCloseTo(0, 3)
  })
  it('white stays white', () => {
    const p3 = rgbToDisplayP3({ r: 255, g: 255, b: 255 })
    expect(p3.r).toBeCloseTo(1, 2)
    expect(p3.g).toBeCloseTo(1, 2)
    expect(p3.b).toBeCloseTo(1, 2)
  })
})

describe('toDisplayP3Hex', () => {
  it('returns valid hex', () => expect(toDisplayP3Hex('#3498db')).toMatch(/^#[0-9a-f]{6}$/))
  it('black → black', () => expect(toDisplayP3Hex('#000000')).toBe('#000000'))
  it('white → white', () => expect(toDisplayP3Hex('#ffffff')).toBe('#ffffff'))
})

describe('toOklchString', () => {
  it('formats without alpha', () => expect(toOklchString('#ff0000')).toMatch(/^oklch\(/))
  it('includes alpha when provided', () => expect(toOklchString('#ff0000', 0.5)).toContain('/ 0.5'))
  it('black L is close to 0', () => {
    const str = toOklchString('#000000')
    const L = parseFloat(str.replace('oklch(', ''))
    expect(L).toBeCloseTo(0, 2)
  })
})

describe('toColorP3String', () => {
  it('formats without alpha', () =>
    expect(toColorP3String('#ff0000')).toMatch(/^color\(display-p3/))
  it('includes alpha when provided', () =>
    expect(toColorP3String('#ff0000', 0.8)).toContain('/ 0.8'))
})

// ─── Regression tests ────────────────────────────────────────────────────────

describe('rgbaStringToRgba clamps out-of-range channels and alpha', () => {
  it('clamps channels above 255 and below 0', () => {
    expect(rgbaStringToRgba('rgb(300, -20, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })
  it('clamps alpha above 1', () => {
    expect(rgbaStringToRgba('rgba(0, 0, 0, 2)')?.a).toBe(1)
  })
  it('a clamped out-of-range rgb() still normalizes to a well-formed hex', () => {
    const n = normalizeColor('rgb(300, -20, 0)')
    expect(n.hex).toMatch(/^#[0-9a-f]{6}$/)
  })
})
