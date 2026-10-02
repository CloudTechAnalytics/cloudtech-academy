---
title: Money and rounding
minutes: 15
summary: Why floating-point numbers and Python's round() are wrong for money, how to calculate in whole kobo with Decimal and round half up, and how many of Tallybook's real invoices the old way got wrong.
---

## The problem

Customers complained that totals were sometimes a kobo out. Engineers assumed it was a display issue. It wasn't: the calculation itself was wrong, in two separate ways, and both are among the most common bugs in financial software.

## The concept

**Floating-point numbers can't store most decimals exactly**

Computers store `float` values in binary, and most decimal fractions (like 0.1) have no exact binary form. Small errors appear, and rounding can then go the wrong way:

```python
print(0.1 + 0.2)
print(round(2.675, 2))
```

```text
0.30000000000000004
2.67
```

2.675 is actually stored as slightly less than 2.675, so it rounds down.

**Python's round() rounds halves to even**

`round()` uses "banker's rounding": a value exactly halfway goes to the nearest **even** number. Tallybook's rule (and most invoices') is to round halves **up**:

```python
print(round(16.5), round(17.5), round(0.5))
```

```text
16 18 0
```

**The fix**

- Store money as **whole kobo** in integers. Integers are exact.
- When a calculation produces fractions (VAT, discounts), use `Decimal` and round explicitly with `ROUND_HALF_UP`.
- Convert to naira only for display.

## Example

Tallybook's rules done properly:

```python
from decimal import Decimal, ROUND_HALF_UP

VAT_RATE = Decimal("0.075")
MAX_DISCOUNT_PCT = 20

def round_kobo(amount):
    """Round a Decimal amount of kobo to a whole kobo, halves up."""
    return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))

def invoice_total(lines, discount_pct=0, vat_exempt=False):
    """Total in kobo. Lines are (quantity, unit price in kobo) pairs."""
    subtotal = sum(quantity * unit_price for quantity, unit_price in lines)
    after_discount = subtotal - round_kobo(Decimal(subtotal) * discount_pct / 100)
    vat = 0 if vat_exempt else round_kobo(after_discount * VAT_RATE)
    return after_discount + vat

print(invoice_total([(1, 220)]))     # 220 kobo; VAT is 16.5 kobo, which rounds up to 17
```

```text
237
```

Now compare it with the old float calculation on every real invoice. Load the lines and customers, and compute both:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/invoicing/"
lines = pd.read_csv(base + "invoice_lines.csv", dtype={"unit_price": str})
invoices = pd.read_csv(base + "invoices_raw.csv").drop_duplicates("invoice_id")
customers = pd.read_csv(base + "customers.csv")
invoices = invoices.merge(customers[["customer_id", "vat_exempt"]], on="customer_id", how="left")
bad_quantity = set(lines.loc[lines["quantity"] <= 0, "invoice_id"])
invoices = invoices[(invoices["discount_pct"] <= MAX_DISCOUNT_PCT) & invoices["vat_exempt"].notna() & ~invoices["invoice_id"].isin(bad_quantity)]

def to_kobo(naira):
    return round_kobo(Decimal(naira) * 100)

def old_total(rows, discount_pct, vat_exempt):
    total = sum(q * float(p) for q, p in rows)
    total = total - total * discount_pct / 100
    if not vat_exempt:
        total = total + total * 0.075
    return round(total, 2)

by_invoice = {k: list(zip(g["quantity"], g["unit_price"])) for k, g in lines.groupby("invoice_id")}
results = []
for inv in invoices.itertuples():
    rows = by_invoice[inv.invoice_id]
    new = invoice_total([(q, to_kobo(p)) for q, p in rows], inv.discount_pct, bool(inv.vat_exempt))
    old = round(old_total(rows, inv.discount_pct, bool(inv.vat_exempt)) * 100)
    results.append({"invoice_id": inv.invoice_id, "new_kobo": new, "old_kobo": old})
results = pd.DataFrame(results)
results["difference"] = results["old_kobo"] - results["new_kobo"]
print(len(results), "invoices checked")
results["difference"].value_counts().sort_index()
```

```text
1171 invoices checked
difference
-1     108
 0    1007
 1      56
Name: count, dtype: int64
```

Most invoices agree, but not all. Every disagreement is one kobo, in either direction: exactly the complaints customers made. A kobo is small; an invoicing system that can't be trusted to the kobo is not.

## Walkthrough

1. Run the cells. Pick one invoice with a difference and work through it by hand. Which step went wrong?
2. Why does `Decimal("0.1")` behave differently from `Decimal(0.1)`? Try both.
3. Where else in an app might float money cause trouble (sums, comparisons, payments matching)?
4. Write `to_naira(kobo)` that formats 1250050 as "₦12,500.50".

## Practice

```answer
{
  "id": "swe-02-p1",
  "prompt": "How many invoices does the old float calculation get **wrong** (any difference from the new one)?",
  "answer": 164,
  "format": "number",
  "dataset": "invoicing",
  "files": ["invoice_lines", "invoices_raw", "customers"],
  "pyVerify": "int((results['difference'] != 0).sum())",
  "hint": "Add up the counts for every difference except 0.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why store money as whole kobo in integers?",
    "options": ["It saves space", "Integers are exact; most decimal fractions can't be stored exactly as floats", "Banks require it", "It's faster to type"],
    "answer": 1,
    "explanation": "Exact arithmetic for money."
  },
  {
    "prompt": "What does `round(16.5)` return in Python?",
    "options": ["17", "16", "16.5", "An error"],
    "answer": 1,
    "explanation": "Halves round to the nearest even number."
  },
  {
    "prompt": "How do you round a Decimal half up?",
    "options": ["round()", "quantize with ROUND_HALF_UP", "int()", "math.floor"],
    "answer": 1,
    "explanation": "Say the rounding rule explicitly."
  }
]
```
