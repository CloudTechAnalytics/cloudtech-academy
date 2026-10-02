---
title: Indexes and query plans
minutes: 15
summary: See how the database finds rows by reading its query plan, add an index so a lookup searches instead of scanning, and know what indexes cost.
---

## The problem

The customer portal's "your invoices" page got slower every month. With a few thousand invoices it was fine; with a few hundred thousand it took seconds, because to find one customer's invoices the database read **every** invoice. Nobody had told it there was a faster way.

## The concept

**Scan or search**

Without help, a database answers `WHERE customer_id = ?` by reading every row: a **scan**. An **index** is a sorted structure (like a book's index) that lets it jump straight to the matching rows: a **search**.

**Query plans**

`EXPLAIN QUERY PLAN` shows how SQLite will run a query, without running it. `SCAN invoices` means every row is read; `SEARCH invoices USING INDEX ...` means it jumps to the rows it needs. PostgreSQL's equivalent is `EXPLAIN`.

**What gets an index**

- Primary keys and UNIQUE columns are indexed automatically.
- Add indexes for columns you **filter, join or sort by** often: foreign keys are the usual first candidates.

**What indexes cost**

Every insert and update must also update each index, and indexes take space. Index for the queries you actually run, not every column.

## Example

Tallybook's invoices and lines, and a helper that shows the plan:

```python
import sqlite3

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False).drop_duplicates()
lines = pd.read_csv(base + "invoice_lines.csv")

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, customer_id TEXT, issue_date TEXT, due_date TEXT);
CREATE TABLE invoice_lines (invoice_id TEXT, line_no INTEGER, quantity INTEGER, PRIMARY KEY (invoice_id, line_no));
""")
conn.executemany("INSERT OR IGNORE INTO invoices VALUES (?, ?, ?, ?)", raw[["invoice_id", "customer_id", "issue_date", "due_date"]].itertuples(index=False))
conn.executemany("INSERT INTO invoice_lines VALUES (?, ?, ?)", lines[["invoice_id", "line_no", "quantity"]].itertuples(index=False))

def plan(sql, params=()):
    return " / ".join(row[3] for row in conn.execute("EXPLAIN QUERY PLAN " + sql, params))

BY_CUSTOMER = "SELECT invoice_id, issue_date FROM invoices WHERE customer_id = ? ORDER BY issue_date"
print("Invoices by customer:", plan(BY_CUSTOMER, ("C0145",)))
print("Lines for an invoice:", plan("SELECT * FROM invoice_lines WHERE invoice_id = ?", ("INV-100357",)))
```

```text
Invoices by customer: SCAN invoices / USE TEMP B-TREE FOR ORDER BY
Lines for an invoice: SEARCH invoice_lines USING INDEX sqlite_autoindex_invoice_lines_1 (invoice_id=?)
```

Looking up one invoice's lines already searches: the composite primary key starts with `invoice_id`, so it doubles as an index. Finding a customer's invoices scans every invoice, then sorts them. Add an index on the columns the query filters and sorts by:

```python
conn.execute("CREATE INDEX idx_invoices_customer_date ON invoices (customer_id, issue_date)")
print("Invoices by customer:", plan(BY_CUSTOMER, ("C0145",)))
print("Rows found:", len(conn.execute(BY_CUSTOMER, ("C0145",)).fetchall()))
```

```text
Invoices by customer: SEARCH invoices USING INDEX idx_invoices_customer_date (customer_id=?)
Rows found: 4
```

Now the database jumps to customer C0145's entries, already in date order, so the separate sort disappears too. With 1,200 invoices you won't feel the difference; with a million, it's the difference between milliseconds and seconds.

## Walkthrough

1. Run the cells. Check the plan for `WHERE issue_date >= ?` alone. Does the new index help? Why not?
2. Write the index the "overdue invoices" query (`WHERE due_date < ?`) would need.
3. Which of Tallybook's tables gets the most inserts? What does that mean for adding indexes to it?
4. List the indexes you'd create for the API in lesson 8.

## Practice

```answer
{
  "id": "dba-06-p1",
  "prompt": "How many invoices does customer **C0145** have?",
  "answer": 4,
  "format": "number",
  "dataset": "invoicing",
  "files": ["invoices_raw", "invoice_lines"],
  "pyVerify": "len(conn.execute(BY_CUSTOMER, ('C0145',)).fetchall())",
  "hint": "The 'Rows found' line.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does 'SCAN invoices' in a query plan mean?",
    "options": ["The table is being backed up", "Every row of invoices is read to answer the query", "An index is used", "The query failed"],
    "answer": 1,
    "explanation": "Fine for small tables, slow for big ones."
  },
  {
    "prompt": "Which columns are the best first candidates for indexes?",
    "options": ["Every column", "Columns you filter, join or sort by often, such as foreign keys", "Text descriptions", "None"],
    "answer": 1,
    "explanation": "Index for real queries."
  },
  {
    "prompt": "What do indexes cost?",
    "options": ["Nothing", "Slower inserts and updates, and extra space", "Slower reads", "Data loss"],
    "answer": 1,
    "explanation": "Every write updates every index."
  }
]
```
