---
title: Table functions and virtual tables
minutes: 25
summary: Build tables inside a measure with FILTER, VALUES, SUMMARIZE and ADDCOLUMNS, count the customers that meet a condition, and test your tables in DAX query view.
---

## The problem

The commercial director asks three questions for the quarterly review:

1. How many customers spent more than ₦10m in 2025?
2. How many **new** customers did we win in 2026?
3. How many customers buy from **all four** of our categories?

None of them is a sum or an average of a column. Each one is "count the customers that meet a condition", and the condition is itself a calculation. To answer them, a measure has to build a **table of customers** in memory, test each one and count the survivors. That's what table functions are for.

## The concept

Some DAX functions return a **table** rather than a value. You can't show a table in a card, but you can count it, iterate it or use it as a filter.

| Function | Returns |
| :-- | :-- |
| `VALUES ( column )` | the distinct values of a column visible in the current filter context |
| `ALL ( table or column )` | every row or value, ignoring filters |
| `FILTER ( table, condition )` | the rows of a table where the condition is true, tested row by row |
| `SUMMARIZE ( table, column, … )` | the distinct combinations of columns that exist in a table |
| `ADDCOLUMNS ( table, "Name", expression )` | the table with calculated columns added |
| `CALCULATETABLE ( table, filters… )` | a table evaluated under modified filters |

The pattern behind all three questions:

```dax
COUNTROWS ( FILTER ( VALUES ( orders[customer_id] ), <condition per customer> ) )
```

`FILTER` iterates the customers, so the condition runs in a row context. Use a **measure** in the condition and context transition calculates it for each customer.

### Filter direction matters in table logic too

You might try to count each customer's categories with `CALCULATE ( DISTINCTCOUNT ( products[category] ) )`. It returns **4 for everyone**: filters flow from `products` to `orders`, never from `orders` back to `products`. Count the categories **through the fact table** instead:

```dax
COUNTROWS ( SUMMARIZE ( orders, products[category] ) )
```

`SUMMARIZE` lists the categories that actually appear in the customer's order lines.

### DAX query view

Power BI Desktop's **DAX query view** (the fourth icon on the left) runs a query and shows the resulting table, so you can see a virtual table before you count it:

```dax
EVALUATE
ADDCOLUMNS (
    VALUES ( customers[customer_name] ),
    "Revenue 2025", CALCULATE ( [Revenue], 'Date'[Year] = 2025 )
)
ORDER BY [Revenue 2025] DESC
```

## Example

```dax
Big Customers =
COUNTROWS (
    FILTER ( VALUES ( orders[customer_id] ), [Revenue] > 10000000 )
)

New Customers =
VAR PeriodStart = MIN ( 'Date'[Date] )
RETURN
    COUNTROWS (
        FILTER (
            VALUES ( orders[customer_id] ),
            CALCULATE ( MIN ( orders[order_date] ), REMOVEFILTERS ( 'Date' ) ) >= PeriodStart
        )
    )

All-Category Customers =
COUNTROWS (
    FILTER (
        VALUES ( orders[customer_id] ),
        CALCULATE ( COUNTROWS ( SUMMARIZE ( orders, products[category] ) ) ) = 4
    )
)
```

`New Customers` takes the customers who bought in the period, works out each one's **first ever** order date (removing the date filter), and keeps those whose first order falls inside the period. `PeriodStart` is a variable because it must be the start of the **visual's** period, captured before `FILTER` starts iterating.

> [!WARNING]
> Kolanut's data starts in January 2025, so in 2025 every customer looks "new": we can't see orders before the data begins. Only trust `New Customers` for periods after the start of the data. Say so on the report.

## Walkthrough

1. Open DAX query view and run the `EVALUATE` query from the concept section. You'll see 90 rows: the virtual table `Big Customers` filters.
2. Add the three measures, and put them in a table by `Date[Year]`.
3. Check `Big Customers` for 2025 in DAX query view: add `FILTER ( …, [Revenue 2025] > 10000000 )` around the `ADDCOLUMNS` and count the rows.
4. Try the wrong version of the category count, `CALCULATE ( DISTINCTCOUNT ( products[category] ) ) = 4`. Every buying customer passes. Then switch back.
5. Add `customers[channel]` to the table. Which channel do the new customers of 2026 come from?

