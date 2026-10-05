---
title: The DOM and events
minutes: 15
summary: Find elements with querySelector, react to typing and clicks with event listeners, and update the page live (the balance after a payment) while keeping the calculation in a plain, testable function.
---

## The problem

On the old page, customers typed an amount, pressed Pay, waited for a whole new page, and only then saw what they'd still owe. Many typed the full invoice total instead of the balance, and the payment was refused. The page should tell them, as they type, what their balance will be.

## The concept

### Finding elements

```js norun
const amount = document.querySelector("#amount");   // CSS selectors
const output = document.querySelector("#after-payment");
```

### Reading and changing them

`input.value` is what's typed (always text). `element.textContent = "..."` changes visible text safely. Avoid `innerHTML` with anything a user typed: it can run as HTML.

### Events

```js norun
amount.addEventListener("input", () => { /* runs on every keystroke */ });
form.addEventListener("submit", (event) => { event.preventDefault(); /* ... */ });
```

### Keep logic out of event handlers

Put the calculation in a plain function that takes values and returns a result. The event handler only reads the page, calls the function, and writes the result. The function can then be tested without a page (lesson 9).

### Announce changes

`aria-live="polite"` on an element makes screen readers read out its new text when it changes.

![Typing 2500 fires an input event; the handler reads input.value as text, calls balanceAfter(1000000, "2500") which returns remainingKobo 750000, and writes the result with textContent; aria-live announces it; textContent is safe, innerHTML with user input is not](/images/courses/webjs/dom-events.svg "The handler reads and writes the page; a plain function does the calculation.")

## Example

First the plain function: given what's due and what was typed, describe the balance after paying.

```js
function balanceAfter(dueKobo, typed) {
  const cleaned = typed.replace(/[₦,\s]/g, "");
  if (cleaned === "") return { ok: false, message: "" };
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { ok: false, message: "Enter an amount like 5000 or 5000.50" };
  const [naira, kobo = ""] = cleaned.split(".");
  const amountKobo = Number(naira) * 100 + Number(kobo.padEnd(2, "0"));
  if (amountKobo === 0) return { ok: false, message: "Enter an amount above zero" };
  if (amountKobo > dueKobo) return { ok: false, message: "That's more than you owe" };
  return { ok: true, amountKobo, remainingKobo: dueKobo - amountKobo };
}

for (const typed of ["5000", "₦17,830.50", "17830.51", "50.5", "abc", "0"]) {
  console.log(JSON.stringify(typed), "->", JSON.stringify(balanceAfter(1783050, typed)));
}
```

```text
"5000" -> {"ok":true,"amountKobo":500000,"remainingKobo":1283050}
"₦17,830.50" -> {"ok":true,"amountKobo":1783050,"remainingKobo":0}
"17830.51" -> {"ok":false,"message":"That's more than you owe"}
"50.5" -> {"ok":true,"amountKobo":5050,"remainingKobo":1778000}
"abc" -> {"ok":false,"message":"Enter an amount like 5000 or 5000.50"}
"0" -> {"ok":false,"message":"Enter an amount above zero"}
```

The amount is turned into kobo by splitting at the decimal point, never through a float. Now wire it to the page from lesson 4. Add this inside `<main>`, after the form, then the script before `</body>`:

```html
<p id="after-payment" aria-live="polite"></p>

<script>
  const DUE_KOBO = 1783050;
  const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });
  const amountInput = document.querySelector("#amount");
  const afterPayment = document.querySelector("#after-payment");

  // balanceAfter() from the example goes here, unchanged.

  amountInput.addEventListener("input", () => {
    const result = balanceAfter(DUE_KOBO, amountInput.value);
    afterPayment.textContent = result.ok
      ? `After this payment you'll owe ${naira.format(result.remainingKobo / 100)}`
      : result.message;
  });
</script>
```

Type `5000` and the line under the form reads "After this payment you'll owe ₦12,830.50"; type the full balance and it reads "After this payment you'll owe ₦0.00"; type one kobo too much and it says "That's more than you owe", before anything is sent.

## Walkthrough

1. Add the code to `pay.html` and try the amounts from the example.
2. Disable the Pay button while the amount isn't valid (`button.disabled = !result.ok`).
3. Why does the handler use `textContent` rather than `innerHTML`?
4. Write a handler for a "Pay full balance" button (the task below).

## Practice

```answer
{
  "id": "web-06-p1",
  "prompt": "What is `remainingKobo` after typing **\"5000\"** against a balance of 1,783,050 kobo?",
  "answer": 1283050,
  "format": "number",
  "jsVerify": "balanceAfter(1783050, '5000').remainingKobo",
  "hint": "5000 naira is 500,000 kobo.",
  "required": true
}
```

```task
{
  "id": "web-06-t1",
  "prompt": "Write JavaScript for a **\"Pay full balance\"** button (id `pay-all`): when **clicked**, it fills the amount input with the full balance in naira (like \"17830.50\") and **updates the message** the same way typing does.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "document.querySelector(\"#pay-all\").addEventListener(...",
  "rules": [
    { "label": "Selects the pay-all button", "pattern": "querySelector\\(\\s*[\"']#pay-all[\"']\\s*\\)|getElementById\\(\\s*[\"']pay-all[\"']\\s*\\)" },
    { "label": "Listens for click", "pattern": "addEventListener\\(\\s*[\"']click[\"']" },
    { "label": "Sets the input's value", "pattern": "\\.value\\s*=" },
    { "label": "Formats kobo as naira with two decimals", "pattern": "padStart\\(\\s*2|toFixed\\(\\s*2\\s*\\)|% ?100" },
    { "label": "Updates the message (dispatches input or calls the same code)", "pattern": "dispatchEvent|balanceAfter\\(" }
  ],
  "sample": "document.querySelector(\"#pay-all\").addEventListener(\"click\", () => {\n  const naira = Math.floor(DUE_KOBO / 100);\n  const kobo = String(DUE_KOBO % 100).padStart(2, \"0\");\n  amountInput.value = `${naira}.${kobo}`;\n  amountInput.dispatchEvent(new Event(\"input\"));\n});",
  "note": "Dispatching an input event reuses the existing handler, so the message logic lives in one place.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What type is `input.value` always?",
    "options": ["A number", "A string (text)", "An object", "It depends on the input type"],
    "answer": 1,
    "explanation": "Convert deliberately."
  },
  {
    "prompt": "Why keep the calculation in a separate function from the event handler?",
    "options": ["It's faster", "So it can be tested without a page, and reused", "Browsers require it", "To use less memory"],
    "answer": 1,
    "explanation": "Handlers read and write the page; functions decide."
  },
  {
    "prompt": "What does aria-live=\"polite\" do?",
    "options": ["Styles the text", "Makes screen readers announce the element's text when it changes", "Validates input", "Slows updates"],
    "answer": 1,
    "explanation": "Live updates for everyone."
  }
]
```
