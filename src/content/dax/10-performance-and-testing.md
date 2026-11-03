---
title: Performance and testing
minutes: 25
summary: Find slow visuals with Performance Analyzer, rewrite the DAX patterns that cause them, and test measures against the source data before anyone else sees them.
---

## The problem

Kolanut's report has grown to five pages and forty measures. The customer page takes eight seconds to load, and the sales director has started exporting to Excel instead. Worse, last week a measure showed ₦76.6m for supermarket sales in one visual and ₦78.0m in another, and nobody could say which was right.

A report that's slow doesn't get used, and a report that's wrong does damage. On 4,266 rows almost anything is fast, but the habits in this lesson are what keep a model fast at 40 million rows, and the testing routine is what lets you say "this number is right" with confidence.

## The concept

### Find the slow part first

**Optimize → Performance Analyzer → Start recording**, then refresh the visuals. Each visual's time is split into:

- **DAX query**: the time the engine spent calculating. This is the part your measures control.
- **Visual display**: drawing. Too many points, or too many visuals on one page.
- **Other**: waiting for other visuals.

Copy a slow visual's query into **DAX query view** to run and change it on its own.

### DAX habits that keep measures fast

| Slow | Faster | Why |
| :-- | :-- | :-- |
| `CALCULATE ( [Revenue], FILTER ( orders, RELATED ( customers[channel] ) = "Wholesale" ) )` | `CALCULATE ( [Revenue], customers[channel] = "Wholesale" )` | filter a **column**, not a whole fact table |
| the same sub-expression written twice | a `VAR` | calculated once |
| `IFERROR ( a / b, 0 )` | `DIVIDE ( a, b, 0 )` | no error handling needed |
| a calculated column on the fact table that's only ever summed | an iterator in a measure | no stored column eating memory |
| bidirectional relationships "to make it work" | single direction plus explicit DAX | ambiguous paths and slower queries |
| `[Revenue] + 0` across big tables | leave blanks blank | visuals stay small |

The model matters as much as the DAX. Remove columns nobody uses, and reduce the number of distinct values (split a date-time into a date and a time; round long decimals). The engine compresses columns, and fewer distinct values compress far better.

### Testing measures

Before a report goes out, test each important measure:

1. **Reconcile with the source.** Pick a total and check it outside Power BI: in SQL, Excel or the source system.
2. **Test at every level.** Check a row, a subtotal and the grand total. Ratios and distinct counts often don't add up across rows, and they shouldn't. Make sure the total means what the reader will think it means.
3. **Test the edges.** A period with no sales, a customer with one order, a filter that leaves nothing.
4. **Compare two routes to the same number.** `Gross Revenue − Discount Amount` should equal `Revenue`.

DAX query view makes these checks fast:

```dax
EVALUATE
ROW (
    "Order lines", COUNTROWS ( orders ),
    "Revenue", [Revenue],
    "Check", [Gross Revenue] - [Discount Amount] - [Revenue]
)
```

`Check` should be 0.

## Example

The ₦76.6m versus ₦78.0m mystery. One visual used:

```dax
Supermarket Revenue = CALCULATE ( [Revenue], customers[channel] = "Supermarket" )
```

The other used a copy of the formula pasted months earlier, before discounts were part of revenue:

```dax
Supermarket Revenue (old) =
CALCULATE (
    SUMX ( orders, orders[quantity] * orders[unit_price] ),
    FILTER ( orders, RELATED ( customers[channel] ) = "Supermarket" )
)
```

The old version is wrong (it ignores discounts) **and** slow (it filters the whole orders table row by row). For January to June 2026, a SQL query on the source gives ₦76,556,135 of supermarket revenue after discounts, which reconciles with the first measure. The fix is the same as in lesson 1: one base measure, reused, and no pasted copies.

## Walkthrough

1. Open Performance Analyzer, start recording and click **Refresh visuals**. Expand the slowest visual and note its DAX query time.
2. Click **Copy query** on that visual, paste it into DAX query view and run it.
3. Run the `EVALUATE ROW` test from the concept section. Check that `Order lines` is 4,266 and `Check` is 0.
4. Run a reconciliation query for supermarket revenue in January to June 2026:

```dax
EVALUATE
SUMMARIZECOLUMNS (
    customers[channel],
    TREATAS ( { 2026 }, 'Date'[Year] ),
    "Revenue", [Revenue]
)
```

5. Search your measures for `FILTER ( orders` and `IFERROR`, and rewrite each one using the table above.

## Practice

```answer
{
  "id": "dax-10-p1",
  "prompt": "Run the reconciliation query in step 4. What is **Supermarket** revenue for 2026? (A rounded figure is fine.)",
  "answer": 76556135,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0))) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Supermarket' AND o.order_date >= '2026-01-01'",
  "hint": "The Supermarket row of the SUMMARIZECOLUMNS result.",
  "required": true
}
```

```answer
{
  "id": "dax-10-p2",
  "prompt": "How much revenue did the old measure **overstate** supermarket sales by in 2026, because it ignored discounts? (Gross minus net for Supermarket, 2026. A rounded figure is fine.)",
  "answer": 1415065,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(SUM(o.quantity * o.unit_price) - SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0))) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Supermarket' AND o.order_date >= '2026-01-01'",
  "hint": "Discount Amount for Supermarket in 2026.",
  "required": true
}
```

```task
{
  "id": "dax-10-t1",
  "prompt": "Rewrite this slow measure so it filters a column instead of the whole orders table, and builds on the base measure:\n\n```dax\nNorth Revenue = CALCULATE(SUMX(orders, orders[quantity] * orders[unit_price] * (1 - orders[discount_pct] / 100)), FILTER(orders, RELATED(customers[region]) = \"North Central\" || RELATED(customers[region]) = \"North West\"))\n```\n\nPaste your version.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "North Revenue = ...",
  "rules": [
    { "label": "Named North Revenue", "pattern": "^\\s*North Revenue\\s*=" },
    { "label": "Uses the [Revenue] base measure", "pattern": "\\[Revenue\\]" },
    { "label": "Filters the customers[region] column directly", "pattern": "customers\\[region\\]\\s*(IN\\s*\\{|=)" },
    { "label": "No FILTER over the orders table", "pattern": "FILTER\\s*\\(\\s*orders", "absent": true },
    { "label": "No RELATED", "pattern": "RELATED\\s*\\(", "absent": true }
  ],
  "sample": "```dax\nNorth Revenue =\nCALCULATE (\n    [Revenue],\n    customers[region] IN { \"North Central\", \"North West\" }\n)\n```",
  "note": "`IN { … }` filters the region column to a list of values. The engine filters 90 customers and lets the relationship do the rest, instead of testing 4,266 order lines one at a time.",
  "required": true
}
```

## More practice

```answer
{
  "id": "dax-10-d1",
  "prompt": "Run `EVALUATE ROW(\"Lines\", COUNTROWS(orders), \"Customers\", DISTINCTCOUNT(orders[customer_id]), \"Units\", [Units])`. What is **Units**?",
  "answer": 58757,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity) FROM orders",
  "hint": "DAX query view shows a one-row table.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Performance Analyzer shows a visual spending 7 seconds in 'DAX query' and 0.2 in 'Visual display'. Where should you look?",
    "options": ["The visual's colours", "The measures and model behind the visual", "The number of pages", "Your internet connection"],
    "answer": 1,
    "explanation": "DAX query time is calculation time."
  },
  {
    "prompt": "Why is CALCULATE([Revenue], customers[channel] = \"Wholesale\") usually faster than filtering the orders table with FILTER(orders, RELATED(…))?",
    "options": ["It isn't", "It filters one column of a small table and lets the relationship do the rest, instead of testing every order row", "RELATED is deprecated", "FILTER returns the wrong rows"],
    "answer": 1,
    "explanation": "Filter columns, not tables, in CALCULATE."
  },
  {
    "prompt": "Two visuals show different numbers for 'supermarket revenue'. What's the most likely cause?",
    "options": ["Power BI is unreliable", "Two different measures, one of them a pasted copy with an old definition", "The data changed between visuals", "Rounding"],
    "answer": 1,
    "explanation": "One base measure, reused everywhere, prevents it."
  }
]
```
