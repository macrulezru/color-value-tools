<div align="center" style="background:#111827;border-radius:20px;padding:28px 20px 20px;margin-bottom:32px">
  <h1 style="color:#f9fafb;margin:0 0 32px;font-size:2.2em;letter-spacing:-0.03em;font-weight:700;font-family:sans-serif">
    color-value-tools
  </h1>
  <img
    src="https://s3.twcstorage.ru/c9a2cc89-780f97fd-311d-4a1a-b86f-c25665c9dc46/images/npm/color-value-tools.webp"
    alt="color-value-tools"
    style="max-width:100%;width:auto;height:300px;border-radius:12px"
  />
</div>

A comprehensive utility library for parsing, converting, manipulating, and analyzing color values across all major color models — hex, RGB, HSL, HSV, HWB, Lab, LCH, Oklab, Oklch, CMYK, Display P3 — plus CSS variables and named colors. Zero dependencies.

---

## Contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Detection](#detection)
- [Parsing & Normalization](#parsing--normalization)
- [Conversions](#conversions)
- [Manipulation](#manipulation)
- [Interpolation & Scales](#interpolation--scales)
- [Color Harmonies](#color-harmonies)
- [Palette Generation](#palette-generation)
- [Accessibility (WCAG)](#accessibility-wcag)
- [Color Blindness Simulation](#color-blindness-simulation)
- [Formatting](#formatting)
- [Cache Management](#cache-management)
- [Generator Functions](#generator-functions)
- [CLI](#cli)
- [Cookbook](#cookbook)
- [TypeScript types](#typescript-types)
- [Architecture](#architecture)
- [Bundle size & dependencies](#bundle-size--dependencies)

---

## Features

- **Universal parser** — `normalizeColor()` accepts hex (3/4/6/8-digit), `rgb()` / `rgba()`, `hsl()` / `hsla()`, `hwb()`, `oklch()` / `oklcha()`, `color(display-p3 ...)`, CSS named colors (all 148), and plain `{r,g,b}` / `{h,s,l}` objects
- **Conversions** — every path between hex, RGB, HSL, HSV, HWB, Lab, LCH, Oklab, Oklch, CMYK, Display P3; all round-trip accurate
- **Manipulation** — `lighten`, `darken`, `saturate`, `desaturate`, `invertColor`, `grayscale`, `setAlpha`, `rotateHue`, `adjustHexBrightness`
- **Mixing & Interpolation** — `mixColors` and `interpolateColors` in 6 color spaces with 4 hue interpolation modes; `createColorScale` across multiple anchor colors with custom positions; `midpointColor` for a perceptual midpoint
- **Color Harmonies** — `complement`, `triadic`, `analogous`, `splitComplementary`, `tetradic`
- **Palette Generation** — `colorShades`, `monochromatic`, `tints`, `shades`, `tones` — all Oklab-accurate where applicable
- **WCAG Accessibility** — `relativeLuminance`, `contrastRatio`, `wcagLevel`, `bestTextColor`, `bestContrastColor`, `bestContrastPalette`, `isReadableOnBackground` (solid, semi-transparent, and gradient backgrounds)
- **Color Blindness Simulation** — protanopia, deuteranopia, tritanopia using Vienot 1999 matrices on linear RGB
- **Perceptual color distance** — `colorDeltaE` implementing the full CIEDE2000 formula
- **CSS Formatting** — `toHslString`, `toHwbString`, `toOklchString`, `toColorP3String`
- **Cache** — LRU-style `normalizeColorCached`; `getCacheStats`, `clearColorCache`, `enableCache` / `disableCache`
- **Generator functions** — `generateGradientColors*`, `generateTints*`, `generateShades*` for lazy iteration without pre-allocating arrays
- **CLI (`cvt`)** — inspect any color from the terminal: full info, all conversions, WCAG contrast, shades, harmonies, nearest named color
- **Zero dependencies** — no runtime deps; ships as tree-shakeable ESM + CommonJS

---

## Installation

```bash
npm install color-value-tools
```

No peer dependencies required.

---

## Quick start

```ts
import {
  normalizeColor, mixColors,
  lighten, darken, saturate,
  complement, triadic,
  wcagLevel, bestTextColor,
  colorDeltaE, randomColor,
} from 'color-value-tools'

// Parse any color format
normalizeColor('#3498db')
// { type: 'hex', hex: '#3498db', r: 52, g: 152, b: 219, h: 204, s: 70, l: 53, v: 86, a: 1 }

// Manipulate
lighten('#3498db', 15)   // '#6ab4e8'
darken('#3498db', 15)    // '#1a6da3'
saturate('#3498db', 20)  // '#1a8fe8'

// Harmonies
complement('#3498db')               // '#db6034'
triadic('#3498db')                  // ['#3498db', '#db3498', '#98db34']

// WCAG accessibility
wcagLevel('#ffffff', '#3498db')     // 'AA'
bestTextColor('#3498db')            // '#ffffff'

// Perceptual color distance (CIEDE2000)
colorDeltaE('#ff0000', '#fe0000')   // ~0.9

// Random color
randomColor({ hRange: [200, 260], sRange: [60, 80] })
```

CommonJS:

```js
const { normalizeColor, mixColors } = require('color-value-tools')
```

---

## Detection

| Function | Description |
|---|---|
| `getColorType(value)` | Returns `'hex'` \| `'css-var'` \| `'rgb'` \| `'hsl'` \| `'named'` \| `'oklch'` \| `'color'` \| `'unknown'` |
| `isHexColor(value)` | Detects 3-, 4-, or 6-digit hex strings (with or without `#`) |
| `isRgbColor(value)` | Detects `rgb()` / `rgba()` strings |
| `isHslColor(value)` | Detects `hsl()` / `hsla()` strings |
| `isOklchColor(value)` | Detects `oklch()` / `oklcha()` strings |
| `isColorFunction(value)` | Detects `color(display-p3 ...)`, `color(srgb ...)`, `color(srgb-linear ...)` strings |
| `isCssVariable(value)` | Checks for `var(--name)` pattern |
| `extractCssVariableName(value)` | Extracts `--name` from `var(--name, fallback)` |

---

## Parsing & Normalization

| Function | Description |
|---|---|
| `normalizeColor(input)` | Universal parser. Accepts hex (3/4/6/8-digit), `rgb()`, `hsl()`, `hwb()`, `oklch()`, `color()`, named color, `{r,g,b}` object, `{h,s,l}` object. Returns `{ type, hex, r, g, b, a, h, s, l, v }` |
| `normalizeColorCached(input)` | Same as `normalizeColor` but uses an internal LRU-style cache. String input only |
| `normalizeHex(hex)` | Normalizes 3- or 6-digit hex to lowercase 6-digit with `#` |
| `rgbaStringToRgba(str)` | Parses `rgb()` / `rgba()` string to `{r, g, b, a}`; supports percentage channels |
| `hex8ToRgba(hex)` | Parses 8-digit hex (`#rrggbbaa`) or 4-digit hex (`#rgba`) to `{r, g, b, a}` |
| `shortHexToRgba(hex)` | Parses 4-digit hex (`#rgba`) to `{r, g, b, a}` — e.g. `#f0f0` → `{r:255,g:0,b:255,a:0}` |
| `parseHwbString(str)` | Parses `hwb()` string to `{H, W, B, alpha}` |
| `parseOklchString(str)` | Parses `oklch(L C H / alpha)` to `{L, C, H, alpha}`; accepts percentage L |
| `parseColorFn(str)` | Parses `color(display-p3 r g b / alpha)` to `{space, r, g, b, alpha}` |
| `parseCssVar(value)` | Parses `var(--name, fallback)` to `{variableName, fallback?}` |

### `normalizeColor` return value

```ts
{
  type: 'hex' | 'rgb' | 'hsl' | 'oklch' | 'color' | 'named' | 'css-var' | 'unknown'
  hex?: string    // '#rrggbb'
  r?: number      // 0–255
  g?: number      // 0–255
  b?: number      // 0–255
  a?: number      // 0–1
  h?: number      // hue 0–360
  s?: number      // HSL saturation 0–100
  l?: number      // HSL lightness 0–100
  v?: number      // HSV value 0–100
  raw?: string    // set for css-var type
}
```

```ts
// Object input
normalizeColor({ r: 52, g: 152, b: 219 })   // → full result with hex, h, s, l, v
normalizeColor({ h: 204, s: 70, l: 53 })     // → full result with hex, r, g, b, v

// CSS variable — returns raw, no color channels
normalizeColor('var(--brand-color)')          // → { type: 'css-var', raw: 'var(--brand-color)' }
```

---

## Conversions

| Function | Description |
|---|---|
| `hexToRgb(hex)` | `→ [r, g, b]` |
| `hexToRgba(hex, opacity)` | `→ rgba(...)` string |
| `hexToHsl(hex)` | `→ [h, s, l]` |
| `hexToHsv(hex)` | `→ [h, s, v]` |
| `hslToHex(h, s, l)` | `→ #rrggbb` |
| `hslToRgb(h, s, l)` | `→ {r, g, b}` |
| `hsvToHex(h, s, v)` | `→ #rrggbb` |
| `hsvToRgb(h, s, v)` | `→ {r, g, b}` |
| `rgbToHex({r,g,b})` | `→ #rrggbb` |
| `rgbaToHex({r,g,b,a})` | `→ #rrggbbaa` |
| `rgbaToHex8({r,g,b,a})` | Alias for `rgbaToHex` |
| `rgbToRgbaString({r,g,b}, a)` | `→ rgba(...)` string |
| `rgbToHsl({r,g,b})` | `→ [h, s, l]` |
| `rgbToHsv({r,g,b})` | `→ [h, s, v]` |
| `rgbToHwb({r,g,b})` | `→ [H, W, B]` |
| `hwbToRgb(H, W, B)` | `→ {r, g, b}` |
| `rgbToCmyk({r,g,b})` | `→ {c, m, y, k}` (0–1 range) |
| `cmykToRgb({c,m,y,k})` | `→ {r, g, b}` |
| `rgbToLab({r,g,b})` | `→ {L, a, b}` (CIE Lab D65) |
| `labToRgb({L,a,b})` | `→ {r, g, b}` |
| `rgbToLch({r,g,b})` | `→ {L, C, H}` (CIE LCH) |
| `lchToRgb({L,C,H})` | `→ {r, g, b}` |
| `rgbToOklab({r,g,b})` | `→ {L, a, b}` (Oklab) |
| `oklabToRgb({L,a,b})` | `→ {r, g, b}` |
| `rgbToOklch({r,g,b})` | `→ {L, C, H}` (Oklch) |
| `oklchToRgb({L,C,H})` | `→ {r, g, b}` |
| `rgbToDisplayP3({r,g,b})` | `→ {r, g, b}` in Display P3 space (0–1 per channel) |
| `displayP3ToRgb({r,g,b})` | `→ {r, g, b}` sRGB (0–255) |
| `toDisplayP3Hex(color)` | Converts any color → Display P3 → hex |

---

## Manipulation

| Function | Description |
|---|---|
| `lighten(color, amount)` | Increase HSL lightness by `amount` (0–100) |
| `darken(color, amount)` | Decrease HSL lightness by `amount` (0–100) |
| `saturate(color, amount)` | Increase HSL saturation by `amount` (0–100) |
| `desaturate(color, amount)` | Decrease HSL saturation by `amount` (0–100) |
| `setAlpha(color, alpha)` | Returns `rgba(...)` with the given alpha (0–1) |
| `getAlpha(color)` | Returns the alpha channel value (0–1) |
| `invertColor(color)` | Inverts all three RGB channels |
| `grayscale(color)` | Converts to grayscale using ITU-R BT.709 perceptual weights |
| `rotateHue(hex, degrees)` | Rotates hue by degrees; supports negative values |
| `adjustHexBrightness(hex, offsetPercent)` | Lightens (positive) or darkens (negative) by percentage |
| `mixColors(c1, c2, t, opts?)` | Interpolates between two colors. `t` = 0–1. `mode`: `'rgb'` \| `'hsl'` \| `'lab'` \| `'lch'` \| `'oklab'` \| `'oklch'`. `hueInterpolation`: `'shorter'` \| `'longer'` \| `'increasing'` \| `'decreasing'` |

### `mixColors` example

```ts
import { mixColors } from 'color-value-tools'

// RGB mix at midpoint
mixColors('#e74c3c', '#3498db', 0.5)
// → '#8dc6bc'

// Perceptually even mix in Oklab
mixColors('#e74c3c', '#3498db', 0.5, { mode: 'oklab', format: 'hex' })

// HSL with "longer" hue path
mixColors('#e74c3c', '#3498db', 0.5, { mode: 'hsl', hueInterpolation: 'longer' })

// Get rgba string output
mixColors('#ff0000', '#0000ff', 0.25, { mode: 'lab', format: 'rgba' })
```

---

## Interpolation & Scales

| Function | Description |
|---|---|
| `interpolateColors(c1, c2, steps, opts?)` | Returns array of `steps` colors from `c1` to `c2`. Same `space` / `format` / `hueInterpolation` options as `mixColors` |
| `createColorScale(anchors, steps, opts?)` | Generates a `steps`-color scale across multiple anchor colors with optional positions (0–1) |
| `midpointColor(c1, c2, opts?)` | Perceptual midpoint between two colors (default space: `'oklab'`) |

### `createColorScale` — multi-stop gradient

```ts
import { createColorScale } from 'color-value-tools'

// Evenly spaced anchors
createColorScale(['#ff0000', '#ffff00', '#00ff00'], 9)

// With explicit positions
createColorScale(
  [
    { color: '#1a1a2e', position: 0 },
    { color: '#e94560', position: 0.4 },
    { color: '#f5a623', position: 1 },
  ],
  12,
  { space: 'oklch' }
)
```

---

## Color Harmonies

| Function | Description |
|---|---|
| `complement(color)` | Complementary color (180° rotation) |
| `triadic(color)` | 3 colors evenly spaced 120° apart |
| `analogous(color, angle?)` | 3 neighboring colors (default ±30°) |
| `splitComplementary(color)` | Base + two colors at 150° and 210° |
| `tetradic(color)` | 4 colors evenly spaced 90° apart |

```ts
import { triadic, analogous, tetradic } from 'color-value-tools'

triadic('#6c3483')        // ['#6c3483', '#34836c', '#83346c']
analogous('#6c3483', 45)  // ['#833469', '#6c3483', '#3469…']
tetradic('#6c3483')       // 4 colors
```

---

## Palette Generation

| Function | Description |
|---|---|
| `colorShades(color, steps?)` | Light-to-dark HSL scale (default 9 steps) |
| `monochromatic(color, steps?)` | Varying saturation at fixed lightness (default 5 steps) |
| `tints(color, steps?)` | Mix toward white in Oklab (default 5 steps) |
| `shades(color, steps?)` | Mix toward black in Oklab (default 5 steps) |
| `tones(color, steps?, gray?)` | Mix toward gray in Oklab (default 5 steps, gray `#808080`) |

---

## Accessibility (WCAG)

| Function | Description |
|---|---|
| `relativeLuminance(color)` | WCAG relative luminance (0–1) |
| `contrastRatio(c1, c2)` | WCAG contrast ratio (1–21) |
| `wcagLevel(fg, bg)` | Returns `'AAA'` \| `'AA'` \| `'AA-large'` \| `'fail'` |
| `bestTextColor(bg)` | Returns `'#000000'` or `'#ffffff'` for best contrast on `bg` |
| `bestContrastColor(bg, candidates)` | Picks the most readable color from an array of candidates |
| `bestContrastPalette(bg, palettes, opts?)` | Picks the palette with best overall contrast. Returns `{ paletteIndex, palette, minContrastRatio, avgContrastRatio }` |
| `isReadableOnBackground(text, bg, opts?)` | Checks readability on solid, semi-transparent, or gradient backgrounds. Returns `{ readable, minContrastRatio, wcagLevel }` |
| `isDark(color, threshold?)` | `true` if luminance is below threshold (default 0.5) |
| `isLight(color, threshold?)` | Inverse of `isDark` |

### `isReadableOnBackground` — complex backgrounds

`background` can be a plain color string, a semi-transparent spec, or a gradient with multiple stops:

```ts
import { isReadableOnBackground } from 'color-value-tools'

// Solid background
isReadableOnBackground('#ffffff', '#3498db')
// → { readable: true, minContrastRatio: 3.05, wcagLevel: 'AA-large' }

// Semi-transparent overlay composited over white
isReadableOnBackground('#ffffff', {
  type: 'semi-transparent',
  color: 'rgba(52, 152, 219, 0.5)',
  underlay: '#f0f0f0',
})

// Gradient — worst stop is used for the result
isReadableOnBackground('#ffffff', {
  type: 'gradient',
  stops: ['#1a1a2e', '#e94560', '#f5a623'],
})

// AAA + large text
isReadableOnBackground('#000000', '#f0f0f0', { level: 'AAA', largeText: true })
```

### `bestContrastPalette` — pick accessible palette

```ts
import { bestContrastPalette } from 'color-value-tools'

const result = bestContrastPalette('#1a1a2e', [
  ['#ffffff', '#f0f0f0', '#cccccc'],
  ['#ffff00', '#ffd700', '#ff8c00'],
])
// → { paletteIndex: 0, palette: [...], minContrastRatio: 12.1, avgContrastRatio: 14.3 }
```

---

## Color Blindness Simulation

Simulates perception using Vienot 1999 matrices applied to linearized RGB.

| Function | Description |
|---|---|
| `simulateProtanopia(color)` | No L-cones (red-blind) |
| `simulateDeuteranopia(color)` | No M-cones (green-blind) |
| `simulateTritanopia(color)` | No S-cones (blue-blind) |
| `simulateColorBlindness(color, type)` | Generic — `type`: `'protanopia'` \| `'deuteranopia'` \| `'tritanopia'` |

```ts
import { simulateColorBlindness } from 'color-value-tools'

simulateColorBlindness('#e74c3c', 'deuteranopia')  // '#9a7b00'
simulateColorBlindness('#3498db', 'protanopia')     // '#5282db'
```

---

## Formatting

| Function | Description |
|---|---|
| `toHslString(h, s, l, alpha?)` | Formats as `hsl(...)` or `hsla(...)` |
| `toHwbString(H, W, B, alpha?)` | Formats as `hwb(...)` with optional alpha |
| `toOklchString(color, alpha?)` | Converts any color to `oklch(L C H)` CSS string |
| `toColorP3String(color, alpha?)` | Converts any color to `color(display-p3 r g b)` CSS string |

```ts
import { toOklchString, toColorP3String, toHwbString } from 'color-value-tools'

toOklchString('#3498db')           // 'oklch(0.6 0.1175 234.77)'
toColorP3String('#3498db')         // 'color(display-p3 0.2493 0.5875 0.8479)'
toHwbString(204, 20, 14)          // 'hwb(204 20% 14%)'
toHwbString(204, 20, 14, 0.8)    // 'hwb(204 20% 14% / 0.8)'
```

---

## Cache Management

Useful in rendering loops, color pickers, or any context with repeated `normalizeColor` calls on the same values.

| Function | Description |
|---|---|
| `normalizeColorCached(input)` | Cached version of `normalizeColor` for repeated string calls |
| `clearColorCache()` | Clears the normalization cache and resets hit counter |
| `getCacheStats()` | Returns `{ size: number, hits: number }` |
| `enableCache()` | Re-enables the cache (on by default) |
| `disableCache()` | Disables caching (useful in tests) |

```ts
import { normalizeColorCached, getCacheStats, clearColorCache } from 'color-value-tools'

// First call — parsed and cached
normalizeColorCached('#3498db')

// Second call — instant cache hit
normalizeColorCached('#3498db')

getCacheStats()   // { size: 1, hits: 1 }
clearColorCache() // { size: 0, hits: 0 } reset
```

---

## Generator Functions

Useful for large palettes and frame-by-frame animations without allocating full arrays upfront.

| Function | Description |
|---|---|
| `generateGradientColors*(start, end, steps, opts?)` | Yields `steps` colors from `start` to `end`. Same `mode` / `format` options as `mixColors` |
| `generateTints*(color, steps, opts?)` | Yields tints toward white in Oklab |
| `generateShades*(color, steps, opts?)` | Yields shades toward black in Oklab |

```ts
import { generateGradientColors, generateTints } from 'color-value-tools'

// Process one color at a time — no intermediate array
for (const color of generateGradientColors('#ff0000', '#0000ff', 1000, { mode: 'oklch' })) {
  renderPixel(color)
}

// Collect lazily
const first5 = [...generateTints('#e74c3c', 100)].slice(0, 5)
```

---

## CLI

The `cvt` CLI is included in the package. Install globally or use via `npx`:

```bash
npm install -g color-value-tools
```

```bash
# Full info (default command)
cvt "#3498db"

# All format conversions — hex, rgb, hsl, hsv, hwb, lab, lch, oklab, oklch, cmyk
cvt "#3498db" convert

# Contrast ratio and WCAG level
cvt "#3498db" contrast "#ffffff"

# Generate 7 shades
cvt "#3498db" shades 7

# All harmonies — complement, triadic, analogous, split-comp, tetradic
cvt "#3498db" harmonies

# Nearest CSS named color
cvt "cornflowerblue" nearest
```

Accepts any valid color format: hex, `rgb()`, `hsl()`, `oklch()`, named colors.

```
cvt "#3498db"
────────────────────────────────────────
  Type:              hex
  Hex:               #3498db
  RGB:               rgb(52, 152, 219)
  HSL:               hsl(204, 70%, 53%)
  HSV:               hsv(204, 76%, 86%)
  Nearest named:     cornflowerblue
  Best text on it:   #ffffff
```

---

## Cookbook

### Generate an accessible button palette

```ts
import { colorShades, bestTextColor, wcagLevel } from 'color-value-tools'

function buttonPalette(base: string) {
  return colorShades(base, 9).map(shade => ({
    bg:   shade,
    text: bestTextColor(shade),
    wcag: wcagLevel(bestTextColor(shade), shade),
  }))
}

buttonPalette('#3498db')
// [{ bg: '#ffffff', text: '#000000', wcag: 'AAA' }, ...]
```

### Theme-aware color adaptation

```ts
import { isDark, lighten, darken } from 'color-value-tools'

function adaptToTheme(color: string, isDarkTheme: boolean): string {
  return isDarkTheme ? lighten(color, 20) : darken(color, 10)
}
```

### Mix two brand colors at a perceptual midpoint

```ts
import { midpointColor } from 'color-value-tools'

const mid = midpointColor('#e74c3c', '#3498db')  // Oklab midpoint
const midLch = midpointColor('#e74c3c', '#3498db', { space: 'oklch' })
```

### Build a triadic scheme and check contrast

```ts
import { triadic, contrastRatio } from 'color-value-tools'

const [base, second, third] = triadic('#6c3483')
console.log(contrastRatio(base, '#ffffff'))    // e.g. 8.4
console.log(contrastRatio(second, '#ffffff'))
```

### Convert any color string to all formats at once

```ts
import { normalizeColor, rgbToOklch, rgbToCmyk, toColorP3String } from 'color-value-tools'

const n = normalizeColor('hsl(204, 70%, 53%)')
const oklch = rgbToOklch({ r: n.r!, g: n.g!, b: n.b! })
const cmyk  = rgbToCmyk({ r: n.r!, g: n.g!, b: n.b! })
const p3    = toColorP3String(n.hex!)
console.log(n.hex, oklch, cmyk, p3)
```

### Find the nearest CSS named color

```ts
import { toNearestNamedColor } from 'color-value-tools'

toNearestNamedColor('#1a8ccc')  // 'steelblue'
toNearestNamedColor('#e74c3c')  // 'tomato'
```

### Random palette within a hue range

```ts
import { randomColor, colorShades } from 'color-value-tools'

const accent  = randomColor({ hRange: [200, 260], sRange: [60, 80], lRange: [40, 60] })
const palette = colorShades(accent, 5)
```

### Simulate color blindness for a palette

```ts
import { triadic, simulateColorBlindness } from 'color-value-tools'

const palette = triadic('#e74c3c')
const deuteranopia = palette.map(c => simulateColorBlindness(c, 'deuteranopia'))
// Compare palette vs deuteranopia to verify distinguishability
```

### Lazy gradient — process 10 000 colors one at a time

```ts
import { generateGradientColors } from 'color-value-tools'

for (const color of generateGradientColors('#1a1a2e', '#f5a623', 10_000, { mode: 'oklch' })) {
  ctx.fillStyle = color
  ctx.fillRect(x++, 0, 1, height)
}
```

---

## TypeScript types

All public types are exported from the package root:

```ts
import type {
  ColorType,            // 'hex' | 'css-var' | 'rgb' | 'hsl' | 'named' | 'oklch' | 'color' | 'unknown'
  WcagLevel,            // 'AAA' | 'AA' | 'AA-large' | 'fail'
  ColorBlindnessType,   // 'protanopia' | 'deuteranopia' | 'tritanopia'
  BackgroundSpec,       // string | { type: 'semi-transparent'; ... } | { type: 'gradient'; ... }
  PaletteScore,         // { palette, minContrastRatio, avgContrastRatio }
} from 'color-value-tools'
```

### `BackgroundSpec` — discriminated union

```ts
import type { BackgroundSpec } from 'color-value-tools'

const solid: BackgroundSpec = '#3498db'

const semiTransparent: BackgroundSpec = {
  type: 'semi-transparent',
  color: 'rgba(0,0,0,0.4)',
  underlay: '#ffffff',     // optional, defaults to white
}

const gradient: BackgroundSpec = {
  type: 'gradient',
  stops: ['#1a1a2e', '#e94560', '#f5a623'],
}
```

### `PaletteScore` — from `bestContrastPalette`

```ts
import type { PaletteScore } from 'color-value-tools'

const result: PaletteScore & { paletteIndex: number } = bestContrastPalette(bg, palettes)
result.paletteIndex      // number
result.palette           // string[]
result.minContrastRatio  // number
result.avgContrastRatio  // number
```

### Inference from `normalizeColor`

```ts
import { normalizeColor } from 'color-value-tools'

const n = normalizeColor('#3498db')
// TypeScript knows: n.hex, n.r, n.g, n.b, n.h, n.s, n.l, n.v, n.a, n.type

if (n.type !== 'unknown' && n.type !== 'css-var') {
  const r: number = n.r!  // available for all resolved color types
}
```

---

## Architecture

```
color-value-tools
│
├── Detection
│     getColorType, isHexColor, isRgbColor, isHslColor,
│     isOklchColor, isColorFunction, isCssVariable
│
├── Parsing
│     normalizeColor          → universal entry point; handles all formats + objects
│     rgbaStringToRgba        → rgb()/rgba() parser
│     hex8ToRgba              → 8-digit and 4-digit hex with alpha
│     parseOklchString        → oklch(L C H / alpha) with % L support
│     parseColorFn            → color(display-p3 ...) / color(srgb ...)
│     parseHwbString          → hwb() string
│     parseCssVar             → var(--name, fallback)
│
├── Color Math — every space via RGB as the hub
│     sRGB ↔ Linear (srgbChanToLinear / linearChanToSrgb)
│     XYZ D65 intermediate for Lab/LCH
│     Oklab/Oklch — Björn Ottosson matrices
│     Display P3 — ICC sRGB→P3 and P3→sRGB matrices
│
├── Manipulation
│     lighten / darken / saturate / desaturate — via HSL
│     invertColor — RGB invert
│     grayscale — BT.709 perceptual weights
│     rotateHue — via HSL hue shift
│     adjustHexBrightness — linear channel blend toward 0/255
│     setAlpha / getAlpha — rgba string manipulation
│
├── mixColors  (core of interpolation system)
│     6 color space modes: rgb | hsl | lab | lch | oklab | oklch
│     4 hue interpolation modes: shorter | longer | increasing | decreasing
│     4 output formats: hex | rgb | rgba | hsl
│     Used internally by: interpolateColors, createColorScale,
│       midpointColor, tints, shades, tones,
│       generateGradientColors*, generateTints*, generateShades*
│
├── Color Harmonies
│     All implemented as hue rotations on normalized hex
│
├── Palette Generation
│     colorShades — HSL lightness sweep
│     monochromatic — HSL saturation sweep
│     tints / shades / tones — Oklab interpolation via mixColors
│
├── Accessibility
│     relativeLuminance — WCAG linearization formula
│     contrastRatio — (L1+0.05)/(L2+0.05)
│     wcagLevel — ratio thresholds 3 / 4.5 / 7
│     isReadableOnBackground — handles 3 background types;
│       semi-transparent: alpha-composites onto underlay before ratio check
│       gradient: evaluates each stop, uses minimum ratio
│     bestContrastPalette — score = avg×0.4 + min×0.6
│
├── Color Blindness
│     Vienot 1999 matrices on linear RGB
│     3 types: protanopia / deuteranopia / tritanopia
│
├── Cache (Section 5.1)
│     Simple Map<string, NormalizeResult>
│     normalizeColorCached — Map lookup before calling normalizeColor
│     getCacheStats / clearColorCache / enableCache / disableCache
│
├── Generator functions (Section 5.2)
│     ES2015 generator syntax (*) — yield one color at a time
│     generateGradientColors* → mixColors inside the generator
│     generateTints* / generateShades* → Oklab mix toward white/black
│
└── CLI (dist/cli/bin/cli.js → cvt)
      Commands: info | convert | contrast | shades | harmonies | nearest
      Accepts any color format normalizeColor understands
```

---

## Bundle size & dependencies

| | |
|---|---|
| **Runtime dependencies** | None |
| **Peer dependencies** | None |
| **Dev dependencies** | TypeScript, Vitest |
| **ESM entry** | `dist/esm/index.js` (tree-shakeable) |
| **CJS entry** | `dist/cjs/index.js` |
| **CLI entry** | `dist/cli/bin/cli.js` → `cvt` |

The package ships both ESM (`type: module`) and CommonJS modules. Every function is a named export — unused functions are eliminated by bundlers that support tree-shaking.

---

## License

MIT

---

## Author

Danil Lisin Vladimirovich aka Macrulez

GitHub: [macrulezru](https://github.com/macrulezru) · Website: [macrulez.ru/en](https://macrulez.ru/en)

Bugs and questions — [issues](https://github.com/macrulezru/color-value-tools/issues)

---

## 💖 Support the project

Open source takes time and effort. If my work saves you time or brings value, consider supporting further development.

<a href="https://donate.cryptocloud.plus/M6O34NIN" target="_blank">
  <img src="https://img.shields.io/badge/Donate-CryptoCloud-8A2BE2?style=for-the-badge&logo=cryptocurrency&logoColor=white" alt="Donate via CryptoCloud">
</a>

Thank you for being part of this journey. ❤️
