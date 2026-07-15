// Roman Numeral Cheat Sheet using Map
const cheatSheetMap = new Map<string, number>([
    ["I", 1],
    ["V", 5],
    ["X", 10],
    ["L", 50],
    ["C", 100],
    ["D", 500],
    ["M", 1000]
]);

function romanToDecimal(numeral: string): number {
    if (typeof numeral !== "string" || numeral.length === 0) {
        return NaN;
    }

    let total = 0;

    for (let i = 0; i < numeral.length; i++) {
        const currentValue = cheatSheetMap.get(numeral[i]);
        const nextValue = i + 1 < numeral.length ? cheatSheetMap.get(numeral[i + 1]) : 0; // Set nextValue to 0 if we are at the last character

        //todo: Handle the case where the current numeral is not in the cheatSheetMap
        if (currentValue === undefined || nextValue === undefined) {
            return NaN; // Return NaN for invalid numeral for now
        }

        if (nextValue > currentValue) {
            total = total - currentValue;
        }
        else {
            total = total + currentValue;
        }
    }
    return total;
}

console.log(romanToDecimal("XVI")); // 16
console.log(romanToDecimal("LXIII")); // 63
console.log(romanToDecimal("IX")); // 9
console.log(romanToDecimal("XIV")); // 14
console.log(romanToDecimal("MCMXCIV")); // 1994
console.log(romanToDecimal("MMXXVI")); // 2026
console.log(romanToDecimal("")); // NaN
