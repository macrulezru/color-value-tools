<div align="center" style="background:#111827;border-radius:20px;padding:28px 20px 20px;margin-bottom:32px">
  <h1 style="color:#f9fafb;margin:0 0 32px;font-size:2.2em;letter-spacing:-0.03em;font-weight:700;font-family:sans-serif">
    color-value-tools
  </h1>
  <img
    src="https://s3.twcstorage.ru/c9a2cc89-780f97fd-311d-4a1a-b86f-c25665c9dc46/images/npm/color-value-tools.webp"
    alt="vue-virtual-scroller-kit"
    style="max-width:100%;width:auto;height:300px;border-radius:12px"
  />
</div>

A comprehensive utility library for parsing, converting, manipulating, and analyzing color values across all major color models — hex, RGB, HSL, HSV, HWB, Lab, LCH, OKLAB, OKLCH, CMYK — plus CSS variables and named colors.

## Installation

```bash
npm install color-value-tools
```

## Usage

```ts
import {
  normalizeColor, mixColors,
  lighten, darken, saturate,
  complement, triadic,
  wcagLevel, bestTextColor,
  colorDeltaE, randomColor,
} from 'color-value-tools';

// Parse any color format
normalizeColor('#3498db');
// { type: 'hex', hex: '#3498db', r: 52, g: 152, b: 219, h: 204, s: 70, l: 53, ... }

// Manipulate
lighten('#3498db', 15);   // '#6ab4e8'
darken('#3498db', 15);    // '#1a6da3'
saturate('#3498db', 20);  // '#1a8fe8'

// Harmonies
complement('#3498db');              // '#db6034'
triadic('#3498db');                 // ['#3498db', '#db3498', '#98db34']

// WCAG accessibility
wcagLevel('#ffffff', '#3498db');    // 'AA'
bestTextColor('#3498db');           // '#ffffff'

// Perceptual color distance (CIEDE2000)
colorDeltaE('#ff0000', '#fe0000');  // ~0.9

// Random color
randomColor({ hRange: [200, 260], sRange: [60, 80] });
```

CommonJS:
```js
const { normalizeColor, mixColors } = require('color-value-tools');
```

---

## API Reference

### Detection

| Function | Description |
|---|---|
| `getColorType(value)` | Returns `'hex'` \| `'css-var'` \| `'rgb'` \| `'hsl'` \| `'named'` \| `'oklch'` \| `'color'` \| `'unknown'` |
| `isHexColor(value)` | Detects 3-, 4-, 6- or 8-digit hex strings (with or without `#`) |
| `isRgbColor(value)` | Detects `rgb()` / `rgba()` strings |
| `isHslColor(value)` | Detects `hsl()` / `hsla()` strings |
| `isOklchColor(value)` | Detects `oklch()` / `oklcha()` strings |
| `isColorFunction(value)` | Detects `color(display-p3 ...)` / `color(srgb ...)` strings |
| `isCssVariable(value)` | Checks for `var(--name)` pattern |
| `extractCssVariableName(value)` | Extracts `--name` from `var(--name, fallback)` |

### Parsing & Normalization

| Function | Description |
|---|---|
| `normalizeColor(input)` | Universal parser. Accepts hex, `rgb()`, `hsl()`, `oklch()`, `color()`, named color, `{r,g,b}` / `{h,s,l}`. Returns `{ type, hex, r, g, b, a, h, s, l, v }` |
| `normalizeColorCached(input)` | Same as `normalizeColor` but uses an internal LRU-style cache |
| `normalizeHex(hex)` | Normalizes 3- or 6-digit hex to lowercase 6-digit with `#` |
| `rgbaStringToRgba(str)` | Parses `rgb()` / `rgba()` string to `{r, g, b, a}` |
| `hex8ToRgba(hex)` | Parses 8-digit hex (`#rrggbbaa`) to `{r, g, b, a}` |
| `shortHexToRgba(hex)` | Parses 4-digit hex (`#rgba`) to `{r, g, b, a}` — e.g. `#f0f0` → `{r:255,g:0,b:255,a:0}` |
| `parseHwbString(str)` | Parses `hwb()` string to `{H, W, B, alpha}` |
| `parseOklchString(str)` | Parses `oklch(L C H / alpha)` to `{L, C, H, alpha}` |
| `parseColorFn(str)` | Parses `color(display-p3 r g b / alpha)` to `{space, r, g, b, alpha}` |
| `parseCssVar(value)` | Parses `var(--name, fallback)` to `{variableName, fallback?}` |

