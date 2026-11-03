---
title: Transactions
minutes: 25
summary: Group changes that must happen together into a transaction, so a failure halfway leaves nothing half-done, and see the difference on a batch of bank payments with one bad row.
---

## The problem

Every evening, Tallybook imports the day's payments from its bank. One evening, the 4th payment in a batch of 6 referred to an invoice that didn't exist. The import crashed. The first 3 payments had already been saved; the last 2 hadn't. Re-running the import saved the first 3 again. Three customers now showed as having paid twice.

Changes that belong together must happen **all or not at all**. That's what a **transaction** guarantees.

## The concept

### ACID

| Property | Meaning |
| :-- | :-- |
| **Atomic** | all the changes in a transaction happen, or none do |
| **Consistent** | constraints hold before and after |
| **Isolated** | other users don't see half-finished changes |
| **Durable** | once committed, changes survive a crash |

### In Python's sqlite3

```python norun
with conn:            # starts a transaction
    conn.execute(...)
    conn.execute(...)
# commits if the block finishes; rolls back everything if an exception escapes
```

### Idempotency

Imports get re-run. Give each payment the bank's unique reference, make it `UNIQUE`, and a re-run can't insert it twice.

![Insert a payment, crash, then the invoice update never runs: without a transaction the payment is saved but the invoice still shows unpaid; inside with conn: both are rolled back. A UNIQUE bank reference stops a re-run from recording a payment twice](/images/courses/dbapi/transactions.svg "All or nothing: a crash halfway leaves no half-finished change.")

## Example

Set up invoices and a payments table, and the batch with one bad row:

```python
import sqlite3

def fresh_db():
    conn = sqlite3.connect(":memory:")
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript("""
    CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, total_kobo INTEGER NOT NULL);
    CREATE TABLE payments (
        bank_reference TEXT PRIMARY KEY,
        invoice_id     TEXT NOT NULL REFERENCES invoices (invoice_id),
        amount_kobo    INTEGER NOT NULL CHECK (amount_kobo > 0)
    );
    INSERT INTO invoices VALUES ('INV-100001', 215000), ('INV-100002', 193500), ('INV-100003', 50000),
                                ('INV-100005', 80000), ('INV-100006', 120000);
    """)
    return conn

batch = [
    ("BNK-7001", "INV-100001", 215000),
    ("BNK-7002", "INV-100002", 100000),
    ("BNK-7003", "INV-100003", 50000),
    ("BNK-7004", "INV-100004", 75000),    # no such invoice
    ("BNK-7005", "INV-100005", 80000),
    ("BNK-7006", "INV-100006", 120000),
]

def import_without_transaction(conn, batch):
    conn.isolation_level = None          # autocommit: each insert is saved immediately
    for payment in batch:
        conn.execute("INSERT INTO payments VALUES (?, ?, ?)", payment)

def import_in_transaction(conn, batch):
    with conn:
        conn.executemany("INSERT INTO payments VALUES (?, ?, ?)", batch)

saved_counts = {}
for name, importer in [("without a transaction", import_without_transaction), ("in a transaction", import_in_transaction)]:
    conn = fresh_db()
    try:
        importer(conn, batch)
    except sqlite3.IntegrityError as error:
        print(f"Import {name} failed: {error}")
    saved = conn.execute("SELECT COUNT(*), COALESCE(SUM(amount_kobo), 0) FROM payments").fetchone()
    saved_counts[name] = saved[0]
    print(f"  payments saved: {saved[0]}, total ₦{saved[1] / 100:,.2f}")
```

```text
Import without a transaction failed: FOREIGN KEY constraint failed
  payments saved: 3, total ₦3,650.00
Import in a transaction failed: FOREIGN KEY constraint failed
  payments saved: 0, total ₦0.00
```

Without a transaction, half the batch is saved and the database is in a state nobody intended. In a transaction, nothing is saved: the batch can be fixed and re-run cleanly. Now the re-run itself. With the bank reference as the primary key, importing the same good payments twice can't double them:

```python
conn = fresh_db()
good = [p for p in batch if p[1] != "INV-100004"]
import_in_transaction(conn, good)
try:
    import_in_transaction(conn, good)
except sqlite3.IntegrityError as error:
    print("Second run refused:", error)
print("Payments:", conn.execute("SELECT COUNT(*) FROM payments").fetchone()[0])

with conn:
    conn.executemany("INSERT OR IGNORE INTO payments VALUES (?, ?, ?)", good)
print("After INSERT OR IGNORE re-run:", conn.execute("SELECT COUNT(*) FROM payments").fetchone()[0])
```

```text
Second run refused: UNIQUE constraint failed: payments.bank_reference
Payments: 5
After INSERT OR IGNORE re-run: 5
```

`INSERT OR IGNORE` makes the re-run a harmless no-op. Atomic batches plus unique bank references mean the evening import can fail, be fixed and be re-run without anyone counting payments by hand.

## Walkthrough

1. Run the cells. In the transaction version, print the invoices that were paid before the error. Were any saved?
2. Change the bad payment's amount to 0 instead. Which constraint fails?
3. When would you want a batch to save the good rows and report the bad ones instead? How would you do that safely?
4. Write the import rules (the task below).

## Practice

```answer
{
  "id": "dba-05-p1",
  "prompt": "Without a transaction, how many payments were saved before the import failed?",
  "answer": 3,
  "format": "number",
  "pyVerify": "saved_counts['without a transaction']",
  "hint": "The first 'payments saved' line.",
  "required": true
}
```

```task
{
  "id": "dba-05-t1",
  "prompt": "Write the **rules for the nightly payment import**, one per line starting with a dash: at least **four**, covering the **transaction**, what makes re-runs **safe**, what happens to a **bad row**, and how the result is **reported**.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "- The whole batch is imported in one transaction ...",
  "rules": [
    { "label": "At least four rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "One transaction (all or nothing)", "pattern": "transaction|all or nothing|roll(s|ed)? ?back" },
    { "label": "Safe re-runs (unique reference, idempotent, insert or ignore)", "pattern": "unique|idempot|or ignore|bank reference" },
    { "label": "Bad rows (reported, quarantined, rejected)", "pattern": "bad row|invalid|unknown invoice|quarantin|reject" },
    { "label": "Reporting (counts, email, alert, log)", "pattern": "report|log|alert|email|count" }
  ],
  "sample": "- The whole batch is imported in one transaction: if any row fails, nothing is saved.\n- Each payment is stored with the bank's unique reference as its key, and re-runs use INSERT OR IGNORE, so running a batch twice can't double any payment.\n- A row for an unknown invoice or with a zero amount stops the batch; the finance team gets the row and the reason, fixes or removes it, and re-runs.\n- Every run logs the batch file, rows imported, rows already present and the outcome, and alerts finance if a batch fails.",
  "note": "The first two rules together are what make 'just re-run it' a safe instruction.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does 'atomic' mean for a transaction?",
    "options": ["It's fast", "All of its changes happen, or none do", "It's encrypted", "It runs at night"],
    "answer": 1,
    "explanation": "No half-finished states."
  },
  {
    "prompt": "In Python's sqlite3, what does `with conn:` do if an error occurs inside the block?",
    "options": ["Commits what it can", "Rolls back every change made in the block", "Ignores the error", "Closes the database"],
    "answer": 1,
    "explanation": "And commits if the block finishes."
  },
  {
    "prompt": "How do you make a re-run of the same payment import safe?",
    "options": ["Hope nobody re-runs it", "Key payments on the bank's unique reference and ignore ones already present", "Delete all payments first", "Run it twice"],
    "answer": 1,
    "explanation": "Idempotent imports."
  }
]
```
