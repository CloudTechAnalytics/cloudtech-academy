---
title: "Iterators: SUMX, AVERAGEX and friends"
minutes: 25
summary: Calculate row by row and then aggregate, choose the right "average of what", and use RELATED to bring values from a dimension into the loop.
---

## The problem

The sales director asks a simple-sounding question: "What's our average sale?" Three analysts give three answers:

- ₦194,689: the average **order line**.
- ₦6.66m: the average **customer** in 2025.
- ₦44.98m: the average **month** in 2025.

All three are correct. They're averages of different things. An "average" in DAX is never just `AVERAGE(column)`: you have to decide **what you're averaging over**, and that's what iterators let you say.

## The concept

An **iterator** loops over a table, evaluates an expression for each row (in row context), then aggregates the results:

```dax
SUMX ( <table>, <expression> )
```

| Iterator | Aggregates with |
| :-- | :-- |
| `SUMX` | sum |
| `AVERAGEX` | average, **skipping blanks** |
| `MINX`, `MAXX` | smallest, largest |
| `COUNTX` | count of non-blank results |
| `CONCATENATEX` | joins text, such as a list of names |

`SUM ( orders[quantity] )` is really shorthand for `SUMX ( orders, orders[quantity] )`.

**The table you iterate decides the "average of what"**

| Measure | Iterates over | Means |
| :-- | :-- | :-- |
| `AVERAGEX ( orders, … )` | order lines | average line value |
| `AVERAGEX ( VALUES ( orders[customer_id] ), [Revenue] )` | customers who bought | average revenue per customer |
| `AVERAGEX ( VALUES ( 'Date'[Year Month] ), [Revenue] )` | months | average monthly revenue |

`VALUES ( column )` returns the distinct values of a column that are visible in the current filter context, so it's the natural thing to iterate when you want "per customer" or "per month".

