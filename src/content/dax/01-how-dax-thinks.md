---
title: How DAX thinks
minutes: 25
summary: Set up the Kolanut model you'll use all course, write the base measures every report builds on, and learn the habits that keep a measure library trustworthy.
---

## The problem

Kolanut Distribution's sales manager opens last month's Power BI report and sees three different revenue figures on three pages: ₦830.5m, ₦859.6m and ₦831.0m. One visual summed the list price, one summed revenue before discounts, and one summed a column somebody had rounded. Each was "Sum of something", dragged straight into a visual.

Nobody trusts the report now, and that's the real cost. A model with one `Revenue` measure, defined once and reused everywhere, can't disagree with itself.

In Power BI Fundamentals you wrote your first measures. This course goes deep: how DAX really evaluates a formula, `CALCULATE`, time intelligence, table functions, ranking, customer analytics and performance. It starts with a model and measures you can trust.

## The concept

**The model comes first**

DAX is evaluated over the **model**: tables joined by relationships, with filters flowing from the "one" side to the "many" side. Kolanut's model is a small star schema:

| Table | Type | Rows | Relationship |
| :-- | :-- | --: | :-- |
| `orders` | Fact: one row per order line | 4,266 | the "many" side of everything |
| `customers` | Dimension | 90 | `customers[customer_id]` 1 → * `orders[customer_id]` |
| `products` | Dimension | 16 | `products[product_id]` 1 → * `orders[product_id]` |
| `Date` | Dimension (calendar) | 730 | `Date[Date]` 1 → * `orders[order_date]` |

Filters flow **downhill**, from a dimension to the fact. Selecting "Lagos" in `customers[region]` filters `orders`. Selecting a product filters `orders` too. But nothing flows back up: filtering `orders` doesn't filter `products`. You'll meet the consequences of that in almost every lesson.

**Measures, not dragged columns**

Every number in a report should come from an explicit measure: written once, named clearly, formatted, and reused. Dragging a column into a visual creates an "implicit measure" that nobody can find, check or reuse.

**Base measures first, then build on them**

Write a handful of simple **base measures**, then build everything else from them. When the definition of revenue changes, you change one measure and the whole report follows.

**Habits of a trustworthy measure library**

- Keep measures in a dedicated `_Measures` table, in display folders (Sales, Customers, Time).
- Name them as a manager would say them: `Revenue`, `Discount %`, `Active Customers`.
- Format every measure (₦ with thousands separators, % with one decimal place).
- Write a one-line **description** on each measure (Properties pane). It shows as a tooltip in the Data pane.

## Example

Kolanut's base measures. `Revenue` is calculated from the order lines, so it doesn't depend on a column someone added in Power Query:

```dax
Revenue =
SUMX (
    orders,
    orders[quantity] * orders[unit_price] * ( 1 - orders[discount_pct] / 100 )
)

Gross Revenue =
SUMX ( orders, orders[quantity] * orders[unit_price] )

Discount Amount = [Gross Revenue] - [Revenue]

Discount % = DIVIDE ( [Discount Amount], [Gross Revenue] )

Order Lines = COUNTROWS ( orders )

Units = SUM ( orders[quantity] )

Active Customers = DISTINCTCOUNT ( orders[customer_id] )
```

The three figures from the problem are now three named measures: `Revenue` (₦830.5m, what customers actually pay), `Gross Revenue` (₦859.6m, before discounts) and the difference between them, `Discount Amount`. Each one is clearly labelled, and none of them can be confused with another.

## Walkthrough

1. Download the sales dataset and load `orders.csv`, `customers.csv` and `products.csv` into Power BI Desktop. In Power Query, check that `order_date` is a **Date** and that `quantity`, `unit_price` and `discount_pct` are **Whole number**.
2. Create the date table with **Modeling → New table**:

```dax
Date =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2025, 1, 1 ), DATE ( 2026, 12, 31 ) ),
    "Year", YEAR ( [Date] ),
    "Quarter", "Q" & ROUNDUP ( MONTH ( [Date] ) / 3, 0 ),
    "Month Number", MONTH ( [Date] ),
    "Month", FORMAT ( [Date], "mmm" ),
    "Year Month", FORMAT ( [Date], "yyyy-mm" )
)
```

