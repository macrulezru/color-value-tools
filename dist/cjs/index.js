"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCssVariable = isCssVariable;
exports.isHexColor = isHexColor;
exports.isRgbColor = isRgbColor;
exports.isHslColor = isHslColor;
exports.getColorType = getColorType;
exports.extractCssVariableName = extractCssVariableName;
exports.normalizeHex = normalizeHex;
exports.hexToRgb = hexToRgb;
exports.hexToRgba = hexToRgba;
exports.hexToHsl = hexToHsl;
exports.hslToHex = hslToHex;
exports.adjustHexBrightness = adjustHexBrightness;
exports.rotateHue = rotateHue;
exports.lighten = lighten;
exports.darken = darken;
exports.saturate = saturate;
exports.desaturate = desaturate;
exports.setAlpha = setAlpha;
exports.getAlpha = getAlpha;
exports.invertColor = invertColor;
exports.grayscale = grayscale;
exports.rgbToHex = rgbToHex;
exports.rgbaToHex = rgbaToHex;
exports.rgbToRgbaString = rgbToRgbaString;
exports.rgbaStringToRgba = rgbaStringToRgba;
exports.rgbToHsl = rgbToHsl;
exports.hslToRgb = hslToRgb;
exports.rgbToHsv = rgbToHsv;
exports.hsvToRgb = hsvToRgb;
exports.hexToHsv = hexToHsv;
exports.hsvToHex = hsvToHex;
exports.hex8ToRgba = hex8ToRgba;
exports.rgbaToHex8 = rgbaToHex8;
exports.normalizeColor = normalizeColor;
exports.complement = complement;
exports.triadic = triadic;
exports.analogous = analogous;
exports.splitComplementary = splitComplementary;
exports.tetradic = tetradic;
exports.colorShades = colorShades;
exports.monochromatic = monochromatic;
exports.mixColors = mixColors;
exports.relativeLuminance = relativeLuminance;
exports.contrastRatio = contrastRatio;
exports.isDark = isDark;
exports.isLight = isLight;
exports.rgbToCmyk = rgbToCmyk;
exports.cmykToRgb = cmykToRgb;
exports.rgbToLab = rgbToLab;
exports.labToRgb = labToRgb;
exports.rgbToLch = rgbToLch;
exports.lchToRgb = lchToRgb;
exports.wcagLevel = wcagLevel;
exports.bestTextColor = bestTextColor;
exports.bestContrastColor = bestContrastColor;
exports.rgbToHwb = rgbToHwb;
exports.hwbToRgb = hwbToRgb;
exports.toHwbString = toHwbString;
exports.parseHwbString = parseHwbString;
exports.rgbToOklab = rgbToOklab;
exports.oklabToRgb = oklabToRgb;
exports.rgbToOklch = rgbToOklch;
exports.oklchToRgb = oklchToRgb;
exports.toHslString = toHslString;
exports.colorDeltaE = colorDeltaE;
exports.randomColor = randomColor;
exports.toNearestNamedColor = toNearestNamedColor;
const NAMED_COLORS = {
    aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff', aquamarine: '#7fffd4', azure: '#f0ffff',
    beige: '#f5f5dc', bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd', blue: '#0000ff',
    blueviolet: '#8a2be2', brown: '#a52a2a', burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00',
    chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed', cornsilk: '#fff8dc', crimson: '#dc143c',
    cyan: '#00ffff', darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b', darkgray: '#a9a9a9',
    darkgreen: '#006400', darkgrey: '#a9a9a9', darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f',
    darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000', darksalmon: '#e9967a', darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b', darkslategray: '#2f4f4f', darkslategrey: '#2f4f4f', darkturquoise: '#00ced1',
    darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff', dimgray: '#696969', dimgrey: '#696969',
    dodgerblue: '#1e90ff', firebrick: '#b22222', floralwhite: '#fffaf0', forestgreen: '#228b22', fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff', gold: '#ffd700', goldenrod: '#daa520', gray: '#808080',
    green: '#008000', greenyellow: '#adff2f', grey: '#808080', honeydew: '#f0fff0', hotpink: '#ff69b4',
    indianred: '#cd5c5c', indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c', lavender: '#e6e6fa',
    lavenderblush: '#fff0f5', lawngreen: '#7cfc00', lemonchiffon: '#fffacd', lightblue: '#add8e6', lightcoral: '#f08080',
    lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2', lightgray: '#d3d3d3', lightgreen: '#90ee90',
    lightgrey: '#d3d3d3', lightpink: '#ffb6c1', lightsalmon: '#ffa07a', lightseagreen: '#20b2aa', lightskyblue: '#87cefa',
    lightslategray: '#778899', lightslategrey: '#778899', lightsteelblue: '#b0c4de', lightyellow: '#ffffe0',
    lime: '#00ff00', limegreen: '#32cd32', linen: '#faf0e6', magenta: '#ff00ff', maroon: '#800000',
    mediumaquamarine: '#66cdaa', mediumblue: '#0000cd', mediumorchid: '#ba55d3', mediumpurple: '#9370db',
    mediumseagreen: '#3cb371', mediumslateblue: '#7b68ee', mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585', midnightblue: '#191970', mintcream: '#f5fffa', mistyrose: '#ffe4e1', moccasin: '#ffe4b5',
    navajowhite: '#ffdead', navy: '#000080', oldlace: '#fdf5e6', olive: '#808000', olivedrab: '#6b8e23',
    orange: '#ffa500', orangered: '#ff4500', orchid: '#da70d6', palegoldenrod: '#eee8aa', palegreen: '#98fb98',
    paleturquoise: '#afeeee', palevioletred: '#db7093', papayawhip: '#ffefd5', peachpuff: '#ffdab9', peru: '#cd853f',
    pink: '#ffc0cb', plum: '#dda0dd', powderblue: '#b0e0e6', purple: '#800080', rebeccapurple: '#663399',
    red: '#ff0000', rosybrown: '#bc8f8f', royalblue: '#4169e1', saddlebrown: '#8b4513', salmon: '#fa8072',
    sandybrown: '#f4a460', seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d', silver: '#c0c0c0',
    skyblue: '#87ceeb', slateblue: '#6a5acd', slategray: '#708090', slategrey: '#708090', snow: '#fffafa',
    springgreen: '#00ff7f', steelblue: '#4682b4', tan: '#d2b48c', teal: '#008080', thistle: '#d8bfd8',
    tomato: '#ff6347', turquoise: '#40e0d0', violet: '#ee82ee', wheat: '#f5deb3', white: '#ffffff',
    whitesmoke: '#f5f5f5', yellow: '#ffff00', yellowgreen: '#9acd32',
    // Special CSS keywords
    transparent: 'transparent', currentcolor: 'currentcolor', inherit: 'inherit', initial: 'initial', unset: 'unset',
};
function isCssVariable(value) {
    return value.trim().startsWith('var(--');
}
function isHexColor(value) {
    const trimmed = value.trim();
    return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed);
}
function isRgbColor(value) {
    const trimmed = value.trim().toLowerCase();
    return trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(');
}
function isHslColor(value) {
    const trimmed = value.trim().toLowerCase();
    return trimmed.startsWith('hsl(') || trimmed.startsWith('hsla(');
}
function getColorType(value) {
    const trimmed = value.trim().toLowerCase();
    if (isCssVariable(trimmed))
        return 'css-var';
    if (isHexColor(trimmed))
        return 'hex';
    if (isRgbColor(trimmed))
        return 'rgb';
    if (isHslColor(trimmed))
        return 'hsl';
    if (trimmed in NAMED_COLORS)
        return 'named';
    return 'unknown';
}
function extractCssVariableName(value) {
    const match = value.match(/var\((--[^)]+)\)/);
    return (match === null || match === void 0 ? void 0 : match[1]) || value;
}
function normalizeHex(hex) {
    let cleanHex = hex.trim();
    if (!cleanHex.startsWith('#'))
        cleanHex = `#${cleanHex}`;
    if (cleanHex.length === 4) {
        cleanHex = `#${cleanHex.slice(1).split('').map(c => c + c).join('')}`;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        return '#f5e477';
    }
    return cleanHex.toLowerCase();
}
function hexToRgb(hex) {
    const normalizedHex = normalizeHex(hex);
    const r = parseInt(normalizedHex.slice(1, 3), 16);
    const g = parseInt(normalizedHex.slice(3, 5), 16);
    const b = parseInt(normalizedHex.slice(5, 7), 16);
    return [r, g, b];
}
function hexToRgba(hex, opacity = 1) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
function hexToHsl(hex) {
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
            case red:
                h = (green - blue) / d + (green < blue ? 6 : 0);
                break;
            case green:
                h = (blue - red) / d + 2;
                break;
            case blue:
                h = (red - green) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
function adjustHexBrightness(hex, offsetPercent) {
    const normalizedHex = normalizeHex(hex);
    const p = Math.max(-100, Math.min(100, offsetPercent)) / 100;
    const r = parseInt(normalizedHex.slice(1, 3), 16);
    const g = parseInt(normalizedHex.slice(3, 5), 16);
    const b = parseInt(normalizedHex.slice(5, 7), 16);
    const adjustChannel = (channel) => {
        if (p > 0)
            return Math.min(255, Math.floor(channel + (255 - channel) * p));
        else if (p < 0)
            return Math.max(0, Math.floor(channel * (1 + p)));
        return channel;
    };
    const newR = adjustChannel(r);
    const newG = adjustChannel(g);
    const newB = adjustChannel(b);
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
function rotateHue(hex, degrees) {
    const [h, s, l] = hexToHsl(hex);
    const newH = ((h + degrees) % 360 + 360) % 360;
    return hslToHex(newH, s, l);
}
function lighten(color, amount) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = (_b = n.s) !== null && _b !== void 0 ? _b : 0;
    const l = Math.min(100, ((_c = n.l) !== null && _c !== void 0 ? _c : 0) + amount);
    return hslToHex(h, s, l);
}
function darken(color, amount) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = (_b = n.s) !== null && _b !== void 0 ? _b : 0;
    const l = Math.max(0, ((_c = n.l) !== null && _c !== void 0 ? _c : 0) - amount);
    return hslToHex(h, s, l);
}
function saturate(color, amount) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = Math.min(100, ((_b = n.s) !== null && _b !== void 0 ? _b : 0) + amount);
    const l = (_c = n.l) !== null && _c !== void 0 ? _c : 0;
    return hslToHex(h, s, l);
}
function desaturate(color, amount) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = Math.max(0, ((_b = n.s) !== null && _b !== void 0 ? _b : 0) - amount);
    const l = (_c = n.l) !== null && _c !== void 0 ? _c : 0;
    return hslToHex(h, s, l);
}
function setAlpha(color, alpha) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const r = (_a = n.r) !== null && _a !== void 0 ? _a : 0;
    const g = (_b = n.g) !== null && _b !== void 0 ? _b : 0;
    const b = (_c = n.b) !== null && _c !== void 0 ? _c : 0;
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`;
}
function getAlpha(color) {
    var _a;
    const n = normalizeColor(color);
    return (_a = n.a) !== null && _a !== void 0 ? _a : 1;
}
function invertColor(color) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const r = 255 - ((_a = n.r) !== null && _a !== void 0 ? _a : 0);
    const g = 255 - ((_b = n.g) !== null && _b !== void 0 ? _b : 0);
    const b = 255 - ((_c = n.b) !== null && _c !== void 0 ? _c : 0);
    return rgbToHex({ r, g, b });
}
function grayscale(color) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const r = (_a = n.r) !== null && _a !== void 0 ? _a : 0;
    const g = (_b = n.g) !== null && _b !== void 0 ? _b : 0;
    const b = (_c = n.b) !== null && _c !== void 0 ? _c : 0;
    // Perceptual luminance weights (ITU-R BT.709)
    const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    return rgbToHex({ r: gray, g: gray, b: gray });
}
function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function toHex2(n) { return Math.round(n).toString(16).padStart(2, '0'); }
function rgbToHex({ r, g, b }) {
    return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toLowerCase();
}
function rgbaToHex({ r, g, b, a }) {
    const aa = Math.round(clamp01(a) * 255);
    return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2(aa)}`.toLowerCase();
}
function rgbToRgbaString({ r, g, b }, a) {
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`;
}
function rgbaStringToRgba(str) {
    const s = str.trim().toLowerCase();
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m)
        return null;
    const parts = m[1].split(/,\s*/).map(p => p.trim());
    if (parts.length < 3)
        return null;
    const parseChannel = (v) => v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : Math.round(parseFloat(v));
    const r = parseChannel(parts[0]);
    const g = parseChannel(parts[1]);
    const b = parseChannel(parts[2]);
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return { r, g, b, a };
}
function rgbToHsl({ r, g, b }) {
    const rd = r / 255, gd = g / 255, bd = b / 255;
    const max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rd:
                h = (gd - bd) / d + (gd < bd ? 6 : 0);
                break;
            case gd:
                h = (bd - rd) / d + 2;
                break;
            case bd:
                h = (rd - gd) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rd = 0, gd = 0, bd = 0;
    if (h >= 0 && h < 60) {
        rd = c;
        gd = x;
        bd = 0;
    }
    else if (h >= 60 && h < 120) {
        rd = x;
        gd = c;
        bd = 0;
    }
    else if (h >= 120 && h < 180) {
        rd = 0;
        gd = c;
        bd = x;
    }
    else if (h >= 180 && h < 240) {
        rd = 0;
        gd = x;
        bd = c;
    }
    else if (h >= 240 && h < 300) {
        rd = x;
        gd = 0;
        bd = c;
    }
    else {
        rd = c;
        gd = 0;
        bd = x;
    }
    return { r: Math.round((rd + m) * 255), g: Math.round((gd + m) * 255), b: Math.round((bd + m) * 255) };
}
function rgbToHsv({ r, g, b }) {
    const rd = r / 255, gd = g / 255, bd = b / 255;
    const max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h = 0;
    if (d !== 0) {
        switch (max) {
            case rd:
                h = (gd - bd) / d + (gd < bd ? 6 : 0);
                break;
            case gd:
                h = (bd - rd) / d + 2;
                break;
            case bd:
                h = (rd - gd) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}
function hsvToRgb(h, s, v) {
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
        case 0:
            rd = v;
            gd = t;
            bd = p;
            break;
        case 1:
            rd = q;
            gd = v;
            bd = p;
            break;
        case 2:
            rd = p;
            gd = v;
            bd = t;
            break;
        case 3:
            rd = p;
            gd = q;
            bd = v;
            break;
        case 4:
            rd = t;
            gd = p;
            bd = v;
            break;
        default:
            rd = v;
            gd = p;
            bd = q;
            break;
    }
    return { r: Math.round(rd * 255), g: Math.round(gd * 255), b: Math.round(bd * 255) };
}
function hexToHsv(hex) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHsv({ r, g, b });
}
function hsvToHex(h, s, v) {
    const { r, g, b } = hsvToRgb(h, s, v);
    return rgbToHex({ r, g, b });
}
function hex8ToRgba(hex) {
    let h = hex.trim();
    if (!h.startsWith('#'))
        h = `#${h}`;
    if (h.length === 5) { // #rgba shorthand
        h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}${h[4]}${h[4]}`;
    }
    if (h.length !== 9)
        return null;
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    const a = parseInt(h.slice(7, 9), 16) / 255;
    return { r, g, b, a };
}
function rgbaToHex8({ r, g, b, a }) {
    return rgbaToHex({ r, g, b, a });
}
function normalizeColor(input) {
    if (typeof input !== 'string') {
        if ('r' in input && 'g' in input && 'b' in input) {
            const { r, g, b } = input;
            const hex = rgbToHex({ r, g, b });
            const [h, s, l] = rgbToHsl({ r, g, b });
            const [hh, ss, vv] = rgbToHsv({ r, g, b });
            return { type: 'rgb', hex, r, g, b, a: 1, h, s, l, v: vv };
        }
        if ('h' in input && 's' in input && 'l' in input) {
            const { h, s, l } = input;
            const { r, g, b } = hslToRgb(h, s, l);
            const hex = rgbToHex({ r, g, b });
            const [hh, ss, vv] = rgbToHsv({ r, g, b });
            return { type: 'hsl', hex, r, g, b, a: 1, h, s, l, v: vv };
        }
        return { type: 'unknown' };
    }
    const str = input.trim();
    if (isCssVariable(str))
        return { type: 'css-var', raw: str };
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
    if (str === 'transparent')
        return { type: 'named', hex: '#000000', r: 0, g: 0, b: 0, a: 0 };
    return { type: 'unknown' };
}
function complement(color) {
    var _a;
    return rotateHue((_a = normalizeColor(color).hex) !== null && _a !== void 0 ? _a : '#000000', 180);
}
function triadic(color) {
    var _a;
    const hex = (_a = normalizeColor(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [hex, rotateHue(hex, 120), rotateHue(hex, 240)];
}
function analogous(color, angle = 30) {
    var _a;
    const hex = (_a = normalizeColor(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [rotateHue(hex, -angle), hex, rotateHue(hex, angle)];
}
function splitComplementary(color) {
    var _a;
    const hex = (_a = normalizeColor(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [hex, rotateHue(hex, 150), rotateHue(hex, 210)];
}
function tetradic(color) {
    var _a;
    const hex = (_a = normalizeColor(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [hex, rotateHue(hex, 90), rotateHue(hex, 180), rotateHue(hex, 270)];
}
function colorShades(color, steps = 9) {
    var _a, _b;
    const n = normalizeColor(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = (_b = n.s) !== null && _b !== void 0 ? _b : 0;
    const result = [];
    for (let i = 0; i < steps; i++) {
        const l = Math.round(100 - (i / (steps - 1)) * 100);
        result.push(hslToHex(h, s, l));
    }
    return result;
}
function monochromatic(color, steps = 5) {
    var _a, _b;
    const n = normalizeColor(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const l = (_b = n.l) !== null && _b !== void 0 ? _b : 50;
    const result = [];
    for (let i = 0; i < steps; i++) {
        const s = Math.round((i / (steps - 1)) * 100);
        result.push(hslToHex(h, s, l));
    }
    return result;
}
function mixColors(c1, c2, t, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const o1 = normalizeColor(c1);
    const o2 = normalizeColor(c2);
    t = Math.max(0, Math.min(1, t));
    const mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || 'rgb';
    const out = (opts === null || opts === void 0 ? void 0 : opts.format) || 'hex';
    let r = 0, g = 0, b = 0, a = 1;
    if (mode === 'hsl') {
        const h1 = (_a = o1.h) !== null && _a !== void 0 ? _a : rgbToHsl({ r: (_b = o1.r) !== null && _b !== void 0 ? _b : 0, g: (_c = o1.g) !== null && _c !== void 0 ? _c : 0, b: (_d = o1.b) !== null && _d !== void 0 ? _d : 0 })[0];
        const s1 = (_e = o1.s) !== null && _e !== void 0 ? _e : 0;
        const l1 = (_f = o1.l) !== null && _f !== void 0 ? _f : 0;
        const h2 = (_g = o2.h) !== null && _g !== void 0 ? _g : rgbToHsl({ r: (_h = o2.r) !== null && _h !== void 0 ? _h : 0, g: (_j = o2.g) !== null && _j !== void 0 ? _j : 0, b: (_k = o2.b) !== null && _k !== void 0 ? _k : 0 })[0];
        const s2 = (_l = o2.s) !== null && _l !== void 0 ? _l : 0;
        const l2 = (_m = o2.l) !== null && _m !== void 0 ? _m : 0;
        const ih = h1 + (((h2 - h1 + 540) % 360) - 180) * t;
        const is = s1 + (s2 - s1) * t;
        const il = l1 + (l2 - l1) * t;
        const rgb = hslToRgb(ih, is, il);
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
        a = ((_o = o1.a) !== null && _o !== void 0 ? _o : 1) + (((_p = o2.a) !== null && _p !== void 0 ? _p : 1) - ((_q = o1.a) !== null && _q !== void 0 ? _q : 1)) * t;
    }
    else {
        r = (((_r = o1.r) !== null && _r !== void 0 ? _r : 0) * (1 - t)) + (((_s = o2.r) !== null && _s !== void 0 ? _s : 0) * t);
        g = (((_t = o1.g) !== null && _t !== void 0 ? _t : 0) * (1 - t)) + (((_u = o2.g) !== null && _u !== void 0 ? _u : 0) * t);
        b = (((_v = o1.b) !== null && _v !== void 0 ? _v : 0) * (1 - t)) + (((_w = o2.b) !== null && _w !== void 0 ? _w : 0) * t);
        a = ((_x = o1.a) !== null && _x !== void 0 ? _x : 1) * (1 - t) + ((_y = o2.a) !== null && _y !== void 0 ? _y : 1) * t;
    }
    if (out === 'hex')
        return rgbToHex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
    if (out === 'rgba')
        return rgbToRgbaString({ r: Math.round(r), g: Math.round(g), b: Math.round(b) }, a);
    if (out === 'rgb')
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    if (out === 'hsl') {
        const [hh, ss, ll] = rgbToHsl({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
        return `hsl(${hh}, ${ss}%, ${ll}%)`;
    }
    return rgbToHex({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
}
function relativeLuminance(color) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const r = ((_a = n.r) !== null && _a !== void 0 ? _a : 0) / 255;
    const g = ((_b = n.g) !== null && _b !== void 0 ? _b : 0) / 255;
    const b = ((_c = n.b) !== null && _c !== void 0 ? _c : 0) / 255;
    const srgbToLin = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(a, b) {
    const L1 = relativeLuminance(a);
    const L2 = relativeLuminance(b);
    const light = Math.max(L1, L2);
    const dark = Math.min(L1, L2);
    return +((light + 0.05) / (dark + 0.05)).toFixed(2);
}
function isDark(color, threshold = 0.5) {
    return relativeLuminance(color) < threshold;
}
function isLight(color, threshold = 0.5) {
    return !isDark(color, threshold);
}
function rgbToCmyk({ r, g, b }) {
    const rd = r / 255, gd = g / 255, bd = b / 255;
    const k = 1 - Math.max(rd, gd, bd);
    if (k === 1)
        return { c: 0, m: 0, y: 0, k: 1 };
    const c = (1 - rd - k) / (1 - k);
    const m = (1 - gd - k) / (1 - k);
    const y = (1 - bd - k) / (1 - k);
    return { c, m, y, k };
}
function cmykToRgb({ c, m, y, k }) {
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}
function srgbToLinear(v) {
    v = v / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function linearToSrgb(v) {
    const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(1, t)) * 255);
}
function rgbToXyz({ r, g, b }) {
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
    const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
    const Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;
    return { X: X * 100, Y: Y * 100, Z: Z * 100 };
}
function xyzToRgb({ X, Y, Z }) {
    X = X / 100;
    Y = Y / 100;
    Z = Z / 100;
    let R = X * 3.2404542 + Y * -1.5371385 + Z * -0.4985314;
    let G = X * -0.9692660 + Y * 1.8760108 + Z * 0.0415560;
    let B = X * 0.0556434 + Y * -0.2040259 + Z * 1.0572252;
    R = linearToSrgb(R);
    G = linearToSrgb(G);
    B = linearToSrgb(B);
    return { r: R, g: G, b: B };
}
function rgbToLab({ r, g, b }) {
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
function labToRgb({ L, a, b }) {
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
function rgbToLch({ r, g, b }) {
    const { L, a, b: bb } = rgbToLab({ r, g, b });
    const C = Math.sqrt(a * a + bb * bb);
    let H = Math.atan2(bb, a) * (180 / Math.PI);
    if (H < 0)
        H += 360;
    return { L, C, H };
}
function lchToRgb({ L, C, H }) {
    const a = Math.cos(H * Math.PI / 180) * C;
    const b = Math.sin(H * Math.PI / 180) * C;
    return labToRgb({ L, a, b });
}
function wcagLevel(foreground, background) {
    const ratio = contrastRatio(foreground, background);
    if (ratio >= 7)
        return 'AAA';
    if (ratio >= 4.5)
        return 'AA';
    if (ratio >= 3)
        return 'AA-large';
    return 'fail';
}
function bestTextColor(background) {
    const onBlack = contrastRatio(background, '#000000');
    const onWhite = contrastRatio(background, '#ffffff');
    return onBlack >= onWhite ? '#000000' : '#ffffff';
}
function bestContrastColor(background, candidates) {
    let best = candidates[0];
    let bestRatio = -1;
    for (const c of candidates) {
        const ratio = contrastRatio(background, c);
        if (ratio > bestRatio) {
            bestRatio = ratio;
            best = c;
        }
    }
    return best;
}
// ─── HWB ─────────────────────────────────────────────────────────────────────
function rgbToHwb({ r, g, b }) {
    const rd = r / 255, gd = g / 255, bd = b / 255;
    const max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd);
    const w = min;
    const bl = 1 - max;
    let h = 0;
    if (max !== min) {
        const d = max - min;
        switch (max) {
            case rd:
                h = (gd - bd) / d + (gd < bd ? 6 : 0);
                break;
            case gd:
                h = (bd - rd) / d + 2;
                break;
            case bd:
                h = (rd - gd) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(w * 100), Math.round(bl * 100)];
}
function hwbToRgb(H, W, B) {
    H = ((H % 360) + 360) % 360;
    const w = W / 100, b = B / 100;
    if (w + b >= 1) {
        const gray = Math.round((w / (w + b)) * 255);
        return { r: gray, g: gray, b: gray };
    }
    const { r, g, b: rb } = hslToRgb(H, 100, 50);
    const factor = 1 - w - b;
    return {
        r: Math.round(r / 255 * factor * 255 + w * 255),
        g: Math.round(g / 255 * factor * 255 + w * 255),
        b: Math.round(rb / 255 * factor * 255 + w * 255),
    };
}
function toHwbString(H, W, B, alpha) {
    if (alpha !== undefined)
        return `hwb(${H} ${W}% ${B}% / ${+alpha.toFixed(3)})`;
    return `hwb(${H} ${W}% ${B}%)`;
}
function parseHwbString(str) {
    const m = str.trim().match(/hwb\(\s*([\d.+-]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?\s*\)/i);
    if (!m)
        return null;
    return { H: parseFloat(m[1]), W: parseFloat(m[2]), B: parseFloat(m[3]), alpha: m[4] !== undefined ? parseFloat(m[4]) : 1 };
}
// ─── OKLCH / OKLAB ───────────────────────────────────────────────────────────
function srgbToOkLinear(v) {
    v = v / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function okLinearToSrgb(v) {
    const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(1, t)) * 255);
}
function rgbToOklab({ r, g, b }) {
    const R = srgbToOkLinear(r), G = srgbToOkLinear(g), B = srgbToOkLinear(b);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return {
        L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    };
}
function oklabToRgb({ L, a, b }) {
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    const R = okLinearToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
    const G = okLinearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
    const B = okLinearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
    return { r: R, g: G, b: B };
}
function rgbToOklch({ r, g, b }) {
    const { L, a, b: bb } = rgbToOklab({ r, g, b });
    const C = Math.sqrt(a * a + bb * bb);
    let H = Math.atan2(bb, a) * (180 / Math.PI);
    if (H < 0)
        H += 360;
    return { L, C, H };
}
function oklchToRgb({ L, C, H }) {
    const a = Math.cos(H * Math.PI / 180) * C;
    const b = Math.sin(H * Math.PI / 180) * C;
    return oklabToRgb({ L, a, b });
}
// ─── Utilities ───────────────────────────────────────────────────────────────
function toHslString(h, s, l, alpha) {
    if (alpha !== undefined)
        return `hsla(${h}, ${s}%, ${l}%, ${+alpha.toFixed(3)})`;
    return `hsl(${h}, ${s}%, ${l}%)`;
}
function colorDeltaE(c1, c2) {
    var _a, _b, _c, _d, _e, _f;
    const n1 = normalizeColor(c1);
    const n2 = normalizeColor(c2);
    const lab1 = rgbToLab({ r: (_a = n1.r) !== null && _a !== void 0 ? _a : 0, g: (_b = n1.g) !== null && _b !== void 0 ? _b : 0, b: (_c = n1.b) !== null && _c !== void 0 ? _c : 0 });
    const lab2 = rgbToLab({ r: (_d = n2.r) !== null && _d !== void 0 ? _d : 0, g: (_e = n2.g) !== null && _e !== void 0 ? _e : 0, b: (_f = n2.b) !== null && _f !== void 0 ? _f : 0 });
    // CIEDE2000
    const deg = (rad) => rad * (180 / Math.PI);
    const rad = (d) => d * (Math.PI / 180);
    const { L: L1, a: a1, b: b1 } = lab1;
    const { L: L2, a: a2, b: b2 } = lab2;
    const dL = L2 - L1;
    const Lm = (L1 + L2) / 2;
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const Cm = (C1 + C2) / 2;
    const Cm7 = Math.pow(Cm, 7);
    const G = 0.5 * (1 - Math.sqrt(Cm7 / (Cm7 + Math.pow(25, 7))));
    const a1p = a1 * (1 + G), a2p = a2 * (1 + G);
    const C1p = Math.sqrt(a1p * a1p + b1 * b1);
    const C2p = Math.sqrt(a2p * a2p + b2 * b2);
    const dCp = C2p - C1p;
    const Cmp = (C1p + C2p) / 2;
    let h1p = deg(Math.atan2(b1, a1p));
    if (h1p < 0)
        h1p += 360;
    let h2p = deg(Math.atan2(b2, a2p));
    if (h2p < 0)
        h2p += 360;
    let dhp;
    if (Math.abs(h1p - h2p) <= 180)
        dhp = h2p - h1p;
    else if (h2p <= h1p)
        dhp = h2p - h1p + 360;
    else
        dhp = h2p - h1p - 360;
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp / 2));
    let Hmp;
    if (Math.abs(h1p - h2p) <= 180)
        Hmp = (h1p + h2p) / 2;
    else if (h1p + h2p < 360)
        Hmp = (h1p + h2p + 360) / 2;
    else
        Hmp = (h1p + h2p - 360) / 2;
    const T = 1
        - 0.17 * Math.cos(rad(Hmp - 30))
        + 0.24 * Math.cos(rad(2 * Hmp))
        + 0.32 * Math.cos(rad(3 * Hmp + 6))
        - 0.20 * Math.cos(rad(4 * Hmp - 63));
    const SL = 1 + 0.015 * Math.pow(Lm - 50, 2) / Math.sqrt(20 + Math.pow(Lm - 50, 2));
    const SC = 1 + 0.045 * Cmp;
    const SH = 1 + 0.015 * Cmp * T;
    const Cmp7 = Math.pow(Cmp, 7);
    const RC = 2 * Math.sqrt(Cmp7 / (Cmp7 + Math.pow(25, 7)));
    const dTheta = 30 * Math.exp(-Math.pow((Hmp - 275) / 25, 2));
    const RT = -Math.sin(rad(2 * dTheta)) * RC;
    return +Math.sqrt(Math.pow(dL / SL, 2) +
        Math.pow(dCp / SC, 2) +
        Math.pow(dHp / SH, 2) +
        RT * (dCp / SC) * (dHp / SH)).toFixed(4);
}
function randomColor(options) {
    var _a, _b, _c;
    const [hMin, hMax] = (_a = options === null || options === void 0 ? void 0 : options.hRange) !== null && _a !== void 0 ? _a : [0, 360];
    const [sMin, sMax] = (_b = options === null || options === void 0 ? void 0 : options.sRange) !== null && _b !== void 0 ? _b : [40, 90];
    const [lMin, lMax] = (_c = options === null || options === void 0 ? void 0 : options.lRange) !== null && _c !== void 0 ? _c : [30, 70];
    const h = Math.floor(Math.random() * (hMax - hMin)) + hMin;
    const s = Math.floor(Math.random() * (sMax - sMin)) + sMin;
    const l = Math.floor(Math.random() * (lMax - lMin)) + lMin;
    return hslToHex(h, s, l);
}
function toNearestNamedColor(color) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const r = (_a = n.r) !== null && _a !== void 0 ? _a : 0, g = (_b = n.g) !== null && _b !== void 0 ? _b : 0, b = (_c = n.b) !== null && _c !== void 0 ? _c : 0;
    let bestName = 'black';
    let bestDist = Infinity;
    for (const [name, hex] of Object.entries(NAMED_COLORS)) {
        const [nr, ng, nb] = hexToRgb(hex);
        const dist = Math.sqrt(Math.pow(r - nr, 2) + Math.pow(g - ng, 2) + Math.pow(b - nb, 2));
        if (dist < bestDist) {
            bestDist = dist;
            bestName = name;
        }
    }
    return bestName;
}
