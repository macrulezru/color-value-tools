// Pure numeric conversions between color spaces and hex/rgba strings.
import { linearChanToSrgb, srgbChanToLinear } from '../internal/transfer.js'

// ─── Display P3 ────────────────────────────────────────────────

export function rgbToDisplayP3(rgb: { r: number; g: number; b: number }): {
  r: number
  g: number
  b: number
} {
  // Remove sRGB gamma (linearize)
  const rl = srgbChanToLinear(rgb.r / 255)
  const gl = srgbChanToLinear(rgb.g / 255)
  const bl = srgbChanToLinear(rgb.b / 255)
  // sRGB-linear → P3-linear matrix
  const pr = 0.8226 * rl + 0.1774 * gl + 0.0 * bl
  const pg = 0.0332 * rl + 0.9669 * gl + 0.0 * bl
  const pb = 0.0171 * rl + 0.0724 * gl + 0.9103 * bl
  // Apply P3 gamma (same as sRGB)
  return {
    r: linearChanToSrgb(pr),
    g: linearChanToSrgb(pg),
    b: linearChanToSrgb(pb),
  }
}

export function displayP3ToRgb(p3: { r: number; g: number; b: number }): {
  r: number
  g: number
  b: number
} {
  // Remove P3 gamma
  const rl = srgbChanToLinear(p3.r)
  const gl = srgbChanToLinear(p3.g)
  const bl = srgbChanToLinear(p3.b)
  // P3-linear → sRGB-linear inverse matrix
  const sr = 1.2247 * rl + -0.2247 * gl + 0.0 * bl
  const sg = -0.0421 * rl + 1.0432 * gl + 0.0 * bl
  const sb = -0.0197 * rl + -0.0786 * gl + 1.0983 * bl
  // Apply sRGB gamma and scale to 0-255
  return {
    r: Math.round(Math.max(0, Math.min(255, linearChanToSrgb(sr) * 255))),
    g: Math.round(Math.max(0, Math.min(255, linearChanToSrgb(sg) * 255))),
    b: Math.round(Math.max(0, Math.min(255, linearChanToSrgb(sb) * 255))),
  }
}

// ─── Short RGBA hex #RGBA ──────────────────────────────────────

export function shortHexToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
  let h = hex.trim()
  if (!h.startsWith('#')) h = `#${h}`
  if (!/^#[0-9a-f]{4}$/i.test(h)) return null
  const r = parseInt(h[1] + h[1], 16)
  const g = parseInt(h[2] + h[2], 16)
  const b = parseInt(h[3] + h[3], 16)
  const a = parseInt(h[4] + h[4], 16) / 255
  return { r, g, b, a }
}

export function normalizeHex(hex: string): string {
  let cleanHex = hex.trim()
  if (!cleanHex.startsWith('#')) cleanHex = `#${cleanHex}`
  if (cleanHex.length === 4) {
    cleanHex = `#${cleanHex
      .slice(1)
      .split('')
      .map((c) => c + c)
      .join('')}`
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return '#f5e477'
  }
  return cleanHex.toLowerCase()
}

export function hexToRgb(hex: string): [number, number, number] {
  const normalizedHex = normalizeHex(hex)
  const r = parseInt(normalizedHex.slice(1, 3), 16)
  const g = parseInt(normalizedHex.slice(3, 5), 16)
  const b = parseInt(normalizedHex.slice(5, 7), 16)
  return [r, g, b]
}

export function hexToRgba(hex: string, opacity: number = 1): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex)
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  let h = 0,
    s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0)
        break
      case green:
        h = (blue - red) / d + 2
        break
      case blue:
        h = (red - green) / d + 4
        break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0,
    g = 0,
    b = 0
  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}
function toHex2(n: number) {
  return Math.round(n).toString(16).padStart(2, '0')
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toLowerCase()
}