When you iterate a list of customers and call `[Revenue]`, **context transition** filters each customer in turn, which is exactly what lesson 2 explained. And because `AVERAGEX` skips blanks, months with no sales (such as July 2026, which hasn't happened) don't drag the average down.

**RELATED inside an iterator**

While iterating `orders` (the many side), `RELATED ( products[list_price] )` fetches the matching value from the one side. That lets you compare what customers paid with the list price.

## Example

```dax
Avg Line Value = AVERAGEX ( orders, orders[quantity] * orders[unit_price] * ( 1 - orders[discount_pct] / 100 ) )

Avg Revenue per Customer = AVERAGEX ( VALUES ( orders[customer_id] ), [Revenue] )

Avg Monthly Revenue = AVERAGEX ( VALUES ( 'Date'[Year Month] ), [Revenue] )

Best Month Revenue = MAXX ( VALUES ( 'Date'[Year Month] ), [Revenue] )

Revenue at List Price = SUMX ( orders, orders[quantity] * RELATED ( products[list_price] ) )

Below List % = 1 - DIVIDE ( [Revenue], [Revenue at List Price] )
```

`Best Month Revenue` shows ₦66.3m across all dates: December 2025, the festive peak. In a matrix by year, it shows each year's best month instead, because `VALUES ( 'Date'[Year Month] )` only returns the months in that year's filter context.

## Walkthrough

1. Add the six measures to `_Measures` and format them.
2. Build a table with `Date[Year]` and `Avg Line Value`, `Avg Revenue per Customer` and `Avg Monthly Revenue`. The three "averages" differ by factors of about 30 and 200.
3. Replace `VALUES ( orders[customer_id] )` with `VALUES ( customers[customer_id] )` and compare the 2025 figure. It's the same, because `[Revenue]` is blank for the nine customers who didn't buy in 2025 and `AVERAGEX` skips them. Now try `[Revenue] + 0` inside the `AVERAGEX`: the zeros count, and the average falls. Decide which you mean, and write it deliberately.
4. Put `Below List %` in a table by `Date[Year]`. In 2026 it's just the discount; in 2025 it's much bigger. The difference is the January 2026 price rise: 2025 sales were at the old prices.

## Practice

```answer
{
  "id": "dax-03-p1",
  "prompt": "What is **Avg Revenue per Customer** in **2025**? (A rounded figure is fine.)",
  "answer": 6664330.7,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) / COUNT(DISTINCT customer_id) FROM orders WHERE order_date < '2026-01-01'",
  "hint": "Table: Date[Year] and Avg Revenue per Customer.",
  "explanation": "About ₦6.66m: ₦539.8m of revenue from 81 customers.",
  "required": true
}
```

```answer
{
  "id": "dax-03-p2",
  "prompt": "In **2025**, how far below today's list prices was Revenue? Give **Below List %** to one decimal place.",
  "answer": 11.6,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT ROUND(100.0 * (1 - SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) / SUM(o.quantity * p.list_price)), 1) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE o.order_date < '2026-01-01'",
  "hint": "Table: Date[Year] and Below List %.",
  "explanation": "11.6% in 2025: the old, lower prices plus discounts. In 2026 it's only the discount, because unit prices now equal the list price.",
  "required": true
}
```

```task
{
  "id": "dax-03-t1",
  "prompt": "Write a measure **Avg Units per Customer**: the average number of units (packs) bought per customer who ordered, in the current filter context. Paste it here.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "Avg Units per Customer = ...",
  "rules": [
    { "label": "Named Avg Units per Customer", "pattern": "^\\s*Avg Units per Customer\\s*=" },
    { "label": "Uses AVERAGEX, or DIVIDE of units by customers", "pattern": "AVERAGEX\\s*\\(|DIVIDE\\s*\\(" },
    { "label": "Works per customer: iterates customer_id values or divides by a customer count", "pattern": "customer_id|\\[Active Customers\\]" }
  ],
  "sample": "```dax\nAvg Units per Customer =\nAVERAGEX ( VALUES ( orders[customer_id] ), [Units] )\n```",
  "note": "`DIVIDE ( [Units], [Active Customers] )` gives the same result here and is a fine alternative. The AVERAGEX version makes the \"per customer\" explicit.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "dax-03-c1",
  "prompt": "What is **Best Month Revenue** in **2026** (January to June)? (A rounded figure is fine.)",
  "answer": 54580085,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT MAX(r) FROM (SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) AS r FROM orders WHERE order_date >= '2026-01-01' GROUP BY strftime('%Y-%m', order_date))",
  "hint": "The same measure, in the 2026 row of a table by Date[Year].",
  "explanation": "April 2026, ₦54.6m.",
  "required": false
}
```

## More practice

```answer
{
  "id": "dax-03-d1",
  "prompt": "What is **Avg Line Value** across all dates? Round to the nearest naira.",
  "answer": 194689,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(AVG(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders",
  "hint": "A card with the measure and no filters.",
  "required": false
}
```

```answer
{
  "id": "dax-03-d2",
  "prompt": "Legal data: write `Avg Invoice per Matter = AVERAGEX(VALUES(invoices[matter_id]), CALCULATE(SUM(invoices[amount_ngn])))`. What is it across all invoices? Round to the nearest naira.",
  "answer": 8065436,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(SUM(amount_ngn) * 1.0 / COUNT(DISTINCT matter_id)) FROM invoices",
  "hint": "Total billed divided by the number of matters with invoices.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which measure gives the average revenue per customer who bought?",
    "options": ["AVERAGE(orders[revenue])", "AVERAGEX(VALUES(orders[customer_id]), [Revenue])", "SUMX(orders, [Revenue])", "COUNTROWS(customers)"],
    "answer": 1,
    "explanation": "Iterate the customers, and context transition calculates each one's revenue."
  },
  {
    "prompt": "AVERAGEX(VALUES(customers[customer_id]), [Revenue]) in 2025, when 9 of 90 customers didn't buy. What does it divide by?",
    "options": ["90", "81: AVERAGEX skips blank results", "9", "It returns an error"],
    "answer": 1,
    "explanation": "Blank [Revenue] values are ignored. Adding + 0 would make them count as zeros."
  },
  {
    "prompt": "Why does RELATED(products[list_price]) work inside SUMX(orders, …)?",
    "options": ["RELATED works anywhere", "SUMX gives a row context on orders, and RELATED follows the relationship from the many side to the one side", "products is filtered automatically", "list_price is a measure"],
    "answer": 1,
    "explanation": "RELATED needs a row context on the many side of a relationship."
  }
]
```
