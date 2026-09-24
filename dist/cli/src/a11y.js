"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativeLuminance = relativeLuminance;
exports.contrastRatio = contrastRatio;
exports.isDark = isDark;
exports.isLight = isLight;
exports.wcagLevel = wcagLevel;
exports.bestTextColor = bestTextColor;
exports.bestContrastColor = bestContrastColor;
exports.colorDeltaE = colorDeltaE;
exports.simulateProtanopia = simulateProtanopia;
exports.simulateDeuteranopia = simulateDeuteranopia;
exports.simulateTritanopia = simulateTritanopia;
exports.simulateColorBlindness = simulateColorBlindness;
exports.isReadableOnBackground = isReadableOnBackground;
exports.bestContrastPalette = bestContrastPalette;
// Luminance, WCAG contrast, perceptual difference and color-blindness simulation.
const parse_js_1 = require("./parse.js");
const spaces_js_1 = require("./convert/spaces.js");
function relativeLuminance(color) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const r = ((_a = n.r) !== null && _a !== void 0 ? _a : 0) / 255;
    const g = ((_b = n.g) !== null && _b !== void 0 ? _b : 0) / 255;
    const b = ((_c = n.b) !== null && _c !== void 0 ? _c : 0) / 255;
    const srgbToLin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
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
function colorDeltaE(c1, c2) {
    var _a, _b, _c, _d, _e, _f;
    const n1 = (0, parse_js_1.normalizeColor)(c1);
    const n2 = (0, parse_js_1.normalizeColor)(c2);
    const lab1 = (0, spaces_js_1.rgbToLab)({ r: (_a = n1.r) !== null && _a !== void 0 ? _a : 0, g: (_b = n1.g) !== null && _b !== void 0 ? _b : 0, b: (_c = n1.b) !== null && _c !== void 0 ? _c : 0 });
    const lab2 = (0, spaces_js_1.rgbToLab)({ r: (_d = n2.r) !== null && _d !== void 0 ? _d : 0, g: (_e = n2.g) !== null && _e !== void 0 ? _e : 0, b: (_f = n2.b) !== null && _f !== void 0 ? _f : 0 });
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
    const T = 1 -
        0.17 * Math.cos(rad(Hmp - 30)) +
        0.24 * Math.cos(rad(2 * Hmp)) +
        0.32 * Math.cos(rad(3 * Hmp + 6)) -
        0.2 * Math.cos(rad(4 * Hmp - 63));
    const SL = 1 + (0.015 * Math.pow(Lm - 50, 2)) / Math.sqrt(20 + Math.pow(Lm - 50, 2));
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
// ─── Color blindness simulation ────────────────────────────────────
function _simulateCB(color, matrix) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    // linearize
    const lin = (v) => {
        const c = v / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const enc = (v) => {
        const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(1, c)) * 255);
    };
    const r = lin((_a = n.r) !== null && _a !== void 0 ? _a : 0), g = lin((_b = n.g) !== null && _b !== void 0 ? _b : 0), b = lin((_c = n.b) !== null && _c !== void 0 ? _c : 0);
    const nr = enc(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b);
    const ng = enc(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b);
    const nb = enc(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b);
    return (0, spaces_js_1.rgbToHex)({ r: nr, g: ng, b: nb });
}
const _PROTANOPIA_M = [
    [0.56667, 0.43333, 0.0],
    [0.55833, 0.44167, 0.0],
    [0.0, 0.24167, 0.75833],
];
const _DEUTERANOPIA_M = [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
];
const _TRITANOPIA_M = [
    [0.95, 0.05, 0.0],
    [0.0, 0.43333, 0.56667],
    [0.0, 0.475, 0.525],
];
function simulateProtanopia(color) {
    return _simulateCB(color, _PROTANOPIA_M);
}
function simulateDeuteranopia(color) {
    return _simulateCB(color, _DEUTERANOPIA_M);
}
function simulateTritanopia(color) {
    return _simulateCB(color, _TRITANOPIA_M);
}
function simulateColorBlindness(color, type) {
    if (type === 'protanopia')
        return simulateProtanopia(color);
    if (type === 'deuteranopia')
        return simulateDeuteranopia(color);
    return simulateTritanopia(color);
}
function isReadableOnBackground(textColor, background, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const level = (_a = options === null || options === void 0 ? void 0 : options.level) !== null && _a !== void 0 ? _a : 'AA';
    const large = (_b = options === null || options === void 0 ? void 0 : options.largeText) !== null && _b !== void 0 ? _b : false;
    const minRequired = level === 'AAA' ? (large ? 4.5 : 7) : large ? 3 : 4.5;
    // The specific effective background color that minRatio was actually
    // computed against — wcagLevel below is derived from this same color
    // (never a hardcoded '#ffffff') so it can't disagree with minRatio/readable.
    let minRatio;
    let effectiveBackground;
    if (typeof background === 'string') {
        effectiveBackground = background;
        minRatio = contrastRatio(textColor, background);
    }
    else if (background.type === 'semi-transparent') {
        const underlay = (_c = background.underlay) !== null && _c !== void 0 ? _c : '#ffffff';
        const fg = (0, parse_js_1.normalizeColor)(background.color);
        const bg = (0, parse_js_1.normalizeColor)(underlay);
        const alpha = (_d = fg.a) !== null && _d !== void 0 ? _d : 1;
        const cr = Math.round(((_e = fg.r) !== null && _e !== void 0 ? _e : 0) * alpha + ((_f = bg.r) !== null && _f !== void 0 ? _f : 255) * (1 - alpha));
        const cg = Math.round(((_g = fg.g) !== null && _g !== void 0 ? _g : 0) * alpha + ((_h = bg.g) !== null && _h !== void 0 ? _h : 255) * (1 - alpha));
        const cb = Math.round(((_j = fg.b) !== null && _j !== void 0 ? _j : 0) * alpha + ((_k = bg.b) !== null && _k !== void 0 ? _k : 255) * (1 - alpha));
        effectiveBackground = (0, spaces_js_1.rgbToHex)({ r: cr, g: cg, b: cb });
        minRatio = contrastRatio(textColor, effectiveBackground);
    }
    else {
        // The worst-case stop (lowest ratio) drives both minRatio and wcagLevel.
        let worstStop = background.stops[0];
        let worstRatio = Infinity;
        for (const stop of background.stops) {
            const ratio = contrastRatio(textColor, stop);
            if (ratio < worstRatio) {
                worstRatio = ratio;
                worstStop = stop;
            }
        }
        effectiveBackground = worstStop;
        minRatio = worstRatio;
    }
    const wLevel = wcagLevel(textColor, effectiveBackground);
    return {
        readable: minRatio >= minRequired,
        minContrastRatio: +minRatio.toFixed(2),
        wcagLevel: wLevel,
    };
}
function bestContrastPalette(background, palettes, options) {
    let bestIdx = 0;
    let bestScore = -1;
    let bestMin = 0, bestAvg = 0;
    palettes.forEach((palette, idx) => {
        var _a;
        const ratios = palette.map((c) => contrastRatio(background, c));
        const weights = (_a = options === null || options === void 0 ? void 0 : options.weights) !== null && _a !== void 0 ? _a : ratios.map(() => 1);
        const totalW = weights.reduce((s, w) => s + w, 0);
        const avg = ratios.reduce((s, r, i) => { var _a; return s + r * ((_a = weights[i]) !== null && _a !== void 0 ? _a : 1); }, 0) / totalW;
        const min = Math.min(...ratios);
        // Score: weighted avg with heavy penalty on minimum
        const score = avg * 0.4 + min * 0.6;
        if (score > bestScore) {
            bestScore = score;
            bestIdx = idx;
            bestMin = min;
            bestAvg = avg;
        }
    });
    return {
        paletteIndex: bestIdx,
        palette: palettes[bestIdx],
        minContrastRatio: +bestMin.toFixed(2),
        avgContrastRatio: +bestAvg.toFixed(2),
    };
}
