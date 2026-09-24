// Memoized normalizeColor() for performance-sensitive code.
import { normalizeColor } from './parse.js'

let _cacheEnabled = true
const _normalizeCache = new Map<string, ReturnType<typeof normalizeColor>>()
let _cacheHits = 0

export function clearColorCache(): void {
  _normalizeCache.clear()
  _cacheHits = 0
}
export function getCacheStats(): { size: number; hits: number } {
  return { size: _normalizeCache.size, hits: _cacheHits }
}
export function enableCache(): void {
  _cacheEnabled = true
}
export function disableCache(): void {
  _cacheEnabled = false
}

// Cached normalizer wrapper — use this in performance-sensitive contexts
export function normalizeColorCached(input: string): ReturnType<typeof normalizeColor> {
  if (!_cacheEnabled) return normalizeColor(input)
  const cached = _normalizeCache.get(input)
  if (cached) {
    _cacheHits++
    return cached
  }
  const result = normalizeColor(input)
  _normalizeCache.set(input, result)
  return result
}
