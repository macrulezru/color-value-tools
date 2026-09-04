# **Color Value Tools**

![Color Value Tools](https://github.com/macrulezru/assets/blob/master/packages-images/color-value-tools.png?raw=true)

A comprehensive utility library for parsing, converting, manipulating, and analyzing color values across all major color models — hex, RGB, HSL, HSV, HWB, Lab, LCH, Oklab, Oklch, CMYK, Display P3 — plus CSS variables and named colors. Zero dependencies.

---

## Features

- **Universal parser** — `normalizeColor()` accepts hex (3/4/6/8-digit), `rgb()` / `rgba()`, `hsl()` / `hsla()`, `hwb()`, `oklch()` / `oklcha()`, `color(display-p3 ...)`, CSS named colors (all 148), and plain `{r,g,b}` / `{h,s,l}` objects
- **Conversions** — every path between hex, RGB, HSL, HSV, HWB, Lab, LCH, Oklab, Oklch, CMYK, Display P3; all round-trip accurate
- **Manipulation** — `lighten`, `darken`, `saturate`, `desaturate`, `invertColor`, `grayscale`, `setAlpha`, `rotateHue`, `adjustHexBrightness`
- **Mixing & Interpolation** — `mixColors` and `interpolateColors` in 6 color spaces with 4 hue interpolation modes; `createColorScale` across multiple anchor colors with custom positions; `midpointColor` for a perceptual midpoint
- **Color Harmonies** — `complement`, `triadic`, `analogous`, `splitComplementary`, `tetradic`
- **Palette Generation** — `colorShades`, `monochromatic`, `tints`, `shades`, `tones`, `randomColor` — all Oklab-accurate where applicable
- **WCAG Accessibility** — `relativeLuminance`, `contrastRatio`, `wcagLevel`, `bestTextColor`, `bestContrastColor`, `bestContrastPalette`, `isReadableOnBackground` (solid, semi-transparent, and gradient backgrounds)
- **Color Blindness Simulation** — protanopia, deuteranopia, tritanopia using Vienot 1999 matrices on linear RGB
- **Perceptual color distance** — `colorDeltaE` implementing the full CIEDE2000 formula
- **CSS Formatting** — `toHslString`, `toHwbString`, `toOklchString`, `toColorP3String`
- **Memoization cache** — `normalizeColorCached` caches parsed results in memory; `getCacheStats`, `clearColorCache`, `enableCache` / `disableCache`
- **Lazy generator functions** — `generateGradientColors`, `generateTints`, `generateShades` for iterating without pre-allocating arrays
- **CLI (`cvt`)** — inspect any color from the terminal: full info, all conversions, WCAG contrast, shades, harmonies, nearest named color
- **Zero dependencies** — no runtime deps; ships as tree-shakeable ESM + CommonJS

---

## Installation

Requires Node.js `18+`. No runtime or peer dependencies — the package is fully framework-agnostic and works in any JS/TS environment (browser, Node, edge runtimes).

```bash
npm install color-value-tools
```

### Quick start

```ts
import {
  normalizeColor,
  mixColors,
  lighten,
  darken,
  saturate,
  complement,
  triadic,
  wcagLevel,
  bestTextColor,
  colorDeltaE,
  randomColor,
} from 'color-value-tools'

// Parse any color format
normalizeColor('#3498db')
// { type: 'hex', hex: '#3498db', r: 52, g: 152, b: 219, a: 1, h: 204, s: 70, l: 53, v: 86 }

// Manipulate
lighten('#3498db', 15) // '#74b9e7'
darken('#3498db', 15) // '#1d6ea5'
saturate('#3498db', 20) // '#1b9df3'

// Harmonies
complement('#3498db') // '#db7633'
triadic('#3498db') // ['#3498db', '#db3398', '#98db33']

// WCAG accessibility
wcagLevel('#ffffff', '#3498db') // 'AA-large'
bestTextColor('#3498db') // '#000000'

// Perceptual color distance (CIEDE2000)
colorDeltaE('#ff0000', '#fe0000') // 0.2079

// Random color within a hue/saturation range
randomColor({ hRange: [200, 260], sRange: [60, 80] })
```

CommonJS:

```js
const { normalizeColor, mixColors } = require('color-value-tools')
```

### More examples

#### What your palette looks like to a colorblind user

`simulateColorBlindness` applies the Vienot 1999 matrices to linearized RGB — you can check contrast before shipping, not guess from a checklist.

```ts
import { simulateColorBlindness } from 'color-value-tools'

simulateColorBlindness('#e74c3c', 'deuteranopia') // '#9a7b00'
simulateColorBlindness('#3498db', 'protanopia') // '#5282db'

// Vienot 1999 matrices applied to linearized RGB — good enough to check a
// palette before it ships, not just guess from a colorblind-safe checklist.
```

#### A harmony and a shade scale from one color

`triadic` builds three colors 120° apart, `colorShades` a light-to-dark scale of nine steps. One base color in, a coordinated palette out — no manual hue math, no hand-picked hex values.

```ts
import { triadic, colorShades } from 'color-value-tools'

triadic('#6c3483') // ['#6c3483', '#34836c', '#83346c'] — evenly spaced 120°

const shades = colorShades('#6c3483', 9) // light-to-dark HSL scale, 9 steps

// One base color in, a coordinated palette out — no manual hue-rotation
// math, no hand-picked hex values.
```

---

## Documentation & links

- 📖 **Full documentation:** [npm.vuecraft.ru/en/packages/color-value-tools](https://npm.vuecraft.ru/en/packages/color-value-tools/guide/overview.html)
- 🌐 **VueCraft:** [vuecraft.ru/en](https://vuecraft.ru/en)
- 👤 **Author:** [macrulez.ru/en](https://macrulez.ru/en)
- 💻 **GitHub:** [macrulezru/color-value-tools](https://github.com/macrulezru/color-value-tools)
- 📦 **NPM:** [color-value-tools](https://www.npmjs.com/package/color-value-tools)
- 🐛 **Issues:** [github.com/macrulezru/color-value-tools/issues](https://github.com/macrulezru/color-value-tools/issues)

---

## License

MIT

---

## 💖 Support the project

Open source takes time and effort. If this library saves you time or brings value, consider supporting further development.

<a href="https://donate.cryptocloud.plus/M6O34NIN" target="_blank">
  <img src="https://img.shields.io/badge/Donate-CryptoCloud-8A2BE2?style=for-the-badge&logo=cryptocurrency&logoColor=white" alt="Donate via CryptoCloud">
</a>

Thank you for being part of this journey. ❤️
