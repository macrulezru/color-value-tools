// Detecting, parsing and normalizing CSS color strings.
import { NAMED_COLORS } from './internal/named-colors.js'
import { linearChanToSrgb } from './internal/transfer.js'
import {
  displayP3ToRgb,
  hex8ToRgba,
  hexToHsl,
  hexToRgb,
  hslToRgb,
  normalizeHex,
  oklchToRgb,
  rgbaStringToRgba,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './convert/spaces.js'

export type ColorType = 'hex' | 'css-var' | 'rgb' | 'hsl' | 'named' | 'oklch' | 'color' | 'unknown'

export function isCssVariable(value: string): boolean {
  return value.trim().startsWith('var(--')
}

export function isHexColor(value: string): boolean {
  const trimmed = value.trim()
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(trimmed)
}

export function isOklchColor(value: string): boolean {
  return /^\s*oklcha?\s*\(/i.test(value.trim())
}

export function isColorFunction(value: string): boolean {
  return /^\s*color\s*\(\s*(display-p3|srgb|srgb-linear)\s/i.test(value.trim())
}

export function isRgbColor(value: string): boolean {
  const trimmed = value.trim().toLowerCase()
  return trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')
}

export function isHslColor(value: string): boolean {
  const trimmed = value.trim().toLowerCase()
  return trimmed.startsWith('hsl(') || trimmed.startsWith('hsla(')
}

export function getColorType(value: string): ColorType {
  const trimmed = value.trim()
  const lower = trimmed.toLowerCase()
  if (isCssVariable(trimmed)) return 'css-var'
  if (isHexColor(trimmed)) return 'hex'
  if (isRgbColor(trimmed)) return 'rgb'
  if (isHslColor(trimmed)) return 'hsl'
  if (isOklchColor(trimmed)) return 'oklch'
  if (isColorFunction(trimmed)) return 'color'
  if (lower in NAMED_COLORS) return 'named'
  return 'unknown'
}

export function extractCssVariableName(value: string): string {
  const match = value.match(/var\(\s*(--[^,)]+)/)
  return match?.[1]?.trim() || value
}

export function parseCssVar(value: string): { variableName: string; fallback?: string } | null {
  const m = value.trim().match(/^var\(\s*(--[^,)]+)(?:,\s*([\s\S]+?))?\s*\)$/)
  if (!m) return null
  return { variableName: m[1].trim(), fallback: m[2]?.trim() }
}

// ─── OKLCH / color() CSS string parsing ────────────────────────

export function parseOklchString(
  str: string,
): { L: number; C: number; H: number; alpha: number } | null {
  const m = str
    .trim()
    .match(/oklcha?\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i)
  if (!m) return null
  let L = parseFloat(m[1])
  if (m[1].endsWith('%')) L = L / 100
  const C = parseFloat(m[2])
  const H = parseFloat(m[3])
  const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1
  return { L, C, H, alpha }
}

export function parseColorFn(
  str: string,
): { space: string; r: number; g: number; b: number; alpha: number } | null {
  const m = str
    .trim()
    .match(/color\(\s*([\w-]+)\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+))?\s*\)/i)
  if (!m) return null
  const space = m[1].toLowerCase()
  const parseVal = (v: string) => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v))
  const r = parseVal(m[2])
  const g = parseVal(m[3])
  const b = parseVal(m[4])
  const alpha = m[5] !== undefined ? parseFloat(m[5]) : 1
  return { space, r, g, b, alpha }
}

