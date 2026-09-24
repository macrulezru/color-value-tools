// Luminance, WCAG contrast, perceptual difference and color-blindness simulation.
import { normalizeColor } from './parse.js'
import { rgbToHex, rgbToLab } from './convert/spaces.js'

export function relativeLuminance(color: string): number {
  const n = normalizeColor(color)
  const r = (n.r ?? 0) / 255
  const g = (n.g ?? 0) / 255
  const b = (n.b ?? 0) / 255
  const srgbToLin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const R = srgbToLin(r),
    G = srgbToLin(g),
    B = srgbToLin(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function contrastRatio(a: string, b: string): number {
  const L1 = relativeLuminance(a)
  const L2 = relativeLuminance(b)
  const light = Math.max(L1, L2)
  const dark = Math.min(L1, L2)
  return +((light + 0.05) / (dark + 0.05)).toFixed(2)
}

export function isDark(color: string, threshold: number = 0.5): boolean {
  return relativeLuminance(color) < threshold
}

export function isLight(color: string, threshold: number = 0.5): boolean {
  return !isDark(color, threshold)
}

// ─── WCAG Accessibility ───────────────────────────────────────────────────────

export type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'fail'

export function wcagLevel(foreground: string, background: string): WcagLevel {
  const ratio = contrastRatio(foreground, background)
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA-large'
  return 'fail'
}

export function bestTextColor(background: string): '#000000' | '#ffffff' {
  const onBlack = contrastRatio(background, '#000000')
  const onWhite = contrastRatio(background, '#ffffff')
  return onBlack >= onWhite ? '#000000' : '#ffffff'
}

export function bestContrastColor(background: string, candidates: string[]): string {
  let best = candidates[0]
  let bestRatio = -1
  for (const c of candidates) {
    const ratio = contrastRatio(background, c)
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = c
    }
  }
  return best
}

export function colorDeltaE(c1: string, c2: string): number {
  const n1 = normalizeColor(c1)
  const n2 = normalizeColor(c2)
  const lab1 = rgbToLab({ r: n1.r ?? 0, g: n1.g ?? 0, b: n1.b ?? 0 })
  const lab2 = rgbToLab({ r: n2.r ?? 0, g: n2.g ?? 0, b: n2.b ?? 0 })
  // CIEDE2000
  const deg = (rad: number) => rad * (180 / Math.PI)
  const rad = (d: number) => d * (Math.PI / 180)
  const { L: L1, a: a1, b: b1 } = lab1
  const { L: L2, a: a2, b: b2 } = lab2
  const dL = L2 - L1
  const Lm = (L1 + L2) / 2
  const C1 = Math.sqrt(a1 * a1 + b1 * b1)
  const C2 = Math.sqrt(a2 * a2 + b2 * b2)
  const Cm = (C1 + C2) / 2
  const Cm7 = Math.pow(Cm, 7)
  const G = 0.5 * (1 - Math.sqrt(Cm7 / (Cm7 + Math.pow(25, 7))))
  const a1p = a1 * (1 + G),
    a2p = a2 * (1 + G)
  const C1p = Math.sqrt(a1p * a1p + b1 * b1)
  const C2p = Math.sqrt(a2p * a2p + b2 * b2)
  const dCp = C2p - C1p
  const Cmp = (C1p + C2p) / 2
  let h1p = deg(Math.atan2(b1, a1p))
  if (h1p < 0) h1p += 360
  let h2p = deg(Math.atan2(b2, a2p))
  if (h2p < 0) h2p += 360
  let dhp: number
  if (Math.abs(h1p - h2p) <= 180) dhp = h2p - h1p
  else if (h2p <= h1p) dhp = h2p - h1p + 360
  else dhp = h2p - h1p - 360
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp / 2))
  let Hmp: number
  if (Math.abs(h1p - h2p) <= 180) Hmp = (h1p + h2p) / 2
  else if (h1p + h2p < 360) Hmp = (h1p + h2p + 360) / 2
  else Hmp = (h1p + h2p - 360) / 2
  const T =
    1 -
    0.17 * Math.cos(rad(Hmp - 30)) +
    0.24 * Math.cos(rad(2 * Hmp)) +
    0.32 * Math.cos(rad(3 * Hmp + 6)) -
    0.2 * Math.cos(rad(4 * Hmp - 63))
  const SL = 1 + (0.015 * Math.pow(Lm - 50, 2)) / Math.sqrt(20 + Math.pow(Lm - 50, 2))
  const SC = 1 + 0.045 * Cmp
  const SH = 1 + 0.015 * Cmp * T
  const Cmp7 = Math.pow(Cmp, 7)
  const RC = 2 * Math.sqrt(Cmp7 / (Cmp7 + Math.pow(25, 7)))
  const dTheta = 30 * Math.exp(-Math.pow((Hmp - 275) / 25, 2))
  const RT = -Math.sin(rad(2 * dTheta)) * RC
  return +Math.sqrt(
    Math.pow(dL / SL, 2) +
      Math.pow(dCp / SC, 2) +
      Math.pow(dHp / SH, 2) +
      RT * (dCp / SC) * (dHp / SH),
  ).toFixed(4)
}

// ─── Color blindness simulation ────────────────────────────────────

