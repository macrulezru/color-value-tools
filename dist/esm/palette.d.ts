export declare function complement(color: string): string;
export declare function triadic(color: string): [string, string, string];
export declare function analogous(color: string, angle?: number): [string, string, string];
export declare function splitComplementary(color: string): [string, string, string];
export declare function tetradic(color: string): [string, string, string, string];
export declare function colorShades(color: string, steps?: number): string[];
export declare function monochromatic(color: string, steps?: number): string[];
export declare function randomColor(options?: {
    hRange?: [number, number];
    sRange?: [number, number];
    lRange?: [number, number];
}): string;
export declare function interpolateColors(color1: string, color2: string, steps: number, options?: {
    space?: 'rgb' | 'hsl' | 'lab' | 'lch' | 'oklab' | 'oklch';
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
    hueInterpolation?: 'shorter' | 'longer' | 'increasing' | 'decreasing';
}): string[];
export declare function createColorScale(anchors: string[] | Array<{
    color: string;
    position?: number;
}>, steps: number, options?: {
    space?: 'rgb' | 'hsl' | 'oklab' | 'oklch';
    format?: 'hex' | 'rgb' | 'hsl';
}): string[];
export declare function midpointColor(color1: string, color2: string, options?: {
    space?: 'lab' | 'lch' | 'oklab' | 'oklch';
}): string;
export declare function tints(color: string, steps?: number): string[];
export declare function shades(color: string, steps?: number): string[];
export declare function tones(color: string, steps?: number, gray?: string): string[];
export declare function generateGradientColors(start: string, end: string, steps: number, options?: {
    mode?: 'rgb' | 'hsl' | 'oklab' | 'oklch';
    format?: 'hex' | 'rgb' | 'hsl';
}): Generator<string>;
export declare function generateTints(color: string, steps: number, options?: {
    format?: 'hex' | 'rgb' | 'hsl';
}): Generator<string>;
export declare function generateShades(color: string, steps: number, options?: {
    format?: 'hex' | 'rgb' | 'hsl';
}): Generator<string>;
