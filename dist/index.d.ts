export type ColorType = 'hex' | 'css-var' | 'rgb' | 'hsl' | 'named' | 'unknown';
export declare function isCssVariable(value: string): boolean;
export declare function isHexColor(value: string): boolean;
export declare function isRgbColor(value: string): boolean;
export declare function isHslColor(value: string): boolean;
export declare function getColorType(value: string): ColorType;
export declare function extractCssVariableName(value: string): string;
export declare function normalizeHex(hex: string): string;
export declare function hexToRgb(hex: string): [number, number, number];
export declare function hexToRgba(hex: string, opacity?: number): string;
export declare function hexToHsl(hex: string): [number, number, number];
export declare function hslToHex(h: number, s: number, l: number): string;
export declare function adjustHexBrightness(hex: string, offsetPercent: number): string;
export declare function rotateHue(hex: string, degrees: number): string;
export declare function rgbToHex({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): string;
export declare function rgbaToHex({ r, g, b, a }: {
    r: number;
    g: number;
    b: number;
    a: number;
}): string;
export declare function rgbToRgbaString({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}, a: number): string;
export declare function rgbaStringToRgba(str: string): {
    r: number;
    g: number;
    b: number;
    a: number;
} | null;
export declare function rgbToHsl({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): [number, number, number];
export declare function hslToRgb(h: number, s: number, l: number): {
    r: number;
    g: number;
    b: number;
};
export declare function rgbToHsv({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): [number, number, number];
export declare function hsvToRgb(h: number, s: number, v: number): {
    r: number;
    g: number;
    b: number;
};
export declare function hexToHsv(hex: string): [number, number, number];
export declare function hsvToHex(h: number, s: number, v: number): string;
export declare function hex8ToRgba(hex: string): {
    r: number;
    g: number;
    b: number;
    a: number;
} | null;
export declare function rgbaToHex8({ r, g, b, a }: {
    r: number;
    g: number;
    b: number;
    a: number;
}): string;
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
export declare function mixColors(c1: string, c2: string, t: number, opts?: {
    mode?: 'rgb' | 'hsl';
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
}): string;
export declare function relativeLuminance(color: string): number;
export declare function contrastRatio(a: string, b: string): number;
export declare function isDark(color: string, threshold?: number): boolean;
export declare function isLight(color: string, threshold?: number): boolean;
export declare function rgbToCmyk({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): {
    c: number;
    m: number;
    y: number;
    k: number;
};
export declare function cmykToRgb({ c, m, y, k }: {
    c: number;
    m: number;
    y: number;
    k: number;
}): {
    r: number;
    g: number;
    b: number;
};
export declare function rgbToLab({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): {
    L: number;
    a: number;
    b: number;
};
export declare function labToRgb({ L, a, b }: {
    L: number;
    a: number;
    b: number;
}): {
    r: number;
    g: number;
    b: number;
};
export declare function rgbToLch({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): {
    L: number;
    C: number;
    H: number;
};
export declare function lchToRgb({ L, C, H }: {
    L: number;
    C: number;
    H: number;
}): {
    r: number;
    g: number;
    b: number;
};
