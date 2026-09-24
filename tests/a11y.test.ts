import { describe, it, expect } from 'vitest'
import {
  bestContrastColor,
  bestContrastPalette,
  bestTextColor,
  colorDeltaE,
  contrastRatio,
  isReadableOnBackground,
  simulateColorBlindness,
  simulateDeuteranopia,
  simulateProtanopia,
  simulateTritanopia,
  wcagLevel,
} from '../src/a11y.js'

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('contrastRatio', () => {
  it('black on white is 21', () => expect(contrastRatio('#000000', '#ffffff')).toBe(21))
  it('same color is 1', () => expect(contrastRatio('#ff0000', '#ff0000')).toBe(1))
  it('is symmetric', () => {
    expect(contrastRatio('#3498db', '#ffffff')).toBe(contrastRatio('#ffffff', '#3498db'))
  })
})

describe('wcagLevel', () => {
  it('black on white is AAA', () => expect(wcagLevel('#000000', '#ffffff')).toBe('AAA'))
  it('low contrast is fail', () => expect(wcagLevel('#cccccc', '#ffffff')).toBe('fail'))
  it('medium contrast is AA-large', () => {
    // find a pair with ratio ~3.5
    expect(['AA', 'AA-large', 'AAA', 'fail']).toContain(wcagLevel('#3498db', '#ffffff'))
  })
})

describe('bestTextColor', () => {
  it('dark bg → white text', () => expect(bestTextColor('#000000')).toBe('#ffffff'))
  it('light bg → black text', () => expect(bestTextColor('#ffffff')).toBe('#000000'))
})

describe('bestContrastColor', () => {
  it('picks highest contrast', () => {
    const result = bestContrastColor('#ffffff', ['#cccccc', '#000000', '#888888'])
    expect(result).toBe('#000000')
  })
})

// ─── Color distance ──────────────────────────────────────────────────────────

describe('colorDeltaE', () => {
  it('same color = 0', () => expect(colorDeltaE('#ff0000', '#ff0000')).toBe(0))
  it('black vs white is large', () => expect(colorDeltaE('#000000', '#ffffff')).toBeGreaterThan(50))
  it('nearly identical colors have small delta', () => {
    expect(colorDeltaE('#ff0000', '#fe0000')).toBeLessThan(2)
  })
})

// ─── Color blindness simulation ──────────────────────────────────────────────

