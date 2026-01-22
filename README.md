# color-value-tools

A tiny utility library for parsing, converting, and manipulating color values across common formats (hex, RGB, HSL, HSV, Lab, CMYK) and CSS variables.

## Installation

```bash
npm install color-value-tools
```

## Usage

Example (ESM / TypeScript):

```ts
import { normalizeColor, mixColors } from 'color-value-tools';

console.log(normalizeColor('#3498db'));
// { type: 'hex', hex: '#3498db', r: 52, g: 152, b: 219, ... }

console.log(mixColors('#ff0000', '#0000ff', 0.5));
// '#800080'
```

Example (CommonJS / Node):

```js
const { normalizeColor, mixColors } = require('color-value-tools');
console.log(normalizeColor('rgba(255,0,0,0.5)'));
```

## API & Options

- **`isCssVariable`**: Check if a string is a CSS variable (e.g. `var(--main)`).
- **`isHexColor`**: Detect hex color strings (3- or 6-digit, with or without `#`).
- **`isRgbColor`**: Detect `rgb()` / `rgba()` color strings.
- **`isHslColor`**: Detect `hsl()` / `hsla()` color strings.
- **`getColorType`**: Returns the color type: `hex`, `css-var`, `rgb`, `hsl`, `named`, or `unknown`.
- **`extractCssVariableName`**: Extracts the CSS variable name from `var(--name)`.
- **`normalizeHex`**: Normalizes and validates hex strings, returns a 6-digit lowercase hex (fallback `#f5e477`).
- **`hexToRgb`**: Convert a hex color to an `[r, g, b]` tuple.
- **`hexToRgba`**: Convert a hex color to an `rgba(...)` string with opacity.
- **`hexToHsl`**: Convert a hex color to an `[h, s, l]` tuple.
- **`hslToHex`**: Convert HSL values to a hex color string.
- **`adjustHexBrightness`**: Lighten or darken a hex color by a percentage offset.
- **`rotateHue`**: Rotate the hue of a hex color by degrees.
- **`rgbToHex` / `rgbaToHex`**: Convert RGB(A) channels to `#rrggbb` / `#rrggbbaa`.
- **`rgbToRgbaString` / `rgbaStringToRgba`**: Build and parse `rgba(...)` / `rgb(...)` strings.
- **`rgbToHsl` / `hslToRgb`**: RGB ↔ HSL conversions.
- **`rgbToHsv` / `hsvToRgb`**: RGB ↔ HSV conversions.
- **`hexToHsv` / `hsvToHex`**: Hex ↔ HSV helpers.
- **`hex8ToRgba` / `rgbaToHex8`**: Parse and build 8-digit hex with alpha.
- **`normalizeColor`**: Universal parser/normalizer returning `{ type, hex?, r?, g?, b?, a?, h?, s?, l?, v? }`.
- **`mixColors`**: Linear interpolation between two colors (supports `rgb` or `hsl` mixing, returns hex/rgb/rgba/hsl).
- **`relativeLuminance` / `contrastRatio`**: WCAG relative luminance and contrast ratio.
- **`isDark` / `isLight`**: Quick luminance-based checks.
- **`rgbToCmyk` / `cmykToRgb`**: CMYK conversions for print scenarios.
- **`rgbToLab` / `labToRgb` / `rgbToLch` / `lchToRgb`**: Perceptual color space conversions (Lab / LCH) for advanced operations.

## Author

Danil Lisin Vladimirovich aka Macrulez

GitHub: [macrulezru](https://github.com/macrulezru)

Website: [macrulez.ru](https://macrulez.ru/)

## License

MIT