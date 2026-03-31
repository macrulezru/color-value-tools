#!/usr/bin/env node
/**
 * color-value-tools CLI
 * Usage: cvt <color> [command]
 *
 * Commands:
 *   info         Show full parsed info (default)
 *   convert      Show all format conversions
 *   contrast <bg>  Contrast ratio and WCAG level against a background
 *   shades [n]   Generate n light-to-dark shades (default 9)
 *   harmonies    Show all color harmonies
 *   nearest      Show nearest CSS named color
 */

import {
  normalizeColor,
  getColorType,
  hexToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToHwb,
  rgbToLab,
  rgbToLch,
  rgbToOklab,
  rgbToOklch,
  rgbToCmyk,
  contrastRatio,
  wcagLevel,
  bestTextColor,
  colorShades,
  complement,
  triadic,
  analogous,
  splitComplementary,
  tetradic,
  toNearestNamedColor,
} from '../src/index';

const args = process.argv.slice(2);

function printUsage(): void {
  console.log(`
color-value-tools CLI (cvt)

Usage:
  cvt <color>                 Full color info
  cvt <color> convert         All format conversions
  cvt <color> contrast <bg>   Contrast ratio vs background
  cvt <color> shades [n]      Generate shades (default 9)
  cvt <color> harmonies       All color harmonies
  cvt <color> nearest         Nearest CSS named color

Examples:
  cvt "#3498db"
  cvt "rgb(52,152,219)" convert
  cvt "#3498db" contrast "#ffffff"
  cvt "#3498db" shades 7
  cvt "cornflowerblue" harmonies
`.trim());
}

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  printUsage();
  process.exit(0);
}

const colorInput = args[0];
const command = args[1] ?? 'info';

const normalized = normalizeColor(colorInput);

if (normalized.type === 'unknown' || normalized.type === 'css-var') {
  console.error(`Error: Cannot resolve color "${colorInput}"`);
  if (normalized.type === 'css-var') {
    console.error('CSS variables cannot be resolved in the CLI (no DOM context).');
  }
  process.exit(1);
}

const r = normalized.r ?? 0;
const g = normalized.g ?? 0;
const b = normalized.b ?? 0;
const a = normalized.a ?? 1;
const hex = normalized.hex ?? '#000000';

function fmt2(n: number, dec = 2): string {
  return n.toFixed(dec);
}

function line(label: string, value: string): void {
  const pad = 18;
  console.log(`  ${label.padEnd(pad)} ${value}`);
}

