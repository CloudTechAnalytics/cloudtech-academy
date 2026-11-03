---
title: REST API design
minutes: 25
summary: Design an API around resources (customers, invoices, payments), choose routes, methods and status codes that clients can rely on, paginate lists, and build it in Flask on the database.
---

## The problem

Tallybook's mobile app needs to show a customer's invoices and let staff record a payment. The first draft API had routes like `/getInvoicesForCustomer?id=C0001` and `/doPayment`, returned 200 for everything (with `"error"` hidden in the body), and sent every invoice a customer had ever had in one response.

Clients write code against an API's shape. A consistent, predictable design saves every client developer time and bugs.

## The concept

### Resources and methods

Routes name **things**; HTTP methods say what to do with them:

| Method and route | Meaning |
| :-- | :-- |
| `GET /customers/C0001` | one customer |
| `GET /customers/C0001/invoices` | that customer's invoices (a list) |
| `GET /invoices/INV-100001` | one invoice, with its lines and balance |
| `POST /invoices/INV-100001/payments` | record a new payment on that invoice |

### Status codes that mean something

| Code | When |
| :-- | :-- |
| 200 OK | a successful read |
| 201 Created | something was created; a `Location` header says where |
| 400 Bad Request | the request itself is invalid |
| 404 Not Found | no such resource |
| 409 Conflict | valid, but clashes with the current state (a payment larger than what's owed, a reused reference) |

### Pagination

Lists take `limit` and `offset` (with a sensible maximum), and say how many there are in total, so clients can page through.

![GET and POST routes with their status codes, error codes 400, 404 and 409, and pagination: of 23 items, limit 10 and offset 10 return items 11 to 20, with the total in the response](/images/courses/dbapi/rest.svg "Routes for things, methods for actions, meaningful status codes, and pagination.")

## Example

The API on a database built from the invoicing data, with the invoice rules from the Software Engineering course:

```python
import sqlite3
from decimal import Decimal, ROUND_HALF_UP

import pandas as pd
from flask import Flask, jsonify, request

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
customers = pd.read_csv(base + "customers.csv")
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False).drop_duplicates()
lines = pd.read_csv(base + "invoice_lines.csv", dtype={"unit_price": str})

def kobo(naira):
    return int((Decimal(naira.replace("₦", "").replace(",", "")) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

def round_kobo(amount):
    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))

def invoice_total(line_rows, discount_pct, vat_exempt):
    subtotal = sum(q * p for q, p in line_rows)
    after = subtotal - round_kobo(Decimal(subtotal) * discount_pct / 100)
    return after + (0 if vat_exempt else round_kobo(after * Decimal("0.075")))

bad = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])
clean = raw[raw["customer_id"].isin(set(customers["customer_id"])) & raw["issue_date"].str.match(r"^\d{4}-\d{2}-\d{2}$")
            & (raw["discount_pct"].astype(int) <= 20) & (raw["due_date"] >= raw["issue_date"]) & ~raw["invoice_id"].isin(bad)]

db = sqlite3.connect(":memory:", check_same_thread=False)
db.row_factory = sqlite3.Row
db.executescript("""
CREATE TABLE customers (customer_id TEXT PRIMARY KEY, business_name TEXT, city TEXT, vat_exempt INTEGER, payment_terms_days INTEGER);
CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, customer_id TEXT REFERENCES customers, issue_date TEXT, due_date TEXT, discount_pct INTEGER);
CREATE TABLE invoice_lines (invoice_id TEXT, line_no INTEGER, description TEXT, quantity INTEGER, unit_price_kobo INTEGER, PRIMARY KEY (invoice_id, line_no));
CREATE TABLE payments (bank_reference TEXT PRIMARY KEY, invoice_id TEXT REFERENCES invoices, amount_kobo INTEGER CHECK (amount_kobo > 0));
CREATE INDEX idx_invoices_customer_date ON invoices (customer_id, issue_date);
""")
with db:
    db.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?)", customers.itertuples(index=False))
    db.executemany("INSERT INTO invoices VALUES (?, ?, ?, ?, ?)", clean[["invoice_id", "customer_id", "issue_date", "due_date", "discount_pct"]].itertuples(index=False))
    db.executemany("INSERT INTO invoice_lines VALUES (?, ?, ?, ?, ?)",
                   [(r.invoice_id, r.line_no, r.description, r.quantity, kobo(r.unit_price)) for r in lines[lines["invoice_id"].isin(clean["invoice_id"])].itertuples()])
    db.executemany("INSERT INTO payments VALUES (?, ?, ?)",
                   [(f"EXPORT-{r.invoice_id}", r.invoice_id, kobo(r.amount_paid)) for r in clean.itertuples() if kobo(r.amount_paid) > 0])

def invoice_summary(invoice_id):
    inv = db.execute("SELECT i.*, c.vat_exempt FROM invoices i JOIN customers c USING (customer_id) WHERE invoice_id = ?", (invoice_id,)).fetchone()
    if inv is None:
        return None
    rows = db.execute("SELECT line_no, description, quantity, unit_price_kobo FROM invoice_lines WHERE invoice_id = ? ORDER BY line_no", (invoice_id,)).fetchall()
    total = invoice_total([(r["quantity"], r["unit_price_kobo"]) for r in rows], inv["discount_pct"], inv["vat_exempt"])
    paid = db.execute("SELECT COALESCE(SUM(amount_kobo), 0) FROM payments WHERE invoice_id = ?", (invoice_id,)).fetchone()[0]
    return {"invoice_id": invoice_id, "customer_id": inv["customer_id"], "due_date": inv["due_date"],
            "lines": [dict(r) for r in rows], "total_kobo": total, "paid_kobo": paid, "balance_kobo": total - paid}

app = Flask(__name__)

@app.get("/customers/<customer_id>/invoices")
def customer_invoices(customer_id):
    if db.execute("SELECT 1 FROM customers WHERE customer_id = ?", (customer_id,)).fetchone() is None:
        return jsonify(error="No such customer"), 404
    limit = min(int(request.args.get("limit", 10)), 50)
    offset = int(request.args.get("offset", 0))
    count = db.execute("SELECT COUNT(*) FROM invoices WHERE customer_id = ?", (customer_id,)).fetchone()[0]
    rows = db.execute("SELECT invoice_id, issue_date, due_date FROM invoices WHERE customer_id = ? ORDER BY issue_date DESC LIMIT ? OFFSET ?",
                      (customer_id, limit, offset)).fetchall()
    return jsonify(total=count, limit=limit, offset=offset, invoices=[dict(r) for r in rows])

@app.get("/invoices/<invoice_id>")
def get_invoice(invoice_id):
    summary = invoice_summary(invoice_id)
    return (jsonify(summary), 200) if summary else (jsonify(error="No such invoice"), 404)

@app.post("/invoices/<invoice_id>/payments")
def add_payment(invoice_id):
    summary = invoice_summary(invoice_id)
    if summary is None:
        return jsonify(error="No such invoice"), 404
    body = request.get_json(silent=True) or {}
    amount, reference = body.get("amount_kobo"), body.get("bank_reference")
    if not isinstance(amount, int) or amount <= 0 or not reference:
        return jsonify(error="Send a positive whole-number amount_kobo and a bank_reference"), 400
    if amount > summary["balance_kobo"]:
        return jsonify(error=f"Payment exceeds the balance of {summary['balance_kobo']} kobo"), 409
    try:
        with db:
            db.execute("INSERT INTO payments VALUES (?, ?, ?)", (reference, invoice_id, amount))
    except sqlite3.IntegrityError:
        return jsonify(error="This bank_reference has already been recorded"), 409
    return jsonify(invoice_summary(invoice_id)), 201, {"Location": f"/invoices/{invoice_id}"}

client = app.test_client()
r = client.get("/customers/C0145/invoices?limit=3")
print(r.status_code, {k: r.get_json()[k] for k in ("total", "limit", "offset")}, [i["invoice_id"] for i in r.get_json()["invoices"]])
```

```text
200 {'total': 4, 'limit': 3, 'offset': 0} ['INV-100357', 'INV-100760', 'INV-100832']
```

Now a payment's journey: read an unpaid invoice, pay part of it, then try the mistakes a client might make:

```python
unpaid = db.execute("""SELECT i.invoice_id FROM invoices i LEFT JOIN payments p USING (invoice_id)
                       WHERE p.invoice_id IS NULL ORDER BY i.invoice_id LIMIT 1""").fetchone()[0]
before = client.get(f"/invoices/{unpaid}").get_json()
print("Before:", before["total_kobo"], "total,", before["balance_kobo"], "balance")

steps = [
    ("pay 100,000 kobo", {"amount_kobo": 100_000, "bank_reference": "BNK-9001"}),
    ("same reference again", {"amount_kobo": 100_000, "bank_reference": "BNK-9001"}),
    ("more than the balance", {"amount_kobo": before["total_kobo"], "bank_reference": "BNK-9002"}),
    ("no amount", {"bank_reference": "BNK-9003"}),
]
for name, body in steps:
    r = client.post(f"/invoices/{unpaid}/payments", json=body)
    detail = r.get_json().get("error") or f"balance now {r.get_json()['balance_kobo']}, Location {r.headers['Location']}"
    print(f"{name:22} {r.status_code}  {detail}")
print("Unknown invoice:", client.get("/invoices/INV-000000").status_code)
```

```text
Before: 3784484 total, 3784484 balance
pay 100,000 kobo       201  balance now 3684484, Location /invoices/INV-100001
same reference again   409  This bank_reference has already been recorded
more than the balance  409  Payment exceeds the balance of 3684484 kobo
no amount              400  Send a positive whole-number amount_kobo and a bank_reference
Unknown invoice: 404
```

Each outcome has its own status code, so a client can handle it without reading error text: 201 to show the new balance, 409 to tell the user it's already recorded or too much, 400 to fix the form, 404 for a wrong link.

## Walkthrough

1. Run the cells. Page through C0145's invoices with `offset=3`. What changes in the response?
2. Add `GET /customers/<id>` returning the customer and their total balance.
3. Why is a reused bank reference 409 and not 400?
4. Design the routes for credit notes (the task below).

## Practice

```answer
{
  "id": "dba-08-p1",
  "prompt": "How many invoices does the API say customer **C0145** has in total?",
  "answer": 4,
  "format": "number",
  "dataset": "invoicing",
  "files": ["customers", "invoices_raw", "invoice_lines"],
  "pyVerify": "client.get('/customers/C0145/invoices').get_json()['total']",
  "hint": "The total in the first output.",
  "required": true
}
```

```task
{
  "id": "dba-08-t1",
  "prompt": "Design the API for **credit notes**: one line per endpoint, giving the **method and route**, what it does, and its **status codes** (success and at least one error each). Include at least **three** endpoints.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "POST /invoices/{id}/credit-notes: ...",
  "rules": [
    { "label": "At least three endpoint lines", "pattern": "^\\s*[-*]?\\s*(GET|POST|PUT|PATCH|DELETE)\\s+/\\S+", "min": 3 },
    { "label": "A POST that creates, with 201", "pattern": "POST[^\\n]*201" },
    { "label": "A GET with 200", "pattern": "GET[^\\n]*200" },
    { "label": "404 for missing resources", "pattern": "404" },
    { "label": "400 or 409 for invalid requests or conflicts", "pattern": "400|409" },
    { "label": "Resource-style routes (no verbs like /create or /get)", "pattern": "/(create|get|do|make)[A-Z_-]", "absent": true }
  ],
  "sample": "POST /invoices/{id}/credit-notes: issue a credit note with amount_kobo and reason; 201 with a Location header, 400 if the amount or reason is missing, 404 if the invoice doesn't exist, 409 if the credit exceeds the invoice's balance.\nGET /invoices/{id}/credit-notes: list an invoice's credit notes; 200, 404 if the invoice doesn't exist.\nGET /credit-notes/{id}: one credit note; 200, 404 if it doesn't exist.",
  "note": "There's no DELETE: credit notes are financial records, so a mistake is corrected with another document, not erased.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which route is designed around resources?",
    "options": ["/getInvoices?customer=C0001", "GET /customers/C0001/invoices", "/doPayment", "/api?action=list"],
    "answer": 1,
    "explanation": "Nouns in routes, verbs as methods."
  },
  {
    "prompt": "A valid payment would make the invoice overpaid. Which status fits?",
    "options": ["200", "409 Conflict", "500", "201"],
    "answer": 1,
    "explanation": "The request is valid but clashes with the current state."
  },
  {
    "prompt": "Why paginate lists?",
    "options": ["To hide data", "So responses stay small and fast however much data a customer has", "HTTP requires it", "To slow clients"],
    "answer": 1,
    "explanation": "And say the total, so clients can page."
  }
]
```
