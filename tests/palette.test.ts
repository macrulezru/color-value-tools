import { describe, it, expect } from 'vitest'
import { normalizeColor } from '../src/parse.js'
import { hexToHsl } from '../src/convert/index.js'
import {
  analogous,
  colorShades,
  complement,
  createColorScale,
  generateGradientColors,
  generateShades,
  generateTints,
  interpolateColors,
  midpointColor,
  monochromatic,
  shades,
  splitComplementary,
  tetradic,
  tints,
  tones,
  triadic,
} from '../src/palette.js'

// ─── Harmonies ───────────────────────────────────────────────────────────────

describe('complement', () => {
  it('returns a different color', () => expect(complement('#ff0000')).not.toBe('#ff0000'))
  it('double complement returns original hue', () => {
    const [h1] = hexToHsl('#3498db')
    const [h2] = hexToHsl(complement(complement('#3498db')))
    expect(Math.abs(h1 - h2)).toBeLessThanOrEqual(1)
  })
})

describe('triadic', () => {
  it('returns 3 colors', () => expect(triadic('#ff0000')).toHaveLength(3))
  it('first element is original', () => expect(triadic('#ff0000')[0]).toBe('#ff0000'))
  it('hues are 120° apart', () => {
    const colors = triadic('#ff0000')
    const hues = colors.map((c) => hexToHsl(c)[0])
    expect(Math.abs(hues[1] - hues[0])).toBeCloseTo(120, 0)
    expect(Math.abs(hues[2] - hues[0])).toBeCloseTo(240, 0)
  })
})

describe('analogous', () => {
  it('returns 3 colors', () => expect(analogous('#ff0000')).toHaveLength(3))
  it('center is original', () => expect(analogous('#ff0000')[1]).toBe('#ff0000'))
})

describe('splitComplementary', () => {
  it('returns 3 colors', () => expect(splitComplementary('#ff0000')).toHaveLength(3))
  it('first is original', () => expect(splitComplementary('#ff0000')[0]).toBe('#ff0000'))
})

describe('tetradic', () => {
  it('returns 4 colors', () => expect(tetradic('#ff0000')).toHaveLength(4))
  it('first is original', () => expect(tetradic('#ff0000')[0]).toBe('#ff0000'))
})

// ─── Palettes ────────────────────────────────────────────────────────────────

describe('colorShades', () => {
  it('default returns 9 steps', () => expect(colorShades('#3498db')).toHaveLength(9))
  it('custom steps', () => expect(colorShades('#3498db', 5)).toHaveLength(5))
  it('is ordered light to dark', () => {
    const shades = colorShades('#3498db', 5)
    const lightnesses = shades.map((c) => hexToHsl(c)[2])
    expect(lightnesses[0]).toBeGreaterThan(lightnesses[lightnesses.length - 1])
  })
})

describe('monochromatic', () => {
  it('default returns 5 steps', () => expect(monochromatic('#3498db')).toHaveLength(5))
  it('saturated colors preserve hue', () => {
    // skip s=0 steps (grays have undefined hue, hexToHsl returns 0 by convention)
    const colors = monochromatic('#3498db', 5)
    const saturated = colors.filter((c) => hexToHsl(c)[1] > 0)
    const hues = saturated.map((c) => hexToHsl(c)[0])
    expect(Math.max(...hues) - Math.min(...hues)).toBeLessThanOrEqual(1)
  })
})

// ─── Interpolation ───────────────────────────────────────────────────────────

describe('interpolateColors', () => {
  it('returns correct number of steps', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 5)).toHaveLength(5)
  })
  it('first is start color', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 5)[0]).toBe('#ff0000')
  })
  it('last is end color', () => {
    const arr = interpolateColors('#ff0000', '#0000ff', 5)
    expect(arr[arr.length - 1]).toBe('#0000ff')
  })
  it('all results are valid hex', () => {
    interpolateColors('#ff0000', '#0000ff', 7, { space: 'oklab' }).forEach((c) => {
      expect(c).toMatch(/^#[0-9a-f]{6}$/)
    })
  })
  it('oklch space', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 5, { space: 'oklch' })).toHaveLength(5)
  })
  it('steps=1 returns single color', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 1)).toHaveLength(1)
  })
})

describe('createColorScale', () => {
  it('returns correct number of steps', () => {
    expect(createColorScale(['#ff0000', '#0000ff'], 7)).toHaveLength(7)
  })
  it('first step matches first anchor', () => {
    const scale = createColorScale(['#ff0000', '#0000ff'], 5)
    expect(scale[0]).toBe('#ff0000')
  })
  it('last step matches last anchor', () => {
    const scale = createColorScale(['#ff0000', '#0000ff'], 5)
    expect(scale[scale.length - 1]).toBe('#0000ff')
  })
  it('supports anchor objects with positions', () => {
    const scale = createColorScale(
      [
        { color: '#ffffff', position: 0 },
        { color: '#000000', position: 1 },
      ],
      3,
    )
    expect(scale).toHaveLength(3)
    expect(scale[0]).toBe('#ffffff')
    expect(scale[2]).toBe('#000000')
  })
  it('three anchors produce valid hex', () => {
    const scale = createColorScale(['#ff0000', '#00ff00', '#0000ff'], 9)
    scale.forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/))
  })
})

