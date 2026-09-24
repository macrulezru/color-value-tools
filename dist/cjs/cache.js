"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearColorCache = clearColorCache;
exports.getCacheStats = getCacheStats;
exports.enableCache = enableCache;
exports.disableCache = disableCache;
exports.normalizeColorCached = normalizeColorCached;
// Memoized normalizeColor() for performance-sensitive code.
const parse_js_1 = require("./parse.js");
let _cacheEnabled = true;
const _normalizeCache = new Map();
let _cacheHits = 0;
function clearColorCache() {
    _normalizeCache.clear();
    _cacheHits = 0;
}
function getCacheStats() {
    return { size: _normalizeCache.size, hits: _cacheHits };
}
function enableCache() {
    _cacheEnabled = true;
}
function disableCache() {
    _cacheEnabled = false;
}
// Cached normalizer wrapper — use this in performance-sensitive contexts
function normalizeColorCached(input) {
    if (!_cacheEnabled)
        return (0, parse_js_1.normalizeColor)(input);
    const cached = _normalizeCache.get(input);
    if (cached) {
        _cacheHits++;
        return cached;
    }
    const result = (0, parse_js_1.normalizeColor)(input);
    _normalizeCache.set(input, result);
    return result;
}
