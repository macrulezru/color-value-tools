// Adjusting and mixing colors.
import { normalizeColor } from './parse.js'
import {
  hexToHsl,
  hslToHex,
  hslToRgb,
  labToRgb,
  lchToRgb,
  normalizeHex,
  oklabToRgb,
  oklchToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToLab,
  rgbToLch,
  rgbToOklab,
  rgbToOklch,
  rgbToRgbaString,
} from './convert/spaces.js'

export function adjustHexBrightness(hex: string, offsetPercent: number): string {
  const normalizedHex = normalizeHex(hex)
  const p = Math.max(-100, Math.min(100, offsetPercent)) / 100
  const r = parseInt(normalizedHex.slice(1, 3), 16)
  const g = parseInt(normalizedHex.slice(3, 5), 16)
  const b = parseInt(normalizedHex.slice(5, 7), 16)
  const adjustChannel = (channel: number): number => {
    if (p > 0) return Math.min(255, Math.floor(channel + (255 - channel) * p))
    else if (p < 0) return Math.max(0, Math.floor(channel * (1 + p)))
    return channel
  }
  const newR = adjustChannel(r)
  const newG = adjustChannel(g)
  const newB = adjustChannel(b)
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

export function rotateHue(hex: string, degrees: number): string {
  const [h, s, l] = hexToHsl(hex)
  const newH = (((h + degrees) % 360) + 360) % 360
  return hslToHex(newH, s, l)
}

export function lighten(color: string, amount: number): string {
  const n = normalizeColor(color)
  const h = n.h ?? 0
  const s = n.s ?? 0
  const l = Math.min(100, (n.l ?? 0) + amount)
  return hslToHex(h, s, l)
}

export function darken(color: string, amount: number): string {
  const n = normalizeColor(color)
  const h = n.h ?? 0
  const s = n.s ?? 0
  const l = Math.max(0, (n.l ?? 0) - amount)
  return hslToHex(h, s, l)
}

export function saturate(color: string, amount: number): string {
  const n = normalizeColor(color)
  const h = n.h ?? 0
  const s = Math.min(100, (n.s ?? 0) + amount)
  const l = n.l ?? 0
  return hslToHex(h, s, l)
}

export function desaturate(color: string, amount: number): string {
  const n = normalizeColor(color)
  const h = n.h ?? 0
  const s = Math.max(0, (n.s ?? 0) - amount)
  const l = n.l ?? 0
  return hslToHex(h, s, l)
}

export function setAlpha(color: string, alpha: number): string {
  const n = normalizeColor(color)
  const r = n.r ?? 0
  const g = n.g ?? 0
  const b = n.b ?? 0
  const a = Math.max(0, Math.min(1, alpha))
  return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`
}

export function getAlpha(color: string): number {
  const n = normalizeColor(color)
  return n.a ?? 1
}

export function invertColor(color: string): string {
  const n = normalizeColor(color)
  const r = 255 - (n.r ?? 0)
  const g = 255 - (n.g ?? 0)
  const b = 255 - (n.b ?? 0)
  return rgbToHex({ r, g, b })
}

export function grayscale(color: string): string {
  const n = normalizeColor(color)
  const r = n.r ?? 0
  const g = n.g ?? 0
  const b = n.b ?? 0
  // Perceptual luminance weights (ITU-R BT.709)
  const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)
  return rgbToHex({ r: gray, g: gray, b: gray })
}

function _lerpHue(
  h1: number,
  h2: number,
  t: number,
  mode: 'shorter' | 'longer' | 'increasing' | 'decreasing' = 'shorter',
): number {
  let d = h2 - h1
  if (mode === 'shorter') {
    if (d > 180) d -= 360
    else if (d < -180) d += 360
  } else if (mode === 'longer') {
    if (d > 0 && d < 180) d -= 360
    else if (d < 0 && d > -180) d += 360
  } else if (mode === 'increasing') {
    if (d < 0) d += 360
  } else if (mode === 'decreasing') {
    if (d > 0) d -= 360
  }
  return h1 + d * t
}

function _formatMixResult(r: number, g: number, b: number, a: number, out: string): string {
  if (out === 'hex') return rgbToHex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) })
  if (out === 'rgba')
    return rgbToRgbaString({ r: Math.round(r), g: Math.round(g), b: Math.round(b) }, a)
  if (out === 'rgb') return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  if (out === 'hsl') {
    const [hh, ss, ll] = rgbToHsl({ r: Math.round(r), g: Math.round(g), b: Math.round(b) })
    return `hsl(${hh}, ${ss}%, ${ll}%)`
  }
  return rgbToHex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) })
}

export function mixColors(
  c1: string,
  c2: string,
  t: number,
  opts?: {
    mode?: 'rgb' | 'hsl' | 'lab' | 'lch' | 'oklab' | 'oklch'
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl'
    hueInterpolation?: 'shorter' | 'longer' | 'increasing' | 'decreasing'
  },
): string {
  const o1 = normalizeColor(c1)
  const o2 = normalizeColor(c2)
  t = Math.max(0, Math.min(1, t))
  const mode = opts?.mode || 'rgb'
  const out = opts?.format || 'hex'
  const hueMode = opts?.hueInterpolation ?? 'shorter'
  let r = 0,
    g = 0,
    b = 0,
    a = 1

  if (mode === 'hsl') {
    const h1 = o1.h ?? rgbToHsl({ r: o1.r ?? 0, g: o1.g ?? 0, b: o1.b ?? 0 })[0]
    const s1 = o1.s ?? 0
    const l1 = o1.l ?? 0
    const h2 = o2.h ?? rgbToHsl({ r: o2.r ?? 0, g: o2.g ?? 0, b: o2.b ?? 0 })[0]
    const s2 = o2.s ?? 0
    const l2 = o2.l ?? 0
    const ih = _lerpHue(h1, h2, t, hueMode)
    const rgb = hslToRgb(ih, s1 + (s2 - s1) * t, l1 + (l2 - l1) * t)
    r = rgb.r
    g = rgb.g
    b = rgb.b
    a = (o1.a ?? 1) + ((o2.a ?? 1) - (o1.a ?? 1)) * t
  } else if (mode === 'lab') {
    const lab1 = rgbToLab({ r: o1.r ?? 0, g: o1.g ?? 0, b: o1.b ?? 0 })
    const lab2 = rgbToLab({ r: o2.r ?? 0, g: o2.g ?? 0, b: o2.b ?? 0 })
    const mixed = labToRgb({
      L: lab1.L + (lab2.L - lab1.L) * t,
      a: lab1.a + (lab2.a - lab1.a) * t,
      b: lab1.b + (lab2.b - lab1.b) * t,
    })
    r = mixed.r
    g = mixed.g
    b = mixed.b
    a = (o1.a ?? 1) + ((o2.a ?? 1) - (o1.a ?? 1)) * t
  } else if (mode === 'lch') {
    const lch1 = rgbToLch({ r: o1.r ?? 0, g: o1.g ?? 0, b: o1.b ?? 0 })
    const lch2 = rgbToLch({ r: o2.r ?? 0, g: o2.g ?? 0, b: o2.b ?? 0 })
    const mixed = lchToRgb({
      L: lch1.L + (lch2.L - lch1.L) * t,
      C: lch1.C + (lch2.C - lch1.C) * t,
      H: _lerpHue(lch1.H, lch2.H, t, hueMode),
    })
    r = mixed.r
    g = mixed.g
    b = mixed.b
    a = (o1.a ?? 1) + ((o2.a ?? 1) - (o1.a ?? 1)) * t
  } else if (mode === 'oklab') {
    const ok1 = rgbToOklab({ r: o1.r ?? 0, g: o1.g ?? 0, b: o1.b ?? 0 })
    const ok2 = rgbToOklab({ r: o2.r ?? 0, g: o2.g ?? 0, b: o2.b ?? 0 })
    const mixed = oklabToRgb({
      L: ok1.L + (ok2.L - ok1.L) * t,
      a: ok1.a + (ok2.a - ok1.a) * t,
      b: ok1.b + (ok2.b - ok1.b) * t,
    })
    r = mixed.r
    g = mixed.g
    b = mixed.b
    a = (o1.a ?? 1) + ((o2.a ?? 1) - (o1.a ?? 1)) * t
  } else if (mode === 'oklch') {
    const ok1 = rgbToOklch({ r: o1.r ?? 0, g: o1.g ?? 0, b: o1.b ?? 0 })
    const ok2 = rgbToOklch({ r: o2.r ?? 0, g: o2.g ?? 0, b: o2.b ?? 0 })
    const mixed = oklchToRgb({
      L: ok1.L + (ok2.L - ok1.L) * t,
      C: ok1.C + (ok2.C - ok1.C) * t,
      H: _lerpHue(ok1.H, ok2.H, t, hueMode),
    })
    r = mixed.r
    g = mixed.g
    b = mixed.b
    a = (o1.a ?? 1) + ((o2.a ?? 1) - (o1.a ?? 1)) * t
  } else {
    r = (o1.r ?? 0) * (1 - t) + (o2.r ?? 0) * t
    g = (o1.g ?? 0) * (1 - t) + (o2.g ?? 0) * t
    b = (o1.b ?? 0) * (1 - t) + (o2.b ?? 0) * t
    a = (o1.a ?? 1) * (1 - t) + (o2.a ?? 1) * t
  }
  return _formatMixResult(r, g, b, a, out)
}
