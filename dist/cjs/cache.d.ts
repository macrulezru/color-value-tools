import { normalizeColor } from './parse.js';
export declare function clearColorCache(): void;
export declare function getCacheStats(): {
    size: number;
    hits: number;
};
export declare function enableCache(): void;
export declare function disableCache(): void;
export declare function normalizeColorCached(input: string): ReturnType<typeof normalizeColor>;
