---
title: JavaScript essentials
minutes: 25
summary: Variables, functions and numbers in JavaScript, and the money traps they hide (floating point and rounding), by writing the invoice total function the payment page needs.
---

## The problem

The payment page must show an invoice's total, with discount and VAT, exactly as the server calculates it. If the page and the API disagree by a kobo, customers lose trust and support gets calls. JavaScript's numbers have the same floating-point traps as Python's, plus a few of their own.

## The concept

### Variables

`const` for values that won't be reassigned (most of them), `let` for those that will. Avoid the old `var`.

### Functions

```js norun
function invoiceTotal(lines, discountPct = 0, vatExempt = false) {
  // ...
  return total;
}
```

Arrow functions are a shorter form: `const double = (n) => n * 2;`

### Numbers

JavaScript has one number type, a 64-bit float. Whole numbers are exact up to about 9 million billion, so **kobo as whole numbers** is safe; fractions like `0.075` are not exact.

### Rounding

`Math.round` rounds halves **up** for positive numbers (`Math.round(16.5)` is 17), unlike Python's `round`. But it rounds `-16.5` to -16, and it can only round what it's given: if a calculation lands on 16.499999999999996 instead of 16.5, it rounds down.

![8.95 * 100 is 894.9999999999999, so Math.floor gives 894 and loses a kobo while Math.round gives 895; Math.round(16.5) is 17 but Math.round(-16.5) is -16; the rule: whole kobo everywhere, convert typed naira once](/images/courses/webjs/money-js.svg "Floats lose kobo: convert once with Math.round, then keep whole kobo.")

## Example

The traps, one line each:

```js
console.log(0.1 + 0.2);
console.log(Math.round(16.5), Math.round(-16.5));
console.log(3 * 0.075, (3 * 75) / 1000);
console.log(8.95 * 100, Math.floor(8.95 * 100));
console.log(Number.isInteger(1250050), Number.MAX_SAFE_INTEGER);
```

```text
0.30000000000000004
17 -16
0.22499999999999998 0.225
894.9999999999999 894
true 9007199254740991
```

`3 * 0.075` isn't exactly 0.225, because 0.075 can't be stored exactly. The error is tiny, but tiny errors become wrong kobo as soon as code rounds down or truncates: `8.95 * 100` comes out just under 895, so the common `Math.floor(price * 100)` loses a kobo. Multiplying by 75 and dividing by 1000 keeps the arithmetic in whole numbers until the last step, and lesson 6 converts typed amounts by splitting the text at the decimal point instead of multiplying. Now the invoice total, matching Tallybook's rules from the Software Engineering course:

```js
const VAT_PER_THOUSAND = 75;          // 7.5%
const MAX_DISCOUNT_PCT = 20;

function roundHalfUp(n) {
  return Math.sign(n) * Math.round(Math.abs(n));
}

function invoiceTotal(lines, discountPct = 0, vatExempt = false) {
  if (discountPct < 0 || discountPct > MAX_DISCOUNT_PCT) {
    throw new RangeError(`discountPct must be between 0 and ${MAX_DISCOUNT_PCT}`);
  }
  const subtotal = lines.reduce((sum, [quantity, unitPriceKobo]) => sum + quantity * unitPriceKobo, 0);
  const afterDiscount = subtotal - roundHalfUp((subtotal * discountPct) / 100);
  const vat = vatExempt ? 0 : roundHalfUp((afterDiscount * VAT_PER_THOUSAND) / 1000);
  return afterDiscount + vat;
}

console.log(invoiceTotal([[2, 100000]]));
console.log(invoiceTotal([[2, 100000]], 10));
console.log(invoiceTotal([[1, 220]]));
console.log(invoiceTotal([[1, 10000], [2, 5000], [4, 2500]], 15));
```

```text
215000
193500
237
27413
```

These are the same totals the Python tests in the Software Engineering course expect, including the half-kobo case (220 kobo: VAT 16.5 rounds up to 17). The page and the server now agree because they implement the same rules the same way. In a real system, the page would also show the server's total, so a mismatch is caught (lesson 8).

## Walkthrough

1. Run the blocks in your console. Try `invoiceTotal([[1, 100000]], 25)`. What happens?
2. Why does `roundHalfUp` use `Math.abs` and `Math.sign`? Test it on -16.5.
3. Rewrite `roundHalfUp` as an arrow function.
4. Write a function that formats kobo as naira (the task below).

## Practice

```answer
{
  "id": "web-02-p1",
  "prompt": "What does `invoiceTotal([[3, 250000]], 5)` return, in kobo?",
  "answer": 765938,
  "format": "number",
  "jsVerify": "invoiceTotal([[3, 250000]], 5)",
  "hint": "750,000 less 5% is 712,500; VAT is 53,437.5, which rounds up.",
  "required": true
}
```

```task
{
  "id": "web-02-t1",
  "prompt": "Write a JavaScript function **koboToNaira(kobo)** that returns text like **\"₦12,500.50\"** for 1250050, using whole-number arithmetic for the naira and kobo parts (no dividing by 100 into a float). Show **two** example calls in comments with their results.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "function koboToNaira(kobo) {\n  ...",
  "rules": [
    { "label": "A function named koboToNaira", "pattern": "function\\s+koboToNaira\\s*\\(|const\\s+koboToNaira\\s*=" },
    { "label": "Uses whole-number division (Math.floor or Math.trunc)", "pattern": "Math\\.(floor|trunc)\\s*\\(" },
    { "label": "Uses the remainder for kobo (%)", "pattern": "%\\s*100" },
    { "label": "Pads kobo to two digits", "pattern": "padStart\\(\\s*2" },
    { "label": "Adds thousands separators", "pattern": "toLocaleString|Intl\\.NumberFormat|replace\\(" },
    { "label": "Example calls in comments", "pattern": "//[^\\n]*₦", "min": 2 }
  ],
  "sample": "function koboToNaira(kobo) {\n  const naira = Math.floor(kobo / 100);\n  const rest = kobo % 100;\n  return `₦${naira.toLocaleString(\"en-NG\")}.${String(rest).padStart(2, \"0\")}`;\n}\n\n// koboToNaira(1250050) -> \"₦12,500.50\"\n// koboToNaira(237)     -> \"₦2.37\"",
  "note": "Splitting into naira and kobo with integer operations never produces 12500.499999.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does `Math.round(16.5)` give in JavaScript?",
    "options": ["16", "17", "16.5", "An error"],
    "answer": 1,
    "explanation": "Halves round up for positive numbers, unlike Python's round()."
  },
  {
    "prompt": "Why compute VAT as `amount * 75 / 1000` instead of `amount * 0.075`?",
    "options": ["It's shorter", "0.075 can't be stored exactly; whole-number arithmetic avoids the error", "Browsers require it", "It's faster"],
    "answer": 1,
    "explanation": "Keep money in whole numbers as long as possible."
  },
  {
    "prompt": "When should you use `const` instead of `let`?",
    "options": ["Never", "Whenever the variable won't be reassigned, which is most of the time", "Only for numbers", "Only in functions"],
    "answer": 1,
    "explanation": "It makes accidental reassignment an error."
  }
]
```
