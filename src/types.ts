export type RomanError =
    | { code: "EMPTY_INPUT"; message: string }
    | { code: "INTERNAL_WHITESPACE"; message: string }
    | { code: "INVALID_CHARACTER"; message: string; character: string }
    | { code: "INVALID_STRUCTURE"; message: string };

export type RomanResult =
    | { ok: true; value: number }
    | { ok: false; error: RomanError };

export interface ConversionOptions {
    clockFace?: boolean; // when true, IIII is accepted/produced for 4
}