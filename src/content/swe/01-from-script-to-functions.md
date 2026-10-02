---
title: From script to functions
minutes: 15
summary: Why code that works once isn't yet software, how to turn a copy-and-paste script into small functions with clear inputs and outputs, and the first signs that the numbers it produces are wrong.
---

## The problem

Tallybook started as a script. Every month, someone ran a file that read the invoices, worked out totals with VAT and discounts, and printed them. It worked, mostly. Then it was copied into the month-end job, the customer portal and the API, each copy slightly changed. Customers started noticing that the same invoice could show totals a kobo or two apart in different places.

This course is about the difference between code that works once and **software**: code that's correct, tested, readable, safely changed by a team, and trusted with money. You'll rebuild Tallybook's invoice calculations properly.

## The concept

**Functions**

A function gives a piece of logic a name, clear **inputs** (parameters) and a clear **output** (the return value):

```python norun
def invoice_total(lines, discount_pct, vat_exempt):
    ...
    return total
```

Good functions:

- do **one** job, named for what it does;
- take everything they need as parameters, rather than reading global variables;
- **return** a result rather than printing it, so other code (and tests) can use it;
- are short enough to read in one go.

**Single source of truth**

Each business rule (VAT rate, discount limit, rounding) should live in **one** place. If three copies of the code each apply VAT, they will eventually disagree.

**Tallybook's rules**

| Rule | |
| :-- | :-- |
| Line amount | quantity × unit price |
| Discount | a percentage of the subtotal, at most 20% |
| VAT | 7.5% of the amount after discount, unless the customer is VAT-exempt |
| Rounding | to the nearest kobo, with halves rounded up |

## Example

The original script, more or less as it was:

```python
VAT = 0.075
lines = [{"quantity": 2, "unit_price": 1250.10}, {"quantity": 1, "unit_price": 899.95}]
discount = 10
exempt = False

total = 0
for l in lines:
    total = total + l["quantity"] * l["unit_price"]
total = total - total * discount / 100
if exempt == False:
    total = total + total * VAT
print("Invoice total:", round(total, 2))
```

```text
Invoice total: 3289.65
```

It works for one invoice, typed into the file. Now the same logic as a function, with the rules named and everything passed in:

```python
VAT_RATE = 0.075
MAX_DISCOUNT_PCT = 20

def invoice_total(lines, discount_pct=0, vat_exempt=False):
    """Total for an invoice, in naira: lines are (quantity, unit price) pairs."""
    subtotal = sum(quantity * unit_price for quantity, unit_price in lines)
    after_discount = subtotal - subtotal * discount_pct / 100
    vat = 0 if vat_exempt else after_discount * VAT_RATE
    return round(after_discount + vat, 2)

print(invoice_total([(2, 1250.10), (1, 899.95)], discount_pct=10))
print(invoice_total([(2, 1250.10), (1, 899.95)], discount_pct=10, vat_exempt=True))
```

```text
3289.65
3060.13
```

Now it can be called from anywhere with any invoice, and it gives the same answer as the script. But the function still uses floating-point numbers for money, and still rounds with Python's `round`. Lesson 2 shows why both are wrong for money, using Tallybook's real invoices.

## Walkthrough

1. Run the cells. Call `invoice_total` for an invoice of your own with three lines.
2. What does the script do if someone sets `discount = 50`? What should happen? (Lesson 3 adds the check.)
3. List three things the script does that a function shouldn't (hint: printing, globals, hard-coded data).
4. Load the invoice lines (below) and compute the first invoice's total with the function.

## Practice

```dataset
{"dataset": "invoicing", "files": ["customers", "invoices_raw", "invoice_lines"]}
```

```answer
{
  "id": "swe-01-p1",
  "prompt": "What does `invoice_total([(2, 1250.10), (1, 899.95)], discount_pct=10)` return?",
  "answer": 3289.65,
  "format": "number",
  "pyVerify": "invoice_total([(2, 1250.10), (1, 899.95)], discount_pct=10)",
  "hint": "The first line of the second output.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why should a function return its result rather than print it?",
    "options": ["Printing is slow", "So other code and tests can use the result", "Python requires it", "To save memory"],
    "answer": 1,
    "explanation": "Printed values can't be checked or reused."
  },
  {
    "prompt": "Three copies of the VAT calculation exist in different services. What's the risk?",
    "options": ["None", "They drift apart and give different totals for the same invoice", "They run slower", "They use more memory"],
    "answer": 1,
    "explanation": "One rule, one place."
  },
  {
    "prompt": "What makes a function easy to test?",
    "options": ["Reading global variables", "Taking inputs as parameters and returning a result", "Printing its output", "Being very long"],
    "answer": 1,
    "explanation": "Same inputs, same output, checkable."
  }
]
```
