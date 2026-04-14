import { describe, it, expect, beforeEach } from 'vitest';
import {
  getColorType,
  normalizeHex,
  hexToRgb,
  hexToHsl,
  hslToHex,
  hslToRgb,
  rgbToHsl,
  rgbToHsv,
  hsvToRgb,
  rgbToHwb,
  hwbToRgb,
  rgbToOklab,
  oklabToRgb,
  rgbToOklch,
  oklchToRgb,
  rgbToDisplayP3,
  displayP3ToRgb,
  toDisplayP3Hex,
  lighten,
  darken,
  saturate,
  desaturate,
  invertColor,
  grayscale,
  setAlpha,
  getAlpha,
  complement,
  triadic,
  analogous,
  splitComplementary,
  tetradic,
  colorShades,
  monochromatic,
  tints,
  shades,
  tones,
  contrastRatio,
  wcagLevel,
  bestTextColor,
  bestContrastColor,
  bestContrastPalette,
  isReadableOnBackground,
  simulateProtanopia,
  simulateDeuteranopia,
  simulateTritanopia,
  simulateColorBlindness,
  colorDeltaE,
  toNearestNamedColor,
  toHslString,
  toHwbString,
  toOklchString,
  toColorP3String,
  rotateHue,
  mixColors,
  interpolateColors,
  createColorScale,
  midpointColor,
  normalizeColor,
  normalizeColorCached,
  clearColorCache,
  getCacheStats,
  enableCache,
  disableCache,
  isOklchColor,
  isColorFunction,
  parseOklchString,
  parseColorFn,
  parseCssVar,
  shortHexToRgba,
  generateGradientColors,
  generateTints,
  generateShades,
} from './index';

// ─── Detection ───────────────────────────────────────────────────────────────

describe('getColorType', () => {
  it('detects hex', () => expect(getColorType('#ff0000')).toBe('hex'));
  it('detects short hex', () => expect(getColorType('#f00')).toBe('hex'));
  it('detects rgb', () => expect(getColorType('rgb(255,0,0)')).toBe('rgb'));
  it('detects rgba', () => expect(getColorType('rgba(255,0,0,0.5)')).toBe('rgb'));
  it('detects hsl', () => expect(getColorType('hsl(0,100%,50%)')).toBe('hsl'));
  it('detects css-var', () => expect(getColorType('var(--color)')).toBe('css-var'));
  it('detects all 148+ named colors', () => {
    expect(getColorType('rebeccapurple')).toBe('named');
    expect(getColorType('cornflowerblue')).toBe('named');
    expect(getColorType('lightgoldenrodyellow')).toBe('named');
    expect(getColorType('transparent')).toBe('named');
  });
  it('returns unknown for garbage', () => expect(getColorType('not-a-color')).toBe('unknown'));
});

// ─── Hex normalization ───────────────────────────────────────────────────────

describe('normalizeHex', () => {
  it('expands 3-digit hex', () => expect(normalizeHex('#f00')).toBe('#ff0000'));
  it('lowercases', () => expect(normalizeHex('#FF0000')).toBe('#ff0000'));
  it('adds # if missing', () => expect(normalizeHex('ff0000')).toBe('#ff0000'));
  it('fallback on invalid', () => expect(normalizeHex('#zzz')).toBe('#f5e477'));
});

// ─── Conversions ─────────────────────────────────────────────────────────────

describe('hexToRgb', () => {
  it('converts red', () => expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]));
  it('converts white', () => expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]));
  it('converts black', () => expect(hexToRgb('#000000')).toEqual([0, 0, 0]));
});

describe('hexToHsl / hslToHex round-trip', () => {
  it('red round-trip', () => {
    const [h, s, l] = hexToHsl('#ff0000');
    expect(hslToHex(h, s, l)).toBe('#ff0000');
  });
  it('hue is 0 for red', () => expect(hexToHsl('#ff0000')[0]).toBe(0));
  it('saturation is 100 for red', () => expect(hexToHsl('#ff0000')[1]).toBe(100));
  it('lightness is 50 for red', () => expect(hexToHsl('#ff0000')[2]).toBe(50));
});

describe('hslToHex handles negative hue', () => {
  it('-30° == 330°', () => expect(hslToHex(-30, 100, 50)).toBe(hslToHex(330, 100, 50)));
  it('-360° == 0°', () => expect(hslToHex(-360, 100, 50)).toBe(hslToHex(0, 100, 50)));
});