export function normalizeColor(
  input: string | { r: number; g: number; b: number } | { h: number; s: number; l: number },
) {
  if (typeof input !== 'string') {
    if ('r' in input && 'g' in input && 'b' in input) {
      const { r, g, b } = input as any
      const hex = rgbToHex({ r, g, b })
      const [h, s, l] = rgbToHsl({ r, g, b })
      const [hh, ss, vv] = rgbToHsv({ r, g, b })
      return { type: 'rgb', hex, r, g, b, a: 1, h, s, l, v: vv }
    }

    if ('h' in input && 's' in input && 'l' in input) {
      const { h, s, l } = input as any
      const { r, g, b } = hslToRgb(h, s, l)
      const hex = rgbToHex({ r, g, b })
      const [hh, ss, vv] = rgbToHsv({ r, g, b })
      return { type: 'hsl', hex, r, g, b, a: 1, h, s, l, v: vv }
    }

    return { type: 'unknown' }
  }
  const str = input.trim()

  if (isCssVariable(str)) return { type: 'css-var', raw: str }

  // 8-digit (#rrggbbaa) or 4-digit (#rgba) — check before isHexColor
  const hex8 = str.match(/^#([0-9a-f]{8}|[0-9a-f]{4})$/i)
  if (hex8) {
    const rgba = hex8ToRgba(str)
    if (rgba) {
      const { r, g, b, a } = rgba
      const hex = rgbToHex({ r, g, b })
      const [h, s, l] = rgbToHsl({ r, g, b })
      const [hh, ss, vv] = rgbToHsv({ r, g, b })
      return { type: 'hex', hex, r, g, b, a, h, s, l, v: vv }
    }
  }

  if (isHexColor(str)) {
    const hex = normalizeHex(str)
    const [r, g, b] = hexToRgb(hex)
    const [h, s, l] = hexToHsl(hex)
    const [hh, ss, vv] = rgbToHsv({ r, g, b })
    return { type: 'hex', hex, r, g, b, a: 1, h, s, l, v: vv }
  }

  if (isRgbColor(str)) {
    const rgba = rgbaStringToRgba(str)
    if (rgba) {
      const { r, g, b, a } = rgba
      const hex = rgbToHex({ r, g, b })
      const [h, s, l] = rgbToHsl({ r, g, b })
      const [hh, ss, vv] = rgbToHsv({ r, g, b })
      return { type: 'rgb', hex, r, g, b, a, h, s, l, v: vv }
    }
  }

  if (isHslColor(str)) {
    const m = str.match(/hsla?\(([^)]+)\)/i)
    if (m) {
      const parts = m[1].split(/,\s*/)
      const h = parseFloat(parts[0])
      const s = parseFloat(parts[1])
      const l = parseFloat(parts[2])
      const a = parts[3] ? parseFloat(parts[3]) : 1
      const { r, g, b } = hslToRgb(h, s, l)
      const hex = rgbToHex({ r, g, b })
      const [hh, ss, vv] = rgbToHsv({ r, g, b })
      return { type: 'hsl', hex, r, g, b, a, h, s, l, v: vv }
    }
  }

  if (str === 'transparent') return { type: 'named', hex: '#000000', r: 0, g: 0, b: 0, a: 0 }

  const lowerStr = str.toLowerCase()
  if (lowerStr in NAMED_COLORS) {
    const hex = NAMED_COLORS[lowerStr]
    const [r, g, b] = hexToRgb(hex)
    const [h, s, l] = hexToHsl(hex)
    const [, , vv] = rgbToHsv({ r, g, b })
    return { type: 'named', hex, r, g, b, a: 1, h, s, l, v: vv }
  }

  // oklch / oklcha
  if (isOklchColor(str)) {
    const parsed = parseOklchString(str)
    if (parsed) {
      const { r, g, b } = oklchToRgb({ L: parsed.L, C: parsed.C, H: parsed.H })
      const hex = rgbToHex({ r, g, b })
      const [h, s, l] = rgbToHsl({ r, g, b })
      const [, , vv] = rgbToHsv({ r, g, b })
      return { type: 'oklch', hex, r, g, b, a: parsed.alpha, h, s, l, v: vv }
    }
  }

  // color(display-p3 ...) / color(srgb ...)
  if (isColorFunction(str)) {
    const parsed = parseColorFn(str)
    if (parsed) {
      const { r: p3r, g: p3g, b: p3b, alpha } = parsed
      // Convert from p3/srgb (0-1) to sRGB 0-255
      let r: number, g: number, b: number
      if (parsed.space === 'display-p3') {
        const srgb = displayP3ToRgb({ r: p3r, g: p3g, b: p3b })
        r = srgb.r
        g = srgb.g
        b = srgb.b
      } else if (parsed.space === 'srgb-linear') {
        // srgb-linear components are linear-light, not gamma-encoded — unlike
        // plain srgb below, they need the linear-to-sRGB transfer function
        // applied before scaling to a 0-255 byte. Without this, only the 0/1
        // extremes happened to come out correct; any mid-range value (e.g. 0.5)
        // converted as if it were already gamma-encoded, which is wrong.
        r = Math.round(linearChanToSrgb(p3r) * 255)
        g = Math.round(linearChanToSrgb(p3g) * 255)
        b = Math.round(linearChanToSrgb(p3b) * 255)
      } else {
        r = Math.round(Math.max(0, Math.min(255, p3r * 255)))
        g = Math.round(Math.max(0, Math.min(255, p3g * 255)))
        b = Math.round(Math.max(0, Math.min(255, p3b * 255)))
      }
      const hex = rgbToHex({ r, g, b })
      const [h, s, l] = rgbToHsl({ r, g, b })
      const [, , vv] = rgbToHsv({ r, g, b })
      return { type: 'color', hex, r, g, b, a: alpha, h, s, l, v: vv }
    }
  }

  return { type: 'unknown' }
}

export function parseHwbString(
  str: string,
): { H: number; W: number; B: number; alpha: number } | null {
  const m = str
    .trim()
    .match(/hwb\(\s*([\d.+-]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?\s*\)/i)
  if (!m) return null
  return {
    H: parseFloat(m[1]),
    W: parseFloat(m[2]),
    B: parseFloat(m[3]),
    alpha: m[4] !== undefined ? parseFloat(m[4]) : 1,
  }
}

export function toNearestNamedColor(color: string): string {
  const n = normalizeColor(color)
  const r = n.r ?? 0,
    g = n.g ?? 0,
    b = n.b ?? 0
  let bestName = 'black'
  let bestDist = Infinity
  for (const [name, hex] of Object.entries(NAMED_COLORS)) {
    // Skip any non-hex entry (currently just a defensive guard — 'transparent'
    // is the only such value left in the table, and it has no real RGB to
    // compare against; hexToRgb() would otherwise silently fall back to
    // normalizeHex()'s placeholder color for it).
    if (hex[0] !== '#') continue
    const [nr, ng, nb] = hexToRgb(hex)
    const dist = Math.sqrt(Math.pow(r - nr, 2) + Math.pow(g - ng, 2) + Math.pow(b - nb, 2))
    if (dist < bestDist) {
      bestDist = dist
      bestName = name
    }
  }
  return bestName
}
