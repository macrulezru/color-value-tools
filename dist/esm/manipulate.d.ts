export declare function adjustHexBrightness(hex: string, offsetPercent: number): string;
export declare function rotateHue(hex: string, degrees: number): string;
export declare function lighten(color: string, amount: number): string;
export declare function darken(color: string, amount: number): string;
export declare function saturate(color: string, amount: number): string;
export declare function desaturate(color: string, amount: number): string;
export declare function setAlpha(color: string, alpha: number): string;
export declare function getAlpha(color: string): number;
export declare function invertColor(color: string): string;
export declare function grayscale(color: string): string;
export declare function mixColors(c1: string, c2: string, t: number, opts?: {
    mode?: 'rgb' | 'hsl' | 'lab' | 'lch' | 'oklab' | 'oklch';
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
    hueInterpolation?: 'shorter' | 'longer' | 'increasing' | 'decreasing';
}): string;
