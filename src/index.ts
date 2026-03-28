export type ColorType = 'hex' | 'css-var' | 'rgb' | 'hsl' | 'named' | 'unknown';

export function isCssVariable(value: string): boolean {
  return value.trim().startsWith('var(--');
}

export function isHexColor(value: string): boolean {
  const trimmed = value.trim();
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed);
}

export function isRgbColor(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(');
}

export function isHslColor(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return trimmed.startsWith('hsl(') || trimmed.startsWith('hsla(');
}

export function getColorType(value: string): ColorType {
  const trimmed = value.trim().toLowerCase();
  if (isCssVariable(trimmed)) return 'css-var';
  if (isHexColor(trimmed)) return 'hex';
  if (isRgbColor(trimmed)) return 'rgb';
  if (isHslColor(trimmed)) return 'hsl';
  const namedColors = [
    'transparent','currentcolor','inherit','initial','unset','black','white','red','green','blue','yellow','purple','orange','gray','grey','pink','brown','cyan','magenta','violet','aqua','beige','coral','gold','indigo','ivory','khaki','lavender','lime','maroon','navy','olive','orchid','plum','salmon','silver','tan','teal','tomato','wheat',
  ];
  if (namedColors.includes(trimmed)) return 'named';
  return 'unknown';
}

export function extractCssVariableName(value: string): string {
  const match = value.match(/var\((--[^)]+)\)/);
  return match?.[1] || value;
}

export function normalizeHex(hex: string): string {
  let cleanHex = hex.trim();
  if (!cleanHex.startsWith('#')) cleanHex = `#${cleanHex}`;
  if (cleanHex.length === 4) {
    cleanHex = `#${cleanHex.slice(1).split('').map(c => c + c).join('')}`;
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return '#f5e477';
  }
  return cleanHex.toLowerCase();
}

export function hexToRgb(hex: string): [number, number, number] {
  const normalizedHex = normalizeHex(hex);
  const r = parseInt(normalizedHex.slice(1, 3), 16);
  const g = parseInt(normalizedHex.slice(3, 5), 16);
  const b = parseInt(normalizedHex.slice(5, 7), 16);
  return [r, g, b];
}

export function hexToRgba(hex: string, opacity: number = 1): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case red: h = (green - blue) / d + (green < blue ? 6 : 0); break;
      case green: h = (blue - red) / d + 2; break;
      case blue: h = (red - green) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function adjustHexBrightness(hex: string, offsetPercent: number): string {
  const normalizedHex = normalizeHex(hex);
  const p = Math.max(-100, Math.min(100, offsetPercent)) / 100;
  const r = parseInt(normalizedHex.slice(1, 3), 16);
  const g = parseInt(normalizedHex.slice(3, 5), 16);
  const b = parseInt(normalizedHex.slice(5, 7), 16);
  const adjustChannel = (channel: number): number => {
    if (p > 0) return Math.min(255, Math.floor(channel + (255 - channel) * p));
    else if (p < 0) return Math.max(0, Math.floor(channel * (1 + p)));
    return channel;
  };
  const newR = adjustChannel(r);
  const newG = adjustChannel(g);
  const newB = adjustChannel(b);
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function rotateHue(hex: string, degrees: number): string {
  const [h, s, l] = hexToHsl(hex);
  const newH = ((h + degrees) % 360 + 360) % 360;
  return hslToHex(newH, s, l);
}

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function toHex2(n: number) { return Math.round(n).toString(16).padStart(2, '0'); }

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toLowerCase();
}

export function rgbaToHex({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string {
  const aa = Math.round(clamp01(a) * 255);
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2(aa)}`.toLowerCase();
}

export function rgbToRgbaString({ r, g, b }: { r: number; g: number; b: number }, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`;
}

export function rgbaStringToRgba(str: string): { r: number; g: number; b: number; a: number } | null {
  const s = str.trim().toLowerCase();
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/,\s*/).map(p => p.trim());
  if (parts.length < 3) return null;
  const parseChannel = (v: string) => v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : Math.round(parseFloat(v));
  const r = parseChannel(parts[0]);
  const g = parseChannel(parts[1]);
  const b = parseChannel(parts[2]);
  const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
  return { r, g, b, a };
}

