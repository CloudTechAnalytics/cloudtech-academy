---
title: Filter context and row context
minutes: 25
summary: The two ways DAX decides which rows a formula sees, and context transition, the rule that explains most "why is every row the same number?" mysteries.
---

## The problem

A colleague adds a calculated column to the `customers` table to show each customer's lifetime sales:

```dax
Customer Sales (wrong) =
SUMX ( orders, orders[quantity] * orders[unit_price] * ( 1 - orders[discount_pct] / 100 ) )
```

Every one of the 90 customers shows the same number: ₦830,541,245, the whole company's revenue. The formula is the same as the `Revenue` measure, which works perfectly in visuals. So why does it fail here?

The answer is **evaluation context**: the set of rows a formula can see when it runs. It's the single most important idea in DAX. Once it clicks, the rest of the language makes sense.

## The concept

DAX has two kinds of context.

**Filter context** is the set of filters active when a measure is calculated: the row and column headers of the visual, slicers, page and report filters. A measure is recalculated for every cell, each with its own filter context. In a matrix of revenue by `customers[region]`, the "Lagos" cell is calculated with the filter `region = "Lagos"`, which flows down to `orders`.

**Row context** means "the current row" while DAX loops through a table. It exists in two places:

- **Calculated columns**: the formula runs once per row of the table.
- **Iterators** such as `SUMX`, `AVERAGEX` and `FILTER`: the expression runs once per row of the table you pass in.

The crucial rule: **row context doesn't filter anything**. It only lets you read the current row's values, such as `orders[quantity]`. That's why the colleague's column fails: on the row for Kayode Distributors there's a row context on `customers`, but no filter, so `SUMX ( orders, … )` loops over **every** order.

**Context transition**

`CALCULATE` turns the current row context into a filter context: "filter the model to this row". And every **measure reference** is wrapped in an invisible `CALCULATE`. So this column works:

```dax
Customer Sales = [Revenue]
```

On Kayode's row, `[Revenue]` becomes `CALCULATE ( [Revenue] )`, which filters `customers` to Kayode, and that filter flows to `orders`. That's **context transition**, and it's why referencing a measure inside a row context behaves so differently from writing the same formula out in full.

| Formula in a `customers` calculated column | Result on each row |
| :-- | :-- |
| `SUMX ( orders, … )` | the grand total: no filter on orders |
| `[Revenue]` | that customer's revenue: context transition |
| `CALCULATE ( SUMX ( orders, … ) )` | that customer's revenue |
| `SUMX ( RELATEDTABLE ( orders ), … )` | that customer's revenue: only their related rows |

## Example

Two calculated columns on `customers`. The first uses context transition, and the second uses it to group customers into bands:

```dax
Customer Sales = [Revenue]

Customer Band =
SWITCH (
    TRUE (),
    customers[Customer Sales] >= 20000000, "A: ₦20m+",
    customers[Customer Sales] >= 10000000, "B: ₦10m–20m",
    customers[Customer Sales] > 0, "C: under ₦10m",
    "No sales"
)
```

`SWITCH ( TRUE (), … )` checks each condition in order and returns the first one that's true. It's DAX's tidy alternative to nested `IF`s.

Because `Customer Band` is a **column**, you can put it on an axis or in a slicer. A measure can't do that: measures give numbers for a filter context; columns create the categories you filter by.

> [!WARNING]
> Calculated columns are computed when the data refreshes, not when someone clicks a slicer. `Customer Sales` is **lifetime** sales and won't change if a report user filters to 2026. Use a column when you need a fixed category; use a measure when the number must respond to filters.

## Walkthrough

1. On `customers`, add the wrong column from the problem and confirm every row shows ₦830,541,245.
2. Change it to `Customer Sales = [Revenue]`. Each customer now has its own number. Delete the wrong column.
3. Add `Customer Band` from the example and format `Customer Sales` as currency.
4. Build a table visual: `customers[Customer Band]`, `[Active Customers]`, `[Revenue]`. You've just used a column (the band) to slice measures.
5. Add a slicer on `Date[Year]` and select 2026. Revenue changes, but the bands don't, because they were calculated at refresh from lifetime sales.

## Practice

