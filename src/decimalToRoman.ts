import { DESCENDING_VALUES } from "./tables";
import type { ConversionOptions } from "./types";

export function decimalToRoman(
    value: number,
    options: ConversionOptions = {}
): string {
    if (!Number.isInteger(value) || value < 1 || value > 3999) {
        throw new Error(
            `Cannot convert ${value}: must be a whole number from 1 to 3999.`
        );
    }

    let remaining = value;
    let result = "";
    for (const [chunkValue, symbol] of DESCENDING_VALUES) {
        while (remaining >= chunkValue) {
            result += symbol;
            remaining -= chunkValue;
        }
    }

    // Clock-face convention: 4 is written IIII. "IV" can only ever
    // appear at the very end of a canonical numeral (4 is a ones digit),
    // so a single replace is safe.
    if (options.clockFace && result.endsWith("IV")) {
        result = result.slice(0, -2) + "IIII";
    }

    return result;
}