export function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): [number, number, number] {
  const rd = r / 255, gd = g / 255, bd = b / 255;
  const max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rd: h = (gd - bd) / d + (gd < bd ? 6 : 0); break;
      case gd: h = (bd - rd) / d + 2; break;
      case bd: h = (rd - gd) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rd = 0, gd = 0, bd = 0;
  if (h >= 0 && h < 60) { rd = c; gd = x; bd = 0; }
  else if (h >= 60 && h < 120) { rd = x; gd = c; bd = 0; }
  else if (h >= 120 && h < 180) { rd = 0; gd = c; bd = x; }
  else if (h >= 180 && h < 240) { rd = 0; gd = x; bd = c; }
  else if (h >= 240 && h < 300) { rd = x; gd = 0; bd = c; }
  else { rd = c; gd = 0; bd = x; }
  return { r: Math.round((rd + m) * 255), g: Math.round((gd + m) * 255), b: Math.round((bd + m) * 255) };
}

export function rgbToHsv({ r, g, b }: { r: number; g: number; b: number }): [number, number, number] {
  const rd = r / 255, gd = g / 255, bd = b / 255;
  const max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rd: h = (gd - bd) / d + (gd < bd ? 6 : 0); break;
      case gd: h = (bd - rd) / d + 2; break;
      case bd: h = (rd - gd) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let rd = 0, gd = 0, bd = 0;
  switch (i) {
    case 0: rd = v; gd = t; bd = p; break;
    case 1: rd = q; gd = v; bd = p; break;
    case 2: rd = p; gd = v; bd = t; break;
    case 3: rd = p; gd = q; bd = v; break;
    case 4: rd = t; gd = p; bd = v; break;
    default: rd = v; gd = p; bd = q; break;
  }
  return { r: Math.round(rd * 255), g: Math.round(gd * 255), b: Math.round(bd * 255) };
}

export function hexToHsv(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsv({ r, g, b });
}

export function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex({ r, g, b });
}