### Conversions

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
| `rgbaToHex8({r,g,b,a})` | Alias for `rgbaToHex` |

### Manipulation

| Function | Description |
|---|---|
| `lighten(color, amount)` | Increase HSL lightness by `amount` (0–100) |
| `darken(color, amount)` | Decrease HSL lightness by `amount` (0–100) |
| `saturate(color, amount)` | Increase HSL saturation by `amount` (0–100) |
| `desaturate(color, amount)` | Decrease HSL saturation by `amount` (0–100) |
| `setAlpha(color, alpha)` | Returns `rgba(...)` with the given alpha (0–1) |
| `getAlpha(color)` | Returns the alpha channel value (0–1) |
| `invertColor(color)` | Inverts RGB channels |
| `grayscale(color)` | Converts to grayscale using ITU-R BT.709 weights |
| `rotateHue(hex, degrees)` | Rotates hue by degrees (supports negative values) |
| `adjustHexBrightness(hex, offsetPercent)` | Lightens (positive) or darkens (negative) by percentage |
| `mixColors(c1, c2, t, opts?)` | Interpolates between two colors. `t` = 0–1. `mode`: `'rgb'`\|`'hsl'`\|`'lab'`\|`'lch'`\|`'oklab'`\|`'oklch'`. `hueInterpolation`: `'shorter'`\|`'longer'`\|`'increasing'`\|`'decreasing'` |

### Interpolation & Scales

| Function | Description |
|---|---|
| `interpolateColors(c1, c2, steps, opts?)` | Returns array of `steps` colors from `c1` to `c2`. Same `space`/`format`/`hueInterpolation` options as `mixColors` |
| `createColorScale(anchors, steps, opts?)` | Generates a `steps`-color scale across multiple anchor colors with optional positions (0–1) |
| `midpointColor(c1, c2, opts?)` | Perceptual midpoint between two colors (default space: `'oklab'`) |

### Color Harmonies

| Function | Description |
|---|---|
| `complement(color)` | Complementary color (180° rotation) |
| `triadic(color)` | 3 colors evenly spaced 120° apart |
| `analogous(color, angle?)` | 3 neighboring colors (default ±30°) |
| `splitComplementary(color)` | Base + two colors at 150° and 210° |
| `tetradic(color)` | 4 colors evenly spaced 90° apart |

### Palette Generation

| Function | Description |
|---|---|
| `colorShades(color, steps?)` | Light-to-dark HSL scale (default 9 steps) |
| `monochromatic(color, steps?)` | Varying saturation at fixed lightness (default 5 steps) |
| `tints(color, steps?)` | Mix toward white in Oklab (default 5 steps) |
| `shades(color, steps?)` | Mix toward black in Oklab (default 5 steps) |
| `tones(color, steps?, gray?)` | Mix toward gray in Oklab (default 5 steps, gray `#808080`) |

### Accessibility (WCAG)

| Function | Description |
|---|---|
| `relativeLuminance(color)` | WCAG relative luminance (0–1) |
| `contrastRatio(c1, c2)` | WCAG contrast ratio (1–21) |
| `wcagLevel(fg, bg)` | Returns `'AAA'` \| `'AA'` \| `'AA-large'` \| `'fail'` |
| `bestTextColor(bg)` | Returns `'#000000'` or `'#ffffff'` for best contrast on `bg` |
| `bestContrastColor(bg, candidates)` | Picks the most readable color from an array of candidates |
| `bestContrastPalette(bg, palettes, opts?)` | Picks the palette with best overall contrast. Returns `{paletteIndex, palette, minContrastRatio, avgContrastRatio}` |
| `isReadableOnBackground(text, bg, opts?)` | Checks readability on solid, semi-transparent, or gradient backgrounds. Returns `{readable, minContrastRatio, wcagLevel}` |
| `isDark(color, threshold?)` | `true` if luminance is below threshold (default 0.5) |
| `isLight(color, threshold?)` | Inverse of `isDark` |

### Color Blindness Simulation

Simulates perception using Vienot 1999 matrices applied to linear RGB.

| Function | Description |
|---|---|
| `simulateProtanopia(color)` | No L-cones (red-blind) |
| `simulateDeuteranopia(color)` | No M-cones (green-blind) |
| `simulateTritanopia(color)` | No S-cones (blue-blind) |
| `simulateColorBlindness(color, type)` | Generic — `type`: `'protanopia'` \| `'deuteranopia'` \| `'tritanopia'` |

