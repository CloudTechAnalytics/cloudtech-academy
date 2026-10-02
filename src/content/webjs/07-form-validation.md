---
title: Form validation
minutes: 25
summary: Validate a form in the browser so people get fast, clear, accessible error messages, and understand why the server must validate everything again anyway.
---

## The problem

The payment form must stop obvious mistakes before they're sent: an empty reference, an amount with letters, more than what's owed. But the old page only showed a red border with no text, so screen reader users never knew what was wrong, and some customers gave up.

There's a second lesson hiding here: browser validation is for **people**, not for **security**. Anyone can send a request to the API without using the page at all.

## The concept

**Validate in two places**

| Where | Purpose |
| :-- | :-- |
| Browser | fast, friendly feedback while people type or submit |
| Server (the API) | the real rules, for every request, from any client |

The API from the Databases and APIs course already refuses bad payments with 400 and 409. The page's checks are a courtesy on top.

**Good error messages**

- Say what's wrong and how to fix it ("Enter the reference from your bank transfer"), not just "Invalid".
- Show them next to the field, and link them with `aria-describedby`, so they're announced.
- Mark the field with `aria-invalid="true"`, and move focus to the first field with an error on submit.
- Don't rely on colour alone.

**Built-in or custom**

HTML attributes (`required`, `type="email"`, `pattern`) give basic checks for free. For messages you control, add `novalidate` to the form and validate in JavaScript.

## Example

The validation as a plain function that returns every problem, keyed by field:

```js
function validatePayment({ amount, reference }, dueKobo) {
  const errors = {};
  const cleaned = amount.replace(/[₦,\s]/g, "");
  if (cleaned === "") {
    errors.amount = "Enter how much you're paying";
  } else if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    errors.amount = "Enter an amount in naira, like 5000 or 5000.50";
  } else {
    const [naira, kobo = ""] = cleaned.split(".");
    const amountKobo = Number(naira) * 100 + Number(kobo.padEnd(2, "0"));
    if (amountKobo === 0) errors.amount = "Enter an amount above zero";
    else if (amountKobo > dueKobo) errors.amount = "That's more than you owe on this invoice";
  }
  const ref = reference.trim();
  if (ref === "") errors.reference = "Enter the reference from your bank transfer";
  else if (!/^[A-Za-z0-9-]{6,30}$/.test(ref)) errors.reference = "References are 6 to 30 letters, numbers or dashes";
  return errors;
}

const cases = [
  { amount: "", reference: "" },
  { amount: "5,000", reference: "TRF-2026-0915-0042" },
  { amount: "20000", reference: "abc" },
  { amount: "5000.555", reference: "TRF-2026-0915-0042" },
];
for (const c of cases) console.log(JSON.stringify(c), "->", JSON.stringify(validatePayment(c, 1783050)));
```

```text
{"amount":"","reference":""} -> {"amount":"Enter how much you're paying","reference":"Enter the reference from your bank transfer"}
{"amount":"5,000","reference":"TRF-2026-0915-0042"} -> {}
{"amount":"20000","reference":"abc"} -> {"amount":"That's more than you owe on this invoice","reference":"References are 6 to 30 letters, numbers or dashes"}
{"amount":"5000.555","reference":"TRF-2026-0915-0042"} -> {"amount":"Enter an amount in naira, like 5000 or 5000.50"}
```

An empty object means valid. Now show the errors accessibly. On the page from lesson 6, add `novalidate` to the `<form>` and an empty error paragraph after each input (`<p id="amount-error" class="error"></p>` and `<p id="reference-error" class="error"></p>`), then:

```html
<script>
  // validatePayment() from the example goes here, unchanged.
  const form = document.querySelector("#payment-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = { amount: form.amount.value, reference: form.reference.value };
    const errors = validatePayment(values, DUE_KOBO);
    for (const field of ["amount", "reference"]) {
      const input = form[field];
      const message = document.querySelector(`#${field}-error`);
      message.textContent = errors[field] ?? "";
      input.setAttribute("aria-invalid", errors[field] ? "true" : "false");
      input.setAttribute("aria-describedby", errors[field] ? `${field}-error` : `${field}-hint`);
    }
    const firstError = ["amount", "reference"].find((field) => errors[field]);
    if (firstError) form[firstError].focus();
    else sendPayment(values);   // lesson 8
  });
</script>
```

Submit the empty form: both messages appear under their fields in words, the fields are marked invalid, focus moves to the amount, and a screen reader reads the amount's error.

## Walkthrough

1. Run the example in your console with a case of your own.
2. Add the script to `pay.html` and submit with each kind of mistake.
3. Bypass the page: in the console, call the API (lesson 8) with a negative amount. What protects Tallybook now?
4. Write a validation rule for a new field (the task below).

## Practice

```answer
{
  "id": "web-07-p1",
  "prompt": "How many error messages does `validatePayment({ amount: \"20000\", reference: \"abc\" }, 1783050)` return?",
  "answer": 2,
  "format": "number",
  "jsVerify": "Object.keys(validatePayment({ amount: '20000', reference: 'abc' }, 1783050)).length",
  "hint": "₦20,000 is more than ₦17,830.50, and 'abc' is too short.",
  "required": true
}
```

```task
{
  "id": "web-07-t1",
  "prompt": "Add a **phone number** field for a payment receipt by SMS. Write the JavaScript lines for `validatePayment` that check `phone`: optional, but if given it must be a Nigerian mobile number, **11 digits starting with 0** (spaces allowed), with a **clear message**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "const phone = (values.phone ?? \"\").replace(...)",
  "rules": [
    { "label": "Removes spaces", "pattern": "replace\\([^)]*\\\\s" },
    { "label": "Optional: skips the check when empty", "pattern": "!==\\s*[\"']{2}|\\.length\\s*>\\s*0|if\\s*\\(\\s*phone\\s*&&|if\\s*\\(\\s*phone\\s*\\)" },
    { "label": "Checks 11 digits starting with 0", "pattern": "\\^0\\\\d\\{10\\}\\$|\\^0\\[0-9\\]\\{10\\}\\$" },
    { "label": "Sets errors.phone with a helpful message", "pattern": "errors\\.phone\\s*=\\s*[\"'`][^\"'`]{15,}" }
  ],
  "sample": "const phone = (values.phone ?? \"\").replace(/\\s/g, \"\");\nif (phone !== \"\" && !/^0\\d{10}$/.test(phone)) {\n  errors.phone = \"Enter an 11-digit mobile number starting with 0, like 0803 123 4567\";\n}",
  "note": "The example in the message shows the format, which helps more than describing it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The page validates the amount. Does the API still need to?",
    "options": ["No", "Yes: anyone can send requests without the page", "Only for large amounts", "Only on weekends"],
    "answer": 1,
    "explanation": "Browser checks are for people; server checks are the rules."
  },
  {
    "prompt": "Which error message is most helpful?",
    "options": ["Invalid", "Error 400", "Enter the reference from your bank transfer", "Red border only"],
    "answer": 2,
    "explanation": "Say what to do."
  },
  {
    "prompt": "How do you make an error message announced by screen readers with its field?",
    "options": ["Make it red", "Link it with aria-describedby and set aria-invalid", "Use a tooltip", "Use an alert box"],
    "answer": 1,
    "explanation": "Connect message and field in the markup."
  }
]
```
