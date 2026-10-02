---
title: Time intelligence
minutes: 25
summary: Year-to-date, same period last year, month-on-month and rolling totals, plus the like-for-like fix that stops a part year from looking like a collapse.
---

## The problem

Kolanut's board pack has a KPI card: **"Revenue 2026: ₦290.7m, −46.1% vs last year."** The board is alarmed. In fact revenue is **up** 19.1% on the same months of last year. The data runs only to 30 June 2026, so the card compared six months with twelve.

Time comparisons are what managers ask for most: this year so far, against last year, against last month, the last three months. DAX has a family of **time intelligence** functions that make them short to write, but they only give honest answers if the date table is right and you handle incomplete periods deliberately.

## The concept

**Prerequisites**

Time intelligence functions work on a proper date table: one row per day with no gaps, covering whole years, marked as a date table, and related to the fact table. You built exactly that in lesson 1.

**The core functions**

Each one returns a **set of dates**, which you use as a filter in `CALCULATE`:

| Function | Dates returned, for the current filter |
| :-- | :-- |
| `DATESYTD ( 'Date'[Date] )` | 1 January up to the last date in the filter |
| `DATESQTD`, `DATESMTD` | the same, from the start of the quarter or month |
| `SAMEPERIODLASTYEAR ( 'Date'[Date] )` | the same dates, one year earlier |
| `DATEADD ( 'Date'[Date], -1, MONTH )` | the same dates shifted by any number of days, months, quarters or years |
| `DATESINPERIOD ( 'Date'[Date], <end>, -3, MONTH )` | a window of 3 months ending on a given date |

```dax
Revenue YTD = CALCULATE ( [Revenue], DATESYTD ( 'Date'[Date] ) )

Revenue LY = CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

Revenue PM = CALCULATE ( [Revenue], DATEADD ( 'Date'[Date], -1, MONTH ) )

MoM % = DIVIDE ( [Revenue] - [Revenue PM], [Revenue PM] )

Revenue Rolling 3M =
CALCULATE (
    [Revenue],
    DATESINPERIOD ( 'Date'[Date], MAX ( 'Date'[Date] ), -3, MONTH )
)
```

`TOTALYTD ( [Revenue], 'Date'[Date] )` is a shortcut for the YTD measure. For a financial year ending 30 June, `DATESYTD ( 'Date'[Date], "30/6" )` restarts the count each 1 July.

**The incomplete-year trap**

At year level, the 2026 filter contains every date from 1 January to 31 December 2026, because the date table covers whole years. `SAMEPERIODLASTYEAR` shifts that to the whole of 2025, and you're comparing six months of sales with twelve.

The fix is to limit the current period to dates that have sales **before** shifting. Add a calculated column to the date table:

```dax
Date With Sales = 'Date'[Date] <= MAX ( orders[order_date] )
```

In a calculated column there's no filter on `orders`, so `MAX ( orders[order_date] )` is the last sale overall: 30 June 2026. Then:

```dax
Revenue LY (like for like) =
CALCULATE (
    [Revenue],
    CALCULATETABLE (
        SAMEPERIODLASTYEAR ( 'Date'[Date] ),
        'Date'[Date With Sales] = TRUE ()
    )
)
```

`CALCULATETABLE` first trims the current dates to those up to 30 June 2026, and **then** `SAMEPERIODLASTYEAR` shifts them back a year. At year level, 2026 is now compared with January to June 2025.

## Example

A matrix with `Date[Year]` and `Date[Month]` in Rows:

| Row | Revenue | Revenue LY (like for like) | YoY % |
| :-- | --: | --: | --: |
| 2026 | 290,730,455 | 244,163,070 | 19.1% |
| 2026 Apr | 54,580,085 | 44,634,720 | 22.3% |
| 2026 May | 46,767,400 | 40,251,060 | 16.2% |
| 2026 Jun | 46,173,840 | 39,767,970 | 16.1% |

With the plain `Revenue LY`, the 2026 row would show ₦539.8m and −46.1%. The monthly rows are identical with either measure. The trap only appears on rows that include dates with no sales yet.

## Walkthrough

1. Add `Revenue YTD`, `Revenue LY`, `Revenue PM`, `MoM %` and `Revenue Rolling 3M`. Format the percentages with one decimal place.
2. Build the matrix from the example with `[Revenue]`, `[Revenue LY]` and a `YoY %` measure: `DIVIDE ( [Revenue] - [Revenue LY], [Revenue LY] )`. Find the −46.1% on the 2026 row.
3. Add the `Date With Sales` column and `Revenue LY (like for like)`, and change `YoY %` to use it. The 2026 row becomes +19.1%.
4. Add `Revenue YTD` to the matrix and check that it restarts at January 2026.
5. Put `Revenue Rolling 3M` on a line chart by `Date[Year Month]`. It smooths out December 2025's festive peak, which is why managers like rolling figures for spotting trends.

