import { describe, it, expect, beforeEach } from 'vitest'
import { normalizeColor } from '../src/parse.js'
import {
  clearColorCache,
  disableCache,
  enableCache,
  getCacheStats,
  normalizeColorCached,
} from '../src/cache.js'

// ─── Cache ───────────────────────────────────────────────────────────────────

describe('cache', () => {
  beforeEach(() => {
    clearColorCache()
    enableCache()
  })

  it('normalizeColorCached returns same result as normalizeColor', () => {
    const cached = normalizeColorCached('#3498db')
    const direct = normalizeColor('#3498db')
    expect(cached.r).toBe(direct.r)
    expect(cached.hex).toBe(direct.hex)
  })
  it('hit count increments on repeated call', () => {
    normalizeColorCached('#ff0000')
    normalizeColorCached('#ff0000')
    expect(getCacheStats().hits).toBeGreaterThanOrEqual(1)
  })
  it('clearColorCache resets size and hits', () => {
    normalizeColorCached('#ff0000')
    clearColorCache()
    const stats = getCacheStats()
    expect(stats.size).toBe(0)
    expect(stats.hits).toBe(0)
  })
  it('disableCache bypasses cache', () => {
    disableCache()
    normalizeColorCached('#aabbcc')
    normalizeColorCached('#aabbcc')
    expect(getCacheStats().hits).toBe(0) // no hits when disabled
    enableCache()
  })
  it('getCacheStats size grows with unique calls', () => {
    normalizeColorCached('#111111')
    normalizeColorCached('#222222')
    expect(getCacheStats().size).toBeGreaterThanOrEqual(2)
  })
})
