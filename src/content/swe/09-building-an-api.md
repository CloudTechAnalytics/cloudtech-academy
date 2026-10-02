---
title: Building an API
minutes: 15
summary: Expose the invoice rules as a small web API with Flask, validate requests and return clear errors with the right status codes, and test the API without running a server.
---

## The problem

Tallybook's mobile app, website and month-end job each had their own copy of the invoice calculation, which is how totals came to disagree. The fix is one service that every client asks: an **API**. The invoice rules from this course live behind it, once, tested.

## The concept

**A web API**

Clients send HTTP requests (lesson 8 of the Linux course) with JSON bodies; the API returns JSON responses with a status code.

| Status | Meaning |
| :-- | :-- |
| 200 | OK |
| 400 | the request was invalid (and the body says why) |
| 404 | no such resource |
| 500 | the server failed (should never be caused by bad input) |

**Flask**

A small Python web framework: decorate a function with a route, read the request, return a response.

**Validate, then calculate**

The API checks every request (lesson 6) and returns **400 with a clear message** for bad input. A traceback or a 500 for bad input is a bug.

**Test without a server**

Flask's **test client** sends requests to the app directly, so API tests run as fast as any other test.

## Example

The API, using the invoice rules from lesson 3:

```python
from decimal import Decimal, ROUND_HALF_UP

from flask import Flask, jsonify, request

VAT_RATE = Decimal("0.075")
MAX_DISCOUNT_PCT = 20

def round_kobo(amount):
    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))

def invoice_total(lines, discount_pct=0, vat_exempt=False):
    if not 0 <= discount_pct <= MAX_DISCOUNT_PCT:
        raise ValueError(f"discount_pct must be between 0 and {MAX_DISCOUNT_PCT}, got {discount_pct}")
    subtotal = sum(quantity * unit_price for quantity, unit_price in lines)
    after_discount = subtotal - round_kobo(Decimal(subtotal) * discount_pct / 100)
    vat = 0 if vat_exempt else round_kobo(after_discount * VAT_RATE)
    return after_discount + vat

app = Flask(__name__)

@app.post("/invoices/total")
def total():
    body = request.get_json(silent=True)
    if not isinstance(body, dict) or not isinstance(body.get("lines"), list) or not body["lines"]:
        return jsonify(error="Send JSON with a non-empty 'lines' list"), 400
    try:
        lines = [(int(line["quantity"]), int(line["unit_price_kobo"])) for line in body["lines"]]
    except (KeyError, TypeError, ValueError):
        return jsonify(error="Each line needs whole-number 'quantity' and 'unit_price_kobo'"), 400
    if any(quantity <= 0 or price < 0 for quantity, price in lines):
        return jsonify(error="Quantities must be positive and prices can't be negative"), 400
    try:
        kobo = invoice_total(lines, int(body.get("discount_pct", 0)), bool(body.get("vat_exempt", False)))
    except ValueError as error:
        return jsonify(error=str(error)), 400
    return jsonify(total_kobo=kobo, total_naira=f"{kobo / 100:,.2f}")

client = app.test_client()
response = client.post("/invoices/total", json={"lines": [{"quantity": 2, "unit_price_kobo": 100_000}], "discount_pct": 10})
print(response.status_code, response.get_json())
```

```text
200 {'total_kobo': 193500, 'total_naira': '1,935.00'}
```

The same answer as the tests in lesson 3. Now the requests that should be refused, each with the status and message a client would get:

```python
bad_requests = {
    "no body": None,
    "empty lines": {"lines": []},
    "missing price": {"lines": [{"quantity": 1}]},
    "negative quantity": {"lines": [{"quantity": -2, "unit_price_kobo": 500}]},
    "discount too high": {"lines": [{"quantity": 1, "unit_price_kobo": 500}], "discount_pct": 25},
}
for name, body in bad_requests.items():
    r = client.post("/invoices/total", json=body) if body is not None else client.post("/invoices/total", data="not json")
    print(f"{name:18} {r.status_code}  {r.get_json()['error']}")
```

```text
no body            400  Send JSON with a non-empty 'lines' list
empty lines        400  Send JSON with a non-empty 'lines' list
missing price      400  Each line needs whole-number 'quantity' and 'unit_price_kobo'
negative quantity  400  Quantities must be positive and prices can't be negative
discount too high  400  discount_pct must be between 0 and 20, got 25
```

Every bad request gets a 400 and a message the client can act on. None reaches the calculation with bad data, and none causes a 500.

## Walkthrough

1. Run the cells. Send a request with `"quantity": "two"`. What comes back?
2. Write the same checks as pytest tests, one per bad request.
3. Add a `GET /health` route that returns `{"status": "ok"}`, and test it.
4. Run the app for real in Colab with `app.run(port=5000)` in a background thread, and call it with `requests` (optional).

## Practice

```answer
{
  "id": "swe-09-p1",
  "prompt": "What `total_kobo` does the API return for **3 × 250,000 kobo** with a **5% discount**, VAT payable?",
  "answer": 765938,
  "format": "number",
  "pyVerify": "client.post('/invoices/total', json={'lines': [{'quantity': 3, 'unit_price_kobo': 250_000}], 'discount_pct': 5}).get_json()['total_kobo']",
  "hint": "Call the API with those values, or work it out: 750,000 less 5%, plus 7.5%.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A client sends a negative quantity. What should the API return?",
    "options": ["500", "400 with a message saying quantities must be positive", "200 with a total", "Nothing"],
    "answer": 1,
    "explanation": "Bad input is the client's to fix; say how."
  },
  {
    "prompt": "Why put the invoice rules behind one API?",
    "options": ["APIs are faster", "So every client uses the same tested calculation and totals can't disagree", "To use Flask", "To hide the code"],
    "answer": 1,
    "explanation": "One source of truth."
  },
  {
    "prompt": "What does Flask's test client let you do?",
    "options": ["Deploy the app", "Send requests to the app in tests without running a server", "Write HTML", "Encrypt data"],
    "answer": 1,
    "explanation": "Fast, reliable API tests."
  }
]
```