export function rgbaToHex({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string {
  const aa = Math.round(clamp01(a) * 255)
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2(aa)}`.toLowerCase()
}

export function rgbToRgbaString(
  { r, g, b }: { r: number; g: number; b: number },
  a: number,
): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`
}

export function rgbaStringToRgba(
  str: string,
): { r: number; g: number; b: number; a: number } | null {
  const s = str.trim().toLowerCase()
  const m = s.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = m[1].split(/,\s*/).map((p) => p.trim())
  if (parts.length < 3) return null
  // Clamp channels to a valid byte and alpha to [0,1] — an out-of-range input
  // like "rgb(300, -20, 0)" or "rgba(0,0,0,2)" is invalid CSS, but previously
  // passed straight through unclamped, which could even corrupt downstream hex
  // output (a negative channel stringifies with a leading "-" via toString(16)).
  const parseChannel = (v: string) => {
    const n = v.endsWith('%') ? parseFloat(v) * 2.55 : parseFloat(v)
    return Math.round(Math.max(0, Math.min(255, n)))
  }
  const r = parseChannel(parts[0])
  const g = parseChannel(parts[1])
  const b = parseChannel(parts[2])
  const a = parts[3] !== undefined ? Math.max(0, Math.min(1, parseFloat(parts[3]))) : 1
  return { r, g, b, a }
}

export function rgbToHsl({
  r,
  g,
  b,
}: {
  r: number
  g: number
  b: number
}): [number, number, number] {
  const rd = r / 255,
    gd = g / 255,
    bd = b / 255
  const max = Math.max(rd, gd, bd),
    min = Math.min(rd, gd, bd)
  let h = 0,
    s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rd:
        h = (gd - bd) / d + (gd < bd ? 6 : 0)
        break
      case gd:
        h = (bd - rd) / d + 2
        break
      case bd:
        h = (rd - gd) / d + 4
        break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rd = 0,
    gd = 0,
    bd = 0
  if (h >= 0 && h < 60) {
    rd = c
    gd = x
    bd = 0
  } else if (h >= 60 && h < 120) {
    rd = x
    gd = c
    bd = 0
  } else if (h >= 120 && h < 180) {
    rd = 0
    gd = c
    bd = x
  } else if (h >= 180 && h < 240) {
    rd = 0
    gd = x
    bd = c
  } else if (h >= 240 && h < 300) {
    rd = x
    gd = 0
    bd = c
  } else {
    rd = c
    gd = 0
    bd = x
  }
  return {
    r: Math.round((rd + m) * 255),
    g: Math.round((gd + m) * 255),
    b: Math.round((bd + m) * 255),
  }
}

export function rgbToHsv({
  r,
  g,
  b,
}: {
  r: number
  g: number
  b: number
}): [number, number, number] {
  const rd = r / 255,
    gd = g / 255,
    bd = b / 255
  const max = Math.max(rd, gd, bd),
    min = Math.min(rd, gd, bd)
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    switch (max) {
      case rd:
        h = (gd - bd) / d + (gd < bd ? 6 : 0)
        break
      case gd:
        h = (bd - rd) / d + 2
        break
      case bd:
        h = (rd - gd) / d + 4
        break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  v = Math.max(0, Math.min(100, v)) / 100
  const i = Math.floor(h / 60)
  const f = h / 60 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  let rd = 0,
    gd = 0,
    bd = 0
  switch (i) {
    case 0:
      rd = v
      gd = t
      bd = p
      break
    case 1:
      rd = q
      gd = v
      bd = p
      break
    case 2:
      rd = p
      gd = v
      bd = t
      break
    case 3:
      rd = p
      gd = q
      bd = v
      break
    case 4:
      rd = t
      gd = p
      bd = v
      break
    default:
      rd = v
      gd = p
      bd = q
      break
  }
  return { r: Math.round(rd * 255), g: Math.round(gd * 255), b: Math.round(bd * 255) }
}

export function hexToHsv(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHsv({ r, g, b })
}

export function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v)
  return rgbToHex({ r, g, b })
}

