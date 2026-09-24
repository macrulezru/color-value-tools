// Memoized normalizeColor() for performance-sensitive code.
import { normalizeColor } from './parse.js';
let _cacheEnabled = true;
const _normalizeCache = new Map();
let _cacheHits = 0;
export function clearColorCache() {
    _normalizeCache.clear();
    _cacheHits = 0;
}
export function getCacheStats() {
    return { size: _normalizeCache.size, hits: _cacheHits };
}
export function enableCache() {
    _cacheEnabled = true;
}
export function disableCache() {
    _cacheEnabled = false;
}
// Cached normalizer wrapper — use this in performance-sensitive contexts
export function normalizeColorCached(input) {
    if (!_cacheEnabled)
        return normalizeColor(input);
    const cached = _normalizeCache.get(input);
    if (cached) {
        _cacheHits++;
        return cached;
    }
    const result = normalizeColor(input);
    _normalizeCache.set(input, result);
    return result;
}
