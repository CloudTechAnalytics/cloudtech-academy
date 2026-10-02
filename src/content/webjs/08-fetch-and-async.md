---
title: Fetch and async code
minutes: 15
summary: Call an API from the page with fetch, async and await, handle every kind of response (success, 400, 409, 404 and network failure), and show loading and error states so customers always know what happened.
---

## The problem

The old page sent the payment and then showed either "Success" or nothing at all. If the network dropped on a weak mobile connection, the customer didn't know whether they'd paid, pressed again, and the second attempt was refused as a duplicate, which looked like an error. Talking to an API means planning for every outcome, including the request never arriving.

## The concept

**fetch, async and await**

```js norun
async function sendPayment(invoiceId, body) {
  const response = await fetch(`/invoices/${invoiceId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  // ...
}
```

`await` pauses the function until the response arrives, without freezing the page.

**fetch only throws on network failure**

A 400 or 409 response is still a **response**: `fetch` succeeds, and you must check `response.ok` or `response.status`. Only a lost connection makes `fetch` throw.

**Every outcome has a message**

| Outcome | What the customer sees |
| :-- | :-- |
| 201 | "Payment recorded", and the new balance from the server |
| 400 | the server's message, next to the form |
| 409 | "already recorded" or "more than you owe", explained |
| 404 | "This invoice link isn't valid" |
| network error | "We couldn't reach Tallybook. Your payment wasn't recorded. Check your connection and try again." |

**States**

Disable the button and show "Recording payment..." while waiting, so it can't be pressed twice.

## Example

To try this without a server, make a stand-in `fetch` that behaves like the Databases and APIs course's API: it returns real `Response` objects with the same status codes.

```js
let balanceKobo = 1783050;
const recorded = new Set();
let networkUp = true;

async function fakeFetch(url, options) {
  if (!networkUp) throw new TypeError("Failed to fetch");
  if (!url.startsWith("/invoices/INV-100832/")) return Response.json({ error: "No such invoice" }, { status: 404 });
  const { amount_kobo: amount, bank_reference: reference } = JSON.parse(options.body);
  if (!Number.isInteger(amount) || amount <= 0 || !reference) return Response.json({ error: "Send a positive amount_kobo and a bank_reference" }, { status: 400 });
  if (recorded.has(reference)) return Response.json({ error: "This bank_reference has already been recorded" }, { status: 409 });
  if (amount > balanceKobo) return Response.json({ error: `Payment exceeds the balance of ${balanceKobo} kobo` }, { status: 409 });
  recorded.add(reference);
  balanceKobo -= amount;
  return Response.json({ balance_kobo: balanceKobo }, { status: 201 });
}
```

Now the function the page uses. It turns every outcome into something to show:

```js
async function sendPayment(invoiceId, amountKobo, reference, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(`/invoices/${invoiceId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount_kobo: amountKobo, bank_reference: reference }),
    });
  } catch {
    return { ok: false, message: "We couldn't reach Tallybook. Your payment wasn't recorded. Check your connection and try again." };
  }
  const data = await response.json();
  if (response.status === 201) return { ok: true, message: `Payment recorded. You now owe ${data.balance_kobo} kobo.`, balanceKobo: data.balance_kobo };
  if (response.status === 404) return { ok: false, message: "This invoice link isn't valid. Please use the link in your latest email." };
  if (response.status === 409 && data.error.includes("already")) return { ok: false, message: "This transfer reference has already been recorded, so you don't need to submit it again." };
  return { ok: false, message: data.error };
}

const attempts = [
  ["INV-100832", 500000, "TRF-2026-0915-0042"],
  ["INV-100832", 500000, "TRF-2026-0915-0042"],
  ["INV-100832", 2000000, "TRF-2026-0915-0043"],
  ["INV-999999", 1000, "TRF-2026-0915-0044"],
];
for (const [invoice, amount, reference] of attempts) {
  const result = await sendPayment(invoice, amount, reference, fakeFetch);
  console.log(result.ok ? "OK  " : "FAIL", result.message);
}
networkUp = false;
console.log((await sendPayment("INV-100832", 1000, "TRF-2026-0915-0045", fakeFetch)).message);
```

```text
OK   Payment recorded. You now owe 1283050 kobo.
FAIL This transfer reference has already been recorded, so you don't need to submit it again.
FAIL Payment exceeds the balance of 1283050 kobo
FAIL This invoice link isn't valid. Please use the link in your latest email.
We couldn't reach Tallybook. Your payment wasn't recorded. Check your connection and try again.
```

The second attempt with the same reference is the weak-connection case from the problem: the first one did succeed, and the message now tells the customer so, instead of looking like a failure. On the real page, pass the browser's `fetch` (the default), disable the button before the `await`, and show `result.message` afterwards.

## Walkthrough

1. Run both blocks in your console. Then set `networkUp = true` and pay the remaining balance exactly.
2. Why does `sendPayment` take `fetchFn` as a parameter?
3. Add the loading state: write the three lines that disable the button, change its text, and restore both afterwards.
4. Handle one more outcome (the task below).

## Practice

```answer
{
  "id": "web-08-p1",
  "prompt": "After the attempts in the example, what is the invoice's balance in kobo?",
  "answer": 1283050,
  "format": "number",
  "jsVerify": "balanceKobo",
  "hint": "Only the first payment of 500,000 kobo was recorded.",
  "required": true
}
```

```task
{
  "id": "web-08-t1",
  "prompt": "The API may return **503** when it's being updated, with a `Retry-After` header in seconds. Write the lines to add to `sendPayment` that handle **503** with a message telling the customer their payment **wasn't recorded** and **when** to try again.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "if (response.status === 503) {\n  ...",
  "rules": [
    { "label": "Checks status 503", "pattern": "status\\s*===?\\s*503" },
    { "label": "Reads the Retry-After header", "pattern": "headers\\.get\\(\\s*[\"']retry-after[\"']\\s*\\)" },
    { "label": "Returns ok: false", "pattern": "ok\\s*:\\s*false" },
    { "label": "Says it wasn't recorded", "pattern": "wasn't recorded|was not recorded|not recorded" },
    { "label": "Says when to try again", "pattern": "try again" }
  ],
  "sample": "if (response.status === 503) {\n  const seconds = Number(response.headers.get(\"Retry-After\")) || 60;\n  const minutes = Math.ceil(seconds / 60);\n  return { ok: false, message: `Tallybook is being updated. Your payment wasn't recorded. Please try again in about ${minutes} minute${minutes === 1 ? \"\" : \"s\"}.` };\n}",
  "note": "Header names are case-insensitive, so get(\"Retry-After\") and get(\"retry-after\") both work.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The API returns 409. Does `await fetch(...)` throw?",
    "options": ["Yes", "No: it returns a response; check response.status", "Only in Firefox", "Only for POST"],
    "answer": 1,
    "explanation": "fetch only throws when the request can't be made."
  },
  {
    "prompt": "Why disable the Pay button while waiting for the response?",
    "options": ["It looks nicer", "So it can't be pressed twice and send two payments", "Browsers require it", "To save data"],
    "answer": 1,
    "explanation": "Clear states prevent double submissions."
  },
  {
    "prompt": "A network error happens before the server replies. What should the customer be told?",
    "options": ["Nothing", "That the payment wasn't recorded, and to check their connection and try again", "That it succeeded", "Error"],
    "answer": 1,
    "explanation": "Always say what happened to their money."
  }
]
```
