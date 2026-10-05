---
title: "Final project: Tallybook's invoicing service"
minutes: 20
summary: Plan your final project, a tested, version-controlled invoicing package and API that replaces the old billing module, with every rule tested at its boundaries and every row of the export accounted for.
---

## The problem

Tallybook wants to retire `billing.py`. Your final project is its replacement: a small, tested invoicing package with an API, in a Git repository, and a short report showing that it's correct, how it handles the messy export, and what it changes for customers.

## The concept

### What the project contains

| Part | Built in |
| :-- | :-- |
| `invoicing.py`: totals, VAT, discount, rounding, late fees | lessons 2 to 4 |
| `test_invoicing.py`: boundary and regression tests | lessons 3 and 4 |
| `importer.py`: validation and conversion of the export | lessons 5 and 6 |
| A Git history of small commits on branches | lesson 7 |
| A review of `billing.py` and your own code | lesson 8 |
| `api.py` with tests using the test client | lesson 9 |

### Prove it

A test run with every test passing, a reconciliation of the export (every row valid, fixed, dropped as a duplicate, or quarantined, with counts that add up), and the totals the new code gives compared with the old, invoice by invoice.

## Example

A reconciliation of the export: every row accounted for, with counts that add up to the total.

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False)
customers = set(pd.read_csv(base + "customers.csv", dtype=str)["customer_id"])
lines = pd.read_csv(base + "invoice_lines.csv")
bad_quantity = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])

def outcome(row, is_duplicate):
    if is_duplicate:
        return "dropped: duplicate"
    if row["customer_id"] not in customers or int(row["discount_pct"]) > 20 or row["invoice_id"] in bad_quantity:
        return "quarantined for review"
    if row["due_date"] < row["issue_date"] and "/" not in row["issue_date"]:
        return "quarantined for review"
    if "/" in row["issue_date"] or not row["amount_paid"].replace(".", "").isdigit():
        return "fixed automatically"
    return "valid"

duplicates = raw.duplicated(keep="first")
raw["outcome"] = [outcome(row, dup) for (_, row), dup in zip(raw.iterrows(), duplicates)]
reconciliation = raw["outcome"].value_counts()
print(reconciliation)
print("Total:", reconciliation.sum(), "of", len(raw), "rows")
```

```text
outcome
valid                     1107
fixed automatically         59
quarantined for review      34
dropped: duplicate           5
Name: count, dtype: int64
Total: 1205 of 1205 rows
```

Every row has exactly one outcome, and they add up. That table, with your test run and the before-and-after totals, is the evidence the finance team needs to switch.

## Walkthrough

1. Build the package and tests, and get every test passing.
2. Build the importer and reconcile the export.
3. Compare old and new totals for every valid invoice, and explain the differences.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "swe-10-p1",
  "prompt": "How many rows are **quarantined for review**?",
  "answer": 34,
  "format": "number",
  "dataset": "invoicing",
  "files": ["invoices_raw", "customers", "invoice_lines"],
  "pyVerify": "int(reconciliation['quarantined for review'])",
  "hint": "The quarantined line of the output.",
  "required": true
}
```

```task
{
  "id": "swe-10-t1",
  "prompt": "Write the **summary** for the finance team (80 to 180 words): what the new service **changes** for customers' totals, how it's **tested**, how the **export** is handled (with counts), and what they need to **do** before the switch.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "The new invoicing service ...",
  "rules": [
    { "label": "Totals change (kobo, rounding)", "pattern": "kobo|round" },
    { "label": "Testing (tests, boundary, passing)", "pattern": "test" },
    { "label": "Export handling with numbers", "pattern": "\\d[^.\\n]{0,120}(quarantin|duplicat|fixed)|(quarantin|duplicat|fixed)[^.\\n]{0,120}\\d" },
    { "label": "An action for the finance team", "pattern": "review|check|approve|confirm|sign" },
    { "label": "Between 80 and 180 words", "minWords": 80, "maxWords": 180 }
  ],
  "sample": "The new invoicing service calculates every invoice in whole kobo and rounds VAT and discounts half up, as our invoices state. Compared with the old billing code, some totals change by exactly one kobo, always to the correct amount; we can list each one. Late fees now follow the written rule: 2% of the outstanding amount per full 30 days, at most three periods, instead of compounding. Every rule is covered by automated tests, including the exact boundaries where the old code went wrong, and the tests run on every change. In the latest export, most rows are valid, a small number had formatted amounts or UK dates that were converted automatically, 5 duplicates were dropped, and the rest are quarantined because of unknown customers, discounts above 20% or impossible quantities and dates. Before we switch, please review the quarantined invoices and confirm the corrected late fee rule.",
  "note": "Telling finance exactly which totals change, and by how much, is what makes them comfortable approving the switch.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What proves the importer handles every row?",
    "options": ["It doesn't crash", "A reconciliation where every row has one outcome and the counts add up to the total", "A fast run time", "Logging"],
    "answer": 1,
    "explanation": "Account for everything."
  },
  {
    "prompt": "Why compare old and new totals invoice by invoice?",
    "options": ["Curiosity", "So every difference is known and explained before customers see it", "To slow the switch", "It's required by Python"],
    "answer": 1,
    "explanation": "No surprises for customers or finance."
  },
  {
    "prompt": "Which is the strongest evidence the new code is correct?",
    "options": ["The engineer says so", "Passing tests for every rule, including boundaries and past bugs", "It's shorter", "It uses Decimal"],
    "answer": 1,
    "explanation": "Tests are executable evidence."
  }
]
```
