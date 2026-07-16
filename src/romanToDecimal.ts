import { SYMBOL_VALUES } from "./tables";
import { decimalToRoman } from "./decimalToRoman";
import type { RomanResult, ConversionOptions } from "./types";

export function normalize(input: string): string {
    return input.trim().toUpperCase();
}

// Arithmetic only. Trusts that every character is a valid symbol.
// Deliberately tolerant: acts as a hypothesis generator for the
// round-trip validation in safeRomanToDecimal.
function computeValue(numeral: string): number {
    let total = 0;
    for (let i = 0; i < numeral.length; i++) {
        const currentValue = SYMBOL_VALUES.get(numeral[i]);
        const nextValue =
            i + 1 < numeral.length ? SYMBOL_VALUES.get(numeral[i + 1]) : 0;
        if (currentValue === undefined || nextValue === undefined) {
            return NaN; // unreachable after character validation, kept as a safety net
        }
        total += nextValue > currentValue ? -currentValue : currentValue;
    }
    return total;
}

export function safeRomanToDecimal(
    rawInput: string,
    options: ConversionOptions = {}
): RomanResult {
    const numeral = normalize(rawInput);

    if (numeral.length === 0) {
        return {
            ok: false,
            error: { code: "EMPTY_INPUT", message: "Input is empty." },
        };
    }

    if (/\s/.test(numeral)) {
        return {
            ok: false,
            error: {
                code: "INTERNAL_WHITESPACE",
                message: "Numeral contains internal whitespace.",
            },
        };
    }

    for (const char of numeral) {
        if (!SYMBOL_VALUES.has(char)) {
            return {
                ok: false,
                error: {
                    code: "INVALID_CHARACTER",
                    message: `Invalid character: "${char}" is not a Roman numeral symbol.`,
                    character: char,
                },
            };
        }
    }

    // ---- Structural validation via round-trip (spec rule D) ----

    const looseValue = computeValue(numeral);

    // Guard the validator's blind spot: e.g. MMMM computes to 4000 and
    // would round-trip to itself if we let it reach decimalToRoman.
    if (looseValue < 1 || looseValue > 3999) {
        return {
            ok: false,
            error: {
                code: "INVALID_STRUCTURE",
                message: `"${numeral}" is out of the supported range (1 to 3999).`,
            },
        };
    }

    const canonical = decimalToRoman(looseValue, options);

    if (numeral !== canonical) {
        return {
            ok: false,
            error: {
                code: "INVALID_STRUCTURE",
                message: `"${numeral}" is not a valid Roman numeral. Did you mean "${canonical}" (${looseValue})?`,
            },
        };
    }

    return { ok: true, value: looseValue };
}

export function romanToDecimal(
    input: string,
    options: ConversionOptions = {}
): number {
    const result = safeRomanToDecimal(input, options);
    if (!result.ok) {
        throw new Error(`[${result.error.code}] ${result.error.message}`);
    }
    return result.value;
}