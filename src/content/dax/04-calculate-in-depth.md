---
title: CALCULATE in depth
minutes: 25
summary: How CALCULATE adds, replaces and removes filters, and how to build shares of a total, of a category and of what the user selected.
---

## The problem

The regional sales manager for Lagos asks for a table of products, with each product's share of its **category**: "Within Household, how much is detergent?" Your first attempt, `DIVIDE ( [Revenue], CALCULATE ( [Revenue], ALL ( products ) ) )`, gives each product's share of **all** sales, so the shares within a category add up to about a quarter, not 100%. Your second attempt ignores the region slicer the manager has set to Lagos.

Nearly every interesting measure in Power BI is a variation on "the same number, but with different filters". `CALCULATE` is the function that changes filters, and getting exactly the right ones kept, replaced or removed is the core skill of DAX.

## The concept

```dax
CALCULATE ( <expression>, <filter or modifier>, … )
```

`CALCULATE` takes the current filter context, changes it with its arguments, then evaluates the expression.

### Filter arguments replace filters on the same column

```dax
Revenue Wholesale = CALCULATE ( [Revenue], customers[channel] = "Wholesale" )
```

The condition replaces any existing filter on `customers[channel]` and keeps every other filter (region, date, product). In a table by channel, every row shows the wholesale figure, because the row's own channel filter has been replaced.

To **intersect** with an existing filter instead of replacing it, wrap the condition in `KEEPFILTERS`: `CALCULATE ( [Revenue], KEEPFILTERS ( customers[channel] = "Wholesale" ) )` shows wholesale revenue on the Wholesale row and blank on the others.

### Modifiers remove filters

| Modifier | Removes |
| :-- | :-- |
| `REMOVEFILTERS ( products )` or `ALL ( products )` | every filter on the products table |
| `REMOVEFILTERS ( products[product_name] )` | only the filter on that column |
| `ALLEXCEPT ( products, products[category] )` | every products filter **except** category |
| `ALLSELECTED ( products )` | filters from the visual itself, keeping slicers and page filters |

`REMOVEFILTERS` is the modern, clearer name for `ALL` used as a modifier. `ALL` is also a table function you can iterate; `REMOVEFILTERS` can only be used inside `CALCULATE`.

### Three kinds of "share"

```dax
% of Total = DIVIDE ( [Revenue], CALCULATE ( [Revenue], REMOVEFILTERS ( products ) ) )

% of Category = DIVIDE ( [Revenue], CALCULATE ( [Revenue], ALLEXCEPT ( products, products[category] ) ) )

% of Selected = DIVIDE ( [Revenue], CALCULATE ( [Revenue], ALLSELECTED ( products ) ) )
```

None of them touches the `customers` filters, so a Lagos slicer still applies to both the top and bottom of every fraction. That's what the manager needed.

## Example

Picture a matrix with `products[category]` then `products[product_name]` in Rows, `% of Category` and `% of Total` in Values, and a slicer on `customers[region]` set to Lagos. Here's how `% of Category` is worked out at each level:

| Row | Numerator | Denominator |
| :-- | :-- | :-- |
| Detergent 900g (12) | Lagos detergent revenue | Lagos Household revenue |
| Household | Lagos Household revenue | Lagos Household revenue (100%) |
| Total | all Lagos revenue | all Lagos revenue (100%) |

On a **product** row, `ALLEXCEPT ( products, products[category] )` removes the product filter and keeps the category, so the denominator is the category total. On the **category** row the measure divides the category by itself: 100%. On the **grand total** row there's no category filter to keep, so it's 100% again.

## Walkthrough

1. Add `Revenue Wholesale`, `% of Total`, `% of Category` and `% of Selected`, formatted as percentages with one decimal place.
2. Build the matrix from the example, with a slicer on `customers[region]`. Check that `% of Category` adds up to 100% within each category.
3. Put `customers[channel]` in a table with `[Revenue]` and `[Revenue Wholesale]`. Every row shows the wholesale number. Then change the measure to use `KEEPFILTERS` and watch the other rows go blank.
4. Add a visual-level filter that hides one category. `% of Total` no longer adds up to 100% on the visible rows, but `% of Selected` does. Use `% of Selected` when the share must be of what's on screen.
5. Write this measure for the Lagos manager and put it in a card, with the region slicer cleared:

```dax
Wholesale Share =
DIVIDE ( [Revenue Wholesale], CALCULATE ( [Revenue], REMOVEFILTERS ( customers[channel] ) ) )
```

## Practice

```answer
{
  "id": "dax-04-p1",
  "prompt": "With the region slicer set to **Lagos** (all dates), what is **Wholesale Share**? One decimal place.",
  "answer": 74.1,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN c.channel = 'Wholesale' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'Lagos'",
  "hint": "The card responds to the region slicer because the measure only removes the channel filter.",
  "explanation": "74.1%: nine wholesale customers carry three-quarters of Lagos sales.",
  "required": true
}
```

