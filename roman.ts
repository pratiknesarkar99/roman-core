// Roman Numeral Cheat Sheet
const cheatSheetObject = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
}

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


console.log(cheatSheetObject.C); // Expected output: 100
console.log(cheatSheetMap.get("C")); // Expected output: 100

console.log(cheatSheetObject["Q"]); // Expected output: undefined
console.log(cheatSheetMap.get("Q")); // Expected output: undefined


console.log(cheatSheetObject["toString"]); // Expected output: [Function: toString]
console.log(cheatSheetMap.get("toString")); // Expected output: undefined

// The cheatSheetObject has a property called "toString" because it inherits from Object.prototype, which has a toString method. Therefore, when accessing cheatSheetObject["toString"], it returns the toString function.
// The cheatSheetMap does not have a key called "toString", so when cheatSheetMap.get("toString") is called, it returns undefined.