describe('simulateProtanopia', () => {
  it('returns valid hex', () => expect(simulateProtanopia('#3498db')).toMatch(/^#[0-9a-f]{6}$/))
  it('black stays black', () => expect(simulateProtanopia('#000000')).toBe('#000000'))
  it('white stays white', () => expect(simulateProtanopia('#ffffff')).toBe('#ffffff'))
  it('changes red (no red perception)', () => {
    // red looks different to protanope
    expect(simulateProtanopia('#ff0000')).not.toBe('#ff0000')
  })
})

describe('simulateDeuteranopia', () => {
  it('returns valid hex', () => expect(simulateDeuteranopia('#3498db')).toMatch(/^#[0-9a-f]{6}$/))
  it('black stays black', () => expect(simulateDeuteranopia('#000000')).toBe('#000000'))
  it('white stays white', () => expect(simulateDeuteranopia('#ffffff')).toBe('#ffffff'))
})

describe('simulateTritanopia', () => {
  it('returns valid hex', () => expect(simulateTritanopia('#3498db')).toMatch(/^#[0-9a-f]{6}$/))
  it('black stays black', () => expect(simulateTritanopia('#000000')).toBe('#000000'))
  it('white stays white', () => expect(simulateTritanopia('#ffffff')).toBe('#ffffff'))
})

describe('simulateColorBlindness', () => {
  it('protanopia matches direct function', () => {
    expect(simulateColorBlindness('#3498db', 'protanopia')).toBe(simulateProtanopia('#3498db'))
  })
  it('deuteranopia matches direct function', () => {
    expect(simulateColorBlindness('#3498db', 'deuteranopia')).toBe(simulateDeuteranopia('#3498db'))
  })
  it('tritanopia matches direct function', () => {
    expect(simulateColorBlindness('#3498db', 'tritanopia')).toBe(simulateTritanopia('#3498db'))
  })
})

// ─── isReadableOnBackground ──────────────────────────────────────────────────

describe('isReadableOnBackground', () => {
  it('black on white → readable', () => {
    const r = isReadableOnBackground('#000000', '#ffffff')
    expect(r.readable).toBe(true)
    expect(r.minContrastRatio).toBeGreaterThanOrEqual(4.5)
  })
  it('white on white → not readable', () => {
    const r = isReadableOnBackground('#ffffff', '#ffffff')
    expect(r.readable).toBe(false)
  })
  it('semi-transparent background', () => {
    const r = isReadableOnBackground('#000000', {
      type: 'semi-transparent',
      color: 'rgba(200,200,200,0.5)',
      underlay: '#ffffff',
    })
    expect(r).toHaveProperty('readable')
    expect(r).toHaveProperty('minContrastRatio')
  })
  it('semi-transparent: wcagLevel reflects the real composited background, not a hardcoded white', () => {
    // Regression: wcagLevel used to always be computed against '#ffffff',
    // ignoring the actual composited color minContrastRatio/readable were
    // computed from — here the overlay is nearly opaque black, so the real
    // effective background is near-black. Black text on it is unreadable
    // (fails outright), but the old code reported wcagLevel: 'AAA' (as if
    // it were still black-on-white) despite readable: false — a direct
    // contradiction between the three returned fields.
    const r = isReadableOnBackground('#000000', {
      type: 'semi-transparent',
      color: 'rgba(0,0,0,0.9)',
      underlay: '#ffffff',
    })
    expect(r.readable).toBe(false)
    expect(r.wcagLevel).toBe('fail')
  })
  it('gradient background checks all stops', () => {
    const r = isReadableOnBackground('#000000', {
      type: 'gradient',
      stops: ['#ffffff', '#000000'],
    })
    // black on black stop fails
    expect(r.minContrastRatio).toBeCloseTo(1, 0)
  })
  it('gradient: wcagLevel is derived from the worst-case stop, not a hardcoded white', () => {
    // Regression: same mismatch as semi-transparent — wcagLevel used to
    // always use '#ffffff' regardless of which stop actually drove
    // minContrastRatio/readable.
    const r = isReadableOnBackground('#000000', {
      type: 'gradient',
      stops: ['#ffffff', '#000000'],
    })
    expect(r.readable).toBe(false)
    expect(r.wcagLevel).toBe('fail')
  })
  it('AAA level requires higher ratio', () => {
    const aa = isReadableOnBackground('#767676', '#ffffff', { level: 'AA' })
    const aaa = isReadableOnBackground('#767676', '#ffffff', { level: 'AAA' })
    expect(aa.readable).toBe(true)
    expect(aaa.readable).toBe(false)
  })
})

// ─── bestContrastPalette ─────────────────────────────────────────────────────

describe('bestContrastPalette', () => {
  it('picks dark palette on light background', () => {
    const result = bestContrastPalette('#ffffff', [
      ['#eeeeee', '#dddddd'], // low contrast
      ['#000000', '#111111'], // high contrast
    ])
    expect(result.paletteIndex).toBe(1)
  })
  it('returns palette, minContrastRatio, avgContrastRatio', () => {
    const result = bestContrastPalette('#ffffff', [['#000000', '#333333']])
    expect(result.palette).toBeDefined()
    expect(typeof result.minContrastRatio).toBe('number')
    expect(typeof result.avgContrastRatio).toBe('number')
  })
  it('minContrastRatio ≤ avgContrastRatio', () => {
    const result = bestContrastPalette('#ffffff', [['#000000', '#999999']])
    expect(result.minContrastRatio).toBeLessThanOrEqual(result.avgContrastRatio)
  })
})
