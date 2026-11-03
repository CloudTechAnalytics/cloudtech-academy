---
title: Queries from code
minutes: 25
summary: Run SQL from Python safely with parameters instead of building query strings, turn query results into useful structures, and calculate invoice totals and balances with joins and aggregation.
---

## The problem

A Tallybook developer wrote a search box for customers by building the SQL with an f-string. It worked in testing. Then a real customer, "Chi's Bakery", searched for their own name, and the app crashed. Building SQL from text that users type is also the classic way attackers get into databases (SQL injection).

The fix is simple and universal: **never put values into SQL text; pass them as parameters**.

## The concept

### Parameters

```python norun
# Never:
conn.execute(f"SELECT * FROM customers WHERE business_name = '{name}'")
# Always:
conn.execute("SELECT * FROM customers WHERE business_name = ?", (name,))
```

With `?` placeholders, the database receives the SQL and the values separately. A value can contain any characters (apostrophes, quotes, SQL keywords) and is always treated as data.

![An f-string pastes the value into SQL, so Mama's Kitchen causes a syntax error and x' OR '1'='1 matches every row; a ? placeholder sends the SQL and the value separately, so the value is only ever data](/images/courses/dbapi/parameters.svg "f-strings paste values into SQL; placeholders keep them separate.")

### Results

`fetchone()` gets one row, `fetchall()` all of them. Setting `conn.row_factory = sqlite3.Row` lets you use column names: `row["business_name"]`.

### Let the database do the work

Joins and `GROUP BY` in SQL are usually faster and clearer than loading whole tables into Python and looping.

## Example

A fresh database with a customer whose name has an apostrophe:

```python
import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
conn.executescript("""
CREATE TABLE customers (customer_id TEXT PRIMARY KEY, business_name TEXT NOT NULL, city TEXT NOT NULL);
INSERT INTO customers VALUES ('C0001', 'Ada Stores', 'Lagos'), ('C0002', 'Chi''s Bakery', 'Enugu');
""")

name = "Chi's Bakery"
try:
    conn.execute(f"SELECT * FROM customers WHERE business_name = '{name}'").fetchall()
except sqlite3.OperationalError as error:
    print("f-string query failed:", error)

row = conn.execute("SELECT * FROM customers WHERE business_name = ?", (name,)).fetchone()
print("Parameter query found:", row["customer_id"], row["city"])
```

```text
f-string query failed: near "s": syntax error
Parameter query found: C0002 Enugu
```

The apostrophe ended the SQL string early. With a parameter, the name is just data. Now, on Tallybook's full data, calculate each invoice's subtotal, and each customer's invoiced and paid amounts, with joins:

```python
from decimal import Decimal, ROUND_HALF_UP

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
customers = pd.read_csv(base + "customers.csv")
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False).drop_duplicates()
lines = pd.read_csv(base + "invoice_lines.csv", dtype={"unit_price": str})

def to_kobo(naira):
    return int((Decimal(naira.replace("₦", "").replace(",", "")) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

known = set(customers["customer_id"])
bad = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])
clean = raw[raw["customer_id"].isin(known) & raw["issue_date"].str.match(r"^\d{4}-\d{2}-\d{2}$")
            & (raw["discount_pct"].astype(int) <= 20) & (raw["due_date"] >= raw["issue_date"]) & ~raw["invoice_id"].isin(bad)]

db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE customers (customer_id TEXT PRIMARY KEY, business_name TEXT, city TEXT, vat_exempt INTEGER, payment_terms_days INTEGER);
CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, customer_id TEXT, issue_date TEXT, due_date TEXT, discount_pct INTEGER, paid_kobo INTEGER);
CREATE TABLE invoice_lines (invoice_id TEXT, line_no INTEGER, quantity INTEGER, unit_price_kobo INTEGER);
""")
db.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?)", customers.itertuples(index=False))
db.executemany("INSERT INTO invoices VALUES (?, ?, ?, ?, ?, ?)",
               [(r.invoice_id, r.customer_id, r.issue_date, r.due_date, int(r.discount_pct), to_kobo(r.amount_paid)) for r in clean.itertuples()])
db.executemany("INSERT INTO invoice_lines VALUES (?, ?, ?, ?)",
               [(r.invoice_id, r.line_no, r.quantity, to_kobo(r.unit_price)) for r in lines[lines["invoice_id"].isin(clean["invoice_id"])].itertuples()])

top = db.execute("""
    SELECT c.business_name,
           COUNT(DISTINCT i.invoice_id)            AS invoices,
           SUM(l.quantity * l.unit_price_kobo)     AS subtotal_kobo
    FROM customers c
    JOIN invoices i      ON i.customer_id = c.customer_id
    JOIN invoice_lines l ON l.invoice_id = i.invoice_id
    WHERE c.city = ?
    GROUP BY c.customer_id
    ORDER BY subtotal_kobo DESC
    LIMIT 3
""", ("Lagos",)).fetchall()
for business_name, invoices, subtotal in top:
    print(f"{business_name:22} {invoices:3} invoices  ₦{subtotal / 100:,.2f} before discount and VAT")
```

```text
Chinedu Stores           6 invoices  ₦1,614,343.00 before discount and VAT
Babatunde Foods          5 invoices  ₦1,531,167.80 before discount and VAT
Sade Electronics         6 invoices  ₦1,527,568.10 before discount and VAT
```

The city is a parameter, too: the same query works for any city a user picks, safely.

## Walkthrough

1. Run the cells. Change the city parameter to `"Abuja"`.
2. Write a query for invoices with nothing paid (`paid_kobo = 0`) that are past their due date on 2026-09-01.
3. Explain to a colleague why `f"... '{name}'"` is dangerous even when names look harmless.
4. Rewrite an unsafe query (the task below).

## Practice

```answer
{
  "id": "dba-04-p1",
  "prompt": "How many invoices have **nothing paid**?",
  "answer": 225,
  "format": "number",
  "dataset": "invoicing",
  "files": ["customers", "invoices_raw", "invoice_lines"],
  "pyVerify": "db.execute('SELECT COUNT(*) FROM invoices WHERE paid_kobo = 0').fetchone()[0]",
  "hint": "SELECT COUNT(*) FROM invoices WHERE paid_kobo = 0",
  "required": true
}
```

```task
{
  "id": "dba-04-t1",
  "prompt": "This code is unsafe: `conn.execute(f\"SELECT * FROM invoices WHERE customer_id = '{customer_id}' AND issue_date >= '{since}'\")`. Rewrite it with **parameters**, and add a comment saying **why**.",
  "minutes": 4,
  "rows": 5,
  "placeholder": "rows = conn.execute(...)",
  "rules": [
    { "label": "Uses ? placeholders", "pattern": "\\?[\\s\\S]*\\?" },
    { "label": "Passes values as a tuple or list", "pattern": "\\(\\s*customer_id\\s*,\\s*since\\s*\\)|\\[\\s*customer_id\\s*,\\s*since\\s*\\]" },
    { "label": "No f-string or format in the SQL", "pattern": "f\"|f'|\\.format\\(|%\\s*\\(", "absent": true },
    { "label": "A comment saying why", "pattern": "#[^\\n]*(inject|data|apostrophe|quote|safe|parameter)" }
  ],
  "sample": "# Values are passed separately from the SQL, so quotes or SQL in them are treated as data, never as code.\nrows = conn.execute(\n    \"SELECT * FROM invoices WHERE customer_id = ? AND issue_date >= ?\",\n    (customer_id, since),\n).fetchall()",
  "note": "Parameters also let the database reuse the query plan, so they're the right habit for speed as well as safety.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use `?` parameters instead of putting values into the SQL text?",
    "options": ["They're shorter", "Values are always treated as data, so quotes and SQL inside them can't change the query", "SQLite requires it", "They sort results"],
    "answer": 1,
    "explanation": "It prevents crashes and SQL injection."
  },
  {
    "prompt": "What does `conn.row_factory = sqlite3.Row` give you?",
    "options": ["Faster queries", "Rows you can read by column name", "Encrypted rows", "Sorted rows"],
    "answer": 1,
    "explanation": "row['business_name'] instead of row[1]."
  },
  {
    "prompt": "Where should totals per customer be calculated?",
    "options": ["Load every row into Python and loop", "In SQL with JOIN and GROUP BY, letting the database do the work", "In the browser", "By hand"],
    "answer": 1,
    "explanation": "Databases are built for this."
  }
]
```
