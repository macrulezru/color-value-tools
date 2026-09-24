"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complement = complement;
exports.triadic = triadic;
exports.analogous = analogous;
exports.splitComplementary = splitComplementary;
exports.tetradic = tetradic;
exports.colorShades = colorShades;
exports.monochromatic = monochromatic;
exports.randomColor = randomColor;
exports.interpolateColors = interpolateColors;
exports.createColorScale = createColorScale;
exports.midpointColor = midpointColor;
exports.tints = tints;
exports.shades = shades;
exports.tones = tones;
exports.generateGradientColors = generateGradientColors;
exports.generateTints = generateTints;
exports.generateShades = generateShades;
// Harmonies, scales, tints/shades and color generators.
const parse_js_1 = require("./parse.js");
const spaces_js_1 = require("./convert/spaces.js");
const manipulate_js_1 = require("./manipulate.js");
function complement(color) {
    var _a;
    return (0, manipulate_js_1.rotateHue)((_a = (0, parse_js_1.normalizeColor)(color).hex) !== null && _a !== void 0 ? _a : '#000000', 180);
}
function triadic(color) {
    var _a;
    const hex = (_a = (0, parse_js_1.normalizeColor)(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [hex, (0, manipulate_js_1.rotateHue)(hex, 120), (0, manipulate_js_1.rotateHue)(hex, 240)];
}
function analogous(color, angle = 30) {
    var _a;
    const hex = (_a = (0, parse_js_1.normalizeColor)(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [(0, manipulate_js_1.rotateHue)(hex, -angle), hex, (0, manipulate_js_1.rotateHue)(hex, angle)];
}
function splitComplementary(color) {
    var _a;
    const hex = (_a = (0, parse_js_1.normalizeColor)(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [hex, (0, manipulate_js_1.rotateHue)(hex, 150), (0, manipulate_js_1.rotateHue)(hex, 210)];
}
function tetradic(color) {
    var _a;
    const hex = (_a = (0, parse_js_1.normalizeColor)(color).hex) !== null && _a !== void 0 ? _a : '#000000';
    return [hex, (0, manipulate_js_1.rotateHue)(hex, 90), (0, manipulate_js_1.rotateHue)(hex, 180), (0, manipulate_js_1.rotateHue)(hex, 270)];
}
function colorShades(color, steps = 9) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const s = (_b = n.s) !== null && _b !== void 0 ? _b : 0;
    // steps - 1 === 0 below would otherwise divide by zero (NaN lightness, then
    // a literal "#NaNNaNNaN" hex string) — a single shade is just the color's
    // own lightness, same idea as interpolateColors() returning the midpoint
    // for a 2-color, 1-step request.
    if (steps <= 1)
        return steps === 1 ? [(0, spaces_js_1.hslToHex)(h, s, (_c = n.l) !== null && _c !== void 0 ? _c : 50)] : [];
    const result = [];
    for (let i = 0; i < steps; i++) {
        const l = Math.round(100 - (i / (steps - 1)) * 100);
        result.push((0, spaces_js_1.hslToHex)(h, s, l));
    }
    return result;
}
function monochromatic(color, steps = 5) {
    var _a, _b, _c;
    const n = (0, parse_js_1.normalizeColor)(color);
    const h = (_a = n.h) !== null && _a !== void 0 ? _a : 0;
    const l = (_b = n.l) !== null && _b !== void 0 ? _b : 50;
    // Same steps === 1 divide-by-zero guard as colorShades() above.
    if (steps <= 1)
        return steps === 1 ? [(0, spaces_js_1.hslToHex)(h, (_c = n.s) !== null && _c !== void 0 ? _c : 0, l)] : [];
    const result = [];
    for (let i = 0; i < steps; i++) {
        const s = Math.round((i / (steps - 1)) * 100);
        result.push((0, spaces_js_1.hslToHex)(h, s, l));
    }
    return result;
}
function randomColor(options) {
    var _a, _b, _c;
    const [hMin, hMax] = (_a = options === null || options === void 0 ? void 0 : options.hRange) !== null && _a !== void 0 ? _a : [0, 360];
    const [sMin, sMax] = (_b = options === null || options === void 0 ? void 0 : options.sRange) !== null && _b !== void 0 ? _b : [40, 90];
    const [lMin, lMax] = (_c = options === null || options === void 0 ? void 0 : options.lRange) !== null && _c !== void 0 ? _c : [30, 70];
    const h = Math.floor(Math.random() * (hMax - hMin)) + hMin;
    const s = Math.floor(Math.random() * (sMax - sMin)) + sMin;
    const l = Math.floor(Math.random() * (lMax - lMin)) + lMin;
    return (0, spaces_js_1.hslToHex)(h, s, l);
}
// ─── Interpolation ─────────────────────────────────────────────────
function interpolateColors(color1, color2, steps, options) {
    if (steps < 2)
        return steps === 1 ? [(0, manipulate_js_1.mixColors)(color1, color2, 0.5, options)] : [];
    const result = [];
    for (let i = 0; i < steps; i++) {
        result.push((0, manipulate_js_1.mixColors)(color1, color2, i / (steps - 1), options));
    }
    return result;
}
function createColorScale(anchors, steps, options) {
    const normalized = anchors.map((a, i, arr) => {
        var _a;
        return ({
            color: typeof a === 'string' ? a : a.color,
            position: typeof a === 'string'
                ? i / Math.max(arr.length - 1, 1)
                : ((_a = a.position) !== null && _a !== void 0 ? _a : i / Math.max(arr.length - 1, 1)),
        });
    });
    normalized.sort((a, b) => a.position - b.position);
    const result = [];
    for (let i = 0; i < steps; i++) {
        const t = steps === 1 ? 0 : i / (steps - 1);
        let lo = normalized[0], hi = normalized[normalized.length - 1];
        for (let j = 0; j < normalized.length - 1; j++) {
            if (t >= normalized[j].position && t <= normalized[j + 1].position) {
                lo = normalized[j];
                hi = normalized[j + 1];
                break;
            }
        }
        const span = hi.position - lo.position;
        const localT = span === 0 ? 0 : (t - lo.position) / span;
        result.push((0, manipulate_js_1.mixColors)(lo.color, hi.color, localT, options));
    }
    return result;
}
function midpointColor(color1, color2, options) {
    var _a;
    return (0, manipulate_js_1.mixColors)(color1, color2, 0.5, { mode: (_a = options === null || options === void 0 ? void 0 : options.space) !== null && _a !== void 0 ? _a : 'oklab' });
}
// ─── Tints / Shades / Tones ───────────────────────────────────────
function tints(color, steps = 5) {
    return interpolateColors(color, '#ffffff', steps, { space: 'oklab' });
}
function shades(color, steps = 5) {
    return interpolateColors(color, '#000000', steps, { space: 'oklab' });
}
function tones(color, steps = 5, gray = '#808080') {
    return interpolateColors(color, gray, steps, { space: 'oklab' });
}
// ─── Generator functions ────────────────────────────────────────
function* generateGradientColors(start, end, steps, options) {
    for (let i = 0; i < steps; i++) {
        yield (0, manipulate_js_1.mixColors)(start, end, steps === 1 ? 0 : i / (steps - 1), options);
    }
}
function* generateTints(color, steps, options) {
    for (let i = 0; i < steps; i++) {
        yield (0, manipulate_js_1.mixColors)(color, '#ffffff', steps === 1 ? 0 : i / (steps - 1), {
            mode: 'oklab',
            ...options,
        });
    }
}
function* generateShades(color, steps, options) {
    for (let i = 0; i < steps; i++) {
        yield (0, manipulate_js_1.mixColors)(color, '#000000', steps === 1 ? 0 : i / (steps - 1), {
            mode: 'oklab',
            ...options,
        });
    }
}
