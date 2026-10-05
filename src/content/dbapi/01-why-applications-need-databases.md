---
title: Why applications need databases
minutes: 15
summary: Why an application's data belongs in a database rather than files, what a relational database gives you (structure, rules, safe concurrent changes and fast lookups), and your first SQLite database from Python.
---

## The problem

Tallybook's invoicing service from the Software Engineering course still reads CSV exports. That works for a month-end report. It doesn't work for an app: two staff recording payments at the same moment can overwrite each other's changes, nothing stops a duplicate invoice or a discount of 50%, and finding one customer's invoices means reading every row in the file.

Applications keep their data in a **database**. In this course you'll design Tallybook's database, protect it with rules, change it safely, and put a real API in front of it, with every query and test run in Colab.

## The concept

### What a relational database provides

| Need | How the database helps |
| :-- | :-- |
| Structure | **tables** with named, typed columns |
| Relationships | **keys** link rows: each invoice belongs to a customer |
| Rules | **constraints** reject bad data at the door |
| Safe changes | **transactions** make a group of changes all happen or none |
| Speed | **indexes** find rows without reading the whole table |
| One question language | **SQL** |

![A Python app sends SQL and values to the database and gets rows back; inside the database are tables, constraints, transactions and indexes](/images/courses/dbapi/app-database.svg "The app sends SQL and values; the database stores, guards and finds the data.")

### SQLite

A complete relational database in a single file (or in memory), built into Python as `sqlite3`. Production systems often use PostgreSQL or MySQL; the ideas and almost all the SQL in this course carry over directly.

### From Python

```python norun
import sqlite3
conn = sqlite3.connect("tallybook.db")     # or ":memory:" for a throwaway database
conn.execute("SELECT ...", (value,))
conn.commit()
```

## Example

Create an in-memory database and load Tallybook's customers into a proper table:

```python
import sqlite3

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
customers = pd.read_csv(base + "customers.csv")

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE customers (
        customer_id        TEXT PRIMARY KEY,
        business_name      TEXT NOT NULL,
        city               TEXT NOT NULL,
        vat_exempt         INTEGER NOT NULL,
        payment_terms_days INTEGER NOT NULL
    )
""")
conn.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?)", customers.itertuples(index=False))
conn.commit()

print(conn.execute("SELECT COUNT(*) FROM customers").fetchone()[0], "customers")
for row in conn.execute("SELECT city, COUNT(*) AS n FROM customers GROUP BY city ORDER BY n DESC LIMIT 3"):
    print(row)
```

```text
300 customers
('Lagos', 105)
('Kano', 52)
('Ibadan', 40)
```

Now try to add a customer whose ID already exists. A CSV file would accept it silently; the database refuses:

```python
try:
    conn.execute("INSERT INTO customers VALUES ('C0001', 'Duplicate Stores', 'Lagos', 0, 30)")
except sqlite3.IntegrityError as error:
    print("Refused:", error)
```

```text
Refused: UNIQUE constraint failed: customers.customer_id
```

That refusal is the database doing a job your application code would otherwise have to remember to do, everywhere, forever.

## Walkthrough

1. Run the cells in Colab. Query the number of VAT-exempt customers.
2. Change `":memory:"` to `"tallybook.db"`, run again, and look for the file in Colab's file panel.
3. Why is `customer_id` the primary key rather than `business_name`?
4. List three things Tallybook's app needs that a CSV file can't provide safely.

## Practice

```dataset
{"dataset": "invoicing", "files": ["customers", "invoices_raw", "invoice_lines"]}
```

```answer
{
  "id": "dba-01-p1",
  "prompt": "How many customers are in **Lagos**?",
  "answer": 105,
  "format": "number",
  "dataset": "invoicing",
  "files": ["customers"],
  "pyVerify": "conn.execute(\"SELECT COUNT(*) FROM customers WHERE city = 'Lagos'\").fetchone()[0]",
  "hint": "SELECT COUNT(*) FROM customers WHERE city = 'Lagos'",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a primary key guarantee?",
    "options": ["Fast inserts", "Each row has a unique identifier; duplicates are refused", "Sorted output", "Encryption"],
    "answer": 1,
    "explanation": "One row per key."
  },
  {
    "prompt": "Two people record payments at the same time on a shared CSV file. What can go wrong?",
    "options": ["Nothing", "One person's change can overwrite the other's", "The file gets faster", "Payments double automatically"],
    "answer": 1,
    "explanation": "Databases manage concurrent changes safely."
  },
  {
    "prompt": "What is SQLite?",
    "options": ["A cloud service", "A complete relational database in a single file, built into Python", "A spreadsheet", "A web framework"],
    "answer": 1,
    "explanation": "Great for learning, testing and small apps."
  }
]
```
