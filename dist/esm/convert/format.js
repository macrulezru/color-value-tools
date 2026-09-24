// Formatters that accept any supported CSS color string.
import { normalizeColor } from '../parse.js';
import { rgbToDisplayP3, rgbToHex, rgbToOklch } from './spaces.js';
export function toDisplayP3Hex(color) {
    const n = normalizeColorRaw(color);
    const p3 = rgbToDisplayP3({ r: n.r, g: n.g, b: n.b });
    return rgbToHex({
        r: Math.round(Math.max(0, Math.min(255, p3.r * 255))),
        g: Math.round(Math.max(0, Math.min(255, p3.g * 255))),
        b: Math.round(Math.max(0, Math.min(255, p3.b * 255))),
    });
}
// Internal raw normalizer (no cache, no circular dep issues)
function normalizeColorRaw(color) {
    var _a, _b, _c, _d;
    const n = normalizeColor(color);
    return { r: (_a = n.r) !== null && _a !== void 0 ? _a : 0, g: (_b = n.g) !== null && _b !== void 0 ? _b : 0, b: (_c = n.b) !== null && _c !== void 0 ? _c : 0, a: (_d = n.a) !== null && _d !== void 0 ? _d : 1 };
}
// ─── Formatting ───────────────────────────────────────────────────────────────
export function toOklchString(color, alpha) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const { L, C, H } = rgbToOklch({ r: (_a = n.r) !== null && _a !== void 0 ? _a : 0, g: (_b = n.g) !== null && _b !== void 0 ? _b : 0, b: (_c = n.b) !== null && _c !== void 0 ? _c : 0 });
    const Lr = +L.toFixed(4), Cr = +C.toFixed(4), Hr = +H.toFixed(2);
    if (alpha !== undefined)
        return `oklch(${Lr} ${Cr} ${Hr} / ${+alpha.toFixed(3)})`;
    return `oklch(${Lr} ${Cr} ${Hr})`;
}
export function toColorP3String(color, alpha) {
    var _a, _b, _c;
    const n = normalizeColor(color);
    const p3 = rgbToDisplayP3({ r: (_a = n.r) !== null && _a !== void 0 ? _a : 0, g: (_b = n.g) !== null && _b !== void 0 ? _b : 0, b: (_c = n.b) !== null && _c !== void 0 ? _c : 0 });
    const r = +p3.r.toFixed(4), g = +p3.g.toFixed(4), b = +p3.b.toFixed(4);
    if (alpha !== undefined)
        return `color(display-p3 ${r} ${g} ${b} / ${+alpha.toFixed(3)})`;
    return `color(display-p3 ${r} ${g} ${b})`;
}
