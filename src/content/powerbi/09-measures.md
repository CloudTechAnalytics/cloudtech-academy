---
title: Measures with CALCULATE and time intelligence
minutes: 45
summary: Change the filter context with CALCULATE, build percentage-of-total, year-to-date and year-on-year measures.
---

## The problem

The managing director wants three numbers on every page: *revenue this year to date*, *growth versus the same period last year*, and *each category's share of revenue*. None of these is a plain sum. Each needs a measure that **changes the filters** before calculating.

## The concept

**CALCULATE** evaluates an expression under modified filters:

```dax
CALCULATE ( <expression>, <filter1>, <filter2>, … )
```

```dax
Revenue Lagos = CALCULATE ( [Revenue], customers[region] = "Lagos" )
```

That measure shows Lagos revenue even in a visual sliced by another region: the filter argument replaces the region filter.

**Removing filters: ALL / REMOVEFILTERS**

```dax
Revenue All Categories = CALCULATE ( [Revenue], REMOVEFILTERS ( products[category] ) )

% of Revenue = DIVIDE ( [Revenue], [Revenue All Categories] )
```

In a table by category, the first measure ignores the category on each row, giving the grand total, so the ratio is each category's share. Format `% of Revenue` as a percentage.

**Time intelligence** (needs the marked date table from lesson 7):

```dax
Revenue YTD = TOTALYTD ( [Revenue], 'Date'[Date] )

Revenue LY = CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

YoY % = DIVIDE ( [Revenue] - [Revenue LY], [Revenue LY] )
```

- `TOTALYTD` adds everything from 1 January up to the latest date in the current filter.
- `SAMEPERIODLASTYEAR` shifts the dates in the filter back one year.
- `YoY %` compares them; blank when there's no previous year.

## Example

A matrix with `Date[Year]` and `Date[Month]` in Rows:

| Month | Revenue | Revenue LY | YoY % |
| :-- | --: | --: | --: |
| 2026 Jan | 48,963,925 | 37,088,460 | 32.0% |
| 2026 Feb | 43,042,730 | 36,138,690 | 19.1% |
| 2026 Mar | 51,202,475 | 46,282,170 | 10.6% |

And **Revenue YTD** at 2026 March shows Q1 2026 in total.

> [!WARNING]
> At **year** level, 2026's YoY % compares January–June 2026 with **all** of 2025, because 2026 only has data to June. Compare full year against half year and 2026 looks like a disaster. Compare **H1 with H1** (filter the page to January–June, or use the monthly or quarterly rows) to get the fair +19.1%.

## Walkthrough

1. In `_Measures`, add `Revenue All Categories` and `% of Revenue`. Build a table: `products[category]`, `[Revenue]`, `[% of Revenue]`.
2. Add `Revenue YTD`, `Revenue LY` and `YoY %`. Format YoY % as a percentage with one decimal place.
3. Build a matrix with `Date[Year]` → `Date[Month]` in Rows and the three measures in Values.
4. Check one number by hand: February 2026's YoY % should equal (43.04 − 36.14) ÷ 36.14.
5. Add a **Card** for `Revenue YTD` and a slicer on `Date[Month]`: selecting March 2026 shows year-to-date March.

## Practice

```answer
{
  "id": "pbi-09-p1",
  "prompt": "What share of total revenue (all dates) comes from **Beverages**? One decimal place.",
  "answer": 27,
  "tolerance": 0.06,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN p.category = 'Beverages' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN products p ON p.product_id = o.product_id",
  "hint": "Table: products[category], [% of Revenue].",
  "explanation": "27.0%: Household and Personal care are slightly larger.",
  "required": true
}
```

```answer
{
  "id": "pbi-09-p2",
  "prompt": "What is **Revenue YTD** at the end of **March 2026**? (A rounded figure is fine.)",
  "answer": 143209130,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'",
  "hint": "Matrix row 2026 → Mar, column Revenue YTD. It should equal January + February + March 2026.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pbi-09-c1",
  "prompt": "What is **YoY %** for **Q1 2026** against Q1 2025, to one decimal place?",
  "answer": 19.8,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN order_date BETWEEN '2026-01-01' AND '2026-03-31' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) / SUM(CASE WHEN order_date BETWEEN '2025-01-01' AND '2025-03-31' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) - 1), 1) FROM orders",
  "hint": "Put Date[Year] → Date[Quarter] in the matrix rows; read YoY % at 2026 Q1.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does CALCULATE([Revenue], customers[region] = \"Lagos\") return?",
    "options": ["Revenue for Lagos only", "Revenue for every region", "The number of Lagos customers", "An error"],
    "answer": 0,
    "explanation": "CALCULATE applies the filter you give it, here region = Lagos."
  },
  {
    "prompt": "A '% of total' measure divides a category's revenue by what?",
    "options": ["Revenue across all categories", "The number of categories", "100", "The largest category"],
    "answer": 0,
    "explanation": "REMOVEFILTERS gives the total across all categories, which is the denominator."
  },
  {
    "prompt": "The data for 2026 runs only from January to June. Why does 2026 look much lower than 2025 at year level?",
    "options": ["Half a year is being compared with a full year", "Sales collapsed", "DAX can't compare years", "The chart is the wrong type"],
    "answer": 0,
    "explanation": "Compare like with like: January–June 2026 against January–June 2025."
  }
]
```
