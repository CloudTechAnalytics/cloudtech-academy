---
title: Variables, BLANKs and readable DAX
minutes: 25
summary: Use VAR and RETURN to write measures you can read and debug, handle BLANK on purpose, and split revenue growth into price and volume.
---

## The problem

Kolanut's revenue for January to June 2026 is ₦290.7m, up 19.1% on the same months of 2025. The managing director's question is the obvious one: "Are we selling **more**, or just charging more?" Prices went up in January 2026, so some of that growth is price and some is volume.

The measure that answers it needs several steps: revenue now, revenue at last year's prices, last year's revenue, and the differences between them. Written as one long nested formula, it's unreadable and impossible to check. Written with **variables**, it reads like the explanation you'd give the director.

## The concept

### VAR and RETURN

```dax
Measure name =
VAR FirstStep = …
VAR SecondStep = … FirstStep …
RETURN
    SecondStep - FirstStep
```

Variables make measures:

- **Readable**: each step has a name.
- **Faster**: a variable is calculated once, however many times you use it.
- **Debuggable**: to check a step, temporarily `RETURN` that variable instead of the result.

One rule catches everyone: **a variable is calculated where it's defined**, in that filter context, and then never changes. `VAR Total = [Revenue]` followed by `CALCULATE ( Total, … )` doesn't recalculate `Total` with the new filters; it returns the same number. Put the `CALCULATE` inside the variable's definition instead.

### BLANK is not zero

DAX uses `BLANK()` for "no value". Visuals hide rows where every measure is blank, which is usually what you want: a product nobody bought in Kano doesn't clutter the table.

- `DIVIDE ( a, b )` returns BLANK when `b` is 0 or blank, or a third argument if you give one: `DIVIDE ( a, b, 0 )`.
- `[Revenue] + 0` turns blanks into zeros, and suddenly the table shows every customer for every month, thousands of empty rows. Only do it when a zero genuinely means something (a sales rep's month with no sales on a performance page).
- `COALESCE ( [Revenue], 0 )` does the same job more explicitly.

### Readable DAX

- One function argument per line, indented, as in the examples in this course.
- Paste long measures into DAX Formatter (daxformatter.com, a free tool from SQLBI) to lay them out consistently.
- Comments: `--` or `//` for a line, `/* … */` for a block.

## Example

First, a calculated column on `products` holding each product's 2025 price (context transition again: each product row filters `orders`):

```dax
Price 2025 = CALCULATE ( MAX ( orders[unit_price] ), 'Date'[Year] = 2025 )
```

Then three measures:

```dax
Revenue at 2025 Prices =
SUMX (
    orders,
    orders[quantity] * RELATED ( products[Price 2025] ) * ( 1 - orders[discount_pct] / 100 )
)

Price Effect =
VAR ActualRevenue = [Revenue]
VAR AtOldPrices = [Revenue at 2025 Prices]
RETURN
    ActualRevenue - AtOldPrices

Volume Effect =
-- growth in revenue at constant (2025) prices, against the same period last year
VAR AtOldPrices = [Revenue at 2025 Prices]
VAR LastYear = CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
RETURN
    AtOldPrices - LastYear
```

For January to June 2026, in a visual filtered to those months:

| | ₦ |
| :-- | --: |
| Revenue, H1 2025 | 244,163,070 |
| + Volume Effect (more units, different mix) | 21,908,445 |
| + Price Effect (the January price rise) | 24,658,940 |
| = Revenue, H1 2026 | 290,730,455 |

The two effects add up exactly to the growth, which is how you know the logic is sound. About half of the ₦46.6m growth came from the price rise and half from selling more. That's a much better answer than "up 19%".

> [!NOTE]
> `Volume Effect` uses `SAMEPERIODLASTYEAR`, which you'll meet properly in the next lesson. Because the data stops at June 2026, it compares like with like at **month** or **quarter** level, or when the visual is filtered to January to June. At **year** level, 2026 (six months) would be compared with all twelve months of 2025. Lesson 6 shows how to make it safe at year level too.

## Walkthrough

1. Add the `Price 2025` column to `products`. In Data view, check that Malt drink 330ml (24) shows ₦13,200, against a list price of ₦14,800.
2. Add the three measures. Put them in a table by `Date[Year]` with `[Revenue]`, and filter the visual to 2026.
3. Debug a step: change `Price Effect` to `RETURN AtOldPrices` and check it shows ₦266,071,515 for 2026. Then put the real `RETURN` back.
4. Try the variable trap. Write `Test = VAR R = [Revenue] RETURN CALCULATE ( R, products[category] = "Snacks" )` and put it in a table by category: every row shows its own revenue, not Snacks, because `R` was already calculated. Delete it.
5. Put `customers[customer_name]` and `Date[Year Month]` in a matrix with `[Revenue]`. Then try `[Revenue] + 0` and see the empty cells fill with zeros. Change it back.

## Practice

```answer
{
  "id": "dax-05-p1",
  "prompt": "What is the **Price Effect** for **2026** (January to June)? (A rounded figure is fine.)",
  "answer": 24658940,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "WITH p25 AS (SELECT product_id, MAX(unit_price) AS p FROM orders WHERE order_date < '2026-01-01' GROUP BY product_id) SELECT ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) - SUM(o.quantity * p25.p * (1 - o.discount_pct / 100.0))) FROM orders o JOIN p25 ON p25.product_id = o.product_id WHERE o.order_date >= '2026-01-01'",
  "hint": "A card with Price Effect, and a Date[Year] slicer set to 2026.",
  "explanation": "₦24.7m of 2026's revenue came from the price rise alone.",
  "required": true
}
```

```answer
{
  "id": "dax-05-p2",
  "prompt": "What is **Revenue at 2025 Prices** for **2026** (January to June)? (A rounded figure is fine.)",
  "answer": 266071515,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "WITH p25 AS (SELECT product_id, MAX(unit_price) AS p FROM orders WHERE order_date < '2026-01-01' GROUP BY product_id) SELECT ROUND(SUM(o.quantity * p25.p * (1 - o.discount_pct / 100.0))) FROM orders o JOIN p25 ON p25.product_id = o.product_id WHERE o.order_date >= '2026-01-01'",
  "hint": "The same visual, with Revenue at 2025 Prices.",
  "explanation": "₦266.1m: what the first half of 2026 would have brought in at the old prices. Against ₦244.2m in H1 2025, that's real volume growth of about 9%.",
  "required": true
}
```

```task
{
  "id": "dax-05-t1",
  "prompt": "This measure works but is hard to read, and calculates `[Revenue]` twice:\n\n```dax\nRevenue Growth % = DIVIDE([Revenue] - CALCULATE([Revenue], SAMEPERIODLASTYEAR('Date'[Date])), CALCULATE([Revenue], SAMEPERIODLASTYEAR('Date'[Date])))\n```\n\nRewrite it with **variables**, so each step is calculated once and has a clear name. Paste your version.",
  "minutes": 5,
  "rows": 8,
  "placeholder": "Revenue Growth % =\nVAR ...",
  "rules": [
    { "label": "Named Revenue Growth %", "pattern": "^\\s*Revenue Growth\\s*%\\s*=" },
    { "label": "At least two variables", "pattern": "\\bVAR\\s+\\w+\\s*=", "min": 2 },
    { "label": "Has a RETURN", "pattern": "\\bRETURN\\b" },
    { "label": "Calls SAMEPERIODLASTYEAR only once", "pattern": "SAMEPERIODLASTYEAR[\\s\\S]*SAMEPERIODLASTYEAR", "absent": true },
    { "label": "Uses DIVIDE", "pattern": "DIVIDE\\s*\\(" }
  ],
  "sample": "```dax\nRevenue Growth % =\nVAR CurrentRevenue = [Revenue]\nVAR LastYearRevenue =\n    CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )\nRETURN\n    DIVIDE ( CurrentRevenue - LastYearRevenue, LastYearRevenue )\n```",
  "note": "Same result, half the work, and anyone can see what it does. If the growth ever looks wrong, change the `RETURN` to `LastYearRevenue` to check that step on its own.",
  "required": true
}
```