switch (command) {
  case 'info': {
    const type = getColorType(colorInput);
    const [h, s, l] = rgbToHsl({ r, g, b });
    const [hv, sv, v] = rgbToHsv({ r, g, b });
    const nearest = toNearestNamedColor(hex);
    const textColor = bestTextColor(hex);
    console.log(`\nColor: ${colorInput}`);
    console.log('─'.repeat(40));
    line('Type:', type);
    line('Hex:', hex);
    line('RGB:', `rgb(${r}, ${g}, ${b})`);
    if (a < 1) line('Alpha:', fmt2(a));
    line('HSL:', `hsl(${h}, ${s}%, ${l}%)`);
    line('HSV:', `hsv(${hv}, ${sv}%, ${v}%)`);
    line('Nearest named:', nearest);
    line('Best text on it:', textColor);
    console.log('');
    break;
  }

  case 'convert': {
    const [h, s, l] = rgbToHsl({ r, g, b });
    const [hv, sv, v] = rgbToHsv({ r, g, b });
    const [hw, w, bw] = rgbToHwb({ r, g, b });
    const lab = rgbToLab({ r, g, b });
    const lch = rgbToLch({ r, g, b });
    const oklab = rgbToOklab({ r, g, b });
    const oklch = rgbToOklch({ r, g, b });
    const cmyk = rgbToCmyk({ r, g, b });
    console.log(`\nConversions for: ${colorInput}`);
    console.log('─'.repeat(40));
    line('Hex:', hex);
    line('Hex8:', `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`);
    line('RGB:', `rgb(${r}, ${g}, ${b})`);
    line('RGBA:', `rgba(${r}, ${g}, ${b}, ${fmt2(a)})`);
    line('HSL:', `hsl(${h}, ${s}%, ${l}%)`);
    line('HSV:', `hsv(${hv}, ${sv}%, ${v}%)`);
    line('HWB:', `hwb(${hw} ${w}% ${bw}%)`);
    line('Lab:', `lab(${fmt2(lab.L)} ${fmt2(lab.a)} ${fmt2(lab.b)})`);
    line('LCH:', `lch(${fmt2(lch.L)} ${fmt2(lch.C)} ${fmt2(lch.H)})`);
    line('Oklab:', `oklab(${fmt2(oklab.L, 4)} ${fmt2(oklab.a, 4)} ${fmt2(oklab.b, 4)})`);
    line('Oklch:', `oklch(${fmt2(oklch.L, 4)} ${fmt2(oklch.C, 4)} ${fmt2(oklch.H, 2)})`);
    line('CMYK:', `cmyk(${fmt2(cmyk.c * 100)}%, ${fmt2(cmyk.m * 100)}%, ${fmt2(cmyk.y * 100)}%, ${fmt2(cmyk.k * 100)}%)`);
    console.log('');
    break;
  }

  case 'contrast': {
    const bgInput = args[2];
    if (!bgInput) {
      console.error('Error: Please provide a background color. Usage: cvt <color> contrast <bg>');
      process.exit(1);
    }
    const bg = normalizeColor(bgInput);
    if (bg.type === 'unknown' || bg.type === 'css-var') {
      console.error(`Error: Cannot resolve background color "${bgInput}"`);
      process.exit(1);
    }
    const bgHex = bg.hex ?? '#000000';
    const ratio = contrastRatio(hex, bgHex);
    const level = wcagLevel(hex, bgHex);
    console.log(`\nContrast: ${colorInput} on ${bgInput}`);
    console.log('─'.repeat(40));
    line('Ratio:', `${fmt2(ratio)}:1`);
    line('WCAG level:', level);
    line('AA (text):', ratio >= 4.5 ? 'pass' : 'fail');
    line('AAA (text):', ratio >= 7 ? 'pass' : 'fail');
    line('AA-large:', ratio >= 3 ? 'pass' : 'fail');
    console.log('');
    break;
  }

  case 'shades': {
    const steps = parseInt(args[2] ?? '9', 10);
    if (isNaN(steps) || steps < 2) {
      console.error('Error: steps must be a number >= 2');
      process.exit(1);
    }
    const shades = colorShades(hex, steps);
    console.log(`\nShades of ${colorInput} (${steps} steps):`);
    console.log('─'.repeat(40));
    shades.forEach((shade, i) => {
      console.log(`  ${String(i + 1).padStart(2)}. ${shade}`);
    });
    console.log('');
    break;
  }

  case 'harmonies': {
    const comp = complement(hex);
    const tri = triadic(hex);
    const ana = analogous(hex);
    const split = splitComplementary(hex);
    const tet = tetradic(hex);
    console.log(`\nHarmonies for: ${colorInput}`);
    console.log('─'.repeat(40));
    line('Complement:', comp);
    line('Triadic:', tri.join(', '));
    line('Analogous:', ana.join(', '));
    line('Split-comp:', split.join(', '));
    line('Tetradic:', tet.join(', '));
    console.log('');
    break;
  }

  case 'nearest': {
    const name = toNearestNamedColor(hex);
    console.log(`\nNearest CSS named color for ${colorInput}:`);
    console.log('─'.repeat(40));
    line('Name:', name);
    console.log('');
    break;
  }

  default:
    console.error(`Unknown command: "${command}"`);
    printUsage();
    process.exit(1);
}
