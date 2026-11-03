---
title: Migrations
minutes: 25
summary: Change a live database's schema safely with numbered, versioned migrations that run once each, in order, inside transactions, and that every environment applies the same way.
---

## The problem

Tallybook added a `currency` column to invoices on a developer's laptop with one command. Staging got it a week later, typed by hand with a different default. Production got it a month later, by someone else, without the index. Three databases, three slightly different schemas, and a bug that only happened in production.

Schema changes need the same discipline as code: written down, reviewed, versioned, and applied the same way everywhere. That's what **migrations** are.

## The concept

### Migrations

A numbered list of schema changes, each a small SQL script, kept in version control with the code:

| Version | Change |
| :-- | :-- |
| 1 | create the tables |
| 2 | add `currency` to invoices, default `NGN` |
| 3 | add the customer-date index |
| 4 | create `credit_notes` |

### Running them

The database records which version it's at. A migration tool applies every **pending** migration, in order, each in a transaction, and records the new version. Running it again does nothing. SQLite has a built-in slot for this: `PRAGMA user_version`. Tools such as Alembic (Python) or Flyway do the same with a version table.

![Migrations 1 to 4 in order; the database is at version 2, so the tool applies 3 then 4, each in a transaction, and records the new version; running again does nothing](/images/courses/dbapi/migrations.svg "The database records its version; the tool applies only what's pending, in order.")

### Rules for safe migrations

- Never edit a migration that has already run anywhere; add a new one.
- Make changes backwards-compatible (CI/CD course, lesson 9): add a column with a default before code needs it; remove old columns only after no code uses them.
- Test migrations on a copy of production data before production.

## Example

A small migration runner:

```python
import sqlite3

MIGRATIONS = [
    # 1: the first tables
    """
    CREATE TABLE customers (customer_id TEXT PRIMARY KEY, business_name TEXT NOT NULL);
    CREATE TABLE invoices (invoice_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers (customer_id),
                           issue_date TEXT NOT NULL);
    """,
    # 2: invoices get a currency, defaulting to naira for every existing row
    "ALTER TABLE invoices ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN';",
    # 3: the portal's invoice list query needs this index (lesson 6)
    "CREATE INDEX idx_invoices_customer_date ON invoices (customer_id, issue_date);",
    # 4: credit notes (lesson 2's task)
    """
    CREATE TABLE credit_notes (credit_note_id INTEGER PRIMARY KEY, invoice_id TEXT NOT NULL REFERENCES invoices (invoice_id),
                               amount_kobo INTEGER NOT NULL CONSTRAINT positive_credit CHECK (amount_kobo > 0),
                               reason TEXT NOT NULL);
    """,
]

def migrate(conn, target=len(MIGRATIONS)):
    current = conn.execute("PRAGMA user_version").fetchone()[0]
    applied = []
    for version in range(current + 1, target + 1):
        conn.execute("BEGIN")
        try:
            for statement in MIGRATIONS[version - 1].split(";"):
                if statement.strip():
                    conn.execute(statement)
            conn.execute(f"PRAGMA user_version = {version}")
            conn.execute("COMMIT")
        except Exception:
            conn.execute("ROLLBACK")
            raise
        applied.append(version)
    return applied

conn = sqlite3.connect(":memory:", isolation_level=None)
print("Applied up to 2:", migrate(conn, target=2))
conn.execute("INSERT INTO customers VALUES ('C0001', 'Ada Stores')")
conn.execute("INSERT INTO invoices (invoice_id, customer_id, issue_date) VALUES ('INV-100001', 'C0001', '2026-09-01')")
print("Applied the rest:", migrate(conn))
print("Run again:", migrate(conn))
print("Schema version:", conn.execute("PRAGMA user_version").fetchone()[0])
print(conn.execute("SELECT invoice_id, currency FROM invoices").fetchall())
```

```text
Applied up to 2: [1, 2]
Applied the rest: [3, 4]
Run again: []
Schema version: 4
[('INV-100001', 'NGN')]
```

The second run applies nothing: every environment that runs `migrate` ends up at version 4 with an identical schema, whatever version it started at. The existing invoice got the default currency without anyone touching it.

## Walkthrough

1. Run the cell. Add migration 5: a `paid_on` index on a payments table. Run `migrate` again. Which versions are applied?
2. Make a migration fail on purpose (a typo in the SQL). Is the version number changed? Is anything half-done?
3. Why must you never edit migration 2 after it has run in production?
4. Plan a safe column rename (the task below).

## Practice

```answer
{
  "id": "dba-07-p1",
  "prompt": "What schema version does the database end at?",
  "answer": 4,
  "format": "number",
  "pyVerify": "conn.execute('PRAGMA user_version').fetchone()[0]",
  "hint": "The 'Schema version' line.",
  "required": true
}
```

```task
{
  "id": "dba-07-t1",
  "prompt": "Tallybook wants to rename `customers.business_name` to `trading_name` **without downtime**, while old and new versions of the app run side by side during a release. Write the steps as **numbered migrations and releases**, at least **four**, so that no running version of the app ever breaks.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "1. Migration: add trading_name ...",
  "rules": [
    { "label": "At least four numbered steps", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 4 },
    { "label": "Adds the new column first", "pattern": "^\\s*1[.)][^\\n]*(add|create)[^\\n]*trading_name" },
    { "label": "Copies or backfills the data", "pattern": "copy|backfill|update[^\\n]*set" },
    { "label": "Code writes or reads both during the change", "pattern": "both|read[^\\n]*trading_name|write[^\\n]*(both|trading_name)" },
    { "label": "Drops the old column last", "pattern": "(drop|remove)[^\\n]*business_name" },
    { "label": "Drop comes in the last step", "pattern": "^\\s*[4-9][.)][^\\n]*(drop|remove)" }
  ],
  "sample": "1. Migration: add trading_name to customers, allowing NULL at first.\n2. Release: the app writes both business_name and trading_name, and still reads business_name.\n3. Migration: backfill trading_name from business_name for every existing row (UPDATE customers SET trading_name = business_name WHERE trading_name IS NULL).\n4. Release: the app reads trading_name, still writing both.\n5. Release: the app stops writing business_name.\n6. Migration: drop business_name once no running version uses it.",
  "note": "This 'expand, migrate, contract' pattern is how renames and type changes happen without downtime.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is a migration?",
    "options": ["Moving servers", "A versioned, reviewed schema change applied the same way in every environment", "A backup", "A query"],
    "answer": 1,
    "explanation": "Schema changes as code."
  },
  {
    "prompt": "A migration has run in production but has a mistake. What do you do?",
    "options": ["Edit it", "Write a new migration that corrects it", "Delete it", "Run it again"],
    "answer": 1,
    "explanation": "History must match every database."
  },
  {
    "prompt": "Why run each migration in a transaction?",
    "options": ["Speed", "If it fails halfway, nothing is applied and the version isn't changed", "It's required by SQL", "To lock users out"],
    "answer": 1,
    "explanation": "No half-migrated databases."
  }
]
```