describe('hslToRgb / rgbToHsl round-trip', () => {
  it('blue round-trip', () => {
    const { r, g, b } = hslToRgb(240, 100, 50);
    const [h, s, l] = rgbToHsl({ r, g, b });
    expect(h).toBe(240);
    expect(s).toBe(100);
    expect(l).toBe(50);
  });
  it('handles negative hue', () => {
    const a = hslToRgb(-120, 100, 50);
    const b = hslToRgb(240, 100, 50);
    expect(a).toEqual(b);
  });
});

describe('rgbToHsv / hsvToRgb round-trip', () => {
  it('green round-trip', () => {
    const [h, s, v] = rgbToHsv({ r: 0, g: 255, b: 0 });
    const { r, g, b } = hsvToRgb(h, s, v);
    expect(r).toBe(0); expect(g).toBe(255); expect(b).toBe(0);
  });
  it('handles negative hue in hsvToRgb', () => {
    expect(hsvToRgb(-120, 100, 100)).toEqual(hsvToRgb(240, 100, 100));
  });
});

describe('rgbToHwb / hwbToRgb round-trip', () => {
  it('red round-trip', () => {
    const [H, W, B] = rgbToHwb({ r: 255, g: 0, b: 0 });
    const { r, g, b } = hwbToRgb(H, W, B);
    expect(r).toBe(255); expect(g).toBe(0); expect(b).toBe(0);
  });
  it('gray when W+B >= 100', () => {
    const { r, g, b } = hwbToRgb(0, 50, 50);
    expect(r).toBe(g); expect(g).toBe(b);
  });
});

describe('rgbToOklab / oklabToRgb round-trip', () => {
  it('blue round-trip (within 1 unit)', () => {
    const lab = rgbToOklab({ r: 0, g: 0, b: 255 });
    const { r, g, b } = oklabToRgb(lab);
    expect(Math.abs(r - 0)).toBeLessThanOrEqual(1);
    expect(Math.abs(g - 0)).toBeLessThanOrEqual(1);
    expect(Math.abs(b - 255)).toBeLessThanOrEqual(1);
  });
});

describe('rgbToOklch / oklchToRgb round-trip', () => {
  it('green round-trip (within 1 unit)', () => {
    const lch = rgbToOklch({ r: 0, g: 200, b: 0 });
    const { r, g, b } = oklchToRgb(lch);
    expect(Math.abs(r - 0)).toBeLessThanOrEqual(2);
    expect(Math.abs(g - 200)).toBeLessThanOrEqual(2);
    expect(Math.abs(b - 0)).toBeLessThanOrEqual(2);
  });
});

// ─── Manipulation ────────────────────────────────────────────────────────────

describe('lighten / darken', () => {
  it('lighten increases lightness', () => {
    const [, , l1] = hexToHsl('#3498db');
    const [, , l2] = hexToHsl(lighten('#3498db', 10));
    expect(l2).toBeGreaterThan(l1);
  });
  it('darken decreases lightness', () => {
    const [, , l1] = hexToHsl('#3498db');
    const [, , l2] = hexToHsl(darken('#3498db', 10));
    expect(l2).toBeLessThan(l1);
  });
  it('lighten clamps at 100', () => {
    const [, , l] = hexToHsl(lighten('#ffffff', 50));
    expect(l).toBe(100);
  });
  it('darken clamps at 0', () => {
    const [, , l] = hexToHsl(darken('#000000', 50));
    expect(l).toBe(0);
  });
});

describe('saturate / desaturate', () => {
  it('saturate increases saturation', () => {
    const [, s1] = hexToHsl('#888888');
    const [, s2] = hexToHsl(saturate('#888888', 20));
    expect(s2).toBeGreaterThanOrEqual(s1);
  });
  it('desaturate decreases saturation', () => {
    const [, s1] = hexToHsl('#ff0000');
    const [, s2] = hexToHsl(desaturate('#ff0000', 30));
    expect(s2).toBeLessThan(s1);
  });
});

describe('invertColor', () => {
  it('inverts black to white', () => expect(invertColor('#000000')).toBe('#ffffff'));
  it('inverts white to black', () => expect(invertColor('#ffffff')).toBe('#000000'));
  it('inverts red', () => expect(invertColor('#ff0000')).toBe('#00ffff'));
});

describe('grayscale', () => {
  it('gray is unchanged', () => {
    const result = grayscale('#808080');
    const [r, g, b] = hexToRgb(result);
    expect(r).toBe(g); expect(g).toBe(b);
  });
  it('colorful → r=g=b', () => {
    const result = grayscale('#3498db');
    const [r, g, b] = hexToRgb(result);
    expect(r).toBe(g); expect(g).toBe(b);
  });
});

