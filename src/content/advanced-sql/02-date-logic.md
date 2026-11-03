---
title: Date logic
minutes: 20
summary: Truncate dates to weeks and months, measure gaps in days, report "as of" a date, and fill in the months with no activity using a calendar.
---

## The problem

Kingsway Foods' account manager wants a monthly chart of the shipments it booked, January 2025 to August 2026. The obvious query returns **12 rows**, not 20:

```sql run
SELECT strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments
FROM shipments
WHERE customer_id = 40
GROUP BY month
ORDER BY month;
```

Months with no bookings simply don't appear. Charted as it is, the line jumps straight from November 2025 to March 2026, and three quiet months, the most important fact about this customer, disappear.

Nearly every business question has a date in it: this month, last quarter, days to pay, how long since the last order. Date logic is where queries most often go quietly wrong.

## The concept

### Dates in SQLite are text

Harbourline stores dates as `YYYY-MM-DD` text. That format sorts correctly and compares correctly (`'2026-03-01' < '2026-04-15'`), and SQLite's date functions read it:

![Subtracting two dates gives days, a month bucket from a date, and a calendar LEFT JOINed to the data so a missing month shows as zero](/images/courses/advanced-sql/dates.svg "Dates subtract into days; months with no rows need a calendar to appear as zero. (Illustration with simplified data.)")

| Task | SQLite |
| :-- | :-- |
| Month label | `strftime('%Y-%m', d)` |
| First day of the month | `date(d, 'start of month')` |
| Last day of the month | `date(d, 'start of month', '+1 month', '-1 day')` |
| Monday of the week | `date(d, '-6 days', 'weekday 1')` |
| Add or subtract | `date(d, '+30 days')`, `date(d, '-3 months')` |
| Days between | `julianday(d2) - julianday(d1)` |
| Day of week (0 = Sunday) | `strftime('%w', d)` |

Try several at once on real shipments:

```sql run
SELECT
  shipment_id,
  ship_date,
  delivery_date,
  date(ship_date, '+30 days')                 AS plus_30_days,
  strftime('%Y-%m', ship_date)                AS ship_month,
  julianday(delivery_date) - julianday(ship_date) AS transit_days
FROM shipments
WHERE status = 'Delivered'
ORDER BY shipment_id
LIMIT 5;
```

Shipment 100001 left on 11 January 2025 and arrived 38 days later. `julianday` turns a date into a day number, so subtracting two of them gives the days between.

### The same ideas in other databases

Your job may use a different database. The ideas are identical; only the spelling changes:

| Task | PostgreSQL | SQL Server | MySQL |
| :-- | :-- | :-- | :-- |
| First of month | `date_trunc('month', d)` | `DATETRUNC(month, d)` | `DATE_FORMAT(d, '%Y-%m-01')` |
| Add 30 days | `d + INTERVAL '30 days'` | `DATEADD(day, 30, d)` | `DATE_ADD(d, INTERVAL 30 DAY)` |
| Days between | `d2 - d1` | `DATEDIFF(day, d1, d2)` | `DATEDIFF(d2, d1)` |
| Year | `EXTRACT(YEAR FROM d)` | `YEAR(d)` | `YEAR(d)` |

### "As of" dates

Reports are run as of a date. Harbourline's data ends on 31 August 2026, so "the last 90 days" means after `date('2026-08-31', '-90 days')`. Avoid `date('now')` in analysis you'll hand over: the answer changes every day, and nobody can reproduce it.

### A calendar for missing periods

`GROUP BY` can only produce groups that exist in the data. To show every month, build a list of months first and `LEFT JOIN` the data onto it. A **recursive CTE** generates the list: it starts with one row, then keeps adding a row based on the previous one until a condition stops it.

## Example

The full 20 months for Kingsway Foods, with zeros where nothing was booked:

```sql run
WITH RECURSIVE months(month_start) AS (
  SELECT '2025-01-01'                     -- the first row
  UNION ALL
  SELECT date(month_start, '+1 month')    -- each next row
  FROM months
  WHERE month_start < '2026-08-01'        -- stop after August 2026
),
bookings AS (
  SELECT date(booking_date, 'start of month') AS month_start, COUNT(*) AS shipments
  FROM shipments
  WHERE customer_id = 40
  GROUP BY 1
)
SELECT
  strftime('%Y-%m', m.month_start) AS month,
  COALESCE(b.shipments, 0) AS shipments
FROM months AS m
LEFT JOIN bookings AS b ON b.month_start = m.month_start
ORDER BY m.month_start;
```

Now the gaps show: nothing in December 2025, January or February 2026, and nothing since June 2026. That's a customer to call.

## Walkthrough

1. Run the `months` CTE on its own (`WITH RECURSIVE months(...) AS (...) SELECT * FROM months;`) and check it lists 20 months.
2. Note how both sides of the join use the **first of the month**. Joining on the same key format is what makes the `LEFT JOIN` line up.
3. Remove `COALESCE` and see the gaps become NULL. A chart would draw NULL as a break, or not at all; a zero is what the manager means.
4. Run `SELECT date('2026-02-14', '-6 days', 'weekday 1');` to find the Monday of that week (9 February).

> [!NOTE]
> Bookings are mostly on weekdays: 90 shipments were booked on a Sunday against about 480 on each weekday. When you compare weeks, compare whole weeks, never part of one.

## Practice