function _simulateCB(color: string, matrix: number[][]): string {
  const n = normalizeColor(color)
  // linearize
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const enc = (v: number) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
    return Math.round(Math.max(0, Math.min(1, c)) * 255)
  }
  const r = lin(n.r ?? 0),
    g = lin(n.g ?? 0),
    b = lin(n.b ?? 0)
  const nr = enc(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b)
  const ng = enc(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b)
  const nb = enc(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b)
  return rgbToHex({ r: nr, g: ng, b: nb })
}

const _PROTANOPIA_M = [
  [0.56667, 0.43333, 0.0],
  [0.55833, 0.44167, 0.0],
  [0.0, 0.24167, 0.75833],
]
const _DEUTERANOPIA_M = [
  [0.625, 0.375, 0.0],
  [0.7, 0.3, 0.0],
  [0.0, 0.3, 0.7],
]
const _TRITANOPIA_M = [
  [0.95, 0.05, 0.0],
  [0.0, 0.43333, 0.56667],
  [0.0, 0.475, 0.525],
]

export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia'

export function simulateProtanopia(color: string): string {
  return _simulateCB(color, _PROTANOPIA_M)
}
export function simulateDeuteranopia(color: string): string {
  return _simulateCB(color, _DEUTERANOPIA_M)
}
export function simulateTritanopia(color: string): string {
  return _simulateCB(color, _TRITANOPIA_M)
}
export function simulateColorBlindness(color: string, type: ColorBlindnessType): string {
  if (type === 'protanopia') return simulateProtanopia(color)
  if (type === 'deuteranopia') return simulateDeuteranopia(color)
  return simulateTritanopia(color)
}

// ─── isReadableOnBackground ─────────────────────────────────────

export type BackgroundSpec =
  | string
  | { type: 'semi-transparent'; color: string; underlay?: string }
  | { type: 'gradient'; stops: string[] }

export function isReadableOnBackground(
  textColor: string,
  background: BackgroundSpec,
  options?: { level?: 'AA' | 'AAA'; largeText?: boolean },
): { readable: boolean; minContrastRatio: number; wcagLevel: WcagLevel } {
  const level = options?.level ?? 'AA'
  const large = options?.largeText ?? false
  const minRequired = level === 'AAA' ? (large ? 4.5 : 7) : large ? 3 : 4.5

  // The specific effective background color that minRatio was actually
  // computed against — wcagLevel below is derived from this same color
  // (never a hardcoded '#ffffff') so it can't disagree with minRatio/readable.
  let minRatio: number
  let effectiveBackground: string
  if (typeof background === 'string') {
    effectiveBackground = background
    minRatio = contrastRatio(textColor, background)
  } else if (background.type === 'semi-transparent') {
    const underlay = background.underlay ?? '#ffffff'
    const fg = normalizeColor(background.color)
    const bg = normalizeColor(underlay)
    const alpha = fg.a ?? 1
    const cr = Math.round((fg.r ?? 0) * alpha + (bg.r ?? 255) * (1 - alpha))
    const cg = Math.round((fg.g ?? 0) * alpha + (bg.g ?? 255) * (1 - alpha))
    const cb = Math.round((fg.b ?? 0) * alpha + (bg.b ?? 255) * (1 - alpha))
    effectiveBackground = rgbToHex({ r: cr, g: cg, b: cb })
    minRatio = contrastRatio(textColor, effectiveBackground)
  } else {
    // The worst-case stop (lowest ratio) drives both minRatio and wcagLevel.
    let worstStop = background.stops[0]
    let worstRatio = Infinity
    for (const stop of background.stops) {
      const ratio = contrastRatio(textColor, stop)
      if (ratio < worstRatio) {
        worstRatio = ratio
        worstStop = stop
      }
    }
    effectiveBackground = worstStop
    minRatio = worstRatio
  }

  const wLevel = wcagLevel(textColor, effectiveBackground)
  return {
    readable: minRatio >= minRequired,
    minContrastRatio: +minRatio.toFixed(2),
    wcagLevel: wLevel,
  }
}

// ─── bestContrastPalette ────────────────────────────────────────

export interface PaletteScore {
  palette: string[]
  minContrastRatio: number
  avgContrastRatio: number
}

export function bestContrastPalette(
  background: string,
  palettes: string[][],
  options?: { weights?: number[] },
): PaletteScore & { paletteIndex: number } {
  let bestIdx = 0
  let bestScore = -1
  let bestMin = 0,
    bestAvg = 0

  palettes.forEach((palette, idx) => {
    const ratios = palette.map((c) => contrastRatio(background, c))
    const weights = options?.weights ?? ratios.map(() => 1)
    const totalW = weights.reduce((s, w) => s + w, 0)
    const avg = ratios.reduce((s, r, i) => s + r * (weights[i] ?? 1), 0) / totalW
    const min = Math.min(...ratios)
    // Score: weighted avg with heavy penalty on minimum
    const score = avg * 0.4 + min * 0.6
    if (score > bestScore) {
      bestScore = score
      bestIdx = idx
      bestMin = min
      bestAvg = avg
    }
  })

  return {
    paletteIndex: bestIdx,
    palette: palettes[bestIdx],
    minContrastRatio: +bestMin.toFixed(2),
    avgContrastRatio: +bestAvg.toFixed(2),
  }
}
