---
title: Customer analytics patterns
minutes: 25
summary: Active and lapsed customers over a rolling window, Pareto concentration and ABC classes, and headcount on a date, built from patterns you can reuse on any data.
---

## The problem

Kolanut's sales reps are judged on keeping customers ordering. The sales director wants a page that answers, for any month she picks:

- How many customers are **active**: they ordered in the last 30 days?
- How many have **lapsed**: they've ordered before, but not in the last 30 days?
- Which customers make up the **80%** of revenue we can't afford to lose?

These are some of the most requested measures in any business with repeat customers (distributors, banks, telecoms, schools collecting fees), and they all follow a few patterns. Learn the patterns once and you can build them on any data.

## The concept

### Pattern 1: a rolling window from the selected date

"As of" the last date in the current filter, look back a fixed number of days:

```dax
Active Customers 30d =
VAR LastDay = MAX ( 'Date'[Date] )
RETURN
    CALCULATE (
        DISTINCTCOUNT ( orders[customer_id] ),
        DATESINPERIOD ( 'Date'[Date], LastDay, -30, DAY )
    )
```

At June 2026, `LastDay` is 30 June and the window is 1 to 30 June.

### Pattern 2: everything up to a date

"Ever ordered by the end of the period" needs every date up to `LastDay`. Remove the date filters explicitly, then add the condition:

```dax
Customers to Date =
VAR LastDay = MAX ( 'Date'[Date] )
RETURN
    CALCULATE (
        DISTINCTCOUNT ( orders[customer_id] ),
        REMOVEFILTERS ( 'Date' ),
        'Date'[Date] <= LastDay
    )

Lapsed Customers 30d = [Customers to Date] - [Active Customers 30d]
```

`REMOVEFILTERS ( 'Date' )` matters: without it, a filter on `Date[Year Month]` from the visual would still be in place, and "to date" would mean "this month only".

The same pattern gives **headcount on a date** in HR data: employees hired on or before the date, who haven't left by it.

### Pattern 3: cumulative share (Pareto)

Rank customers by revenue, then add up everyone whose revenue is at least the current customer's:

```dax
Cumulative Share =
VAR CurrentRevenue = [Revenue]
VAR AllCustomers = ALLSELECTED ( customers[customer_name] )
VAR RunningTotal =
    SUMX ( FILTER ( AllCustomers, [Revenue] >= CurrentRevenue ), [Revenue] )
RETURN
    DIVIDE ( RunningTotal, CALCULATE ( [Revenue], AllCustomers ) )

ABC Class =
SWITCH (
    TRUE (),
    ISBLANK ( [Revenue] ), BLANK (),
    [Cumulative Share] <= 0.8, "A",
    [Cumulative Share] <= 0.95, "B",
    "C"
)
```

Class A customers together make up the first 80% of revenue. They get the most attention from account managers.

