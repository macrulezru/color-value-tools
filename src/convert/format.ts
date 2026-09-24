// Formatters that accept any supported CSS color string.
import { normalizeColor } from '../parse.js'
import { rgbToDisplayP3, rgbToHex, rgbToOklch } from './spaces.js'

export function toDisplayP3Hex(color: string): string {
  const n = normalizeColorRaw(color)
  const p3 = rgbToDisplayP3({ r: n.r, g: n.g, b: n.b })
  return rgbToHex({
    r: Math.round(Math.max(0, Math.min(255, p3.r * 255))),
    g: Math.round(Math.max(0, Math.min(255, p3.g * 255))),
    b: Math.round(Math.max(0, Math.min(255, p3.b * 255))),
  })
}

// Internal raw normalizer (no cache, no circular dep issues)
function normalizeColorRaw(color: string): { r: number; g: number; b: number; a: number } {
  const n = normalizeColor(color)
  return { r: n.r ?? 0, g: n.g ?? 0, b: n.b ?? 0, a: n.a ?? 1 }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function toOklchString(color: string, alpha?: number): string {
  const n = normalizeColor(color)
  const { L, C, H } = rgbToOklch({ r: n.r ?? 0, g: n.g ?? 0, b: n.b ?? 0 })
  const Lr = +L.toFixed(4),
    Cr = +C.toFixed(4),
    Hr = +H.toFixed(2)
  if (alpha !== undefined) return `oklch(${Lr} ${Cr} ${Hr} / ${+alpha.toFixed(3)})`
  return `oklch(${Lr} ${Cr} ${Hr})`
}

export function toColorP3String(color: string, alpha?: number): string {
  const n = normalizeColor(color)
  const p3 = rgbToDisplayP3({ r: n.r ?? 0, g: n.g ?? 0, b: n.b ?? 0 })
  const r = +p3.r.toFixed(4),
    g = +p3.g.toFixed(4),
    b = +p3.b.toFixed(4)
  if (alpha !== undefined) return `color(display-p3 ${r} ${g} ${b} / ${+alpha.toFixed(3)})`
  return `color(display-p3 ${r} ${g} ${b})`
}
