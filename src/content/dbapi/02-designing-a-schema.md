---
title: Designing a schema
minutes: 25
summary: Design tables for an application (one table per kind of thing, keys that link them, no repeated facts), write the schema for Tallybook's customers, invoices, lines and payments, and load the clean data into it.
---

## The problem

The invoice export has the customer's ID on every invoice, but the customer's name and VAT status live in another file. Some systems "simplify" this by copying the customer's details onto every invoice. Then a customer changes their business name, and half their invoices show the old one.

A good **schema**, the design of a database's tables, stores each fact once, links related rows with keys, and makes impossible states impossible to store.

## The concept

### One table per kind of thing

Customers, invoices, invoice lines and payments are different things with different lifetimes, so each gets a table.

### Keys

- A **primary key** identifies each row (`customer_id`).
- A **foreign key** points to a row in another table (`invoices.customer_id` → `customers.customer_id`).
- A **composite key** uses more than one column: an invoice line is identified by its invoice **and** its line number.

### Don't repeat facts

Store the customer's name once, in `customers`. Store totals? Usually **not**: they can be calculated from the lines, and a stored total can disagree with them. (If you store one for speed, you must keep it in step.)

### Money and dates

Money as **integer kobo** (Software Engineering, lesson 2). Dates in SQLite as `YYYY-MM-DD` text, which sorts and compares correctly.

![Entity-relationship diagram: customers (customer_id primary key) has zero or more invoices (invoice_id primary key, customer_id foreign key); each invoice has one or more invoice_lines (composite key invoice_id and line_no) and zero or more payments (payment_id primary key, invoice_id foreign key)](/images/courses/dbapi/schema.svg "Tallybook's schema: four tables linked by keys.")

## Example

Tallybook's schema. The `CHECK` constraints are named, so error messages say which rule was broken; lesson 3 puts them to work.

```python
import sqlite3
from decimal import Decimal, ROUND_HALF_UP

import pandas as pd

SCHEMA = """
CREATE TABLE customers (
    customer_id        TEXT PRIMARY KEY,
    business_name      TEXT NOT NULL,
    city               TEXT NOT NULL,
    vat_exempt         INTEGER NOT NULL CONSTRAINT vat_flag CHECK (vat_exempt IN (0, 1)),
    payment_terms_days INTEGER NOT NULL CONSTRAINT positive_terms CHECK (payment_terms_days > 0)
);
CREATE TABLE invoices (
    invoice_id   TEXT PRIMARY KEY,
    customer_id  TEXT NOT NULL REFERENCES customers (customer_id),
    issue_date   TEXT NOT NULL CONSTRAINT iso_issue_date CHECK (issue_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
    due_date     TEXT NOT NULL,
    discount_pct INTEGER NOT NULL CONSTRAINT discount_limit CHECK (discount_pct BETWEEN 0 AND 20),
    CONSTRAINT due_after_issue CHECK (due_date >= issue_date)
);
CREATE TABLE invoice_lines (
    invoice_id      TEXT NOT NULL REFERENCES invoices (invoice_id),
    line_no         INTEGER NOT NULL,
    description     TEXT NOT NULL,
    quantity        INTEGER NOT NULL CONSTRAINT positive_quantity CHECK (quantity > 0),
    unit_price_kobo INTEGER NOT NULL CONSTRAINT price_not_negative CHECK (unit_price_kobo >= 0),
    PRIMARY KEY (invoice_id, line_no)
);
CREATE TABLE payments (
    payment_id  INTEGER PRIMARY KEY,
    invoice_id  TEXT NOT NULL REFERENCES invoices (invoice_id),
    paid_on     TEXT NOT NULL,
    amount_kobo INTEGER NOT NULL CONSTRAINT positive_payment CHECK (amount_kobo > 0)
);
"""

conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")
conn.executescript(SCHEMA)
for name, sql in conn.execute("SELECT name, sql FROM sqlite_master WHERE type = 'table'"):
    print(name, "-", sql.count("REFERENCES"), "foreign key(s),", sql.count("CHECK"), "check(s)")
```

```text
customers - 0 foreign key(s), 2 check(s)
invoices - 1 foreign key(s), 3 check(s)
invoice_lines - 1 foreign key(s), 2 check(s)
payments - 1 foreign key(s), 1 check(s)
```

Now load the data that passed validation in the Software Engineering course: customers, the invoices without problems, and their lines in kobo.

