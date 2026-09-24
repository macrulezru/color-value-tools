// Harmonies, scales, tints/shades and color generators.
import { normalizeColor } from './parse.js'
import { hslToHex } from './convert/spaces.js'
import { mixColors, rotateHue } from './manipulate.js'

export function complement(color: string): string {
  return rotateHue(normalizeColor(color).hex ?? '#000000', 180)
}

export function triadic(color: string): [string, string, string] {
  const hex = normalizeColor(color).hex ?? '#000000'
  return [hex, rotateHue(hex, 120), rotateHue(hex, 240)]
}

export function analogous(color: string, angle: number = 30): [string, string, string] {
  const hex = normalizeColor(color).hex ?? '#000000'
  return [rotateHue(hex, -angle), hex, rotateHue(hex, angle)]
}

export function splitComplementary(color: string): [string, string, string] {
  const hex = normalizeColor(color).hex ?? '#000000'
  return [hex, rotateHue(hex, 150), rotateHue(hex, 210)]
}

export function tetradic(color: string): [string, string, string, string] {
  const hex = normalizeColor(color).hex ?? '#000000'
  return [hex, rotateHue(hex, 90), rotateHue(hex, 180), rotateHue(hex, 270)]
}

export function colorShades(color: string, steps: number = 9): string[] {
  const n = normalizeColor(color)
  const h = n.h ?? 0
  const s = n.s ?? 0
  // steps - 1 === 0 below would otherwise divide by zero (NaN lightness, then
  // a literal "#NaNNaNNaN" hex string) — a single shade is just the color's
  // own lightness, same idea as interpolateColors() returning the midpoint
  // for a 2-color, 1-step request.
  if (steps <= 1) return steps === 1 ? [hslToHex(h, s, n.l ?? 50)] : []
  const result: string[] = []
  for (let i = 0; i < steps; i++) {
    const l = Math.round(100 - (i / (steps - 1)) * 100)
    result.push(hslToHex(h, s, l))
  }
  return result
}

export function monochromatic(color: string, steps: number = 5): string[] {
  const n = normalizeColor(color)
  const h = n.h ?? 0
  const l = n.l ?? 50
  // Same steps === 1 divide-by-zero guard as colorShades() above.
  if (steps <= 1) return steps === 1 ? [hslToHex(h, n.s ?? 0, l)] : []
  const result: string[] = []
  for (let i = 0; i < steps; i++) {
    const s = Math.round((i / (steps - 1)) * 100)
    result.push(hslToHex(h, s, l))
  }
  return result
}

export function randomColor(options?: {
  hRange?: [number, number]
  sRange?: [number, number]
  lRange?: [number, number]
}): string {
  const [hMin, hMax] = options?.hRange ?? [0, 360]
  const [sMin, sMax] = options?.sRange ?? [40, 90]
  const [lMin, lMax] = options?.lRange ?? [30, 70]
  const h = Math.floor(Math.random() * (hMax - hMin)) + hMin
  const s = Math.floor(Math.random() * (sMax - sMin)) + sMin
  const l = Math.floor(Math.random() * (lMax - lMin)) + lMin
  return hslToHex(h, s, l)
}

// ─── Interpolation ─────────────────────────────────────────────────

export function interpolateColors(
  color1: string,
  color2: string,
  steps: number,
  options?: {
    space?: 'rgb' | 'hsl' | 'lab' | 'lch' | 'oklab' | 'oklch'
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl'
    hueInterpolation?: 'shorter' | 'longer' | 'increasing' | 'decreasing'
  },
): string[] {
  if (steps < 2) return steps === 1 ? [mixColors(color1, color2, 0.5, options)] : []
  const result: string[] = []
  for (let i = 0; i < steps; i++) {
    result.push(mixColors(color1, color2, i / (steps - 1), options))
  }
  return result
}

export function createColorScale(
  anchors: string[] | Array<{ color: string; position?: number }>,
  steps: number,
  options?: { space?: 'rgb' | 'hsl' | 'oklab' | 'oklch'; format?: 'hex' | 'rgb' | 'hsl' },
): string[] {
  const normalized = (anchors as any[]).map((a, i, arr) => ({
    color: typeof a === 'string' ? a : a.color,
    position:
      typeof a === 'string'
        ? i / Math.max(arr.length - 1, 1)
        : (a.position ?? i / Math.max(arr.length - 1, 1)),
  }))
  normalized.sort((a, b) => a.position - b.position)
  const result: string[] = []
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1)
    let lo = normalized[0],
      hi = normalized[normalized.length - 1]
    for (let j = 0; j < normalized.length - 1; j++) {
      if (t >= normalized[j].position && t <= normalized[j + 1].position) {
        lo = normalized[j]
        hi = normalized[j + 1]
        break
      }
    }
    const span = hi.position - lo.position
    const localT = span === 0 ? 0 : (t - lo.position) / span
    result.push(mixColors(lo.color, hi.color, localT, options))
  }
  return result
}

export function midpointColor(
  color1: string,
  color2: string,
  options?: { space?: 'lab' | 'lch' | 'oklab' | 'oklch' },
): string {
  return mixColors(color1, color2, 0.5, { mode: options?.space ?? 'oklab' })
}

// ─── Tints / Shades / Tones ───────────────────────────────────────

export function tints(color: string, steps: number = 5): string[] {
  return interpolateColors(color, '#ffffff', steps, { space: 'oklab' })
}

export function shades(color: string, steps: number = 5): string[] {
  return interpolateColors(color, '#000000', steps, { space: 'oklab' })
}

export function tones(color: string, steps: number = 5, gray: string = '#808080'): string[] {
  return interpolateColors(color, gray, steps, { space: 'oklab' })
}

// ─── Generator functions ────────────────────────────────────────

export function* generateGradientColors(
  start: string,
  end: string,
  steps: number,
  options?: { mode?: 'rgb' | 'hsl' | 'oklab' | 'oklch'; format?: 'hex' | 'rgb' | 'hsl' },
): Generator<string> {
  for (let i = 0; i < steps; i++) {
    yield mixColors(start, end, steps === 1 ? 0 : i / (steps - 1), options)
  }
}

export function* generateTints(
  color: string,
  steps: number,
  options?: { format?: 'hex' | 'rgb' | 'hsl' },
): Generator<string> {
  for (let i = 0; i < steps; i++) {
    yield mixColors(color, '#ffffff', steps === 1 ? 0 : i / (steps - 1), {
      mode: 'oklab',
      ...options,
    })
  }
}

export function* generateShades(
  color: string,
  steps: number,
  options?: { format?: 'hex' | 'rgb' | 'hsl' },
): Generator<string> {
  for (let i = 0; i < steps; i++) {
    yield mixColors(color, '#000000', steps === 1 ? 0 : i / (steps - 1), {
      mode: 'oklab',
      ...options,
    })
  }
}
