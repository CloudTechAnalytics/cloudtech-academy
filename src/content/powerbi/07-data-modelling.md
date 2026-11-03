---
title: Data modelling
minutes: 20
summary: Complete the star schema with a date table built in DAX, explained piece by piece; mark it, sort months properly, add a hierarchy and tidy the model.
---

## The problem

You want revenue by month, and year-on-year comparisons. Grouping by `order_date` alone gets messy: months sort alphabetically (April, August, December…), there's nothing to group quarters by, and DAX's time functions (next lessons) need a complete calendar. The answer is a **date table**.

## The concept

The star schema from the last lesson has one gap: dates. `orders[order_date]` holds dates, but you can't group it by quarter, sort months properly or use DAX's time functions with it alone. Every serious Power BI model has a separate **date table**.

### Why a date table?

| Need | Without a date table | With one |
| :-- | :-- | :-- |
| Group by year, quarter, month | Power BI's hidden auto date tables, one per date column | One shared set of columns: `Year`, `Quarter`, `Month` |
| Months in calendar order | "Apr, Aug, Dec, Feb…" (alphabetical) | "Jan, Feb, Mar…", sorted by month number |
| Days with no orders | Missing from the axis | Present, so gaps show as gaps |
| Year-to-date, same period last year | Unreliable or impossible | `TOTALYTD`, `SAMEPERIODLASTYEAR` work |
| Several date columns (order, delivery) | Each grouped separately | All related to one table |

A proper date table has:

- **one row per day**, with **no gaps**, covering whole years;
- a column of type **Date** that's unique;
- columns to group and sort by: year, quarter, month name, month number.

### Building it with DAX

**Modeling → New table**, then:

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

Read it from the inside out:

| Piece | Does | For 15 May 2025 |
| :-- | :-- | :-- |
| `DATE ( 2025, 1, 1 )` | Builds a date from year, month, day | (the start date) |
| `CALENDAR ( start, end )` | A one-column table, `[Date]`, with every day from start to end | One row per day of 2025 and 2026 |
| `ADDCOLUMNS ( table, "Name", expression, … )` | Adds columns, calculated for each row | |
| `YEAR ( [Date] )` | The year | 2025 |
| `MONTH ( [Date] )` | Month number, 1 to 12 | 5 |
| `ROUNDUP ( MONTH ( [Date] ) / 3, 0 )` | Month 1–3 → 1, 4–6 → 2, and so on | 5 ÷ 3 = 1.67 → 2 |
| `"Q" & …` | Joins text: `&` works as in Excel | Q2 |
| `FORMAT ( [Date], "mmm" )` | The date as text in a pattern | May |
| `FORMAT ( [Date], "yyyy-mm" )` | | 2025-05 |

> [!NOTE]
> `CALENDARAUTO()` builds the date range automatically from the dates in your model. It's convenient, but it picks up any stray date column (such as a customer's joining date in 2018), so a fixed `CALENDAR` is easier to predict.

### Mark as date table

Select the table → **Table tools → Mark as date table** → choose the `Date` column. Power BI checks the column is unique with no gaps, and then uses it for time intelligence. If it refuses, the range has a gap or a duplicate.

### Relate it to the fact table

In Model view, drag `Date[Date]` onto `orders[order_date]`: one-to-many, single direction, like the other dimensions. The model is now a full star: `customers`, `products` and `Date` around `orders`.

### Sort by column

Text sorts alphabetically, so a `Month` column shows **Apr, Aug, Dec, Feb, Jan…** on a chart. Fix it once in the model:

1. Select `Date[Month]`.
2. **Column tools → Sort by column → Month Number**.

Every visual that uses `Month` now shows Jan to Dec in order. The same trick works for anything with a natural order, such as size bands sorted by a band number.

### Hierarchies

A **hierarchy** groups columns from big to small, so users can drill down: Year → Quarter → Month. Right-click `Year` → **Create hierarchy**, then drag `Quarter` and `Month` onto it. In a visual, the drill arrows move between the levels.

