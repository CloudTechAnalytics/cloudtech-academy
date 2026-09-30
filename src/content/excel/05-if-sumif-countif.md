---
title: IF, SUMIF and COUNTIF
minutes: 35
summary: Make decisions inside formulas with IF, and total or count only the rows that meet conditions with SUMIFS and COUNTIFS.
---

## The problem

Filtering answers one question at a time. But the sales director wants a table: revenue by product, lines by month, discounted lines this year. Rebuilding filters for every cell would take all day. **Conditional functions** calculate totals and counts for rows that meet a condition, directly in a formula.

## The concept

**IF: choose between two results**

```excel
=IF(condition, value_if_true, value_if_false)
=IF([@quantity]>=20, "Large", "Small")
```

Combine conditions with `AND` and `OR`:

```excel
=IF(AND([@quantity]>=20, [@discount_pct]=0), "Large, full price", "Other")
```

For several outcomes, `IFS` is easier to read than nested IFs:

```excel
=IFS([@quantity]>=20, "Large", [@quantity]>=10, "Medium", TRUE, "Small")
```

**SUMIF and COUNTIF: one condition**

```excel
=SUMIF(range_to_test, condition, range_to_add)
=SUMIF(Orders[product_id], 1, Orders[revenue])       revenue from product 1
=COUNTIF(Orders[discount_pct], ">0")                  lines with any discount
```

**SUMIFS and COUNTIFS: several conditions** (note the order changes: the range to add comes **first**)

```excel
=SUMIFS(range_to_add, range1, condition1, range2, condition2, …)
=COUNTIFS(range1, condition1, range2, condition2, …)
```

**Conditions with dates or cell values** are built as text with `&`:

```excel
=SUMIFS(Orders[revenue], Orders[order_date], ">="&DATE(2025,10,1), Orders[order_date], "<="&DATE(2025,12,31))
```

That's revenue for October–December 2025: two conditions on the same column give a date range.

> [!TIP]
> Put conditions in cells instead of typing them into formulas: `=SUMIFS(Orders[revenue], Orders[product_id], A2)`. Then a whole column of product IDs in A gives a whole summary table with one formula copied down.

## Example

Revenue per product, as a small summary table:

| A: product_id | B: revenue |
| --: | :-- |
| 1 | `=SUMIFS(Orders[revenue], Orders[product_id], A2)` |
| 2 | (copied down) |
| … | … |

Copy the formula down beside product IDs 1 to 16, and you have revenue for every product.

Here it is built on Kolanut's data, with a second column counting order lines:

![A summary table of product IDs 1 to 16 with revenue from SUMIFS and order lines from COUNTIFS; the formula bar shows the SUMIFS formula for product 1.](/images/courses/excel/sumifs.webp "One SUMIFS formula (1), copied down beside the product IDs (2), gives revenue for every product (3). Product 1 brought in ₦59,804,940.")

## Walkthrough

1. Add a `size` column to the Orders table: `=IF([@quantity]>=20, "Large", "Small")`.
2. Count large lines: `=COUNTIF(Orders[size], "Large")`.
3. Revenue from product 1 (Malt drink): `=SUMIF(Orders[product_id], 1, Orders[revenue])`.
4. Discounted lines in 2026: `=COUNTIFS(Orders[order_date], ">="&DATE(2026,1,1), Orders[discount_pct], ">0")`.

Check step 4 with a filter (order_date in 2026, discount_pct not 0). Two methods agreeing is the best evidence you're right.

## Practice

```answer
{
  "id": "xls-05-p1",
  "prompt": "What was the total revenue from **product 1 (Malt drink 330ml)**? (A rounded figure is fine.)",
  "answer": 59804940,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE product_id = 1",
  "hint": "=SUMIF(Orders[product_id], 1, Orders[revenue])",
  "required": true
}
```

```answer
{
  "id": "xls-05-p2",
  "prompt": "How many order lines in **2026** had a discount greater than 0?",
  "answer": 593,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE order_date >= '2026-01-01' AND discount_pct > 0",
  "hint": "=COUNTIFS(Orders[order_date], \">=\"&DATE(2026,1,1), Orders[discount_pct], \">0\")",
  "required": true
}
```

```answer
{
  "id": "xls-05-p3",
  "prompt": "What was revenue in the **fourth quarter of 2025** (1 October to 31 December)? (A rounded figure is fine.)",
  "answer": 160799625,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2025-10-01' AND '2025-12-31'",
  "hint": "SUMIFS with two conditions on order_date: \">=\"&DATE(2025,10,1) and \"<=\"&DATE(2025,12,31).",
  "explanation": "₦160.8m: nearly 30% of 2025's revenue came in the last three months.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "xls-05-c1",
  "prompt": "How many order lines are **Large** (20 packs or more)?",
  "answer": 1032,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE quantity >= 20",
  "hint": "Either COUNTIF on a size column, or directly: =COUNTIF(Orders[quantity], \">=20\").",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In =SUMIFS(H:H, D:D, \"Lagos\"), which column is added up?",
    "options": ["H:H", "D:D", "\"Lagos\"", "None of them"],
    "answer": 0,
    "explanation": "The first argument of SUMIFS is always the range to add up; the pairs after it are the conditions."
  },
  {
    "prompt": "What does =COUNTIFS(A:A, \"Lagos\", B:B, \">100000\") count?",
    "options": ["Rows where A is Lagos OR B is over 100,000", "Rows where A is Lagos AND B is over 100,000", "All Lagos rows", "The total of B for Lagos"],
    "answer": 1,
    "explanation": "Every condition in COUNTIFS must be true for a row to count."
  },
  {
    "prompt": "In a SUMIFS condition, what does \">=100000\" mean?",
    "options": ["100,000 or more", "Less than 100,000", "Exactly 100,000", "Not 100,000"],
    "answer": 0,
    "explanation": ">= means greater than or equal to."
  }
]
```