3. Mark it as a date table (**Table tools → Mark as date table**, column `Date`), and sort `Month` by `Month Number`.
4. In Model view, create the three relationships in the table above. Check each is **one-to-many** with a **single** cross-filter direction.
5. Create a `_Measures` table (**Home → Enter data**, load an empty table), then add the seven base measures from the example.
6. Format them: `Revenue`, `Gross Revenue` and `Discount Amount` as currency with no decimals; `Discount %` as a percentage with one decimal place; the counts as whole numbers.
7. Put the measures into a display folder called `Sales` (Model view → select the measures → Properties → Display folder), and give `Revenue` the description "What customers pay: quantity × price, after discount."
8. Check your model: a card with `Revenue` should show **₦830,541,245**.

> [!TIP]
> Keep this file. Every lesson in the course builds on it, so save it as `kolanut-dax.pbix` and add to it as you go.

## Practice

```dataset
{"dataset": "sales", "files": ["orders", "customers", "products"]}
```

```answer
{
  "id": "dax-01-p1",
  "prompt": "What is **Discount %** across all orders? One decimal place.",
  "answer": 3.4,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(100.0 * (1 - SUM(quantity * unit_price * (1 - discount_pct / 100.0)) / SUM(quantity * unit_price)), 1) FROM orders",
  "hint": "A card with the Discount % measure and no filters.",
  "explanation": "3.4%: about ₦29m given away in discounts on ₦860m of sales.",
  "required": true
}
```

```answer
{
  "id": "dax-01-p2",
  "prompt": "How many **Active Customers** placed orders in **2026**?",
  "answer": 90,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(DISTINCT customer_id) FROM orders WHERE order_date >= '2026-01-01'",
  "hint": "A table with Date[Year] and Active Customers.",
  "explanation": "All 90 customers ordered in 2026, against 81 in 2025. The nine extra are new customers, and you'll find them with DAX in lesson 7.",
  "required": true
}
```

```task
{
  "id": "dax-01-t1",
  "prompt": "Paste your **Discount %** measure exactly as you wrote it in Power BI. It should build on your other measures rather than repeating their formulas, and use `DIVIDE`.",
  "minutes": 3,
  "rows": 4,
  "placeholder": "Discount % = ...",
  "rules": [
    { "label": "Named Discount %", "pattern": "^\\s*Discount\\s*%\\s*=" },
    { "label": "Uses DIVIDE, not the / operator", "pattern": "DIVIDE\\s*\\(" },
    { "label": "Builds on existing measures in square brackets, such as [Discount Amount] and [Gross Revenue]", "pattern": "\\[[^\\]]+\\]", "min": 2 }
  ],
  "sample": "```dax\nDiscount % = DIVIDE ( [Discount Amount], [Gross Revenue] )\n```",
  "note": "Measure references have **no table name** in front (`[Revenue]`), while columns always do (`orders[quantity]`). That convention lets anyone reading your DAX tell measures and columns apart at a glance.",
  "required": true
}
```

## More practice

Optional drills. They don't count towards the certificate.

```answer
{
  "id": "dax-01-d1",
  "prompt": "What is **Revenue** for **2025**? (A rounded figure is fine.)",
  "answer": 539810790,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders WHERE order_date < '2026-01-01'",
  "hint": "Table: Date[Year], Revenue.",
  "required": false
}
```

```answer
{
  "id": "dax-01-d2",
  "prompt": "Legal data: load `invoices.csv` and write `Billed = SUM(invoices[amount_ngn])`. What is Billed across all invoices?",
  "answer": 1201750000,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT SUM(amount_ngn) FROM invoices",
  "hint": "A card with the measure.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You select 'Beverages' in a slicer on products[category]. Which tables are filtered?",
    "options": ["Only products", "products and orders, because filters flow from the one side to the many side", "Every table in the model", "orders and customers"],
    "answer": 1,
    "explanation": "Filters flow downhill to the fact table, not back up to other dimensions."
  },
  {
    "prompt": "Why write Discount Amount = [Gross Revenue] - [Revenue] instead of repeating the SUMX formulas?",
    "options": ["It's faster to type", "If the definition of revenue changes, you change it in one place and every measure follows", "DAX requires it", "It uses less memory"],
    "answer": 1,
    "explanation": "Base measures are the single definition everything else reuses."
  },
  {
    "prompt": "How can you tell a measure from a column in someone's DAX?",
    "options": ["Measures are in capitals", "By convention, columns are written with their table name (orders[quantity]) and measures without one ([Revenue])", "Measures start with M_", "You can't"],
    "answer": 1,
    "explanation": "Follow the convention in your own DAX, and others can read it at a glance."
  }
]
```
