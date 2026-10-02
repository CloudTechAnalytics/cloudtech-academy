---
title: Testing JavaScript
minutes: 20
summary: Test the page's logic (totals, validation and API handling) with small automated tests, using a tiny test runner you can run in the browser console, and see how real projects do the same with Vitest or Jest.
---

## The problem

The payment page now has four pieces of logic: the invoice total, the live balance, validation and the API handling. Each was checked by hand once. The next developer who changes the reference format or the rounding will check by hand again, if they remember. Front-end logic deserves the same automated tests as the server's.

## The concept

**Test the functions, not the clicks**

Because the logic lives in plain functions (lessons 6 to 8), most of it can be tested without a browser page at all: call the function, compare the result.

**A test is still just an assertion**

Every test framework does the same thing: run named checks, report which passed and which failed.

**Real projects**

In a project with Node.js, use a test framework: **Vitest** or **Jest** (`npm install -D vitest`, then `npx vitest`). They find `*.test.js` files, run them on every change, and can simulate a page for DOM tests. For checking whole pages in real browsers, teams use **Playwright** or Cypress. The tests you write here move into those files almost unchanged.

## Example

A test runner small enough to read, then tests for the functions from lessons 2 and 7. Paste the functions into the console first (they're repeated here so this block runs on its own):

```js
const results = [];
function test(name, fn) {
  try {
    fn();
    results.push(["PASS", name]);
  } catch (error) {
    results.push(["FAIL", `${name}: ${error.message}`]);
  }
}
function expectEqual(actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

const roundHalfUp = (n) => Math.sign(n) * Math.round(Math.abs(n));
function invoiceTotal(lines, discountPct = 0, vatExempt = false) {
  if (discountPct < 0 || discountPct > 20) throw new RangeError("discountPct must be between 0 and 20");
  const subtotal = lines.reduce((sum, [q, p]) => sum + q * p, 0);
  const afterDiscount = subtotal - roundHalfUp((subtotal * discountPct) / 100);
  return afterDiscount + (vatExempt ? 0 : roundHalfUp((afterDiscount * 75) / 1000));
}
function validateReference(reference) {
  const ref = reference.trim();
  if (ref === "") return "Enter the reference from your bank transfer";
  if (!/^[A-Za-z0-9-]{6,30}$/.test(ref)) return "References are 6 to 30 letters, numbers or dashes";
  return null;
}

test("single line with VAT", () => expectEqual(invoiceTotal([[2, 100000]]), 215000));
test("VAT-exempt customer pays no VAT", () => expectEqual(invoiceTotal([[2, 100000]], 0, true), 200000));
test("VAT half a kobo rounds up", () => expectEqual(invoiceTotal([[1, 220]]), 237));
test("discount above 20% is refused", () => {
  let threw = false;
  try { invoiceTotal([[1, 100]], 25); } catch { threw = true; }
  expectEqual(threw, true);
});
test("empty reference has a message", () => expectEqual(validateReference("  "), "Enter the reference from your bank transfer"));
test("valid reference passes", () => expectEqual(validateReference("TRF-2026-0915-0042"), null));
test("reference of 5 characters is too short", () => expectEqual(validateReference("AB-12"), null));

console.log(results.map(([status, name]) => `${status}  ${name}`).join("\n"));
console.log(`${results.filter(([s]) => s === "PASS").length} passed, ${results.filter(([s]) => s === "FAIL").length} failed`);
```

```text
PASS  single line with VAT
PASS  VAT-exempt customer pays no VAT
PASS  VAT half a kobo rounds up
PASS  discount above 20% is refused
PASS  empty reference has a message
PASS  valid reference passes
FAIL  reference of 5 characters is too short: expected null, got "References are 6 to 30 letters, numbers or dashes"
6 passed, 1 failed
```

One test fails, and the failure is in the **test**, not the code: a 5-character reference is too short (the rule says 6 to 30), so `validateReference` correctly returns a message. The test's expectation was wrong. Reading a failure carefully, and deciding whether the code or the test is wrong, is half of testing. The fix is to expect the message.

## Walkthrough

1. Run the block. Fix the failing test's expected value and run it again.
2. Add boundary tests for references of exactly 6 and exactly 30 characters, and of 31.
3. Write tests for `sendPayment` from lesson 8 using `fakeFetch` (they'll need `await`).
4. Turn one of these into a Vitest test file (the task below).

## Practice

```answer
{
  "id": "web-09-p1",
  "prompt": "How many of the seven tests **pass** in the example?",
  "answer": 6,
  "format": "number",
  "jsVerify": "results.filter(([s]) => s === 'PASS').length",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "web-09-t1",
  "prompt": "Write a **Vitest** test file for `validateReference` (imported from `./validate.js`), with a **describe** block and at least **three** tests: an empty reference, a valid one, and one that's **too long** (31 characters).",
  "minutes": 6,
  "rows": 12,
  "placeholder": "import { describe, it, expect } from \"vitest\";",
  "rules": [
    { "label": "Imports from vitest", "pattern": "from\\s+[\"']vitest[\"']" },
    { "label": "Imports validateReference", "pattern": "import\\s*\\{[^}]*validateReference[^}]*\\}\\s*from\\s*[\"']\\./validate(\\.js)?[\"']" },
    { "label": "A describe block", "pattern": "describe\\(" },
    { "label": "At least three tests", "pattern": "\\b(it|test)\\(\\s*[\"'`]", "min": 3 },
    { "label": "Uses expect", "pattern": "expect\\(" },
    { "label": "A 31-character case", "pattern": "repeat\\(\\s*31\\s*\\)|[A-Za-z0-9-]{31}" }
  ],
  "sample": "import { describe, it, expect } from \"vitest\";\nimport { validateReference } from \"./validate.js\";\n\ndescribe(\"validateReference\", () => {\n  it(\"asks for a reference when it's empty\", () => {\n    expect(validateReference(\"  \")).toBe(\"Enter the reference from your bank transfer\");\n  });\n\n  it(\"accepts a normal bank reference\", () => {\n    expect(validateReference(\"TRF-2026-0915-0042\")).toBeNull();\n  });\n\n  it(\"refuses a reference of 31 characters\", () => {\n    expect(validateReference(\"A\".repeat(31))).toMatch(/6 to 30/);\n  });\n});",
  "note": "The test names read as sentences, so a failure report explains itself.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A test fails. What's the first thing to decide?",
    "options": ["Delete it", "Whether the code or the test's expectation is wrong", "Rerun until it passes", "Ignore it"],
    "answer": 1,
    "explanation": "Tests can be wrong too."
  },
  {
    "prompt": "Why can most of the page's logic be tested without a browser?",
    "options": ["It can't", "It's in plain functions that take values and return results", "Browsers are slow", "Tests ignore the DOM"],
    "answer": 1,
    "explanation": "Design for testability."
  },
  {
    "prompt": "Which tool runs JavaScript unit tests in a Node.js project?",
    "options": ["Lighthouse", "Vitest or Jest", "CSS", "fetch"],
    "answer": 1,
    "explanation": "And Playwright for whole pages in real browsers."
  }
]
```
