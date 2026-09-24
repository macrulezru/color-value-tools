export declare function rgbToDisplayP3(rgb: {
    r: number;
    g: number;
    b: number;
}): {
    r: number;
    g: number;
    b: number;
};
export declare function displayP3ToRgb(p3: {
    r: number;
    g: number;
    b: number;
}): {
    r: number;
    g: number;
    b: number;
};
export declare function shortHexToRgba(hex: string): {
    r: number;
    g: number;
    b: number;
    a: number;
} | null;
export declare function normalizeHex(hex: string): string;
export declare function hexToRgb(hex: string): [number, number, number];
export declare function hexToRgba(hex: string, opacity?: number): string;
export declare function hexToHsl(hex: string): [number, number, number];
export declare function hslToHex(h: number, s: number, l: number): string;
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
export declare function rgbToHsl({ r, g, b, }: {
    r: number;
    g: number;
    b: number;
}): [number, number, number];
export declare function hslToRgb(h: number, s: number, l: number): {
    r: number;
    g: number;
    b: number;
};
export declare function rgbToHsv({ r, g, b, }: {
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
export declare function rgbToHwb({ r, g, b, }: {
    r: number;
    g: number;
    b: number;
}): [number, number, number];
export declare function hwbToRgb(H: number, W: number, B: number): {
    r: number;
    g: number;
    b: number;
};
export declare function toHwbString(H: number, W: number, B: number, alpha?: number): string;
export declare function rgbToOklab({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): {
    L: number;
    a: number;
    b: number;
};
export declare function oklabToRgb({ L, a, b }: {
    L: number;
    a: number;
    b: number;
}): {
    r: number;
    g: number;
    b: number;
};
export declare function rgbToOklch({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): {
    L: number;
    C: number;
    H: number;
};
export declare function oklchToRgb({ L, C, H }: {
    L: number;
    C: number;
    H: number;
}): {
    r: number;
    g: number;
    b: number;
};
export declare function toHslString(h: number, s: number, l: number, alpha?: number): string;
