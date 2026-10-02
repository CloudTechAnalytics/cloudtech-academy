---
title: Debugging
minutes: 15
summary: Read a traceback from the bottom up, narrow a failure down to the exact input that causes it, and use the data to find every row with the same problem, instead of fixing them one crash at a time.
---

## The problem

The month-end job loads the invoice export and adds up what customers paid. It crashed. The engineer on duty found the bad row, edited it by hand, and re-ran the job. It crashed again on a different row. After the third time, they asked for help.

Debugging is a method, not luck: read the error properly, reproduce it with the smallest input, find **all** the inputs like it, then fix the cause.

## The concept

**Reading a traceback**

A traceback lists the calls that led to an error, most recent **last**. Read it from the bottom:

1. The last line: the **type** of error and its message (`ValueError: could not convert string to float: '₦12,500.00'`).
2. The lines above: **where** it happened, innermost call last.

**A debugging method**

| Step | Question |
| :-- | :-- |
| Read | what failed, and on what value? |
| Reproduce | can I make it fail with one small input? |
| Find all | how many inputs share the problem, and what kinds? |
| Fix the cause | handle every kind properly, not just the first one found |
| Test | add a test with the input that failed |

**Look at the data, not just the code**

When code crashes on data, the fastest route is often to ask the data directly: which values in this column don't look like the rest?

## Example

The job's loading step, simplified. Instead of letting it crash, catch the error so you can read it:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
raw = pd.read_csv(base + "invoices_raw.csv", dtype=str, keep_default_na=False)

total_paid = 0.0
try:
    for i, row in raw.iterrows():
        total_paid += float(row["amount_paid"])
except ValueError as error:
    print(f"Row {i} ({row['invoice_id']}): {type(error).__name__}: {error}")
```

```text
Row 98 (INV-100099): ValueError: could not convert string to float: '₦125,179.79'
```

That's one bad value. Instead of fixing it and waiting for the next crash, find every value that isn't a plain number:

```python
plain_number = raw["amount_paid"].str.fullmatch(r"\d+(\.\d{1,2})?")
odd = raw.loc[~plain_number, "amount_paid"]
print(len(odd), "amounts aren't plain numbers")
print(odd.head(5).to_string())
print("Kinds:", odd.str.replace(r"\d", "9", regex=True).value_counts().to_dict())
```

```text
27 amounts aren't plain numbers
98     ₦125,179.79
131    ₦460,653.17
184     ₦13,701.95
227    ₦157,928.02
233     ₦26,961.40
Kinds: {'₦999,999.99': 13, '₦99,999.99': 12, '₦9,999.99': 2}
```

They're all the same kind: amounts formatted with the naira sign and thousands commas, the way a spreadsheet shows them. The `to_kobo` function from lesson 3 already handles exactly that. Use it for every row:

```python
from decimal import Decimal, ROUND_HALF_UP

def to_kobo(naira):
    cleaned = naira.replace("₦", "").replace(",", "").strip()
    return int((Decimal(cleaned) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

raw["paid_kobo"] = raw["amount_paid"].map(to_kobo)
print(f"Total paid: ₦{raw['paid_kobo'].sum() / 100:,.2f} across {len(raw)} rows")
```

```text
Total paid: ₦111,025,044.57 across 1205 rows
```

One fix for the whole class of problem, instead of one edit per crash. (There are other problems in this export too, such as duplicate invoices, which would make this total wrong. Lesson 6 deals with them.)

## Walkthrough

1. Run the cells. Write a pytest test for `to_kobo` using one of the odd values.
2. Run `float("₦12,500.00")` in a cell and read the full traceback from the bottom up.
3. Check the `issue_date` column the same way: which values don't look like `2026-08-31`?
4. Why was editing the bad rows by hand the wrong fix?

## Practice

```answer
{
  "id": "swe-05-p1",
  "prompt": "How many `amount_paid` values aren't plain numbers?",
  "answer": 27,
  "format": "number",
  "dataset": "invoicing",
  "files": ["invoices_raw"],
  "pyVerify": "int((~plain_number).sum())",
  "hint": "The first line of the second output.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Where do you start reading a Python traceback?",
    "options": ["The first line", "The last line: the error type and message", "The middle", "It doesn't matter"],
    "answer": 1,
    "explanation": "Most recent call last."
  },
  {
    "prompt": "The job crashes on one bad row. What's the best next step?",
    "options": ["Edit that row and rerun", "Find every row with the same kind of problem and handle them all", "Catch and ignore all errors", "Delete the row"],
    "answer": 1,
    "explanation": "Fix the class of problem, not one instance."
  },
  {
    "prompt": "Why catch the exception while debugging?",
    "options": ["To hide it", "To see exactly which input caused it, then look for others like it", "To speed up the code", "It's required"],
    "answer": 1,
    "explanation": "Then decide how to handle it properly."
  }
]
```
