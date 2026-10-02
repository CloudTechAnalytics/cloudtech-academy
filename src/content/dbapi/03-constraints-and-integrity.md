---
title: Constraints and integrity
minutes: 15
summary: Let the database enforce the rules (primary keys, foreign keys, NOT NULL and CHECK constraints), see it refuse every kind of bad row in Tallybook's raw export, and handle the refusals in code.
---

## The problem

In the Software Engineering course, the importer checked each invoice in Python. That's good, but it only protects data that comes through the importer. The API, an admin script, or a hurried fix in a database console can still write a 50% discount or an invoice for a customer who doesn't exist.

Rules that must **always** hold belong in the database itself, as **constraints**. Then no code path can break them.

## The concept

| Constraint | Refuses |
| :-- | :-- |
| `PRIMARY KEY` / `UNIQUE` | a second row with the same key |
| `NOT NULL` | a missing value |
| `REFERENCES` (foreign key) | a link to a row that doesn't exist |
| `CHECK (...)` | any row where the condition is false |

**Two SQLite details**

- Foreign keys are only enforced after `PRAGMA foreign_keys = ON`, on every connection. (PostgreSQL always enforces them.)
- An empty string `''` is **not** NULL. `NOT NULL` won't catch a blank customer ID; the foreign key will, because no customer has the ID `''`.

**Database rules and code rules**

Keep both: validate in code to give users friendly messages, and constrain in the database so the rule holds everywhere. In code, catch `sqlite3.IntegrityError` and turn it into a clear response.

## Example

Build the schema from lesson 2, load the customers, then insert **every** raw invoice, including the bad ones, and record what the database says:

```python
import sqlite3

import pandas as pd

SCHEMA = """
CREATE TABLE customers (
    customer_id TEXT PRIMARY KEY, business_name TEXT NOT NULL, city TEXT NOT NULL,
    vat_exempt INTEGER NOT NULL, payment_terms_days INTEGER NOT NULL
);
CREATE TABLE invoices (
    invoice_id   TEXT PRIMARY KEY,
    customer_id  TEXT NOT NULL REFERENCES customers (customer_id),
    issue_date   TEXT NOT NULL CONSTRAINT iso_issue_date CHECK (issue_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
    due_date     TEXT NOT NULL,
    discount_pct INTEGER NOT NULL CONSTRAINT discount_limit CHECK (discount_pct BETWEEN 0 AND 20),
    CONSTRAINT due_after_issue CHECK (due_date >= issue_date)
);
"""
base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")
conn.executescript(SCHEMA)
customers = pd.read_csv(base + "customers.csv")
conn.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?)", customers.itertuples(index=False))

raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False)
outcomes = []
for row in raw.itertuples():
    try:
        conn.execute("INSERT INTO invoices VALUES (?, ?, ?, ?, ?)",
                     (row.invoice_id, row.customer_id, row.issue_date, row.due_date, int(row.discount_pct)))
        outcomes.append("inserted")
    except sqlite3.IntegrityError as error:
        outcomes.append(str(error))
conn.commit()
pd.Series(outcomes).value_counts()
```

```text
inserted                                         1143
CHECK constraint failed: iso_issue_date            34
FOREIGN KEY constraint failed                      11
CHECK constraint failed: discount_limit             7
CHECK constraint failed: due_after_issue            5
UNIQUE constraint failed: invoices.invoice_id       5
Name: count, dtype: int64
```

Every invoice-level problem the importer found by hand, the database refused on its own: duplicates by the primary key, unknown and blank customers by the foreign key, and the rest by the named checks. (Bad quantities are a property of lines, so the `invoice_lines` table's own check catches those: walkthrough step 4.) Now see what a friendly API response could look like:

```python
FRIENDLY = {
    "UNIQUE constraint failed: invoices.invoice_id": "This invoice already exists.",
    "FOREIGN KEY constraint failed": "The customer doesn't exist.",
    "CHECK constraint failed: discount_limit": "Discounts must be between 0% and 20%.",
    "CHECK constraint failed: iso_issue_date": "Dates must be written as YYYY-MM-DD.",
    "CHECK constraint failed: due_after_issue": "The due date can't be before the issue date.",
}

def add_invoice(invoice):
    try:
        with conn:
            conn.execute("INSERT INTO invoices VALUES (?, ?, ?, ?, ?)", invoice)
        return "created"
    except sqlite3.IntegrityError as error:
        return FRIENDLY.get(str(error), "The invoice breaks a data rule.")

print(add_invoice(("INV-999001", "C0001", "2026-09-01", "2026-09-30", 25)))
print(add_invoice(("INV-999002", "C9999", "2026-09-01", "2026-09-30", 10)))
print(add_invoice(("INV-999003", "C0001", "2026-09-01", "2026-09-30", 10)))
```

```text
Discounts must be between 0% and 20%.
The customer doesn't exist.
created
```

## Walkthrough

1. Run the cells. Turn foreign keys off (`PRAGMA foreign_keys = OFF`) on a new connection and reload. What gets in that shouldn't?
2. Add a CHECK that `customer_id` isn't blank. Which rows does it catch first?
3. Why keep validation in Python as well as constraints in the database?
4. Insert a line with quantity 0 using lesson 2's `invoice_lines` table. What's the message?

## Practice

```answer
{
  "id": "dba-03-p1",
  "prompt": "How many raw invoice rows does the database **refuse** in total?",
  "answer": 62,
  "format": "number",
  "dataset": "invoicing",
  "files": ["customers", "invoices_raw"],
  "pyVerify": "sum(o != 'inserted' for o in outcomes)",
  "hint": "Add every count except inserted.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why put rules in the database as well as in application code?",
    "options": ["It's faster", "So the rule holds for every program and person that writes to the database", "SQL is easier", "To skip testing"],
    "answer": 1,
    "explanation": "No code path can bypass a constraint."
  },
  {
    "prompt": "A customer_id is an empty string. Does NOT NULL refuse it?",
    "options": ["Yes", "No: an empty string isn't NULL; a foreign key or CHECK must catch it", "Only in SQLite", "Only in PostgreSQL"],
    "answer": 1,
    "explanation": "'' and NULL are different."
  },
  {
    "prompt": "What must you run for SQLite to enforce foreign keys?",
    "options": ["Nothing", "PRAGMA foreign_keys = ON on each connection", "VACUUM", "CREATE INDEX"],
    "answer": 1,
    "explanation": "It's off by default in SQLite."
  }
]
```
