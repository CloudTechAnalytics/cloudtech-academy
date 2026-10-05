---
title: HTML and accessibility
minutes: 15
summary: Write semantic HTML for the payment page (landmarks, headings, a proper table and a labelled form) so it works for everyone, including people using screen readers or keyboards, and check it.
---

## The problem

Tallybook's old payment page was built from `<div>`s styled to look like a form. It looked fine. But a screen reader announced the amount box as just "edit text", the "Pay" button couldn't be reached with the keyboard, and the invoice table read out as a jumble of numbers. About 1 in 6 people live with some form of disability, and many more use phones in bright sun or with one hand.

Accessible HTML isn't extra work: it's using the right element for each job, which also makes pages easier to style, test and maintain.

## The concept

### Semantic elements

| Use | Instead of |
| :-- | :-- |
| `<header>`, `<main>`, `<nav>`, `<footer>` | anonymous `<div>`s |
| one `<h1>`, then `<h2>`, `<h3>` in order | bold text that looks like a heading |
| `<table>` with `<caption>` and `<th scope="col">` | a grid of `<div>`s for tabular data |
| `<button>` | a clickable `<div>` (no keyboard, no role) |
| `<label for="amount">` linked to `<input id="amount">` | placeholder text as the only label |

### Forms

Every input needs a visible **label**. Give inputs the right `type` and `inputmode` (phones show a number pad for `inputmode="decimal"`), and connect hints and errors with `aria-describedby`.

![A page outline with header, nav, main (h1, table with caption, form with label, input and button) and footer; beside it, an amount field whose label is linked by for and id and whose hint is linked by aria-describedby](/images/courses/webjs/semantic-html.svg "Semantic elements give the page structure that keyboards and screen readers can use.")

### Checking

Use the keyboard only (Tab, Shift+Tab, Enter, Space), zoom to 200%, and run the **Lighthouse** accessibility audit in Chrome's DevTools.

## Example

The payment page's structure. Save it as `pay.html` and open it in your browser:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pay invoice INV-100832 · Tallybook</title>
</head>
<body>
  <header>
    <p>Tallybook · Ada Stores</p>
  </header>
  <main>
    <h1>Pay invoice INV-100832</h1>

    <table>
      <caption>Invoice lines</caption>
      <thead>
        <tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Price</th></tr>
      </thead>
      <tbody>
        <tr><td>Bookkeeping, monthly</td><td>1</td><td>₦25,890.00</td></tr>
      </tbody>
    </table>

    <h2>Balance</h2>
    <p>Total ₦27,830.50 · paid ₦10,000.00 · <strong>due ₦17,830.50</strong></p>

    <h2>Make a payment</h2>
    <form id="payment-form">
      <label for="amount">Amount in naira</label>
      <input id="amount" name="amount" inputmode="decimal" autocomplete="off" aria-describedby="amount-hint" required>
      <p id="amount-hint">Up to ₦17,830.50</p>

      <label for="reference">Bank transfer reference</label>
      <input id="reference" name="reference" aria-describedby="reference-hint" required>
      <p id="reference-hint">From your bank's transfer confirmation</p>

      <button type="submit">Record payment</button>
    </form>
  </main>
</body>
</html>
```

Open it and press Tab: focus moves from the amount, to the reference, to the button, and Enter submits. Click the words "Amount in naira": the cursor jumps into the box, because the label is linked to the input. A screen reader would announce "Amount in naira, edit text, Up to ₦17,830.50". None of that needed any JavaScript or CSS.

## Walkthrough

1. Save and open the page. Navigate it with the keyboard only. Can you do everything?
2. Remove the `for="amount"` attribute and click the label again. What changed?
3. In Chrome DevTools, run Lighthouse with the Accessibility category. What score does it give, and what does it suggest?
4. Fix an inaccessible form (the task below).

## Practice

```task
{
  "id": "web-04-t1",
  "prompt": "This form is inaccessible: `<div class=\"field\">Email</div><input placeholder=\"Email\"><div class=\"btn\" onclick=\"send()\">Send receipt</div>`. Rewrite it as accessible HTML: a **form**, a **label linked** to an **email input**, and a real **button**.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "<form ...>",
  "rules": [
    { "label": "A form element", "pattern": "<form[\\s>]" },
    { "label": "A label with for=", "pattern": "<label[^>]*\\bfor=\"([\\w-]+)\"" },
    { "label": "An input with a matching id", "pattern": "<input[^>]*\\bid=\"[\\w-]+\"" },
    { "label": "type=\"email\"", "pattern": "<input[^>]*type=\"email\"" },
    { "label": "A real button", "pattern": "<button[^>]*>\\s*Send receipt\\s*</button>" },
    { "label": "No clickable div", "pattern": "<div[^>]*onclick", "absent": true }
  ],
  "sample": "<form id=\"receipt-form\">\n  <label for=\"receipt-email\">Email for your receipt</label>\n  <input id=\"receipt-email\" name=\"email\" type=\"email\" autocomplete=\"email\" required>\n  <button type=\"submit\">Send receipt</button>\n</form>",
  "note": "type=\"email\" also gives phone users an @ key, and autocomplete=\"email\" lets them fill it in one tap.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use `<button>` instead of a `<div>` with a click handler?",
    "options": ["It's prettier", "Buttons work with the keyboard and are announced as buttons by screen readers", "Divs are deprecated", "Buttons are faster"],
    "answer": 1,
    "explanation": "The right element brings behaviour for free."
  },
  {
    "prompt": "Why isn't placeholder text enough as a label?",
    "options": ["It's too small", "It disappears when typing starts and isn't reliably announced", "Browsers ignore it", "It's slow"],
    "answer": 1,
    "explanation": "Use a visible, linked label."
  },
  {
    "prompt": "What does `inputmode=\"decimal\"` do on a phone?",
    "options": ["Validates the number", "Shows a numeric keypad with a decimal point", "Rounds input", "Nothing"],
    "answer": 1,
    "explanation": "Small detail, big difference for mobile users."
  }
]
```