describe('midpointColor', () => {
  it('returns valid hex', () =>
    expect(midpointColor('#ff0000', '#0000ff')).toMatch(/^#[0-9a-f]{6}$/))
  it('midpoint of same color is same color (approx)', () => {
    const mid = midpointColor('#3498db', '#3498db')
    const orig = normalizeColor('#3498db')
    const res = normalizeColor(mid)
    expect(Math.abs((res.r ?? 0) - (orig.r ?? 0))).toBeLessThanOrEqual(2)
  })
  it('oklch space', () =>
    expect(midpointColor('#ff0000', '#0000ff', { space: 'oklch' })).toMatch(/^#[0-9a-f]{6}$/))
})

// ─── Tints / Shades / Tones ──────────────────────────────────────────────────

describe('tints', () => {
  it('returns correct count', () => expect(tints('#3498db', 5)).toHaveLength(5))
  it('first is original color (approx)', () => {
    const arr = tints('#3498db', 5)
    const orig = normalizeColor('#3498db')
    const first = normalizeColor(arr[0])
    expect(Math.abs((first.r ?? 0) - (orig.r ?? 0))).toBeLessThanOrEqual(2)
  })
  it('last is close to white', () => {
    const arr = tints('#3498db', 5)
    const last = normalizeColor(arr[arr.length - 1])
    expect(last.r ?? 0).toBeGreaterThan(240)
    expect(last.g ?? 0).toBeGreaterThan(240)
    expect(last.b ?? 0).toBeGreaterThan(240)
  })
  it('all results are valid hex', () => {
    tints('#3498db', 5).forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/))
  })
})

describe('shades', () => {
  it('returns correct count', () => expect(shades('#3498db', 5)).toHaveLength(5))
  it('last is close to black', () => {
    const arr = shades('#3498db', 5)
    const last = normalizeColor(arr[arr.length - 1])
    expect(last.r ?? 255).toBeLessThan(15)
    expect(last.g ?? 255).toBeLessThan(15)
    expect(last.b ?? 255).toBeLessThan(15)
  })
})

describe('tones', () => {
  it('returns correct count', () => expect(tones('#3498db', 5)).toHaveLength(5))
  it('last is close to gray', () => {
    const arr = tones('#3498db', 5)
    const last = normalizeColor(arr[arr.length - 1])
    // gray: r≈g≈b≈128
    expect(Math.abs((last.r ?? 0) - 128)).toBeLessThan(10)
  })
  it('custom gray', () => {
    const arr = tones('#ff0000', 3, '#a0a0a0')
    expect(arr).toHaveLength(3)
  })
})

// ─── Generators ──────────────────────────────────────────────────────────────

describe('generateGradientColors', () => {
  it('yields correct number of values', () => {
    const colors = [...generateGradientColors('#ff0000', '#0000ff', 5)]
    expect(colors).toHaveLength(5)
  })
  it('first value is start', () => {
    const [first] = generateGradientColors('#ff0000', '#0000ff', 5)
    expect(first).toBe('#ff0000')
  })
  it('last value is end', () => {
    const colors = [...generateGradientColors('#ff0000', '#0000ff', 5)]
    expect(colors[colors.length - 1]).toBe('#0000ff')
  })
  it('all values are valid hex', () => {
    for (const c of generateGradientColors('#ff0000', '#0000ff', 10, { mode: 'oklab' })) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})

describe('generateTints', () => {
  it('yields correct number of values', () => {
    const arr = [...generateTints('#3498db', 6)]
    expect(arr).toHaveLength(6)
  })
  it('all values are valid hex', () => {
    for (const c of generateTints('#3498db', 5)) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
  it('last value is close to white', () => {
    const arr = [...generateTints('#3498db', 5)]
    const last = normalizeColor(arr[arr.length - 1])
    expect(last.r ?? 0).toBeGreaterThan(240)
  })
})

describe('generateShades', () => {
  it('yields correct number of values', () => {
    expect([...generateShades('#3498db', 4)]).toHaveLength(4)
  })
  it('last value is close to black', () => {
    const arr = [...generateShades('#3498db', 5)]
    const last = normalizeColor(arr[arr.length - 1])
    expect(last.r ?? 255).toBeLessThan(15)
  })
})

// ─── Regression tests ────────────────────────────────────────────────────────

describe('colorShades / monochromatic with steps <= 1 (divide-by-zero guard)', () => {
  it('colorShades(color, 1) returns one real hex, not "#NaNNaNNaN"', () => {
    const result = colorShades('#3498db', 1)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatch(/^#[0-9a-f]{6}$/)
  })
  it('monochromatic(color, 1) returns one real hex, not "#NaNNaNNaN"', () => {
    const result = monochromatic('#3498db', 1)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatch(/^#[0-9a-f]{6}$/)
  })
  it('colorShades(color, 0) returns an empty array', () => {
    expect(colorShades('#3498db', 0)).toEqual([])
  })
})