export function hex8ToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
  let h = hex.trim();
  if (!h.startsWith('#')) h = `#${h}`;
  if (h.length === 5) { // #rgba shorthand
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}${h[4]}${h[4]}`;
  }
  if (h.length !== 9) return null;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const a = parseInt(h.slice(7, 9), 16) / 255;
  return { r, g, b, a };
}

export function rgbaToHex8({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string {
  return rgbaToHex({ r, g, b, a });
}

export function normalizeColor(input: string | { r: number; g: number; b: number } | { h: number; s: number; l: number }) {
  if (typeof input !== 'string') {
    if ('r' in input && 'g' in input && 'b' in input) {
      const { r, g, b } = input as any;
      const hex = rgbToHex({ r, g, b });
      const [h, s, l] = rgbToHsl({ r, g, b });
      const [hh, ss, vv] = rgbToHsv({ r, g, b });
      return { type: 'rgb', hex, r, g, b, a: 1, h, s, l, v: vv };
    }

    if ('h' in input && 's' in input && 'l' in input) {
      const { h, s, l } = input as any;
      const { r, g, b } = hslToRgb(h, s, l);
      const hex = rgbToHex({ r, g, b });
      const [hh, ss, vv] = rgbToHsv({ r, g, b });
      return { type: 'hsl', hex, r, g, b, a: 1, h, s, l, v: vv };
    }
    
    return { type: 'unknown' };
  }
  const str = input.trim();

  if (isCssVariable(str)) return { type: 'css-var', raw: str };

  if (isHexColor(str)) {
    const hex = normalizeHex(str);
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = hexToHsl(hex);
    const [hh, ss, vv] = rgbToHsv({ r, g, b });
    return { type: 'hex', hex, r, g, b, a: 1, h, s, l, v: vv };
  }

  const hex8 = str.match(/^#([0-9a-f]{8}|[0-9a-f]{4})$/i);
  if (hex8) {
    const rgba = hex8ToRgba(str);

    if (rgba) {
      const { r, g, b, a } = rgba;
      const hex = rgbToHex({ r, g, b });
      const [h, s, l] = rgbToHsl({ r, g, b });
      const [hh, ss, vv] = rgbToHsv({ r, g, b });
      return { type: 'hex', hex, r, g, b, a, h, s, l, v: vv };
    }
  }

  if (isRgbColor(str)) {
    const rgba = rgbaStringToRgba(str);
    if (rgba) {
      const { r, g, b, a } = rgba;
      const hex = rgbToHex({ r, g, b });
      const [h, s, l] = rgbToHsl({ r, g, b });
      const [hh, ss, vv] = rgbToHsv({ r, g, b });
      return { type: 'rgb', hex, r, g, b, a, h, s, l, v: vv };
    }
  }

  if (isHslColor(str)) {
    const m = str.match(/hsla?\(([^)]+)\)/i);
    if (m) {
      const parts = m[1].split(/,\s*/);
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const l = parseFloat(parts[2]);
      const a = parts[3] ? parseFloat(parts[3]) : 1;
      const { r, g, b } = hslToRgb(h, s, l);
      const hex = rgbToHex({ r, g, b });
      const [hh, ss, vv] = rgbToHsv({ r, g, b });
      return { type: 'hsl', hex, r, g, b, a, h, s, l, v: vv };
    }
  }

  if (str === 'transparent') return { type: 'named', hex: '#000000', r: 0, g: 0, b: 0, a: 0 };

  return { type: 'unknown' };
}

export function mixColors(c1: string, c2: string, t: number, opts?: { mode?: 'rgb' | 'hsl'; format?: 'hex' | 'rgb' | 'rgba' | 'hsl' }): string {
  const o1 = normalizeColor(c1);
  const o2 = normalizeColor(c2);
  t = Math.max(0, Math.min(1, t));
  const mode = opts?.mode || 'rgb';
  const out = opts?.format || 'hex';
  let r = 0, g = 0, b = 0, a = 1;
  if (mode === 'hsl') {
    const h1 = o1.h ?? rgbToHsl({ r: o1.r ?? 0, g: o1.g ?? 0, b: o1.b ?? 0 })[0];
    const s1 = o1.s ?? 0; const l1 = o1.l ?? 0;
    const h2 = o2.h ?? rgbToHsl({ r: o2.r ?? 0, g: o2.g ?? 0, b: o2.b ?? 0 })[0];
    const s2 = o2.s ?? 0; const l2 = o2.l ?? 0;
    const ih = h1 + ( ((h2 - h1 + 540) % 360) - 180 ) * t;
    const is = s1 + (s2 - s1) * t;
    const il = l1 + (l2 - l1) * t;
    const rgb = hslToRgb(ih, is, il);
    r = rgb.r; g = rgb.g; b = rgb.b;
    a = (o1.a ?? 1) + ((o2.a ?? 1) - (o1.a ?? 1)) * t;
  } else {
    r = ( (o1.r ?? 0) * (1 - t) ) + ( (o2.r ?? 0) * t );
    g = ( (o1.g ?? 0) * (1 - t) ) + ( (o2.g ?? 0) * t );
    b = ( (o1.b ?? 0) * (1 - t) ) + ( (o2.b ?? 0) * t );
    a = (o1.a ?? 1) * (1 - t) + (o2.a ?? 1) * t;
  }
  if (out === 'hex') return rgbToHex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
  if (out === 'rgba') return rgbToRgbaString({ r: Math.round(r), g: Math.round(g), b: Math.round(b) }, a);
  if (out === 'rgb') return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  if (out === 'hsl') {
    const [hh, ss, ll] = rgbToHsl({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
    return `hsl(${hh}, ${ss}%, ${ll}%)`;
  }
  return rgbToHex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
}

export function relativeLuminance(color: string): number {
  const n = normalizeColor(color);
  const r = (n.r ?? 0) / 255;
  const g = (n.g ?? 0) / 255;
  const b = (n.b ?? 0) / 255;
  const srgbToLin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a: string, b: string): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return +( (light + 0.05) / (dark + 0.05) ).toFixed(2);
}

export function isDark(color: string, threshold: number = 0.5): boolean {
  return relativeLuminance(color) < threshold;
}

export function isLight(color: string, threshold: number = 0.5): boolean {
  return !isDark(color, threshold);
}

export function rgbToCmyk({ r, g, b }: { r: number; g: number; b: number }) {
  const rd = r / 255, gd = g / 255, bd = b / 255;
  const k = 1 - Math.max(rd, gd, bd);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };
  const c = (1 - rd - k) / (1 - k);
  const m = (1 - gd - k) / (1 - k);
  const y = (1 - bd - k) / (1 - k);
  return { c, m, y, k };
}

export function cmykToRgb({ c, m, y, k }: { c: number; m: number; y: number; k: number }) {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

function srgbToLinear(v: number) {
  v = v / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v: number) {
  const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, t)) * 255);
}

function rgbToXyz({ r, g, b }: { r: number; g: number; b: number }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
  const Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;
  return { X: X * 100, Y: Y * 100, Z: Z * 100 };
}

function xyzToRgb({ X, Y, Z }: { X: number; Y: number; Z: number }) {
  X = X / 100; Y = Y / 100; Z = Z / 100;
  let R = X * 3.2404542 + Y * -1.5371385 + Z * -0.4985314;
  let G = X * -0.9692660 + Y * 1.8760108 + Z * 0.0415560;
  let B = X * 0.0556434 + Y * -0.2040259 + Z * 1.0572252;
  R = linearToSrgb(R);
  G = linearToSrgb(G);
  B = linearToSrgb(B);
  return { r: R, g: G, b: B };
}

export function rgbToLab({ r, g, b }: { r: number; g: number; b: number }) {
  const { X, Y, Z } = rgbToXyz({ r, g, b });
  const refX = 95.047, refY = 100.0, refZ = 108.883;
  const x = X / refX, y = Y / refY, z = Z / refZ;
  const fx = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
  const fy = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
  const fz = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;
  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const b2 = 200 * (fy - fz);
  return { L, a, b: b2 };
}

export function labToRgb({ L, a, b }: { L: number; a: number; b: number }) {
  const refX = 95.047, refY = 100.0, refZ = 108.883;
  let fy = (L + 16) / 116;
  let fx = a / 500 + fy;
  let fz = fy - b / 200;
  const fx3 = Math.pow(fx, 3);
  const fz3 = Math.pow(fz, 3);
  const fy3 = Math.pow(fy, 3);
  const xr = fx3 > 0.008856 ? fx3 : (fx - 16 / 116) / 7.787;
  const yr = L > (903.3 * 0.008856) ? fy3 : L / 903.3;
  const zr = fz3 > 0.008856 ? fz3 : (fz - 16 / 116) / 7.787;
  const X = xr * refX, Y = yr * refY, Z = zr * refZ;
  return xyzToRgb({ X, Y, Z });
}

export function rgbToLch({ r, g, b }: { r: number; g: number; b: number }) {
  const { L, a, b: bb } = rgbToLab({ r, g, b });
  const C = Math.sqrt(a * a + bb * bb);
  let H = Math.atan2(bb, a) * (180 / Math.PI);
  if (H < 0) H += 360;
  return { L, C, H };
}

export function lchToRgb({ L, C, H }: { L: number; C: number; H: number }) {
  const a = Math.cos(H * Math.PI / 180) * C;
  const b = Math.sin(H * Math.PI / 180) * C;
  return labToRgb({ L, a, b });
}
