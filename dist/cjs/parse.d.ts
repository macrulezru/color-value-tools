export type ColorType = 'hex' | 'css-var' | 'rgb' | 'hsl' | 'named' | 'oklch' | 'color' | 'unknown';
export declare function isCssVariable(value: string): boolean;
export declare function isHexColor(value: string): boolean;
export declare function isOklchColor(value: string): boolean;
export declare function isColorFunction(value: string): boolean;
export declare function isRgbColor(value: string): boolean;
export declare function isHslColor(value: string): boolean;
export declare function getColorType(value: string): ColorType;
export declare function extractCssVariableName(value: string): string;
export declare function parseCssVar(value: string): {
    variableName: string;
    fallback?: string;
} | null;
export declare function parseOklchString(str: string): {
    L: number;
    C: number;
    H: number;
    alpha: number;
} | null;
export declare function parseColorFn(str: string): {
    space: string;
    r: number;
    g: number;
    b: number;
    alpha: number;
} | null;
export declare function normalizeColor(input: string | {
    r: number;
    g: number;
    b: number;
} | {
    h: number;
    s: number;
    l: number;
}): {
    type: string;
    hex: string;
    r: any;
    g: any;
    b: any;
    a: number;
    h: number;
    s: number;
    l: number;
    v: number;
    raw?: undefined;
} | {
    type: string;
    hex: string;
    r: number;
    g: number;
    b: number;
    a: number;
    h: any;
    s: any;
    l: any;
    v: number;
    raw?: undefined;
} | {
    type: string;
    hex?: undefined;
    r?: undefined;
    g?: undefined;
    b?: undefined;
    a?: undefined;
    h?: undefined;
    s?: undefined;
    l?: undefined;
    v?: undefined;
    raw?: undefined;
} | {
    type: string;
    raw: string;
    hex?: undefined;
    r?: undefined;
    g?: undefined;
    b?: undefined;
    a?: undefined;
    h?: undefined;
    s?: undefined;
    l?: undefined;
    v?: undefined;
} | {
    type: string;
    hex: string;
    r: number;
    g: number;
    b: number;
    a: number;
    h?: undefined;
    s?: undefined;
    l?: undefined;
    v?: undefined;
    raw?: undefined;
};
export declare function parseHwbString(str: string): {
    H: number;
    W: number;
    B: number;
    alpha: number;
} | null;
export declare function toNearestNamedColor(color: string): string;