```answer
{
  "id": "dax-02-p1",
  "prompt": "How many customers are in band **B: ₦10m–20m** or above, that is, with lifetime sales of at least ₦10,000,000?",
  "answer": 30,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM (SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(quantity * unit_price * (1 - discount_pct / 100.0)) >= 10000000)",
  "hint": "Your table of Customer Band with a count of customers. Add the A and B rows.",
  "explanation": "30 of 90 customers have bought ₦10m or more. You'll see in lesson 9 that they bring in most of the revenue.",
  "required": true
}
```

```answer
{
  "id": "dax-02-p2",
  "prompt": "Which customer has the highest **Customer Sales**? Type the name as it appears in the data.",
  "answer": "Chuks Trading Co.",
  "accept": ["Chuks Trading Co", "Chuks Trading"],
  "format": "text",
  "hint": "Sort a table of customers[customer_name] and customers[Customer Sales] by sales, highest first.",
  "explanation": "Chuks Trading Co., with ₦47.6m, just ahead of Brother Sunday Wholesale (₦46.5m).",
  "required": true
}
```

```task
{
  "id": "dax-02-t1",
  "prompt": "Write a calculated column for `customers` called **Order Count** that counts each customer's order lines. It must give each customer their **own** number, so think about context transition. Paste it here.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "Order Count = ...",
  "rules": [
    { "label": "Named Order Count", "pattern": "^\\s*Order Count\\s*=" },
    { "label": "Uses a measure reference, CALCULATE or RELATEDTABLE, so each row is filtered to its customer", "pattern": "\\[Order Lines\\]|CALCULATE\\s*\\(|RELATEDTABLE\\s*\\(" },
    { "label": "Doesn't use COUNTROWS(orders) on its own, which would count every order", "pattern": "=\\s*COUNTROWS\\s*\\(\\s*orders\\s*\\)\\s*$", "absent": true }
  ],
  "sample": "```dax\nOrder Count = [Order Lines]\n```",
  "note": "`[Order Lines]` works through context transition. `COUNTROWS ( RELATEDTABLE ( orders ) )` and `CALCULATE ( COUNTROWS ( orders ) )` also work. Plain `COUNTROWS ( orders )` shows 4,266 on every row, for the same reason as the problem.",
  "required": true
}
```

## More practice

```answer
{
  "id": "dax-02-d1",
  "prompt": "On `products`, add `Product Sales = [Revenue]`. What are the lifetime sales of **Detergent 900g (12)**? (A rounded figure is fine.)",
  "answer": 78372810,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0))) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.product_name = 'Detergent 900g (12)'",
  "hint": "Look at the products table in Data view after adding the column.",
  "required": false
}
```

```answer
{
  "id": "dax-02-d2",
  "prompt": "HR data: on `employees`, add `Leave Days = SUM(leave[days])` with **no** CALCULATE, after relating employees to leave. What number appears on every row?",
  "answer": 609,
  "format": "number",
  "dataset": "hr",
  "files": ["leave"],
  "verify": "SELECT SUM(days) FROM leave",
  "hint": "Row context doesn't filter, so SUM sees the whole leave table.",
  "explanation": "The total for everyone. `CALCULATE ( SUM ( leave[days] ) )` would give each employee their own total.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In a calculated column on customers, why does SUM(orders[quantity]) return the same number on every row?",
    "options": ["SUM is broken in columns", "Row context doesn't filter orders; only context transition (CALCULATE or a measure reference) does", "The relationship is missing", "Calculated columns can't use SUM"],
    "answer": 1,
    "explanation": "Row context gives you the current row's values, not a filter."
  },
  {
    "prompt": "What is context transition?",
    "options": ["Moving a measure to another table", "CALCULATE turning the current row context into an equivalent filter context", "Changing a column's data type", "Switching between Report and Data view"],
    "answer": 1,
    "explanation": "It happens with CALCULATE and with every measure reference, which is wrapped in an invisible CALCULATE."
  },
  {
    "prompt": "A report user selects 2026 in a slicer. What happens to a calculated column, Customer Sales = [Revenue]?",
    "options": ["It recalculates for 2026", "Nothing: calculated columns are computed at refresh and don't respond to slicers", "It goes blank", "It shows an error"],
    "answer": 1,
    "explanation": "Use a measure when a number must respond to filters."
  }
]
```