### Formatting

| Function | Description |
|---|---|
| `toHslString(h, s, l, alpha?)` | Formats as `hsl(...)` or `hsla(...)` |
| `toHwbString(H, W, B, alpha?)` | Formats as `hwb(...)` with optional alpha |
| `toOklchString(color, alpha?)` | Converts any color to `oklch(L C H)` CSS string |
| `toColorP3String(color, alpha?)` | Converts any color to `color(display-p3 r g b)` CSS string |

### Cache Management

| Function | Description |
|---|---|
| `normalizeColorCached(input)` | Cached version of `normalizeColor` for repeated calls |
| `clearColorCache()` | Clears the normalization cache |
| `getCacheStats()` | Returns `{size, hits}` |
| `enableCache()` / `disableCache()` | Toggle caching on/off |

### Generator Functions

Useful for large palettes and frame-by-frame animations without allocating full arrays.

| Function | Description |
|---|---|
| `generateGradientColors*(start, end, steps, opts?)` | Yields `steps` colors from `start` to `end` |
| `generateTints*(color, steps, opts?)` | Yields tints toward white |
| `generateShades*(color, steps, opts?)` | Yields shades toward black |

### Utilities

| Function | Description |
|---|---|
| `colorDeltaE(c1, c2)` | Perceptual color distance using CIEDE2000 |
| `randomColor(options?)` | Generates a random color. Options: `hRange`, `sRange`, `lRange` (each `[min, max]`) |
| `toNearestNamedColor(color)` | Returns the closest CSS named color name (all 148 standard colors) |

---

## CLI

After installing globally or via `npx`, you can inspect colors directly from the terminal:

```bash
npm install -g color-value-tools
```

```bash
# Full info (default)
cvt "#3498db"

# All format conversions
cvt "#3498db" convert

# Contrast ratio and WCAG level
cvt "#3498db" contrast "#ffffff"

# Generate 7 shades
cvt "#3498db" shades 7

# All harmonies
cvt "#3498db" harmonies

# Nearest CSS named color
cvt "cornflowerblue" nearest
```

---

## Cookbook

### Generate an accessible button palette

```ts
import { colorShades, bestTextColor, wcagLevel } from 'color-value-tools';

function buttonPalette(base: string) {
  const shades = colorShades(base, 9);
  return shades.map(shade => ({
    bg: shade,
    text: bestTextColor(shade),
    wcag: wcagLevel(bestTextColor(shade), shade),
  }));
}

buttonPalette('#3498db');
// [{ bg: '#ffffff', text: '#000000', wcag: 'AAA' }, ...]
```

### Theme-aware dark/light color

```ts
import { isDark, lighten, darken } from 'color-value-tools';

function adaptToTheme(color: string, isDarkTheme: boolean): string {
  return isDarkTheme ? lighten(color, 20) : darken(color, 10);
}
```

### Mix two brand colors at a midpoint

```ts
import { mixColors } from 'color-value-tools';

const mid = mixColors('#e74c3c', '#3498db', 0.5, { mode: 'hsl', format: 'hex' });
// Perceptually even blend between red and blue
```

### Build a triadic color scheme and check contrast

```ts
import { triadic, contrastRatio } from 'color-value-tools';

const [base, second, third] = triadic('#6c3483');
console.log(contrastRatio(base, '#ffffff')); // e.g. 8.4
console.log(contrastRatio(second, '#ffffff'));
```

### Convert a CSS color string to all formats at once

```ts
import { normalizeColor, rgbToOklch, rgbToCmyk } from 'color-value-tools';

const n = normalizeColor('hsl(204, 70%, 53%)');
const oklch = rgbToOklch({ r: n.r!, g: n.g!, b: n.b! });
const cmyk  = rgbToCmyk({ r: n.r!, g: n.g!, b: n.b! });
console.log(n.hex, oklch, cmyk);
```

### Find the perceptually nearest named CSS color

```ts
import { toNearestNamedColor } from 'color-value-tools';

toNearestNamedColor('#1a8ccc'); // 'steelblue'
```

### Random palette within a hue range

```ts
import { randomColor, colorShades } from 'color-value-tools';

const accent = randomColor({ hRange: [200, 260], sRange: [60, 80], lRange: [40, 60] });
const palette = colorShades(accent, 5);
```

---

## Author

Danil Lisin Vladimirovich aka Macrulez

GitHub: [macrulezru](https://github.com/macrulezru)

Website: [macrulez.ru](https://macrulez.ru/)

## License

MIT
