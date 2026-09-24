"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.mixColors = mixColors;
// Adjusting and mixing colors.
const parse_js_1 = require("./parse.js");
const spaces_js_1 = require("./convert/spaces.js");
function adjustHexBrightness(hex, offsetPercent) {
    const normalizedHex = (0, spaces_js_1.normalizeHex)(hex);
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
    const [h, s, l] = (0, spaces_js_1.hexToHsl)(hex);
    const newH = (((h + degrees) % 360) + 360) % 360;
    return (0, spaces_js_1.hslToHex)(newH, s, l);
}
function lighten(color, amount) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = (_b = n.s) !== null && _b !== void 0 ? _b : 0;
    const l = Math.min(100, ((_c = n.l) !== null && _c !== void 0 ? _c : 0) + amount);
    return (0, spaces_js_1.hslToHex)(h, s, l);
}
function darken(color, amount) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = (_b = n.s) !== null && _b !== void 0 ? _b : 0;
    const l = Math.max(0, ((_c = n.l) !== null && _c !== void 0 ? _c : 0) - amount);
    return (0, spaces_js_1.hslToHex)(h, s, l);
}
function saturate(color, amount) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = Math.min(100, ((_b = n.s) !== null && _b !== void 0 ? _b : 0) + amount);
    const l = (_c = n.l) !== null && _c !== void 0 ? _c : 0;
    return (0, spaces_js_1.hslToHex)(h, s, l);
}
function desaturate(color, amount) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = Math.max(0, ((_b = n.s) !== null && _b !== void 0 ? _b : 0) - amount);
    const l = (_c = n.l) !== null && _c !== void 0 ? _c : 0;
    return (0, spaces_js_1.hslToHex)(h, s, l);
}
function setAlpha(color, alpha) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const r = (_a = n.r) !== null && _a !== void 0 ? _a : 0;
    const g = (_b = n.g) !== null && _b !== void 0 ? _b : 0;
    const b = (_c = n.b) !== null && _c !== void 0 ? _c : 0;
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`;
}
function getAlpha(color) {
    var _a;
    const n = (0, parse_js_1.normalizeColor)(color);
    return (_a = n.a) !== null && _a !== void 0 ? _a : 1;
}
function invertColor(color) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const r = 255 - ((_a = n.r) !== null && _a !== void 0 ? _a : 0);
    const g = 255 - ((_b = n.g) !== null && _b !== void 0 ? _b : 0);
    const b = 255 - ((_c = n.b) !== null && _c !== void 0 ? _c : 0);
    return (0, spaces_js_1.rgbToHex)({ r, g, b });
}
function grayscale(color) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const r = (_a = n.r) !== null && _a !== void 0 ? _a : 0;
    const g = (_b = n.g) !== null && _b !== void 0 ? _b : 0;
    const b = (_c = n.b) !== null && _c !== void 0 ? _c : 0;
    // Perceptual luminance weights (ITU-R BT.709)
    const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    return (0, spaces_js_1.rgbToHex)({ r: gray, g: gray, b: gray });
}
function _lerpHue(h1, h2, t, mode = 'shorter') {
    let d = h2 - h1;
    if (mode === 'shorter') {
        if (d > 180)
            d -= 360;
        else if (d < -180)
            d += 360;
    }
    else if (mode === 'longer') {
        if (d > 0 && d < 180)
            d -= 360;
        else if (d < 0 && d > -180)
            d += 360;
    }
    else if (mode === 'increasing') {
        if (d < 0)
            d += 360;
    }
    else if (mode === 'decreasing') {
        if (d > 0)
            d -= 360;
    }
    return h1 + d * t;
}
function _formatMixResult(r, g, b, a, out) {
    if (out === 'hex')
        return (0, spaces_js_1.rgbToHex)({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
    if (out === 'rgba')
        return (0, spaces_js_1.rgbToRgbaString)({ r: Math.round(r), g: Math.round(g), b: Math.round(b) }, a);
    if (out === 'rgb')
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    if (out === 'hsl') {
        const [hh, ss, ll] = (0, spaces_js_1.rgbToHsl)({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
        return `hsl(${hh}, ${ss}%, ${ll}%)`;
    }
    return (0, spaces_js_1.rgbToHex)({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
}
function mixColors(c1, c2, t, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35;
    const o1 = (0, parse_js_1.normalizeColor)(c1);
    const o2 = (0, parse_js_1.normalizeColor)(c2);
    t = Math.max(0, Math.min(1, t));
    const mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || 'rgb';
    const out = (opts === null || opts === void 0 ? void 0 : opts.format) || 'hex';
    const hueMode = (_a = opts === null || opts === void 0 ? void 0 : opts.hueInterpolation) !== null && _a !== void 0 ? _a : 'shorter';
    let r = 0, g = 0, b = 0, a = 1;
    if (mode === 'hsl') {
        const h1 = (_b = o1.h) !== null && _b !== void 0 ? _b : (0, spaces_js_1.rgbToHsl)({ r: (_c = o1.r) !== null && _c !== void 0 ? _c : 0, g: (_d = o1.g) !== null && _d !== void 0 ? _d : 0, b: (_e = o1.b) !== null && _e !== void 0 ? _e : 0 })[0];
        const s1 = (_f = o1.s) !== null && _f !== void 0 ? _f : 0;
        const l1 = (_g = o1.l) !== null && _g !== void 0 ? _g : 0;
        const h2 = (_h = o2.h) !== null && _h !== void 0 ? _h : (0, spaces_js_1.rgbToHsl)({ r: (_j = o2.r) !== null && _j !== void 0 ? _j : 0, g: (_k = o2.g) !== null && _k !== void 0 ? _k : 0, b: (_l = o2.b) !== null && _l !== void 0 ? _l : 0 })[0];
        const s2 = (_m = o2.s) !== null && _m !== void 0 ? _m : 0;
        const l2 = (_o = o2.l) !== null && _o !== void 0 ? _o : 0;
        const ih = _lerpHue(h1, h2, t, hueMode);
        const rgb = (0, spaces_js_1.hslToRgb)(ih, s1 + (s2 - s1) * t, l1 + (l2 - l1) * t);
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
        a = ((_p = o1.a) !== null && _p !== void 0 ? _p : 1) + (((_q = o2.a) !== null && _q !== void 0 ? _q : 1) - ((_r = o1.a) !== null && _r !== void 0 ? _r : 1)) * t;
    }
    else if (mode === 'lab') {
        const lab1 = (0, spaces_js_1.rgbToLab)({ r: (_s = o1.r) !== null && _s !== void 0 ? _s : 0, g: (_t = o1.g) !== null && _t !== void 0 ? _t : 0, b: (_u = o1.b) !== null && _u !== void 0 ? _u : 0 });
        const lab2 = (0, spaces_js_1.rgbToLab)({ r: (_v = o2.r) !== null && _v !== void 0 ? _v : 0, g: (_w = o2.g) !== null && _w !== void 0 ? _w : 0, b: (_x = o2.b) !== null && _x !== void 0 ? _x : 0 });
        const mixed = (0, spaces_js_1.labToRgb)({
            L: lab1.L + (lab2.L - lab1.L) * t,
            a: lab1.a + (lab2.a - lab1.a) * t,
            b: lab1.b + (lab2.b - lab1.b) * t,
        });
        r = mixed.r;
        g = mixed.g;
        b = mixed.b;
        a = ((_y = o1.a) !== null && _y !== void 0 ? _y : 1) + (((_z = o2.a) !== null && _z !== void 0 ? _z : 1) - ((_0 = o1.a) !== null && _0 !== void 0 ? _0 : 1)) * t;
    }
    else if (mode === 'lch') {
        const lch1 = (0, spaces_js_1.rgbToLch)({ r: (_1 = o1.r) !== null && _1 !== void 0 ? _1 : 0, g: (_2 = o1.g) !== null && _2 !== void 0 ? _2 : 0, b: (_3 = o1.b) !== null && _3 !== void 0 ? _3 : 0 });
        const lch2 = (0, spaces_js_1.rgbToLch)({ r: (_4 = o2.r) !== null && _4 !== void 0 ? _4 : 0, g: (_5 = o2.g) !== null && _5 !== void 0 ? _5 : 0, b: (_6 = o2.b) !== null && _6 !== void 0 ? _6 : 0 });
        const mixed = (0, spaces_js_1.lchToRgb)({
            L: lch1.L + (lch2.L - lch1.L) * t,
            C: lch1.C + (lch2.C - lch1.C) * t,
            H: _lerpHue(lch1.H, lch2.H, t, hueMode),
        });
        r = mixed.r;
        g = mixed.g;
        b = mixed.b;
        a = ((_7 = o1.a) !== null && _7 !== void 0 ? _7 : 1) + (((_8 = o2.a) !== null && _8 !== void 0 ? _8 : 1) - ((_9 = o1.a) !== null && _9 !== void 0 ? _9 : 1)) * t;
    }
    else if (mode === 'oklab') {
        const ok1 = (0, spaces_js_1.rgbToOklab)({ r: (_10 = o1.r) !== null && _10 !== void 0 ? _10 : 0, g: (_11 = o1.g) !== null && _11 !== void 0 ? _11 : 0, b: (_12 = o1.b) !== null && _12 !== void 0 ? _12 : 0 });
        const ok2 = (0, spaces_js_1.rgbToOklab)({ r: (_13 = o2.r) !== null && _13 !== void 0 ? _13 : 0, g: (_14 = o2.g) !== null && _14 !== void 0 ? _14 : 0, b: (_15 = o2.b) !== null && _15 !== void 0 ? _15 : 0 });
        const mixed = (0, spaces_js_1.oklabToRgb)({
            L: ok1.L + (ok2.L - ok1.L) * t,
            a: ok1.a + (ok2.a - ok1.a) * t,
            b: ok1.b + (ok2.b - ok1.b) * t,
        });
        r = mixed.r;
        g = mixed.g;
        b = mixed.b;
        a = ((_16 = o1.a) !== null && _16 !== void 0 ? _16 : 1) + (((_17 = o2.a) !== null && _17 !== void 0 ? _17 : 1) - ((_18 = o1.a) !== null && _18 !== void 0 ? _18 : 1)) * t;
    }
    else if (mode === 'oklch') {
        const ok1 = (0, spaces_js_1.rgbToOklch)({ r: (_19 = o1.r) !== null && _19 !== void 0 ? _19 : 0, g: (_20 = o1.g) !== null && _20 !== void 0 ? _20 : 0, b: (_21 = o1.b) !== null && _21 !== void 0 ? _21 : 0 });
        const ok2 = (0, spaces_js_1.rgbToOklch)({ r: (_22 = o2.r) !== null && _22 !== void 0 ? _22 : 0, g: (_23 = o2.g) !== null && _23 !== void 0 ? _23 : 0, b: (_24 = o2.b) !== null && _24 !== void 0 ? _24 : 0 });
        const mixed = (0, spaces_js_1.oklchToRgb)({
            L: ok1.L + (ok2.L - ok1.L) * t,
            C: ok1.C + (ok2.C - ok1.C) * t,
            H: _lerpHue(ok1.H, ok2.H, t, hueMode),
        });
        r = mixed.r;
        g = mixed.g;
        b = mixed.b;
        a = ((_25 = o1.a) !== null && _25 !== void 0 ? _25 : 1) + (((_26 = o2.a) !== null && _26 !== void 0 ? _26 : 1) - ((_27 = o1.a) !== null && _27 !== void 0 ? _27 : 1)) * t;
    }
    else {
        r = ((_28 = o1.r) !== null && _28 !== void 0 ? _28 : 0) * (1 - t) + ((_29 = o2.r) !== null && _29 !== void 0 ? _29 : 0) * t;
        g = ((_30 = o1.g) !== null && _30 !== void 0 ? _30 : 0) * (1 - t) + ((_31 = o2.g) !== null && _31 !== void 0 ? _31 : 0) * t;
        b = ((_32 = o1.b) !== null && _32 !== void 0 ? _32 : 0) * (1 - t) + ((_33 = o2.b) !== null && _33 !== void 0 ? _33 : 0) * t;
        a = ((_34 = o1.a) !== null && _34 !== void 0 ? _34 : 1) * (1 - t) + ((_35 = o2.a) !== null && _35 !== void 0 ? _35 : 1) * t;
    }
    return _formatMixResult(r, g, b, a, out);
}
