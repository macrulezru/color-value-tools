#!/usr/bin/env node
"use strict";
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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const args = process.argv.slice(2);
function printUsage() {
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
const command = (_a = args[1]) !== null && _a !== void 0 ? _a : 'info';
const normalized = (0, index_1.normalizeColor)(colorInput);
if (normalized.type === 'unknown' || normalized.type === 'css-var') {
    console.error(`Error: Cannot resolve color "${colorInput}"`);
    if (normalized.type === 'css-var') {
        console.error('CSS variables cannot be resolved in the CLI (no DOM context).');
    }
    process.exit(1);
}
const r = (_b = normalized.r) !== null && _b !== void 0 ? _b : 0;
const g = (_c = normalized.g) !== null && _c !== void 0 ? _c : 0;
const b = (_d = normalized.b) !== null && _d !== void 0 ? _d : 0;
const a = (_e = normalized.a) !== null && _e !== void 0 ? _e : 1;
const hex = (_f = normalized.hex) !== null && _f !== void 0 ? _f : '#000000';
function fmt2(n, dec = 2) {
    return n.toFixed(dec);
}
function line(label, value) {
    const pad = 18;
    console.log(`  ${label.padEnd(pad)} ${value}`);
}
switch (command) {
    case 'info': {
        const type = (0, index_1.getColorType)(colorInput);
        const [h, s, l] = (0, index_1.rgbToHsl)({ r, g, b });
        const [hv, sv, v] = (0, index_1.rgbToHsv)({ r, g, b });
        const nearest = (0, index_1.toNearestNamedColor)(hex);
        const textColor = (0, index_1.bestTextColor)(hex);
        console.log(`\nColor: ${colorInput}`);
        console.log('─'.repeat(40));
        line('Type:', type);
        line('Hex:', hex);
        line('RGB:', `rgb(${r}, ${g}, ${b})`);
        if (a < 1)
            line('Alpha:', fmt2(a));
        line('HSL:', `hsl(${h}, ${s}%, ${l}%)`);
        line('HSV:', `hsv(${hv}, ${sv}%, ${v}%)`);
        line('Nearest named:', nearest);
        line('Best text on it:', textColor);
        console.log('');
        break;
    }
    case 'convert': {
        const [h, s, l] = (0, index_1.rgbToHsl)({ r, g, b });
        const [hv, sv, v] = (0, index_1.rgbToHsv)({ r, g, b });
        const [hw, w, bw] = (0, index_1.rgbToHwb)({ r, g, b });
        const lab = (0, index_1.rgbToLab)({ r, g, b });
        const lch = (0, index_1.rgbToLch)({ r, g, b });
        const oklab = (0, index_1.rgbToOklab)({ r, g, b });
        const oklch = (0, index_1.rgbToOklch)({ r, g, b });
        const cmyk = (0, index_1.rgbToCmyk)({ r, g, b });
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
        const bg = (0, index_1.normalizeColor)(bgInput);
        if (bg.type === 'unknown' || bg.type === 'css-var') {
            console.error(`Error: Cannot resolve background color "${bgInput}"`);
            process.exit(1);
        }
        const bgHex = (_g = bg.hex) !== null && _g !== void 0 ? _g : '#000000';
        const ratio = (0, index_1.contrastRatio)(hex, bgHex);
        const level = (0, index_1.wcagLevel)(hex, bgHex);
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
        const steps = parseInt((_h = args[2]) !== null && _h !== void 0 ? _h : '9', 10);
        if (isNaN(steps) || steps < 2) {
            console.error('Error: steps must be a number >= 2');
            process.exit(1);
        }
        const shades = (0, index_1.colorShades)(hex, steps);
        console.log(`\nShades of ${colorInput} (${steps} steps):`);
        console.log('─'.repeat(40));
        shades.forEach((shade, i) => {
            console.log(`  ${String(i + 1).padStart(2)}. ${shade}`);
        });
        console.log('');
        break;
    }
    case 'harmonies': {
        const comp = (0, index_1.complement)(hex);
        const tri = (0, index_1.triadic)(hex);
        const ana = (0, index_1.analogous)(hex);
        const split = (0, index_1.splitComplementary)(hex);
        const tet = (0, index_1.tetradic)(hex);
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
        const name = (0, index_1.toNearestNamedColor)(hex);
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
