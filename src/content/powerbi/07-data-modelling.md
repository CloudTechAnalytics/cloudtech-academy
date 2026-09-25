---
title: Data modelling
minutes: 35
summary: Finish the star schema with a proper date table, sort months correctly, and tidy the model so reports are easy to build.
---

## The problem

You want revenue by month, and year-on-year comparisons. Grouping by `order_date` alone gets messy: months sort alphabetically (April, August, December…), there's nothing to group quarters by, and DAX's time functions (next lessons) need a complete calendar. The answer is a **date table**.

## The concept

**Why a date table?**

- One row per day, with no gaps, covering the whole period.
- Columns to group by: year, quarter, month name, month number.
- Required for reliable **time intelligence** in DAX (year-to-date, same period last year).

**Build it with DAX** (Modeling → **New table**):

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

Then:

1. **Mark as date table**: select the table → Table tools → **Mark as date table** → choose the `Date` column.
2. **Relate** `Date[Date]` (1) → `orders[order_date]` (*).
3. **Sort by column**: select `Month` → Column tools → **Sort by column → Month Number**. Now months sort January to December.

**Tidy model habits**

- Hide ID and technical columns report builders shouldn't use.
- Give tables and columns clear names (`Revenue`, not `Sum of revenue2`).
- Set formats once in the model (currency, thousands separators), not on every visual.
- Keep calculations as **measures** (next lessons) rather than many calculated columns.
- Turn off **Auto date/time** (File → Options and settings → Options → Current file → Data Load) once you have your own date table. It creates hidden date tables for every date column and bloats the file.

## Example

The finished model:

```
customers (1) ──* orders *── (1) products
                     *
                     │
                  (1) Date
```

Now `Date[Year]` and `Date[Month]` on a matrix, `orders[revenue]` in values, gives a correctly sorted month-by-year grid.

## Walkthrough

1. **Modeling → New table**, paste the DAX above, press Enter.
2. Mark it as a date table.
3. In Model view, drag `Date[Date]` onto `orders[order_date]`. Check it's one-to-many, single direction.
4. Sort `Month` by `Month Number`.
5. Build a **Matrix**: Rows `Date[Year]`, then `Date[Quarter]`; Values `orders[revenue]`. Expand a year with the **+** icons.
6. Hide `orders[order_date]` in report view, so everyone uses `Date` instead.

> [!NOTE]
> The date table runs to 31 December 2026 although the data stops at 30 June 2026. That's intended: complete years make year-level calculations behave, and later data will fit without changes.

## Practice

```answer
{
  "id": "pbi-07-p1",
  "prompt": "Using the date table, what was revenue in **Q2 2026** (April–June), to the nearest naira?",
  "answer": 147521325,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2026-04-01' AND '2026-06-30'",
  "hint": "Matrix with Date[Year] and Date[Quarter] in rows and revenue in values; read 2026 → Q2.",
  "required": true
}
```

```answer
{
  "id": "pbi-07-p2",
  "prompt": "How many rows does the `Date` table built with the DAX above contain?",
  "answer": 730,
  "format": "number",
  "hint": "It covers 1 January 2025 to 31 December 2026: two full years, neither a leap year.",
  "explanation": "365 + 365 = 730 days, one row each.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why do months sort April, August, December… by default?",
    "options": ["A Power BI bug", "Month names are text, so they sort alphabetically unless sorted by a number column", "The date table is wrong", "Months can't be sorted"],
    "answer": 1,
    "explanation": "Sort by column → Month Number fixes the order."
  },
  {
    "prompt": "Why mark a table as the date table?",
    "options": ["To make it bold", "So DAX time intelligence functions treat it as the calendar", "To hide it", "To load it faster"],
    "answer": 1,
    "explanation": "Marking tells Power BI which table and column to use for time calculations."
  },
  {
    "prompt": "Which field should you put on a monthly chart's axis once the model has a date table?",
    "options": ["orders[order_date]", "Date[Month] (or Date[Year Month])", "products[product_id]", "orders[revenue]"],
    "answer": 1,
    "explanation": "Use the date table's columns so every visual shares one calendar."
  }
]
```
