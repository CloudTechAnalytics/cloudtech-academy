---
title: "Final project: Tallybook's pay-an-invoice page"
minutes: 20
summary: Plan your final project, an accessible, responsive payment page that calculates exactly, validates clearly, talks to the API safely and is backed by tests.
---

## The problem

Tallybook wants the new pay-an-invoice page live before the next month-end. Your final project is the page itself, and the evidence that it works for every customer: on a small phone, with a keyboard, with a screen reader, on a bad connection, and when someone types something unexpected.

## The concept

### What the page includes

| Part | Built in |
| :-- | :-- |
| Exact money: totals and formatting in kobo | lessons 2 and 3 |
| Semantic, accessible HTML | lesson 4 |
| Mobile-first, responsive CSS | lesson 5 |
| Live balance as the customer types | lesson 6 |
| Clear, accessible validation | lesson 7 |
| Every API outcome handled, with loading states | lesson 8 |
| Automated tests for the logic | lesson 9 |

### Evidence

A checklist with a result for each item: keyboard only, screen reader (NVDA on Windows, VoiceOver on a phone), 320px wide, 200% zoom, Lighthouse accessibility score, slow network (DevTools' "Slow 3G"), and the test results.

## Example

The checklist as data, so it can be scored and reported the same way each time you re-check the page:

```js
const checks = [
  { area: "Keyboard", check: "Every control reachable and usable with Tab, Enter and Space", passed: true },
  { area: "Screen reader", check: "Labels, errors and the live balance are announced", passed: true },
  { area: "Small screen", check: "Usable at 320px wide without horizontal scrolling", passed: true },
  { area: "Zoom", check: "Usable at 200% zoom", passed: true },
  { area: "Money", check: "Totals match the API for the test invoices", passed: true },
  { area: "Validation", check: "Every error has a visible, linked message", passed: true },
  { area: "Network", check: "Slow and failed requests show clear messages and no double payments", passed: false },
  { area: "Tests", check: "All logic tests pass", passed: true },
];
const failed = checks.filter((c) => !c.passed);
console.log(`${checks.length - failed.length} of ${checks.length} checks passed`);
for (const c of failed) console.log(`To fix: ${c.area}: ${c.check}`);
```

```text
7 of 8 checks passed
To fix: Network: Slow and failed requests show clear messages and no double payments
```

A page isn't finished when it looks right on your laptop; it's finished when this list is all passes on real devices.

## Walkthrough

1. Build the page from lessons 4 to 8 in one file, with the tests from lesson 9.
2. Run every check on a real phone as well as your computer, and record the results honestly.
3. Fix what fails, re-check, and keep the before-and-after.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "web-10-p1",
  "prompt": "How many checks fail in the example checklist?",
  "answer": 1,
  "format": "number",
  "jsVerify": "failed.length",
  "hint": "The 'To fix' lines.",
  "required": true
}
```

```task
{
  "id": "web-10-t1",
  "prompt": "Write the **release note** for the new page (60 to 140 words): what's **better for customers**, how it was **checked for accessibility** (at least **two** methods), how **network problems** are handled, and anything **still to do**.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "The new pay-an-invoice page ...",
  "rules": [
    { "label": "Benefits for customers (live balance, phone, clear errors)", "pattern": "live|as (they|you) type|phone|mobile|clear" },
    { "label": "At least two accessibility checks", "pattern": "keyboard|screen reader|nvda|voiceover|lighthouse|zoom", "min": 2 },
    { "label": "Network handling", "pattern": "network|connection|offline|retry|twice|duplicate" },
    { "label": "Still to do", "pattern": "still|next|to do|remaining|will" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 140 }
  ],
  "sample": "The new pay-an-invoice page works on any phone without zooming, shows what you'll owe as you type, and explains every problem in plain words next to the field. Totals are calculated in kobo exactly as our API does. We checked it with the keyboard alone, with NVDA and VoiceOver, at 320 pixels wide and at 200% zoom, and Lighthouse's accessibility audit found no issues. If the connection drops, the page says the payment wasn't recorded, and if a payment was actually recorded, a second attempt is recognised instead of looking like an error. Still to do: a 'Pay full balance' button and receipts by SMS, both planned for next month.",
  "note": "Naming the checks used is what makes 'accessible' a claim people can trust.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "When is a web page finished?",
    "options": ["When it looks right on your laptop", "When it passes checks for keyboard, screen readers, small screens, slow networks and its tests", "When the code compiles", "When the designer approves"],
    "answer": 1,
    "explanation": "Check how real people will use it."
  },
  {
    "prompt": "Which is a real accessibility check?",
    "options": ["Looking at it", "Using the page with only the keyboard", "Making it blue", "Removing labels"],
    "answer": 1,
    "explanation": "And screen readers, zoom and Lighthouse."
  },
  {
    "prompt": "Why record checks as data?",
    "options": ["It's required", "So the same checks are repeated and reported consistently after every change", "To hide failures", "To slow releases"],
    "answer": 1,
    "explanation": "Repeatable evidence."
  }
]
```