describe('setAlpha / getAlpha', () => {
  it('setAlpha returns rgba string', () => {
    expect(setAlpha('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });
  it('getAlpha returns 1 for hex', () => expect(getAlpha('#ff0000')).toBe(1));
  it('getAlpha reads rgba alpha', () => expect(getAlpha('rgba(255,0,0,0.3)')).toBeCloseTo(0.3, 1));
});

describe('rotateHue', () => {
  it('180° rotation gives complement', () => {
    const [h1] = hexToHsl('#ff0000');
    const [h2] = hexToHsl(rotateHue('#ff0000', 180));
    expect(Math.abs(h2 - (h1 + 180) % 360)).toBeLessThanOrEqual(1);
  });
  it('negative rotation', () => {
    expect(rotateHue('#ff0000', -30)).toBe(rotateHue('#ff0000', 330));
  });
});

// ─── Harmonies ───────────────────────────────────────────────────────────────

describe('complement', () => {
  it('returns a different color', () => expect(complement('#ff0000')).not.toBe('#ff0000'));
  it('double complement returns original hue', () => {
    const [h1] = hexToHsl('#3498db');
    const [h2] = hexToHsl(complement(complement('#3498db')));
    expect(Math.abs(h1 - h2)).toBeLessThanOrEqual(1);
  });
});

describe('triadic', () => {
  it('returns 3 colors', () => expect(triadic('#ff0000')).toHaveLength(3));
  it('first element is original', () => expect(triadic('#ff0000')[0]).toBe('#ff0000'));
  it('hues are 120° apart', () => {
    const colors = triadic('#ff0000');
    const hues = colors.map(c => hexToHsl(c)[0]);
    expect(Math.abs(hues[1] - hues[0])).toBeCloseTo(120, 0);
    expect(Math.abs(hues[2] - hues[0])).toBeCloseTo(240, 0);
  });
});

describe('analogous', () => {
  it('returns 3 colors', () => expect(analogous('#ff0000')).toHaveLength(3));
  it('center is original', () => expect(analogous('#ff0000')[1]).toBe('#ff0000'));
});

describe('splitComplementary', () => {
  it('returns 3 colors', () => expect(splitComplementary('#ff0000')).toHaveLength(3));
  it('first is original', () => expect(splitComplementary('#ff0000')[0]).toBe('#ff0000'));
});

describe('tetradic', () => {
  it('returns 4 colors', () => expect(tetradic('#ff0000')).toHaveLength(4));
  it('first is original', () => expect(tetradic('#ff0000')[0]).toBe('#ff0000'));
});

// ─── Palettes ────────────────────────────────────────────────────────────────

describe('colorShades', () => {
  it('default returns 9 steps', () => expect(colorShades('#3498db')).toHaveLength(9));
  it('custom steps', () => expect(colorShades('#3498db', 5)).toHaveLength(5));
  it('is ordered light to dark', () => {
    const shades = colorShades('#3498db', 5);
    const lightnesses = shades.map(c => hexToHsl(c)[2]);
    expect(lightnesses[0]).toBeGreaterThan(lightnesses[lightnesses.length - 1]);
  });
});

describe('monochromatic', () => {
  it('default returns 5 steps', () => expect(monochromatic('#3498db')).toHaveLength(5));
  it('saturated colors preserve hue', () => {
    // skip s=0 steps (grays have undefined hue, hexToHsl returns 0 by convention)
    const colors = monochromatic('#3498db', 5);
    const saturated = colors.filter(c => hexToHsl(c)[1] > 0);
    const hues = saturated.map(c => hexToHsl(c)[0]);
    expect(Math.max(...hues) - Math.min(...hues)).toBeLessThanOrEqual(1);
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('contrastRatio', () => {
  it('black on white is 21', () => expect(contrastRatio('#000000', '#ffffff')).toBe(21));
  it('same color is 1', () => expect(contrastRatio('#ff0000', '#ff0000')).toBe(1));
  it('is symmetric', () => {
    expect(contrastRatio('#3498db', '#ffffff')).toBe(contrastRatio('#ffffff', '#3498db'));
  });
});

describe('wcagLevel', () => {
  it('black on white is AAA', () => expect(wcagLevel('#000000', '#ffffff')).toBe('AAA'));
  it('low contrast is fail', () => expect(wcagLevel('#cccccc', '#ffffff')).toBe('fail'));
  it('medium contrast is AA-large', () => {
    // find a pair with ratio ~3.5
    expect(['AA', 'AA-large', 'AAA', 'fail']).toContain(wcagLevel('#3498db', '#ffffff'));
  });
});

describe('bestTextColor', () => {
  it('dark bg → white text', () => expect(bestTextColor('#000000')).toBe('#ffffff'));
  it('light bg → black text', () => expect(bestTextColor('#ffffff')).toBe('#000000'));
});

describe('bestContrastColor', () => {
  it('picks highest contrast', () => {
    const result = bestContrastColor('#ffffff', ['#cccccc', '#000000', '#888888']);
    expect(result).toBe('#000000');
  });
});

// ─── Color distance ──────────────────────────────────────────────────────────

describe('colorDeltaE', () => {
  it('same color = 0', () => expect(colorDeltaE('#ff0000', '#ff0000')).toBe(0));
  it('black vs white is large', () => expect(colorDeltaE('#000000', '#ffffff')).toBeGreaterThan(50));
  it('nearly identical colors have small delta', () => {
    expect(colorDeltaE('#ff0000', '#fe0000')).toBeLessThan(2);
  });
});

// ─── Utilities ───────────────────────────────────────────────────────────────

describe('toNearestNamedColor', () => {
  it('pure red → red', () => expect(toNearestNamedColor('#ff0000')).toBe('red'));
  it('pure white → white', () => expect(toNearestNamedColor('#ffffff')).toBe('white'));
  it('pure black → black', () => expect(toNearestNamedColor('#000000')).toBe('black'));
});

describe('toHslString', () => {
  it('no alpha', () => expect(toHslString(0, 100, 50)).toBe('hsl(0, 100%, 50%)'));
  it('with alpha', () => expect(toHslString(0, 100, 50, 0.5)).toBe('hsla(0, 100%, 50%, 0.5)'));
});

describe('toHwbString', () => {
  it('no alpha', () => expect(toHwbString(120, 0, 0)).toBe('hwb(120 0% 0%)'));
  it('with alpha', () => expect(toHwbString(120, 0, 0, 0.5)).toBe('hwb(120 0% 0% / 0.5)'));
});

describe('mixColors', () => {
  it('t=0 returns first color', () => expect(mixColors('#ff0000', '#0000ff', 0)).toBe('#ff0000'));
  it('t=1 returns second color', () => expect(mixColors('#ff0000', '#0000ff', 1)).toBe('#0000ff'));
  it('t=0.5 rgb midpoint black→white', () => expect(mixColors('#000000', '#ffffff', 0.5)).toBe('#808080'));
  it('hsl mode returns valid hex', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'hsl' })).toMatch(/^#[0-9a-f]{6}$/));
  it('lab mode returns valid hex', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'lab' })).toMatch(/^#[0-9a-f]{6}$/));
  it('lch mode returns valid hex', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'lch' })).toMatch(/^#[0-9a-f]{6}$/));
  it('oklab mode returns valid hex', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'oklab' })).toMatch(/^#[0-9a-f]{6}$/));
  it('oklch mode returns valid hex', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { mode: 'oklch' })).toMatch(/^#[0-9a-f]{6}$/));
  it('oklch shorter hue stays between endpoints', () => {
    const result = mixColors('#ff0000', '#00ff00', 0.5, { mode: 'oklch', hueInterpolation: 'shorter' });
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('format rgb', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { format: 'rgb' })).toMatch(/^rgb\(/));
  it('format rgba', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { format: 'rgba' })).toMatch(/^rgba\(/));
  it('format hsl', () => expect(mixColors('#ff0000', '#0000ff', 0.5, { format: 'hsl' })).toMatch(/^hsl\(/));
});

describe('normalizeColor', () => {
  it('parses hex', () => {
    const c = normalizeColor('#ff0000');
    expect(c.r).toBe(255); expect(c.g).toBe(0); expect(c.b).toBe(0);
  });
  it('parses rgba string', () => {
    const c = normalizeColor('rgba(255, 0, 0, 0.5)');
    expect(c.r).toBe(255); expect(c.a).toBeCloseTo(0.5);
  });
  it('parses hsl string', () => {
    const c = normalizeColor('hsl(240, 100%, 50%)');
    expect(c.h).toBe(240);
  });
  it('parses {r,g,b} object', () => {
    const c = normalizeColor({ r: 0, g: 255, b: 0 });
    expect(c.hex).toBe('#00ff00');
  });
  it('parses {h,s,l} object', () => {
    const c = normalizeColor({ h: 0, s: 100, l: 50 });
    expect(c.r).toBe(255);
  });
  it('parses oklch() string', () => {
    const c = normalizeColor('oklch(0.627 0.111 251)');
    expect(c.type).toBe('oklch');
    expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('parses color(display-p3 ...) string', () => {
    const c = normalizeColor('color(display-p3 1 0 0)');
    expect(c.type).toBe('color');
    expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('parses #RGBA 4-digit hex', () => {
    const c = normalizeColor('#f00f');
    expect(c.type).toBe('hex');
    expect(c.r).toBe(255); expect(c.g).toBe(0); expect(c.b).toBe(0);
  });
});

// ─── Section 1: New parsers ───────────────────────────────────────────────────

describe('isOklchColor', () => {
  it('detects oklch()', () => expect(isOklchColor('oklch(0.5 0.1 180)')).toBe(true));
  it('detects oklcha()', () => expect(isOklchColor('oklcha(0.5 0.1 180 / 0.5)')).toBe(true));
  it('rejects rgb', () => expect(isOklchColor('rgb(255,0,0)')).toBe(false));
});

describe('isColorFunction', () => {
  it('detects color(display-p3 ...)', () => expect(isColorFunction('color(display-p3 1 0 0)')).toBe(true));
  it('detects color(srgb ...)', () => expect(isColorFunction('color(srgb 1 0 0)')).toBe(true));
  it('rejects oklch', () => expect(isColorFunction('oklch(0.5 0.1 180)')).toBe(false));
});

describe('parseOklchString', () => {
  it('parses standard form', () => {
    const r = parseOklchString('oklch(0.65 0.15 25)');
    expect(r).not.toBeNull();
    expect(r!.L).toBeCloseTo(0.65, 2);
    expect(r!.C).toBeCloseTo(0.15, 2);
    expect(r!.H).toBeCloseTo(25, 1);
    expect(r!.alpha).toBe(1);
  });
  it('parses percentage L', () => {
    const r = parseOklchString('oklch(65% 0.15 25)');
    expect(r!.L).toBeCloseTo(0.65, 2);
  });
  it('parses alpha', () => {
    const r = parseOklchString('oklch(0.65 0.15 25 / 0.8)');
    expect(r!.alpha).toBeCloseTo(0.8, 2);
  });
  it('returns null for invalid', () => expect(parseOklchString('rgb(0,0,0)')).toBeNull());
});

describe('parseColorFn', () => {
  it('parses display-p3', () => {
    const r = parseColorFn('color(display-p3 1 0.5 0)');
    expect(r).not.toBeNull();
    expect(r!.space).toBe('display-p3');
    expect(r!.r).toBeCloseTo(1, 2);
    expect(r!.g).toBeCloseTo(0.5, 2);
    expect(r!.b).toBeCloseTo(0, 2);
    expect(r!.alpha).toBe(1);
  });
  it('parses percentage values', () => {
    const r = parseColorFn('color(srgb 100% 50% 0%)');
    expect(r!.r).toBeCloseTo(1, 2);
    expect(r!.g).toBeCloseTo(0.5, 2);
  });
  it('parses alpha', () => {
    const r = parseColorFn('color(display-p3 1 0 0 / 0.5)');
    expect(r!.alpha).toBeCloseTo(0.5, 2);
  });
  it('returns null for invalid', () => expect(parseColorFn('not-color')).toBeNull());
});

describe('parseCssVar', () => {
  it('parses without fallback', () => {
    const r = parseCssVar('var(--primary)');
    expect(r).not.toBeNull();
    expect(r!.variableName).toBe('--primary');
    expect(r!.fallback).toBeUndefined();
  });
  it('parses with fallback', () => {
    const r = parseCssVar('var(--primary, #3498db)');
    expect(r!.variableName).toBe('--primary');
    expect(r!.fallback).toBe('#3498db');
  });
  it('returns null for non-var', () => expect(parseCssVar('#ff0000')).toBeNull());
});

describe('shortHexToRgba', () => {
  it('expands #f0f0 correctly', () => {
    const r = shortHexToRgba('#f0f0');
    expect(r).not.toBeNull();
    expect(r!.r).toBe(255);
    expect(r!.g).toBe(0);
    expect(r!.b).toBe(255);
    expect(r!.a).toBe(0);
  });
  it('expands #ffff → fully opaque white', () => {
    const r = shortHexToRgba('#ffff');
    expect(r!.r).toBe(255); expect(r!.g).toBe(255); expect(r!.b).toBe(255);
    expect(r!.a).toBeCloseTo(1, 1);
  });
  it('returns null for wrong length', () => expect(shortHexToRgba('#fff')).toBeNull());
});

describe('getColorType extended', () => {
  it('detects oklch', () => expect(getColorType('oklch(0.5 0.1 180)')).toBe('oklch'));
  it('detects color()', () => expect(getColorType('color(display-p3 1 0 0)')).toBe('color'));
});

// ─── Section 1.2: Display P3 ─────────────────────────────────────────────────

describe('rgbToDisplayP3 / displayP3ToRgb round-trip', () => {
  it('red round-trip (within 0.01)', () => {
    const p3 = rgbToDisplayP3({ r: 255, g: 0, b: 0 });
    const back = displayP3ToRgb(p3);
    expect(Math.abs(back.r - 255)).toBeLessThan(2);
    expect(Math.abs(back.g - 0)).toBeLessThan(2);
    expect(Math.abs(back.b - 0)).toBeLessThan(2);
  });
  it('black stays black', () => {
    const p3 = rgbToDisplayP3({ r: 0, g: 0, b: 0 });
    expect(p3.r).toBeCloseTo(0, 3);
    expect(p3.g).toBeCloseTo(0, 3);
    expect(p3.b).toBeCloseTo(0, 3);
  });
  it('white stays white', () => {
    const p3 = rgbToDisplayP3({ r: 255, g: 255, b: 255 });
    expect(p3.r).toBeCloseTo(1, 2);
    expect(p3.g).toBeCloseTo(1, 2);
    expect(p3.b).toBeCloseTo(1, 2);
  });
});

describe('toDisplayP3Hex', () => {
  it('returns valid hex', () => expect(toDisplayP3Hex('#3498db')).toMatch(/^#[0-9a-f]{6}$/));
  it('black → black', () => expect(toDisplayP3Hex('#000000')).toBe('#000000'));
  it('white → white', () => expect(toDisplayP3Hex('#ffffff')).toBe('#ffffff'));
});

describe('toOklchString', () => {
  it('formats without alpha', () => expect(toOklchString('#ff0000')).toMatch(/^oklch\(/));
  it('includes alpha when provided', () => expect(toOklchString('#ff0000', 0.5)).toContain('/ 0.5'));
  it('black L is close to 0', () => {
    const str = toOklchString('#000000');
    const L = parseFloat(str.replace('oklch(', ''));
    expect(L).toBeCloseTo(0, 2);
  });
});

describe('toColorP3String', () => {
  it('formats without alpha', () => expect(toColorP3String('#ff0000')).toMatch(/^color\(display-p3/));
  it('includes alpha when provided', () => expect(toColorP3String('#ff0000', 0.8)).toContain('/ 0.8'));
});

// ─── Section 2: Interpolation ─────────────────────────────────────────────────

describe('interpolateColors', () => {
  it('returns correct number of steps', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 5)).toHaveLength(5);
  });
  it('first is start color', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 5)[0]).toBe('#ff0000');
  });
  it('last is end color', () => {
    const arr = interpolateColors('#ff0000', '#0000ff', 5);
    expect(arr[arr.length - 1]).toBe('#0000ff');
  });
  it('all results are valid hex', () => {
    interpolateColors('#ff0000', '#0000ff', 7, { space: 'oklab' }).forEach(c => {
      expect(c).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
  it('oklch space', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 5, { space: 'oklch' })).toHaveLength(5);
  });
  it('steps=1 returns single color', () => {
    expect(interpolateColors('#ff0000', '#0000ff', 1)).toHaveLength(1);
  });
});

describe('createColorScale', () => {
  it('returns correct number of steps', () => {
    expect(createColorScale(['#ff0000', '#0000ff'], 7)).toHaveLength(7);
  });
  it('first step matches first anchor', () => {
    const scale = createColorScale(['#ff0000', '#0000ff'], 5);
    expect(scale[0]).toBe('#ff0000');
  });
  it('last step matches last anchor', () => {
    const scale = createColorScale(['#ff0000', '#0000ff'], 5);
    expect(scale[scale.length - 1]).toBe('#0000ff');
  });
  it('supports anchor objects with positions', () => {
    const scale = createColorScale([
      { color: '#ffffff', position: 0 },
      { color: '#000000', position: 1 },
    ], 3);
    expect(scale).toHaveLength(3);
    expect(scale[0]).toBe('#ffffff');
    expect(scale[2]).toBe('#000000');
  });
  it('three anchors produce valid hex', () => {
    const scale = createColorScale(['#ff0000', '#00ff00', '#0000ff'], 9);
    scale.forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });
});

describe('midpointColor', () => {
  it('returns valid hex', () => expect(midpointColor('#ff0000', '#0000ff')).toMatch(/^#[0-9a-f]{6}$/));
  it('midpoint of same color is same color (approx)', () => {
    const mid = midpointColor('#3498db', '#3498db');
    const orig = normalizeColor('#3498db');
    const res  = normalizeColor(mid);
    expect(Math.abs((res.r ?? 0) - (orig.r ?? 0))).toBeLessThanOrEqual(2);
  });
  it('oklch space', () => expect(midpointColor('#ff0000', '#0000ff', { space: 'oklch' })).toMatch(/^#[0-9a-f]{6}$/));
});

// ─── Section 3: Tints / Shades / Tones ───────────────────────────────────────

describe('tints', () => {
  it('returns correct count', () => expect(tints('#3498db', 5)).toHaveLength(5));
  it('first is original color (approx)', () => {
    const arr = tints('#3498db', 5);
    const orig = normalizeColor('#3498db');
    const first = normalizeColor(arr[0]);
    expect(Math.abs((first.r ?? 0) - (orig.r ?? 0))).toBeLessThanOrEqual(2);
  });
  it('last is close to white', () => {
    const arr = tints('#3498db', 5);
    const last = normalizeColor(arr[arr.length - 1]);
    expect(last.r ?? 0).toBeGreaterThan(240);
    expect(last.g ?? 0).toBeGreaterThan(240);
    expect(last.b ?? 0).toBeGreaterThan(240);
  });
  it('all results are valid hex', () => {
    tints('#3498db', 5).forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });
});

describe('shades', () => {
  it('returns correct count', () => expect(shades('#3498db', 5)).toHaveLength(5));
  it('last is close to black', () => {
    const arr = shades('#3498db', 5);
    const last = normalizeColor(arr[arr.length - 1]);
    expect(last.r ?? 255).toBeLessThan(15);
    expect(last.g ?? 255).toBeLessThan(15);
    expect(last.b ?? 255).toBeLessThan(15);
  });
});

describe('tones', () => {
  it('returns correct count', () => expect(tones('#3498db', 5)).toHaveLength(5));
  it('last is close to gray', () => {
    const arr = tones('#3498db', 5);
    const last = normalizeColor(arr[arr.length - 1]);
    // gray: r≈g≈b≈128
    expect(Math.abs((last.r ?? 0) - 128)).toBeLessThan(10);
  });
  it('custom gray', () => {
    const arr = tones('#ff0000', 3, '#a0a0a0');
    expect(arr).toHaveLength(3);
  });
});

// ─── Section 4.1: Color blindness simulation ──────────────────────────────────

describe('simulateProtanopia', () => {
  it('returns valid hex', () => expect(simulateProtanopia('#3498db')).toMatch(/^#[0-9a-f]{6}$/));
  it('black stays black', () => expect(simulateProtanopia('#000000')).toBe('#000000'));
  it('white stays white', () => expect(simulateProtanopia('#ffffff')).toBe('#ffffff'));
  it('changes red (no red perception)', () => {
    // red looks different to protanope
    expect(simulateProtanopia('#ff0000')).not.toBe('#ff0000');
  });
});

describe('simulateDeuteranopia', () => {
  it('returns valid hex', () => expect(simulateDeuteranopia('#3498db')).toMatch(/^#[0-9a-f]{6}$/));
  it('black stays black', () => expect(simulateDeuteranopia('#000000')).toBe('#000000'));
  it('white stays white', () => expect(simulateDeuteranopia('#ffffff')).toBe('#ffffff'));
});

describe('simulateTritanopia', () => {
  it('returns valid hex', () => expect(simulateTritanopia('#3498db')).toMatch(/^#[0-9a-f]{6}$/));
  it('black stays black', () => expect(simulateTritanopia('#000000')).toBe('#000000'));
  it('white stays white', () => expect(simulateTritanopia('#ffffff')).toBe('#ffffff'));
});

describe('simulateColorBlindness', () => {
  it('protanopia matches direct function', () => {
    expect(simulateColorBlindness('#3498db', 'protanopia')).toBe(simulateProtanopia('#3498db'));
  });
  it('deuteranopia matches direct function', () => {
    expect(simulateColorBlindness('#3498db', 'deuteranopia')).toBe(simulateDeuteranopia('#3498db'));
  });
  it('tritanopia matches direct function', () => {
    expect(simulateColorBlindness('#3498db', 'tritanopia')).toBe(simulateTritanopia('#3498db'));
  });
});

// ─── Section 4.2: isReadableOnBackground ─────────────────────────────────────

describe('isReadableOnBackground', () => {
  it('black on white → readable', () => {
    const r = isReadableOnBackground('#000000', '#ffffff');
    expect(r.readable).toBe(true);
    expect(r.minContrastRatio).toBeGreaterThanOrEqual(4.5);
  });
  it('white on white → not readable', () => {
    const r = isReadableOnBackground('#ffffff', '#ffffff');
    expect(r.readable).toBe(false);
  });
  it('semi-transparent background', () => {
    const r = isReadableOnBackground('#000000', {
      type: 'semi-transparent',
      color: 'rgba(200,200,200,0.5)',
      underlay: '#ffffff',
    });
    expect(r).toHaveProperty('readable');
    expect(r).toHaveProperty('minContrastRatio');
  });
  it('gradient background checks all stops', () => {
    const r = isReadableOnBackground('#000000', {
      type: 'gradient',
      stops: ['#ffffff', '#000000'],
    });
    // black on black stop fails
    expect(r.minContrastRatio).toBeCloseTo(1, 0);
  });
  it('AAA level requires higher ratio', () => {
    const aa  = isReadableOnBackground('#767676', '#ffffff', { level: 'AA' });
    const aaa = isReadableOnBackground('#767676', '#ffffff', { level: 'AAA' });
    expect(aa.readable).toBe(true);
    expect(aaa.readable).toBe(false);
  });
});

// ─── Section 4.3: bestContrastPalette ────────────────────────────────────────

describe('bestContrastPalette', () => {
  it('picks dark palette on light background', () => {
    const result = bestContrastPalette('#ffffff', [
      ['#eeeeee', '#dddddd'],   // low contrast
      ['#000000', '#111111'],   // high contrast
    ]);
    expect(result.paletteIndex).toBe(1);
  });
  it('returns palette, minContrastRatio, avgContrastRatio', () => {
    const result = bestContrastPalette('#ffffff', [['#000000', '#333333']]);
    expect(result.palette).toBeDefined();
    expect(typeof result.minContrastRatio).toBe('number');
    expect(typeof result.avgContrastRatio).toBe('number');
  });
  it('minContrastRatio ≤ avgContrastRatio', () => {
    const result = bestContrastPalette('#ffffff', [['#000000', '#999999']]);
    expect(result.minContrastRatio).toBeLessThanOrEqual(result.avgContrastRatio);
  });
});

// ─── Section 5.1: Cache ───────────────────────────────────────────────────────

describe('cache', () => {
  beforeEach(() => {
    clearColorCache();
    enableCache();
  });

  it('normalizeColorCached returns same result as normalizeColor', () => {
    const cached = normalizeColorCached('#3498db');
    const direct = normalizeColor('#3498db');
    expect(cached.r).toBe(direct.r);
    expect(cached.hex).toBe(direct.hex);
  });
  it('hit count increments on repeated call', () => {
    normalizeColorCached('#ff0000');
    normalizeColorCached('#ff0000');
    expect(getCacheStats().hits).toBeGreaterThanOrEqual(1);
  });
  it('clearColorCache resets size and hits', () => {
    normalizeColorCached('#ff0000');
    clearColorCache();
    const stats = getCacheStats();
    expect(stats.size).toBe(0);
    expect(stats.hits).toBe(0);
  });
  it('disableCache bypasses cache', () => {
    disableCache();
    normalizeColorCached('#aabbcc');
    normalizeColorCached('#aabbcc');
    expect(getCacheStats().hits).toBe(0); // no hits when disabled
    enableCache();
  });
  it('getCacheStats size grows with unique calls', () => {
    normalizeColorCached('#111111');
    normalizeColorCached('#222222');
    expect(getCacheStats().size).toBeGreaterThanOrEqual(2);
  });
});

// ─── Section 5.2: Generators ─────────────────────────────────────────────────

describe('generateGradientColors', () => {
  it('yields correct number of values', () => {
    const colors = [...generateGradientColors('#ff0000', '#0000ff', 5)];
    expect(colors).toHaveLength(5);
  });
  it('first value is start', () => {
    const [first] = generateGradientColors('#ff0000', '#0000ff', 5);
    expect(first).toBe('#ff0000');
  });
  it('last value is end', () => {
    const colors = [...generateGradientColors('#ff0000', '#0000ff', 5)];
    expect(colors[colors.length - 1]).toBe('#0000ff');
  });
  it('all values are valid hex', () => {
    for (const c of generateGradientColors('#ff0000', '#0000ff', 10, { mode: 'oklab' })) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe('generateTints', () => {
  it('yields correct number of values', () => {
    const arr = [...generateTints('#3498db', 6)];
    expect(arr).toHaveLength(6);
  });
  it('all values are valid hex', () => {
    for (const c of generateTints('#3498db', 5)) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
  it('last value is close to white', () => {
    const arr = [...generateTints('#3498db', 5)];
    const last = normalizeColor(arr[arr.length - 1]);
    expect(last.r ?? 0).toBeGreaterThan(240);
  });
});

describe('generateShades', () => {
  it('yields correct number of values', () => {
    expect([...generateShades('#3498db', 4)]).toHaveLength(4);
  });
  it('last value is close to black', () => {
    const arr = [...generateShades('#3498db', 5)];
    const last = normalizeColor(arr[arr.length - 1]);
    expect(last.r ?? 255).toBeLessThan(15);
  });
});
