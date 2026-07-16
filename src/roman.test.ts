import { describe, it, expect } from "vitest";
import {
    safeRomanToDecimal,
    romanToDecimal,
    decimalToRoman,
} from "./index";

// ---------- Happy path: known conversions ----------

describe("safeRomanToDecimal: valid numerals", () => {
    it("converts simple additive numerals", () => {
        expect(safeRomanToDecimal("XVI")).toEqual({ ok: true, value: 16 });
        expect(safeRomanToDecimal("LXIII")).toEqual({ ok: true, value: 63 });
        expect(safeRomanToDecimal("MMXXVI")).toEqual({ ok: true, value: 2026 });
    });

    it("converts numerals with subtractive pairs", () => {
        expect(safeRomanToDecimal("IX")).toEqual({ ok: true, value: 9 });
        expect(safeRomanToDecimal("XIV")).toEqual({ ok: true, value: 14 });
        expect(safeRomanToDecimal("MCMXCIV")).toEqual({ ok: true, value: 1994 });
    });

    it("handles the extremes of the supported range", () => {
        expect(safeRomanToDecimal("I")).toEqual({ ok: true, value: 1 });
        expect(safeRomanToDecimal("MMMCMXCIX")).toEqual({ ok: true, value: 3999 });
    });

    it("handles the longest canonical numeral", () => {
        expect(safeRomanToDecimal("MMMDCCCLXXXVIII")).toEqual({
            ok: true,
            value: 3888,
        });
    });
});

// ---------- Normalization ----------

describe("input normalization", () => {
    it("trims outer whitespace", () => {
        expect(safeRomanToDecimal("  XIV  ")).toEqual({ ok: true, value: 14 });
    });

    it("accepts lowercase and mixed case", () => {
        expect(safeRomanToDecimal("xiv")).toEqual({ ok: true, value: 14 });
        expect(safeRomanToDecimal("McmXcIv")).toEqual({ ok: true, value: 1994 });
    });

    it("normalization does not rescue internal whitespace", () => {
        const result = safeRomanToDecimal("X IV");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.code).toBe("INTERNAL_WHITESPACE");
    });
});

// ---------- Error contracts ----------

describe("error reporting", () => {
    it("rejects empty input", () => {
        const result = safeRomanToDecimal("");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.code).toBe("EMPTY_INPUT");
    });

    it("rejects whitespace-only input as empty, not as whitespace", () => {
        const result = safeRomanToDecimal("   ");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.code).toBe("EMPTY_INPUT");
    });

    it("names the first invalid character it finds", () => {
        const result = safeRomanToDecimal("XQIZ");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_CHARACTER");
            expect(result.error).toMatchObject({ character: "Q" });
        }
    });

    it("checks whitespace before characters (error precedence)", () => {
        const result = safeRomanToDecimal("X Q");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.code).toBe("INTERNAL_WHITESPACE");
    });

    it("rejects structurally invalid numerals with a suggestion", () => {
        const result = safeRomanToDecimal("XMXMXC");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_STRUCTURE");
            expect(result.error.message).toContain("MMLXX");
            expect(result.error.message).toContain("2070");
        }
    });

    it("rejects non-canonical forms that pass local rules", () => {
        for (const bad of ["IVI", "VIV", "IIX", "XXL", "IC", "IL", "VX"]) {
            const result = safeRomanToDecimal(bad);
            expect(result.ok, `expected "${bad}" to be rejected`).toBe(false);
        }
    });

    it("rejects values that compute above the supported range", () => {
        const result = safeRomanToDecimal("MMMM");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.code).toBe("INVALID_STRUCTURE");
    });
});

// ---------- Clock-face mode ----------

describe("clock-face mode", () => {
    it("accepts IIII when enabled", () => {
        expect(safeRomanToDecimal("IIII", { clockFace: true })).toEqual({
            ok: true,
            value: 4,
        });
    });

    it("rejects IIII when disabled, suggesting IV", () => {
        const result = safeRomanToDecimal("IIII");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error.message).toContain("IV");
    });

    it("produces IIII for 4 when enabled", () => {
        expect(decimalToRoman(4, { clockFace: true })).toBe("IIII");
    });

    it("rejects IV when clock mode is on", () => {
        // In clock mode the canonical form of 4 is IIII, so IV no longer matches.
        const result = safeRomanToDecimal("IV", { clockFace: true });
        expect(result.ok).toBe(false);
    });

    it("only affects the ones digit", () => {
        expect(decimalToRoman(1444, { clockFace: true })).toBe("MCDXLIIII");
        expect(decimalToRoman(444, { clockFace: true })).toBe("CDXLIIII");
        expect(decimalToRoman(40, { clockFace: true })).toBe("XL");
    });
});

// ---------- decimalToRoman: boundaries and rejection ----------

describe("decimalToRoman", () => {
    it("converts boundary values", () => {
        expect(decimalToRoman(1)).toBe("I");
        expect(decimalToRoman(3999)).toBe("MMMCMXCIX");
        expect(decimalToRoman(3888)).toBe("MMMDCCCLXXXVIII");
    });

    it("throws for values outside 1-3999", () => {
        expect(() => decimalToRoman(0)).toThrow();
        expect(() => decimalToRoman(4000)).toThrow();
        expect(() => decimalToRoman(-7)).toThrow();
    });

    it("throws for non-integers and non-finite values", () => {
        expect(() => decimalToRoman(3.5)).toThrow();
        expect(() => decimalToRoman(NaN)).toThrow();
        expect(() => decimalToRoman(Infinity)).toThrow();
    });
});

// ---------- The throwing wrapper ----------

describe("romanToDecimal (throwing API)", () => {
    it("returns the value directly on success", () => {
        expect(romanToDecimal("MCMXCIV")).toBe(1994);
    });

    it("throws with the error code in the message", () => {
        expect(() => romanToDecimal("XQI")).toThrow(/INVALID_CHARACTER/);
        expect(() => romanToDecimal("")).toThrow(/EMPTY_INPUT/);
    });
});

// ---------- The invariant: exhaustive round-trip ----------

describe("round-trip invariant", () => {
    it("decimalToRoman and romanToDecimal are inverses across the entire range", () => {
        for (let n = 1; n <= 3999; n++) {
            const numeral = decimalToRoman(n);
            const back = safeRomanToDecimal(numeral);
            expect(back, `round-trip failed for ${n} -> ${numeral}`).toEqual({
                ok: true,
                value: n,
            });
        }
    });

    it("holds in clock-face mode too", () => {
        for (let n = 1; n <= 3999; n++) {
            const numeral = decimalToRoman(n, { clockFace: true });
            const back = safeRomanToDecimal(numeral, { clockFace: true });
            expect(back.ok, `clock round-trip failed for ${n}`).toBe(true);
        }
    });
});