![A Pareto chart of the 81 customers who ordered in 2025: bars for each customer's revenue, largest first, and a running-share line that rises steeply and flattens. The first 28 customers take it past 80%.](/images/courses/dax/pareto-2025.svg "The Pareto pattern on 2025 alone. The practice asks you to find the class A count across all dates.")

## Example

The sales director's page for June 2026, by channel:

| Channel | Customers to Date | Active 30d | Lapsed 30d |
| :-- | --: | --: | --: |
| Kiosk | 39 | 24 | 15 |
| Supermarket | 30 | 21 | 9 |
| Wholesale | 21 | 21 | 0 |
| **Total** | **90** | **66** | **24** |

Every wholesaler ordered in June; 15 of 39 kiosks didn't. Before you send the kiosk list to the sales reps, check the window. Kiosks order small amounts, less often, and over the last three months (DATESINPERIOD with -3, MONTH), all 90 customers ordered. A 30-day window suits wholesalers; for kiosks, 60 days or three months may be the fairer test of "lapsed". The pattern is the same, so make the window a parameter and let the business choose.

## Walkthrough

1. Add `Active Customers 30d`, `Customers to Date` and `Lapsed Customers 30d`. Build the table from the example, with a slicer on `Date[Year Month]` set to 2026-06.
2. Remove `REMOVEFILTERS ( 'Date' )` from `Customers to Date` and watch "to date" collapse to June only. Put it back.
3. Change `-30` to `-60`. Active customers at June 2026 rise to 84.
4. Add `Cumulative Share` and `ABC Class` to a table of `customers[customer_name]` and `[Revenue]`, sorted by revenue, with no date filter. Find the row where the share first passes 80%.

## Practice

```answer
{
  "id": "dax-09-p1",
  "prompt": "At **June 2026**, how many **Lapsed Customers 30d** are there in the **Kiosk** channel?",
  "answer": 15,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT COUNT(*) FROM (SELECT o.customer_id FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Kiosk' AND o.order_date <= '2026-06-30' GROUP BY o.customer_id HAVING MAX(o.order_date) < '2026-06-01')",
  "hint": "The Kiosk row of your table, with June 2026 selected.",
  "required": true
}
```

```answer
{
  "id": "dax-09-p2",
  "prompt": "Across all dates, how many customers are in **class A**: the customers who together make up the first 80% of revenue? Count the customer whose revenue takes the running share past 80%.",
  "answer": 29,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "WITH r AS (SELECT customer_id, SUM(quantity * unit_price * (1 - discount_pct / 100.0)) AS r FROM orders GROUP BY customer_id), c AS (SELECT r, SUM(r) OVER (ORDER BY r DESC ROWS UNBOUNDED PRECEDING) / SUM(r) OVER () AS cum, ROW_NUMBER() OVER (ORDER BY r DESC) AS rn FROM r) SELECT MIN(rn) FROM c WHERE cum >= 0.8",
  "hint": "Sort the customer table by revenue and find the first row where Cumulative Share is 80% or more. Its position is the answer.",
  "explanation": "29 of 90 customers (about a third) bring in 80% of revenue. Note that the ABC Class measure, with <= 0.8, puts that 29th customer in B. Decide which convention you'll use and state it on the report.",
  "required": true
}
```

```task
{
  "id": "dax-09-t1",
  "prompt": "HR data: write **Headcount** for the employees table, giving the number of employees on the payroll on the **last date** of the current filter context (hired on or before it, and either no exit_date or an exit_date after it). Assume a date table that is **not** related to employees. Paste it here.",
  "minutes": 6,
  "rows": 10,
  "placeholder": "Headcount =\nVAR ...",
  "rules": [
    { "label": "Named Headcount", "pattern": "^\\s*Headcount\\s*=" },
    { "label": "Captures the last date in a variable", "pattern": "VAR\\s+\\w+\\s*=\\s*MAX\\s*\\(\\s*'?Date'?\\[Date\\]" },
    { "label": "Tests hire_date", "pattern": "hire_date\\]?\\s*<=" },
    { "label": "Handles a blank exit_date (ISBLANK) and an exit after the date", "pattern": "ISBLANK\\s*\\(\\s*employees\\[exit_date\\]" },
    { "label": "Counts rows of a filtered employees table", "pattern": "COUNTROWS\\s*\\(|CALCULATE\\s*\\(\\s*COUNTROWS" }
  ],
  "sample": "```dax\nHeadcount =\nVAR LastDay = MAX ( 'Date'[Date] )\nRETURN\n    COUNTROWS (\n        FILTER (\n            employees,\n            employees[hire_date] <= LastDay\n                && ( ISBLANK ( employees[exit_date] ) || employees[exit_date] > LastDay )\n        )\n    )\n```",
  "note": "Because the date table isn't related to employees, the date only enters through the `LastDay` variable. That's the standard design for \"on a date\" measures such as headcount, open matters or stock on hand.",
  "required": true
}
```

## More practice

```answer
{
  "id": "dax-09-d1",
  "prompt": "Using your Headcount measure, how many employees were on the payroll on **31 December 2024**?",
  "answer": 60,
  "format": "number",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT COUNT(*) FROM employees WHERE hire_date <= '2024-12-31' AND (exit_date IS NULL OR exit_date > '2024-12-31')",
  "hint": "Your date table must include 2024. A table by Date[Year] shows the headcount at the end of each year.",
  "required": false
}
```

```answer
{
  "id": "dax-09-d2",
  "prompt": "At June 2026, how many customers are active in the last **60** days?",
  "answer": 84,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(DISTINCT customer_id) FROM orders WHERE order_date > date('2026-06-30', '-60 days') AND order_date <= '2026-06-30'",
  "hint": "Change -30 to -60 in DATESINPERIOD.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why does Customers to Date need REMOVEFILTERS('Date') as well as 'Date'[Date] <= LastDay?",
    "options": ["It's faster", "Otherwise a filter on another Date column, such as Year Month from the visual, still applies and 'to date' becomes 'this month'", "REMOVEFILTERS counts blanks", "It isn't needed"],
    "answer": 1,
    "explanation": "Remove every date filter first, then add exactly the dates you want."
  },
  {
    "prompt": "15 of 39 kiosks didn't order in June, but every kiosk ordered in the last three months. What's the right conclusion?",
    "options": ["15 kiosks have been lost", "The 30-day window may be too short for kiosks, which order less often; agree the window with the business", "Kiosks should be removed from the report", "The measure is wrong"],
    "answer": 1,
    "explanation": "Lapsed depends on the window. Fit it to how often each kind of customer normally orders."
  },
  {
    "prompt": "What does a Cumulative Share of 80% on a customer's row mean?",
    "options": ["The customer is 80% of revenue", "This customer and everyone with higher revenue together make up 80% of revenue", "80% of customers are bigger", "The customer grew 80%"],
    "answer": 1,
    "explanation": "It's the running total of revenue down a list sorted from biggest to smallest."
  }
]
```
