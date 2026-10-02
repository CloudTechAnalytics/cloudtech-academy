---
title: "Final project: Tallybook's invoicing database and API"
minutes: 20
summary: Plan your final project, a migrated, constrained database and a tested REST API for invoices and payments, with every rule enforced in the database and every endpoint tested.
---

## The problem

Tallybook is ready to retire its CSV exports. Your final project is the replacement: a database with a schema built by migrations and protected by constraints, loaded from the export with every refused row explained, and a REST API for customers, invoices and payments, tested with fresh databases.

## The concept

**What the project contains**

| Part | Built in |
| :-- | :-- |
| Schema with keys and named constraints, as migrations | lessons 2, 3 and 7 |
| A loader that reports every refused row | lesson 3 |
| Parameterised queries for balances and lists | lesson 4 |
| A transactional, idempotent payment import | lesson 5 |
| Indexes justified by query plans | lesson 6 |
| The REST API with clear status codes and pagination | lesson 8 |
| Tests with fixtures for every endpoint and rule | lesson 9 |

**Prove it reconciles**

The API's balances must agree with a direct SQL calculation for every invoice, and every row of the export must be either loaded or refused with a reason.

## Example

A reconciliation in SQL alone: total invoiced, paid and outstanding across all loaded invoices, from the same rules the API uses.

```python
import sqlite3
from decimal import Decimal, ROUND_HALF_UP

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
customers = pd.read_csv(base + "customers.csv")
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False).drop_duplicates()
lines = pd.read_csv(base + "invoice_lines.csv", dtype={"unit_price": str})

def kobo(naira):
    return int((Decimal(naira.replace("₦", "").replace(",", "")) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

bad = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])
clean = raw[raw["customer_id"].isin(set(customers["customer_id"])) & raw["issue_date"].str.match(r"^\d{4}-\d{2}-\d{2}$")
            & (raw["discount_pct"].astype(int) <= 20) & (raw["due_date"] >= raw["issue_date"]) & ~raw["invoice_id"].isin(bad)]

db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE customers (customer_id TEXT PRIMARY KEY, vat_exempt INTEGER);
CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, customer_id TEXT, discount_pct INTEGER, paid_kobo INTEGER);
CREATE TABLE invoice_lines (invoice_id TEXT, quantity INTEGER, unit_price_kobo INTEGER);
""")
db.executemany("INSERT INTO customers VALUES (?, ?)", customers[["customer_id", "vat_exempt"]].itertuples(index=False))
db.executemany("INSERT INTO invoices VALUES (?, ?, ?, ?)", [(r.invoice_id, r.customer_id, int(r.discount_pct), kobo(r.amount_paid)) for r in clean.itertuples()])
db.executemany("INSERT INTO invoice_lines VALUES (?, ?, ?)", [(r.invoice_id, r.quantity, kobo(r.unit_price)) for r in lines[lines["invoice_id"].isin(clean["invoice_id"])].itertuples()])

rows = db.execute("""
    SELECT i.invoice_id, i.discount_pct, c.vat_exempt, i.paid_kobo, SUM(l.quantity * l.unit_price_kobo) AS subtotal
    FROM invoices i JOIN customers c USING (customer_id) JOIN invoice_lines l USING (invoice_id)
    GROUP BY i.invoice_id
""").fetchall()

def rk(x):
    return int(Decimal(x).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

invoiced = paid = 0
for invoice_id, discount, exempt, paid_kobo, subtotal in rows:
    after = subtotal - rk(Decimal(subtotal) * discount / 100)
    invoiced += after + (0 if exempt else rk(after * Decimal("0.075")))
    paid += paid_kobo
print(f"Invoices: {len(rows)}")
print(f"Invoiced:    ₦{invoiced / 100:,.2f}")
print(f"Paid:        ₦{paid / 100:,.2f}")
print(f"Outstanding: ₦{(invoiced - paid) / 100:,.2f}")
```

```text
Invoices: 1133
Invoiced:    ₦138,718,871.36
Paid:        ₦104,078,481.37
Outstanding: ₦34,640,389.99
```

Your API's balances, summed over every invoice, must give exactly the outstanding figure. If they don't, one of the two has a bug, and your tests should find which.

## Walkthrough

1. Build the migrations, loader, API and tests.
2. Reconcile the API's balances with the SQL figures above.
3. Write the README: how to run the migrations, the loader, the API and the tests.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "dba-10-p1",
  "prompt": "How many invoices are in the reconciliation?",
  "answer": 1133,
  "format": "number",
  "dataset": "invoicing",
  "files": ["customers", "invoices_raw", "invoice_lines"],
  "pyVerify": "len(rows)",
  "hint": "The Invoices line.",
  "required": true
}
```

```task
{
  "id": "dba-10-t1",
  "prompt": "Write the **README section** for your project (60 to 150 words): what the service does, how to **run the migrations**, how to **load** the export (and where refused rows go), how to **start** the API, and how to **run the tests**.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "## Tallybook invoicing service ...",
  "rules": [
    { "label": "Migrations", "pattern": "migrat" },
    { "label": "Loading and refused rows", "pattern": "(load|import)[\\s\\S]*(refused|rejected|report)" },
    { "label": "Starting the API", "pattern": "flask|api|server|run" },
    { "label": "Running the tests", "pattern": "pytest|test" },
    { "label": "A command in backticks", "pattern": "`[^`]+`", "min": 2 },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "## Tallybook invoicing service\n\nA SQLite database and Flask API for customers, invoices and payments, replacing the CSV exports.\n\n1. Create or update the database: `python migrate.py tallybook.db`. It applies any pending migrations and does nothing if the database is current.\n2. Load an export: `python load.py tallybook.db invoices_raw.csv`. Every refused row is written to `refused.csv` with the constraint it broke, for the finance team to review.\n3. Start the API: `flask --app api run`. Endpoints are listed in `API.md`.\n4. Run the tests: `python -m pytest`. Each test uses its own in-memory database, so they can run in any order.",
  "note": "A README someone can follow without asking you a question is part of the software.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "How do you know the API's balances are right?",
    "options": ["It doesn't crash", "They reconcile exactly with an independent SQL calculation, and tests cover each rule", "They look plausible", "The client is happy"],
    "answer": 1,
    "explanation": "Two independent routes to the same number."
  },
  {
    "prompt": "Where should 'discount at most 20%' be enforced?",
    "options": ["Only in the API", "In the database as a constraint, and in the API for a friendly message", "Only in the client", "Nowhere"],
    "answer": 1,
    "explanation": "Constraint for safety, validation for clarity."
  },
  {
    "prompt": "What makes the payment import safe to re-run?",
    "options": ["Running it at night", "A transaction per batch and a unique bank reference per payment", "Deleting payments first", "A bigger database"],
    "answer": 1,
    "explanation": "Atomic and idempotent."
  }
]
```