```answer
{
  "id": "dax-04-p2",
  "prompt": "Across all regions and dates, what is **Detergent 900g (12)**'s **% of Category** (Household)? One decimal place.",
  "answer": 32.0,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN p.product_name = 'Detergent 900g (12)' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Household'",
  "hint": "The detergent row of your matrix, with the region slicer cleared.",
  "required": true
}
```

```task
{
  "id": "dax-04-t1",
  "prompt": "Write a measure **% of Region** that shows each customer's share of their **region's** revenue, in a table with customers[region] and customers[customer_name] in the rows. It should still respond to a date slicer. Paste it here.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "% of Region = ...",
  "rules": [
    { "label": "Named % of Region", "pattern": "^\\s*%\\s*of Region\\s*=" },
    { "label": "Uses DIVIDE", "pattern": "DIVIDE\\s*\\(" },
    { "label": "Uses CALCULATE for the denominator", "pattern": "CALCULATE\\s*\\(" },
    { "label": "Keeps the region but removes the customer: ALLEXCEPT(customers, customers[region]) or REMOVEFILTERS on the customer columns", "pattern": "ALLEXCEPT\\s*\\(\\s*customers\\s*,\\s*customers\\[region\\]|REMOVEFILTERS\\s*\\(\\s*customers\\[customer_(name|id)\\]" },
    { "label": "Doesn't remove the Date filters", "pattern": "ALL\\s*\\(\\s*'?Date'?|REMOVEFILTERS\\s*\\(\\s*'?Date'?|REMOVEFILTERS\\s*\\(\\s*\\)", "absent": true }
  ],
  "sample": "```dax\n% of Region =\nDIVIDE (\n    [Revenue],\n    CALCULATE ( [Revenue], ALLEXCEPT ( customers, customers[region] ) )\n)\n```",
  "note": "`ALLEXCEPT ( customers, customers[region] )` removes every customers filter except region, and leaves the Date and products tables alone, so a 2026 slicer still applies to both parts of the fraction.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "dax-04-c1",
  "prompt": "Write `Revenue Lagos = CALCULATE([Revenue], customers[region] = \"Lagos\")`. In a table by **customers[region]**, filtered to **2026**, what does the measure show on the **North West** row? (A rounded figure is fine.)",
  "answer": 152768595,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0))) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'Lagos' AND o.order_date >= '2026-01-01'",
  "hint": "The filter argument replaces the row's region filter, so every row shows the same thing.",
  "explanation": "Lagos's 2026 revenue on every row, North West included: the filter on region was replaced, while the date filter was kept.",
  "required": false
}
```

## More practice

```answer
{
  "id": "dax-04-d1",
  "prompt": "What share of all revenue (all dates) comes from the **Supermarket** channel? Use a % of Total measure that removes the customers filters. One decimal place.",
  "answer": 25.3,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN c.channel = 'Supermarket' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id",
  "hint": "DIVIDE([Revenue], CALCULATE([Revenue], REMOVEFILTERS(customers))) in a table by channel.",
  "required": false
}
```

```answer
{
  "id": "dax-04-d2",
  "prompt": "Legal data: relate invoices to matters. Write `Overdue = CALCULATE(SUM(invoices[amount_ngn]), invoices[status] = \"Overdue\")`. What share of **Commercial litigation** billing is overdue? One decimal place.",
  "answer": 15.0,
  "format": "percent",
  "dataset": "legal",
  "files": ["invoices", "matters"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN i.status = 'Overdue' THEN i.amount_ngn END) / SUM(i.amount_ngn), 1) FROM invoices i JOIN matters m ON m.matter_id = i.matter_id WHERE m.practice_area = 'Commercial litigation'",
  "hint": "DIVIDE([Overdue], SUM(invoices[amount_ngn])) in a table by matters[practice_area].",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In a table by channel, CALCULATE([Revenue], customers[channel] = \"Wholesale\") shows the same number on every row. Why?",
    "options": ["A bug", "The filter argument replaces each row's channel filter", "The relationship is inactive", "CALCULATE ignores filters"],
    "answer": 1,
    "explanation": "Use KEEPFILTERS to intersect with the row's filter instead."
  },
  {
    "prompt": "Which denominator gives each product's share of its own category?",
    "options": ["CALCULATE([Revenue], ALL(products))", "CALCULATE([Revenue], ALLEXCEPT(products, products[category]))", "CALCULATE([Revenue], ALL(customers))", "[Revenue]"],
    "answer": 1,
    "explanation": "ALLEXCEPT removes the product filter but keeps the category."
  },
  {
    "prompt": "A visual filter hides one category. Which measure's rows still add up to 100%?",
    "options": ["% of Total, using REMOVEFILTERS", "% of Selected, using ALLSELECTED", "Both", "Neither"],
    "answer": 1,
    "explanation": "ALLSELECTED keeps filters from outside the visual, so the total is what's on screen."
  }
]
```