export function hex8ToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
  let h = hex.trim()
  if (!h.startsWith('#')) h = `#${h}`
  if (h.length === 5) {
    // #rgba shorthand
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}${h[4]}${h[4]}`
  }
  if (h.length !== 9) return null
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)
  const a = parseInt(h.slice(7, 9), 16) / 255
  return { r, g, b, a }
}

export function rgbaToHex8({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string {
  return rgbaToHex({ r, g, b, a })
}

export function rgbToCmyk({ r, g, b }: { r: number; g: number; b: number }) {
  const rd = r / 255,
    gd = g / 255,
    bd = b / 255
  const k = 1 - Math.max(rd, gd, bd)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 1 }
  const c = (1 - rd - k) / (1 - k)
  const m = (1 - gd - k) / (1 - k)
  const y = (1 - bd - k) / (1 - k)
  return { c, m, y, k }
}

export function cmykToRgb({ c, m, y, k }: { c: number; m: number; y: number; k: number }) {
  const r = 255 * (1 - c) * (1 - k)
  const g = 255 * (1 - m) * (1 - k)
  const b = 255 * (1 - y) * (1 - k)
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) }
}

function srgbToLinear(v: number) {
  v = v / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function linearToSrgb(v: number) {
  const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(1, t)) * 255)
}

function rgbToXyz({ r, g, b }: { r: number; g: number; b: number }) {
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175
  const Z = R * 0.0193339 + G * 0.119192 + B * 0.9503041
  return { X: X * 100, Y: Y * 100, Z: Z * 100 }
}

function xyzToRgb({ X, Y, Z }: { X: number; Y: number; Z: number }) {
  X = X / 100
  Y = Y / 100
  Z = Z / 100
  let R = X * 3.2404542 + Y * -1.5371385 + Z * -0.4985314
  let G = X * -0.969266 + Y * 1.8760108 + Z * 0.041556
  let B = X * 0.0556434 + Y * -0.2040259 + Z * 1.0572252
  R = linearToSrgb(R)
  G = linearToSrgb(G)
  B = linearToSrgb(B)
  return { r: R, g: G, b: B }
}

export function rgbToLab({ r, g, b }: { r: number; g: number; b: number }) {
  const { X, Y, Z } = rgbToXyz({ r, g, b })
  const refX = 95.047,
    refY = 100.0,
    refZ = 108.883
  const x = X / refX,
    y = Y / refY,
    z = Z / refZ
  const fx = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116
  const fy = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116
  const fz = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116
  const L = 116 * fy - 16
  const a = 500 * (fx - fy)
  const b2 = 200 * (fy - fz)
  return { L, a, b: b2 }
}

export function labToRgb({ L, a, b }: { L: number; a: number; b: number }) {
  const refX = 95.047,
    refY = 100.0,
    refZ = 108.883
  let fy = (L + 16) / 116
  let fx = a / 500 + fy
  let fz = fy - b / 200
  const fx3 = Math.pow(fx, 3)
  const fz3 = Math.pow(fz, 3)
  const fy3 = Math.pow(fy, 3)
  const xr = fx3 > 0.008856 ? fx3 : (fx - 16 / 116) / 7.787
  const yr = L > 903.3 * 0.008856 ? fy3 : L / 903.3
  const zr = fz3 > 0.008856 ? fz3 : (fz - 16 / 116) / 7.787
  const X = xr * refX,
    Y = yr * refY,
    Z = zr * refZ
  return xyzToRgb({ X, Y, Z })
}

export function rgbToLch({ r, g, b }: { r: number; g: number; b: number }) {
  const { L, a, b: bb } = rgbToLab({ r, g, b })
  const C = Math.sqrt(a * a + bb * bb)
  let H = Math.atan2(bb, a) * (180 / Math.PI)
  if (H < 0) H += 360
  return { L, C, H }
}

export function lchToRgb({ L, C, H }: { L: number; C: number; H: number }) {
  const a = Math.cos((H * Math.PI) / 180) * C
  const b = Math.sin((H * Math.PI) / 180) * C
  return labToRgb({ L, a, b })
}

// ─── HWB ─────────────────────────────────────────────────────────────────────

export function rgbToHwb({
  r,
  g,
  b,
}: {
  r: number
  g: number
  b: number
}): [number, number, number] {
  const rd = r / 255,
    gd = g / 255,
    bd = b / 255
  const max = Math.max(rd, gd, bd),
    min = Math.min(rd, gd, bd)
  const w = min
  const bl = 1 - max
  let h = 0
  if (max !== min) {
    const d = max - min
    switch (max) {
      case rd:
        h = (gd - bd) / d + (gd < bd ? 6 : 0)
        break
      case gd:
        h = (bd - rd) / d + 2
        break
      case bd:
        h = (rd - gd) / d + 4
        break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(w * 100), Math.round(bl * 100)]
}

export function hwbToRgb(H: number, W: number, B: number): { r: number; g: number; b: number } {
  H = ((H % 360) + 360) % 360
  const w = W / 100,
    b = B / 100
  if (w + b >= 1) {
    const gray = Math.round((w / (w + b)) * 255)
    return { r: gray, g: gray, b: gray }
  }
  const { r, g, b: rb } = hslToRgb(H, 100, 50)
  const factor = 1 - w - b
  return {
    r: Math.round((r / 255) * factor * 255 + w * 255),
    g: Math.round((g / 255) * factor * 255 + w * 255),
    b: Math.round((rb / 255) * factor * 255 + w * 255),
  }
}

export function toHwbString(H: number, W: number, B: number, alpha?: number): string {
  if (alpha !== undefined) return `hwb(${H} ${W}% ${B}% / ${+alpha.toFixed(3)})`
  return `hwb(${H} ${W}% ${B}%)`
}

// ─── OKLCH / OKLAB ───────────────────────────────────────────────────────────

function srgbToOkLinear(v: number): number {
  v = v / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function okLinearToSrgb(v: number): number {
  const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(1, t)) * 255)
}

export function rgbToOklab({ r, g, b }: { r: number; g: number; b: number }): {
  L: number
  a: number
  b: number
} {
  const R = srgbToOkLinear(r),
    G = srgbToOkLinear(g),
    B = srgbToOkLinear(b)
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

export function oklabToRgb({ L, a, b }: { L: number; a: number; b: number }): {
  r: number
  g: number
  b: number
} {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3)
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3)
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3)
  const R = okLinearToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const G = okLinearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const B = okLinearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  return { r: R, g: G, b: B }
}

export function rgbToOklch({ r, g, b }: { r: number; g: number; b: number }): {
  L: number
  C: number
  H: number
} {
  const { L, a, b: bb } = rgbToOklab({ r, g, b })
  const C = Math.sqrt(a * a + bb * bb)
  let H = Math.atan2(bb, a) * (180 / Math.PI)
  if (H < 0) H += 360
  return { L, C, H }
}

export function oklchToRgb({ L, C, H }: { L: number; C: number; H: number }): {
  r: number
  g: number
  b: number
} {
  const a = Math.cos((H * Math.PI) / 180) * C
  const b = Math.sin((H * Math.PI) / 180) * C
  return oklabToRgb({ L, a, b })
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export function toHslString(h: number, s: number, l: number, alpha?: number): string {
  if (alpha !== undefined) return `hsla(${h}, ${s}%, ${l}%, ${+alpha.toFixed(3)})`
  return `hsl(${h}, ${s}%, ${l}%)`
}
