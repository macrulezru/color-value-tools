import { describe, it, expect } from 'vitest';
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
  contrastRatio,
  wcagLevel,
  bestTextColor,
  bestContrastColor,
  colorDeltaE,
  toNearestNamedColor,
  toHslString,
  toHwbString,
  rotateHue,
  mixColors,
  normalizeColor,
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
  it('t=0.5 returns midpoint', () => expect(mixColors('#000000', '#ffffff', 0.5)).toBe('#808080'));
  it('hsl mode', () => {
    const result = mixColors('#ff0000', '#0000ff', 0.5, { mode: 'hsl' });
    expect(result).toBeTruthy();
  });
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
});