```python
base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
customers = pd.read_csv(base + "customers.csv")
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False).drop_duplicates()
lines = pd.read_csv(base + "invoice_lines.csv", dtype={"unit_price": str})

def to_kobo(naira):
    return int((Decimal(naira) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

known = set(customers["customer_id"])
bad_lines = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])
clean = raw[raw["customer_id"].isin(known) & raw["issue_date"].str.match(r"^\d{4}-\d{2}-\d{2}$")
            & (raw["discount_pct"].astype(int) <= 20) & (raw["due_date"] >= raw["issue_date"]) & ~raw["invoice_id"].isin(bad_lines)]

with conn:
    conn.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?)", customers.itertuples(index=False))
    conn.executemany("INSERT INTO invoices VALUES (?, ?, ?, ?, ?)",
                     clean[["invoice_id", "customer_id", "issue_date", "due_date", "discount_pct"]].itertuples(index=False))
    kept = lines[lines["invoice_id"].isin(clean["invoice_id"])]
    conn.executemany("INSERT INTO invoice_lines VALUES (?, ?, ?, ?, ?)",
                     [(r.invoice_id, r.line_no, r.description, r.quantity, to_kobo(r.unit_price)) for r in kept.itertuples()])

for table in ["customers", "invoices", "invoice_lines"]:
    print(table, conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
```

```text
customers 300
invoices 1133
invoice_lines 2321
```

The schema now holds each fact once. A customer's name changes in one row, and every invoice shows the new name, because invoices don't store it at all: they store the key.

## Walkthrough

1. Run the cells. Write a query joining invoices to customers to list five invoices with the customer's business name.
2. Why is the primary key of `invoice_lines` two columns?
3. Should `invoices` have a `total_kobo` column? Argue both sides.
4. Draw the four tables and their keys (the task below).

## Practice

```answer
{
  "id": "dba-02-p1",
  "prompt": "How many invoices are loaded into the `invoices` table?",
  "answer": 1133,
  "format": "number",
  "dataset": "invoicing",
  "files": ["customers", "invoices_raw", "invoice_lines"],
  "pyVerify": "conn.execute('SELECT COUNT(*) FROM invoices').fetchone()[0]",
  "hint": "The invoices line of the second output.",
  "required": true
}
```

```task
{
  "id": "dba-02-t1",
  "prompt": "Tallybook wants **credit notes**: a credit note reduces what a customer owes on one invoice, with a reason and a date. Write the **CREATE TABLE** for `credit_notes`, with a primary key, a **foreign key** to invoices, money in **kobo**, and at least one **named CHECK** constraint.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "CREATE TABLE credit_notes (\n    ...",
  "rules": [
    { "label": "CREATE TABLE credit_notes", "pattern": "create\\s+table\\s+credit_notes" },
    { "label": "A primary key", "pattern": "primary\\s+key" },
    { "label": "A foreign key to invoices", "pattern": "references\\s+invoices" },
    { "label": "An amount in kobo as an integer", "pattern": "\\w*kobo\\w*\\s+integer" },
    { "label": "A named CHECK constraint", "pattern": "constraint\\s+\\w+\\s+check\\s*\\(" },
    { "label": "A reason and a date", "pattern": "reason[\\s\\S]*(date|issued_on|_on\\b)|(date|issued_on)[\\s\\S]*reason" }
  ],
  "sample": "CREATE TABLE credit_notes (\n    credit_note_id INTEGER PRIMARY KEY,\n    invoice_id     TEXT NOT NULL REFERENCES invoices (invoice_id),\n    issued_on      TEXT NOT NULL,\n    amount_kobo    INTEGER NOT NULL CONSTRAINT positive_credit CHECK (amount_kobo > 0),\n    reason         TEXT NOT NULL CONSTRAINT reason_given CHECK (length(trim(reason)) > 0)\n);",
  "note": "A credit note is its own table, not a negative payment: it has a different meaning, a reason, and different people who may issue it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why not copy the customer's name onto every invoice?",
    "options": ["It uses more disk", "When the name changes, copies disagree; store it once and link by key", "SQL forbids it", "It's slower"],
    "answer": 1,
    "explanation": "One fact, one place."
  },
  {
    "prompt": "What does a foreign key do?",
    "options": ["Encrypts a column", "Links a row to a row in another table, and can refuse links to rows that don't exist", "Sorts the table", "Speeds up inserts"],
    "answer": 1,
    "explanation": "Relationships the database enforces."
  },
  {
    "prompt": "Why store money as integer kobo in the database?",
    "options": ["It's shorter", "Integers are exact; floating-point amounts drift", "Databases can't store decimals", "It's required by SQLite"],
    "answer": 1,
    "explanation": "The same rule as in code."
  }
]
```
