import { safeRomanToDecimal, decimalToRoman } from "./src/index";

console.log(safeRomanToDecimal("XVI"));       // ok: 16
console.log(safeRomanToDecimal("LXIII"));     // ok: 63
console.log(safeRomanToDecimal("IX"));        // ok: 9
console.log(safeRomanToDecimal("XIV"));       // ok: 14
console.log(safeRomanToDecimal("MCMXCIV"));   // ok: 1994
console.log(safeRomanToDecimal("MMXXVI"));    // ok: 2026
console.log(safeRomanToDecimal("  xiv  "));   // ok: 14 (normalization)
console.log(safeRomanToDecimal("XQI"));       // error: INVALID_CHARACTER "Q"
console.log(safeRomanToDecimal(""));          // error: EMPTY_INPUT
console.log(safeRomanToDecimal("XMXMXC"));    // error: did you mean MMLXX (2070)?
console.log(safeRomanToDecimal("IVI"));       // error: did you mean V (5)?
console.log(safeRomanToDecimal("VIV"));       // error: did you mean IX (9)?
console.log(safeRomanToDecimal("MMMM"));      // error: out of range
console.log(safeRomanToDecimal("IIII"));                      // error: did you mean IV?
console.log(safeRomanToDecimal("IIII", { clockFace: true })); // ok: 4
console.log(decimalToRoman(4, { clockFace: true }));          // IIII
console.log(decimalToRoman(3888));                            // MMMDCCCLXXXVIII