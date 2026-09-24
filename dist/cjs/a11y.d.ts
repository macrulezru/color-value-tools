export declare function relativeLuminance(color: string): number;
export declare function contrastRatio(a: string, b: string): number;
export declare function isDark(color: string, threshold?: number): boolean;
export declare function isLight(color: string, threshold?: number): boolean;
export type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';
export declare function wcagLevel(foreground: string, background: string): WcagLevel;
export declare function bestTextColor(background: string): '#000000' | '#ffffff';
export declare function bestContrastColor(background: string, candidates: string[]): string;
export declare function colorDeltaE(c1: string, c2: string): number;
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia';
export declare function simulateProtanopia(color: string): string;
export declare function simulateDeuteranopia(color: string): string;
export declare function simulateTritanopia(color: string): string;
export declare function simulateColorBlindness(color: string, type: ColorBlindnessType): string;
export type BackgroundSpec = string | {
    type: 'semi-transparent';
    color: string;
    underlay?: string;
} | {
    type: 'gradient';
    stops: string[];
};
export declare function isReadableOnBackground(textColor: string, background: BackgroundSpec, options?: {
    level?: 'AA' | 'AAA';
    largeText?: boolean;
}): {
    readable: boolean;
    minContrastRatio: number;
    wcagLevel: WcagLevel;
};
export interface PaletteScore {
    palette: string[];
    minContrastRatio: number;
    avgContrastRatio: number;
}
export declare function bestContrastPalette(background: string, palettes: string[][], options?: {
    weights?: number[];
}): PaletteScore & {
    paletteIndex: number;
};