## Practice

```answer
{
  "id": "dax-07-p1",
  "prompt": "How many **Big Customers** (revenue over ₦10m) were there in **2025**?",
  "answer": 18,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM (SELECT customer_id FROM orders WHERE order_date < '2026-01-01' GROUP BY customer_id HAVING SUM(quantity * unit_price * (1 - discount_pct / 100.0)) > 10000000)",
  "hint": "The 2025 row of your table.",
  "required": true
}
```

```answer
{
  "id": "dax-07-p2",
  "prompt": "How many **New Customers** did Kolanut win in **2026**?",
  "answer": 9,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM (SELECT customer_id FROM orders GROUP BY customer_id HAVING MIN(order_date) >= '2026-01-01')",
  "hint": "The 2026 row. In 2025 the measure shows 81, but that's the start of the data, not 81 new customers.",
  "explanation": "Nine new customers, all of them kiosks or supermarkets.",
  "required": true
}
```

```answer
{
  "id": "dax-07-p3",
  "prompt": "How many customers bought from **all four categories** in **2026**?",
  "answer": 55,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT COUNT(*) FROM (SELECT o.customer_id FROM orders o JOIN products p ON p.product_id = o.product_id WHERE o.order_date >= '2026-01-01' GROUP BY o.customer_id HAVING COUNT(DISTINCT p.category) = 4)",
  "hint": "Count the categories through orders with SUMMARIZE, not DISTINCTCOUNT on products.",
  "explanation": "55 of the 90 customers. The other 35 are cross-selling opportunities: they already buy from Kolanut, just not everything.",
  "required": true
}
```

## More practice

```answer
{
  "id": "dax-07-d1",
  "prompt": "How many customers bought from **exactly one** category in 2026?",
  "answer": 3,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT COUNT(*) FROM (SELECT o.customer_id FROM orders o JOIN products p ON p.product_id = o.product_id WHERE o.order_date >= '2026-01-01' GROUP BY o.customer_id HAVING COUNT(DISTINCT p.category) = 1)",
  "hint": "Change = 4 to = 1.",
  "required": false
}
```

```answer
{
  "id": "dax-07-d2",
  "prompt": "Legal data: how many clients have more than ₦20m of invoices in total? Use COUNTROWS(FILTER(VALUES(matters[client_id]), …)) with invoices related to matters.",
  "answer": 27,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices", "matters"],
  "verify": "SELECT COUNT(*) FROM (SELECT m.client_id FROM invoices i JOIN matters m ON m.matter_id = i.matter_id GROUP BY m.client_id HAVING SUM(i.amount_ngn) > 20000000)",
  "hint": "Inside FILTER, CALCULATE(SUM(invoices[amount_ngn])) gives each client's total.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which expression counts customers whose revenue in the current period is over ₦10m?",
    "options": ["COUNTROWS(customers) > 10000000", "COUNTROWS(FILTER(VALUES(orders[customer_id]), [Revenue] > 10000000))", "CALCULATE([Revenue] > 10000000)", "SUM(customers[customer_id])"],
    "answer": 1,
    "explanation": "Build the table of customers, filter it with a measure, count what's left."
  },
  {
    "prompt": "Why does CALCULATE(DISTINCTCOUNT(products[category])) return 4 for every customer?",
    "options": ["Every customer buys everything", "Filters flow from products to orders, not from orders back to products, so the customer filter never reaches products", "DISTINCTCOUNT ignores filters", "The relationship is many-to-many"],
    "answer": 1,
    "explanation": "Count through the fact table, with SUMMARIZE(orders, products[category])."
  },
  {
    "prompt": "Data starts in January 2025. What will New Customers show for 2025, and why?",
    "options": ["0", "Every customer who bought in 2025, because orders before the data starts can't be seen", "The true number of new customers", "An error"],
    "answer": 1,
    "explanation": "That's left-censoring; trust the measure only after the start of the data."
  }
]
```
