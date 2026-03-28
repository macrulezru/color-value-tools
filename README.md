# color-value-tools

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
| `getColorType(value)` | Returns `'hex'`, `'css-var'`, `'rgb'`, `'hsl'`, `'named'`, or `'unknown'` |
| `isHexColor(value)` | Detects 3- or 6-digit hex strings (with or without `#`) |
| `isRgbColor(value)` | Detects `rgb()` / `rgba()` strings |
| `isHslColor(value)` | Detects `hsl()` / `hsla()` strings |
| `isCssVariable(value)` | Checks for `var(--name)` pattern |
| `extractCssVariableName(value)` | Extracts `--name` from `var(--name)` |

### Parsing & Normalization

| Function | Description |
|---|---|
| `normalizeColor(input)` | Universal parser. Accepts hex string, `rgb()`, `hsl()`, named color, or `{r,g,b}` / `{h,s,l}` object. Returns `{ type, hex, r, g, b, a, h, s, l, v }` |
| `normalizeHex(hex)` | Normalizes 3- or 6-digit hex to lowercase 6-digit with `#` |
| `rgbaStringToRgba(str)` | Parses `rgb()` / `rgba()` string to `{r, g, b, a}` |
| `hex8ToRgba(hex)` | Parses 8-digit hex (`#rrggbbaa`) to `{r, g, b, a}` |
| `parseHwbString(str)` | Parses `hwb()` string to `{H, W, B, alpha}` |

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
| `rgbaToHex8({r,g,b,a})` | Alias for `rgbaToHex` |

### Manipulation

| Function | Description |
|---|---|
| `lighten(color, amount)` | Increase lightness by `amount` (0–100) |
| `darken(color, amount)` | Decrease lightness by `amount` (0–100) |
| `saturate(color, amount)` | Increase saturation by `amount` (0–100) |
| `desaturate(color, amount)` | Decrease saturation by `amount` (0–100) |
| `setAlpha(color, alpha)` | Returns `rgba(...)` with the given alpha (0–1) |
| `getAlpha(color)` | Returns the alpha channel value (0–1) |
| `invertColor(color)` | Inverts RGB channels |
| `grayscale(color)` | Converts to grayscale using ITU-R BT.709 weights |
| `rotateHue(hex, degrees)` | Rotates hue by degrees (supports negative values) |
| `adjustHexBrightness(hex, offsetPercent)` | Lightens (positive) or darkens (negative) by percentage |
| `mixColors(c1, c2, t, opts?)` | Linearly interpolates between two colors. `t` = 0–1. Options: `mode: 'rgb'|'hsl'`, `format: 'hex'|'rgb'|'rgba'|'hsl'` |

### Color Harmonies

| Function | Description |
|---|---|
| `complement(color)` | Returns the complementary color (180° rotation) |
| `triadic(color)` | Returns 3 colors evenly spaced 120° apart |
| `analogous(color, angle?)` | Returns 3 neighboring colors (default ±30°) |
| `splitComplementary(color)` | Returns the base + two colors at 150° and 210° |
| `tetradic(color)` | Returns 4 colors evenly spaced 90° apart |

### Palette Generation

| Function | Description |
|---|---|
| `colorShades(color, steps?)` | Generates a light-to-dark scale (default 9 steps) |
| `monochromatic(color, steps?)` | Generates shades by varying saturation (default 5 steps) |

### Accessibility (WCAG)

| Function | Description |
|---|---|
| `relativeLuminance(color)` | WCAG relative luminance (0–1) |
| `contrastRatio(c1, c2)` | WCAG contrast ratio (1–21) |
| `wcagLevel(fg, bg)` | Returns `'AAA'`, `'AA'`, `'AA-large'`, or `'fail'` |
| `bestTextColor(bg)` | Returns `'#000000'` or `'#ffffff'` for best contrast on `bg` |
| `bestContrastColor(bg, candidates)` | Picks the most readable color from `candidates` |
| `isDark(color, threshold?)` | `true` if luminance is below threshold (default 0.5) |
| `isLight(color, threshold?)` | Inverse of `isDark` |

### Formatting

| Function | Description |
|---|---|
| `toHslString(h, s, l, alpha?)` | Formats as `hsl(...)` or `hsla(...)` |
| `toHwbString(H, W, B, alpha?)` | Formats as `hwb(...)` with optional alpha |

### Utilities

| Function | Description |
|---|---|
| `colorDeltaE(c1, c2)` | Perceptual color distance using CIEDE2000 |
| `randomColor(options?)` | Generates a random color. Options: `hRange`, `sRange`, `lRange` (each `[min, max]`) |
| `toNearestNamedColor(color)` | Returns the closest CSS named color name (all 148 standard colors) |

---

## Author

Danil Lisin Vladimirovich aka Macrulez

GitHub: [macrulezru](https://github.com/macrulezru)

Website: [macrulez.ru](https://macrulez.ru/)

## License

MIT
