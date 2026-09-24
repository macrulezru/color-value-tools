// sRGB transfer functions (operate on 0-1 values)
export function srgbChanToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
export function linearChanToSrgb(v: number): number {
  const t = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return Math.max(0, Math.min(1, t))
}
