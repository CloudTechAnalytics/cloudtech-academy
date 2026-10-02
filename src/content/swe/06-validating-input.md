---
title: Validating input
minutes: 25
summary: Check every record before using it, collect every problem with a clear reason instead of crashing on the first, and decide what happens to bad records so they're fixed rather than silently dropped.
---

## The problem

Lesson 5 fixed one problem in the invoice export. There are several more: invoices exported twice, discounts above the 20% limit, dates in two formats, invoices for customers who don't exist, due dates before issue dates, and lines with zero or negative quantities. Any of them can produce a wrong total without any error at all, which is worse than a crash.

## The concept

**Validate at the boundary**

Check data where it enters your system (an import, an API request, a form), before any calculation uses it.

**Collect problems, don't stop at the first**

A validator returns a **list of problems** for each record. An empty list means valid. Then you can report every problem at once, with counts.

**Decide what happens to invalid records**

| Option | When |
| :-- | :-- |
| Reject with a clear message | input from a person or another system that can fix it |
| Quarantine for review | bulk imports, so good records still go through |
| Fix automatically | only when the fix is certain (a formatted amount) |

Never silently drop bad records: totals become wrong and nobody knows.

**Raise errors with useful messages**

When a function can't continue, `raise ValueError(...)` with a message that says what was wrong and what was expected, as `invoice_total` does for discounts.

## Example

A validator for invoice rows:

```python
import re
from datetime import date

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False)
customers = set(pd.read_csv(base + "customers.csv", dtype=str)["customer_id"])
lines = pd.read_csv(base + "invoice_lines.csv")
bad_quantity = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])

ISO_DATE = re.compile(r"\d{4}-\d{2}-\d{2}")

def validate(row):
    problems = []
    if not row["customer_id"]:
        problems.append("missing customer")
    elif row["customer_id"] not in customers:
        problems.append("unknown customer")
    if not ISO_DATE.fullmatch(row["issue_date"]):
        problems.append("issue date not YYYY-MM-DD")
    elif date.fromisoformat(row["due_date"]) < date.fromisoformat(row["issue_date"]):
        problems.append("due before issued")
    if not 0 <= int(row["discount_pct"]) <= 20:
        problems.append("discount above 20%")
    if row["invoice_id"] in bad_quantity:
        problems.append("line with zero or negative quantity")
    return problems

raw["duplicate"] = raw.duplicated(keep="first")
raw["problems"] = raw.apply(validate, axis=1)
print("Rows:", len(raw), " valid:", int((raw["problems"].str.len() == 0).sum() - raw["duplicate"].sum()))
raw.explode("problems")["problems"].value_counts()
```

```text
Rows: 1205  valid: 1133
problems
issue date not YYYY-MM-DD              34
line with zero or negative quantity    12
missing customer                        7
discount above 20%                      7
unknown customer                        5
due before issued                       5
Name: count, dtype: int64
```

Plus the duplicates, flagged separately:

```python
print("Exact duplicate rows:", int(raw["duplicate"].sum()))
print(raw.loc[raw["invoice_id"].isin(raw.loc[raw["duplicate"], "invoice_id"]), ["invoice_id", "customer_id", "issue_date", "amount_paid"]].sort_values("invoice_id").head(4).to_string(index=False))
```

```text
Exact duplicate rows: 5
invoice_id customer_id issue_date amount_paid
INV-100357       C0145 2026-07-04   425045.78
INV-100357       C0145 2026-07-04   425045.78
INV-100416       C0211 2026-08-25   116151.86
INV-100416       C0211 2026-08-25   116151.86
```

Each kind of problem has its own owner and fix. Formatted dates can be converted with certainty, so they can be fixed automatically, like formatted amounts. Duplicates should be dropped, keeping one copy. Unknown customers, discounts above the limit and bad quantities go to the finance team for review: the code can't know the right answer.

## Walkthrough

1. Run the cells. Write a function that converts `31/08/2026` to `2026-08-31`, and a test for it.
2. How many invoices have more than one problem?
3. Why does the validator check `due_date` only when `issue_date` is valid?
4. Write the import rules (the task below).

## Practice

```answer
{
  "id": "swe-06-p1",
  "prompt": "How many rows have a **discount above 20%**?",
  "answer": 7,
  "format": "number",
  "dataset": "invoicing",
  "files": ["invoices_raw"],
  "pyVerify": "int(raw['problems'].map(lambda p: 'discount above 20%' in p).sum())",
  "hint": "The discount above 20% count.",
  "required": true
}
```

```task
{
  "id": "swe-06-t1",
  "prompt": "Write the **import rules** for the invoice export, one per line starting with the problem and a colon: at least **five** problems, each saying whether it's **fixed automatically**, **quarantined for review** (and by whom), or **rejected**, and why.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "Formatted amounts: ...",
  "rules": [
    { "label": "At least five problem lines", "pattern": "^[^:\\n]{4,40}:\\s*\\S", "min": 5 },
    { "label": "Something fixed automatically", "pattern": "automatic|convert|fix(ed)? (in|by) code" },
    { "label": "Something quarantined or reviewed by a named team", "pattern": "(quarantin|review)[^\\n]*(finance|team|support|owner)" },
    { "label": "Duplicates handled", "pattern": "duplicat" },
    { "label": "Discount limit handled", "pattern": "discount" },
    { "label": "No silent dropping", "pattern": "silently (drop|ignore|skip)", "absent": true }
  ],
  "sample": "Formatted amounts: fixed automatically by to_kobo, since removing the naira sign and commas is certain.\nUK-style dates: converted automatically from DD/MM/YYYY, since the export only uses these two formats.\nDuplicates: the second copy is dropped and logged with its invoice ID.\nDiscount above 20%: quarantined for review by the finance team; the code can't know the intended discount.\nUnknown or missing customer: quarantined for review by the finance team, who match it to the right customer.\nZero or negative quantities: quarantined for review by the invoice's author.\nDue date before issue date: quarantined for review by the finance team.",
  "note": "Every row ends up somewhere visible: fixed, dropped with a log, or in a review queue.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why collect all problems for a record instead of stopping at the first?",
    "options": ["It's faster", "So everything wrong can be reported and fixed in one go", "Python requires it", "To use less memory"],
    "answer": 1,
    "explanation": "One round of fixes, not many."
  },
  {
    "prompt": "When is it safe to fix bad data automatically?",
    "options": ["Always", "Only when the correct value is certain, like removing currency symbols", "Never", "When it's quicker"],
    "answer": 1,
    "explanation": "Otherwise send it for review."
  },
  {
    "prompt": "What's wrong with silently dropping invalid rows?",
    "options": ["Nothing", "Totals become wrong and nobody knows why", "It's slow", "It uses memory"],
    "answer": 1,
    "explanation": "Make every decision visible."
  }
]
```