> [!TIP]
> Hide `Date With Sales` from report view. It's plumbing for measures, not something report users should filter on.

## Practice

```answer
{
  "id": "dax-06-p1",
  "prompt": "What is **Revenue YTD** at the end of **May 2026**? (A rounded figure is fine.)",
  "answer": 244556615,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-05-31'",
  "hint": "The 2026 May row of your matrix.",
  "required": true
}
```

```answer
{
  "id": "dax-06-p2",
  "prompt": "What is **Revenue Rolling 3M** at **June 2026**? (A rounded figure is fine.)",
  "answer": 147521325,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders WHERE order_date BETWEEN '2026-04-01' AND '2026-06-30'",
  "hint": "April + May + June 2026.",
  "required": true
}
```

```answer
{
  "id": "dax-06-p3",
  "prompt": "What is **MoM %** for **June 2026**? One decimal place (it's negative).",
  "answer": -1.3,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN order_date BETWEEN '2026-06-01' AND '2026-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) / SUM(CASE WHEN order_date BETWEEN '2026-05-01' AND '2026-05-31' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) - 1), 1) FROM orders",
  "hint": "The June 2026 row, with MoM % in Values.",
  "explanation": "Down 1.3% on May, but up 16.1% on June 2025. Month-on-month changes are noisy; compare with last year before worrying.",
  "required": true
}
```

## Challenge

```task
{
  "id": "dax-06-c1",
  "prompt": "Write **Revenue YTD LY (like for like)**: last year's year-to-date revenue, limited to the same dates that have sales this year. Build on the measures from this lesson. Paste it here.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Revenue YTD LY (like for like) = ...",
  "rules": [
    { "label": "Named Revenue YTD LY (like for like)", "pattern": "^\\s*Revenue YTD LY \\(like for like\\)\\s*=" },
    { "label": "Uses SAMEPERIODLASTYEAR or DATEADD with -1 YEAR", "pattern": "SAMEPERIODLASTYEAR|DATEADD\\s*\\([^)]*-\\s*1\\s*,\\s*YEAR" },
    { "label": "Is year-to-date: DATESYTD, TOTALYTD or [Revenue YTD]", "pattern": "DATESYTD|TOTALYTD|\\[Revenue YTD\\]" },
    { "label": "Limits to dates with sales", "pattern": "Date With Sales" }
  ],
  "sample": "```dax\nRevenue YTD LY (like for like) =\nCALCULATE (\n    [Revenue YTD],\n    CALCULATETABLE (\n        SAMEPERIODLASTYEAR ( 'Date'[Date] ),\n        'Date'[Date With Sales] = TRUE ()\n    )\n)\n```",
  "note": "`[Revenue YTD]` is evaluated in the shifted dates, so DATESYTD runs on last year's dates. At year level for 2026 it returns January to June 2025: ₦244.2m.",
  "required": false
}
```

## More practice

```answer
{
  "id": "dax-06-d1",
  "prompt": "Legal data: build a date table for 2024 to 2026 related to `invoices[issued_date]`, and a `Billed` measure. What is **Billed LY (like for like)** for **2026**, given invoices run to the end of August 2026? (A rounded figure is fine.)",
  "answer": 376570000,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT SUM(amount_ngn) FROM invoices WHERE issued_date BETWEEN '2025-01-01' AND '2025-08-31'",
  "hint": "January to August 2025.",
  "explanation": "Against ₦386.1m billed so far in 2026, billing is up 2.5%. The plain LY measure would compare with all of 2025 (₦613.7m) and show a 37% fall.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Data runs to 30 June 2026. At year level, why does CALCULATE([Revenue], SAMEPERIODLASTYEAR('Date'[Date])) mislead for 2026?",
    "options": ["SAMEPERIODLASTYEAR is broken", "The 2026 filter covers the whole year, so it's shifted to all of 2025 and six months are compared with twelve", "The date table has gaps", "It double-counts June"],
    "answer": 1,
    "explanation": "Trim the current period to dates with sales before shifting it."
  },
  {
    "prompt": "Which filter gives the three months ending on the last date in the current context?",
    "options": ["DATESYTD('Date'[Date])", "DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH)", "DATEADD('Date'[Date], -3, MONTH)", "SAMEPERIODLASTYEAR('Date'[Date])"],
    "answer": 1,
    "explanation": "DATEADD shifts the period; DATESINPERIOD builds a window."
  },
  {
    "prompt": "What does time intelligence need from the date table?",
    "options": ["Only the dates that have sales", "One row per day with no gaps, covering whole years, marked as a date table", "A row per order", "A text date column"],
    "answer": 1,
    "explanation": "The functions shift and slice a continuous calendar."
  }
]
```
