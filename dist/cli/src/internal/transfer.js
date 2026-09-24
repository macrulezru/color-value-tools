"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.srgbChanToLinear = srgbChanToLinear;
exports.linearChanToSrgb = linearChanToSrgb;
// sRGB transfer functions (operate on 0-1 values)
function srgbChanToLinear(v) {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function linearChanToSrgb(v) {
    const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, t));
}