```exercise
{
  "id": "asql-02-p1",
  "prompt": "How long do customers take to pay? For each payment, the gap is payment_date minus the shipment's delivery_date. Show payments, avg_days_to_pay (1 decimal place) and paid_within_30 (the number of payments made 30 days or less after delivery).",
  "starter": "SELECT\n  COUNT(*) AS payments\nFROM payments AS p\nJOIN shipments AS s ON s.shipment_id = p.shipment_id;",
  "solution": "SELECT COUNT(*) AS payments, ROUND(AVG(julianday(p.payment_date) - julianday(s.delivery_date)), 1) AS avg_days_to_pay, SUM(julianday(p.payment_date) - julianday(s.delivery_date) <= 30) AS paid_within_30 FROM payments AS p JOIN shipments AS s ON s.shipment_id = p.shipment_id;",
  "hint": "julianday(p.payment_date) - julianday(s.delivery_date) is the gap in days. SUM(gap <= 30) counts the quick payments.",
  "required": true
}
```

```exercise
{
  "id": "asql-02-p2",
  "prompt": "Show Harbourline's bookings by week, for the weeks starting in July 2026. Show week_start (the Monday) and shipments, ordered by week_start.",
  "starter": "SELECT\n  date(booking_date, '-6 days', 'weekday 1') AS week_start,\n  COUNT(*) AS shipments\nFROM shipments\n",
  "solution": "SELECT date(booking_date, '-6 days', 'weekday 1') AS week_start, COUNT(*) AS shipments FROM shipments GROUP BY week_start HAVING week_start BETWEEN '2026-07-01' AND '2026-07-31' ORDER BY week_start;",
  "hint": "Group by the week start, then keep weeks whose Monday is in July with HAVING week_start BETWEEN '2026-07-01' AND '2026-07-31'. Filtering booking_date instead would cut the first week short.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-02-c1",
  "prompt": "Show every month from 2025-01 to 2026-08 with the number of shipments Harmattan Agro Ltd (customer 8) booked, including zeros. Show month ('YYYY-MM') and shipments, ordered by month.",
  "starter": "",
  "solution": "WITH RECURSIVE months(month_start) AS (SELECT '2025-01-01' UNION ALL SELECT date(month_start, '+1 month') FROM months WHERE month_start < '2026-08-01'), b AS (SELECT date(booking_date, 'start of month') AS month_start, COUNT(*) AS shipments FROM shipments WHERE customer_id = 8 GROUP BY 1) SELECT strftime('%Y-%m', m.month_start) AS month, COALESCE(b.shipments, 0) AS shipments FROM months AS m LEFT JOIN b ON b.month_start = m.month_start ORDER BY m.month_start;",
  "hint": "Reuse the calendar from the example and change the customer.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-02-d1",
  "prompt": "As of 2026-08-31, how many days has it been since each customer's last booking? Show customer_id, last_booking and days_since (a whole number), longest first. Only customers who have booked.",
  "starter": "",
  "solution": "SELECT customer_id, MAX(booking_date) AS last_booking, CAST(julianday('2026-08-31') - julianday(MAX(booking_date)) AS INTEGER) AS days_since FROM shipments GROUP BY customer_id ORDER BY days_since DESC, customer_id;",
  "hint": "julianday('2026-08-31') - julianday(MAX(booking_date)).",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-02-d2",
  "prompt": "How many shipments were delivered in the 90 days up to and including 2026-08-31? Show one number, delivered_last_90.",
  "starter": "",
  "solution": "SELECT COUNT(*) AS delivered_last_90 FROM shipments WHERE delivery_date > date('2026-08-31', '-90 days') AND delivery_date <= '2026-08-31';",
  "hint": "delivery_date > date('2026-08-31', '-90 days').",
  "required": false
}
```

```exercise
{
  "id": "asql-02-d3",
  "prompt": "Count bookings by day of the week. Show day_number (0 = Sunday … 6 = Saturday from strftime('%w')) and shipments, ordered by day_number.",
  "starter": "",
  "solution": "SELECT CAST(strftime('%w', booking_date) AS INTEGER) AS day_number, COUNT(*) AS shipments FROM shipments GROUP BY day_number ORDER BY day_number;",
  "hint": "strftime('%w', booking_date) returns '0' to '6' as text; CAST it to INTEGER.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A monthly GROUP BY returns 17 rows for a 20-month period. What's happening?",
    "options": ["Three months were deleted", "Months with no rows don't form a group; join to a calendar to show them as zeros", "GROUP BY has a row limit", "The dates are in the wrong format"],
    "answer": 1,
    "explanation": "GROUP BY only creates groups that exist. A calendar plus LEFT JOIN and COALESCE fills the gaps."
  },
  {
    "prompt": "Why use a fixed 'as of' date instead of date('now') in a report?",
    "options": ["date('now') is slower", "So the answer can be reproduced and checked later", "date('now') returns text", "It doesn't matter"],
    "answer": 1,
    "explanation": "A report that changes every time it runs can't be checked."
  },
  {
    "prompt": "In PostgreSQL, which expression gives the first day of the month?",
    "options": ["strftime('%Y-%m', d)", "date_trunc('month', d)", "DATEADD(month, 1, d)", "date(d, 'start of month')"],
    "answer": 1,
    "explanation": "date_trunc('month', d) in PostgreSQL; date(d, 'start of month') is SQLite's version."
  }
]
```