### Tidy model habits

A model is used by everyone who builds reports on it, so keep it easy to read:

| Habit | Why |
| :-- | :-- |
| **Hide** IDs and technical columns (right-click → Hide in report view) | Report builders see only what they should use |
| **Clear names**: `Revenue`, not `Sum of revenue2` | Names appear in every visual and tooltip |
| **Set formats once** in the model: currency, thousands separators | Every visual inherits them |
| **Set the summarisation** of number columns that shouldn't be added (Column tools → Summarization → Don't summarize) | Stops `customer_id` appearing as "Sum of customer_id" |
| **Measures**, not lots of calculated columns (next lessons) | Smaller, faster models |
| **Turn off Auto date/time** once you have your own date table | It creates hidden tables for every date column and bloats the file |

Auto date/time is under **File → Options and settings → Options → Current file → Data Load**.

## Example

The finished model is the full star from the last lesson's diagram: `orders` in the middle, `customers`, `products` and `Date` around it.

Now `Date[Year]` and `Date[Quarter]` on a matrix, `orders[revenue]` in values, gives revenue by quarter:

| Year | Quarter | Revenue |
| :-- | :-- | --: |
| 2025 | Q1 | 119,509,320 |
| 2025 | Q2 | 124,653,750 |
| 2025 | Q3 | 134,848,095 |
| 2025 | Q4 | 160,799,625 |
| 2026 | Q1 | (try it yourself) |
| 2026 | Q2 | (you'll find it in the practice) |

And with `Date[Month]` sorted by `Month Number`, a line chart of 2025 runs January to December in order, with the December peak (₦66,284,310) at the right end, where it belongs.

## Walkthrough

1. **Modeling → New table**, paste the DAX above, press Enter. The `Date` table appears. Open it in Table view and check the first row is 1 January 2025 and the last is 31 December 2026.
2. Mark it as a date table.
3. In Model view, drag `Date[Date]` onto `orders[order_date]`. Check it's one-to-many, single direction.
4. Sort `Month` by `Month Number`.
5. Create a hierarchy: Year → Quarter → Month.
6. Build a **Matrix**: Rows the hierarchy; Values `orders[revenue]`. Expand a year with the **+** icons.
7. Hide `orders[order_date]` in report view, so everyone uses `Date` instead.
8. Turn off Auto date/time for this file.

> [!NOTE]
> The date table runs to 31 December 2026 although the data stops at 30 June 2026. That's intended: complete years make year-level calculations behave, and later data will fit without changes.

### Summary

| Need | Do |
| :-- | :-- |
| Group, sort and compare dates properly | A date table: one row per day, whole years |
| Build it | `ADDCOLUMNS ( CALENDAR ( … ), "Year", YEAR ( [Date] ), … )` |
| Let DAX time functions use it | Mark as date table |
| Months in order | Sort `Month` by `Month Number` |
| Drill from year to month | A hierarchy |
| A model others can use | Hide technical columns, clear names, formats set once |

## Practice

```answer
{
  "id": "pbi-07-p1",
  "prompt": "Using the date table, what was revenue in **Q2 2026** (April–June)? (A rounded figure is fine.)",
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


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-07-d1",
  "prompt": "Using your date table, what was Kolanut's revenue in **March 2026**?",
  "answer": 51202475,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2026-03-01' AND '2026-03-31'",
  "hint": "Put Year and Month from the date table in a matrix with the revenue measure.",
  "required": false
}
```

```answer
{
  "id": "pbi-07-d2",
  "prompt": "In the legal dataset, what was the total value of invoices **issued in 2025**?",
  "answer": 613730000,
  "format": "naira",
  "dataset": "legal",
  "files": [
    "invoices"
  ],
  "verify": "SELECT SUM(amount_ngn) FROM invoices WHERE issued_date BETWEEN '2025-01-01' AND '2025-12-31'",
  "hint": "Relate a date table to invoices[issued_date] and slice by Year.",
  "required": false
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