## More practice

```answer
{
  "id": "dax-05-d1",
  "prompt": "What is **Price Effect** for the **Kiosk** channel in 2026? (A rounded figure is fine.)",
  "answer": 1135185,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "WITH p25 AS (SELECT product_id, MAX(unit_price) AS p FROM orders WHERE order_date < '2026-01-01' GROUP BY product_id) SELECT ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) - SUM(o.quantity * p25.p * (1 - o.discount_pct / 100.0))) FROM orders o JOIN p25 ON p25.product_id = o.product_id JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01' AND c.channel = 'Kiosk'",
  "hint": "A table by customers[channel], filtered to 2026.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "VAR R = [Revenue] RETURN CALCULATE(R, products[category] = \"Snacks\"). What does it return?",
    "options": ["Snacks revenue", "[Revenue] in the original filter context: the variable was already calculated, so CALCULATE can't change it", "An error", "BLANK"],
    "answer": 1,
    "explanation": "Variables are evaluated where they're defined. Put CALCULATE inside the variable instead."
  },
  {
    "prompt": "Why can [Revenue] + 0 make a report slow and cluttered?",
    "options": ["Adding is slow", "It turns blanks into zeros, so visuals show every combination of rows, even those with no sales", "It changes the data type", "It removes filters"],
    "answer": 1,
    "explanation": "Visuals hide all-blank rows; zeros aren't blank."
  },
  {
    "prompt": "Revenue grew ₦46.6m. Price Effect is ₦24.7m and Volume Effect ₦21.9m. What's the best summary?",
    "options": ["Growth was all price", "Roughly half the growth came from the price rise and half from selling more", "Volume fell", "The measures are wrong because they don't match"],
    "answer": 1,
    "explanation": "The two effects add up to the total growth."
  }
]
```
