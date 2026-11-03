---
title: Window functions in depth
minutes: 25
summary: Control exactly which rows a window function sees with frames, and use moving averages, shares of a total, LAG, LEAD and FIRST_VALUE without the common traps.
---

## The problem

Harbourline's monthly bookings bounce around: 146 in April 2025, 106 in June, 142 in July. The operations director asks, "Is volume actually going up or down, or is it just noise?" A month-by-month chart is too jumpy to answer that. What she needs is a **moving average**, which smooths each month with the months before it.

In SQL for Data Analysis you met `RANK`, `ROW_NUMBER`, running totals and `LAG`. This lesson covers the part that trips up experienced analysts: **which rows** a window function actually looks at.

## The concept

### The frame

Inside `OVER (…)`, `PARTITION BY` picks the group and `ORDER BY` sorts it. The **frame** then picks which rows of the group the function uses for the current row:

![A running total and a three-row moving average over 10, 20, 30, 40 with the frame highlighted; the default-frame trap with ties; and LAG, LEAD and share of total](/images/courses/advanced-sql/window-frames.svg "A frame is the set of rows a window function sees for each row. (Illustration with simplified data.)")

```sql
AVG(shipments) OVER (
  ORDER BY month
  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW   -- this month and the two before
)
```

| Frame | Rows used |
| :-- | :-- |
| `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` | this row and the two before: a 3-period moving window |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` | everything up to this row: a running total |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | the whole partition |
| *(no ORDER BY)* | the whole partition |

### Two default-frame traps

1. With `ORDER BY` and no frame, the default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. **RANGE** treats rows with the same `ORDER BY` value as one step. A running total ordered by `booking_date` gives every shipment booked on the same day the *same* total. If you want one step per row, write `ROWS` and add a tie-breaker (`ORDER BY booking_date, shipment_id`).
2. `LAST_VALUE(x) OVER (ORDER BY …)` returns the **current** row's value, because the default frame stops at the current row. Give it the whole partition, or use `FIRST_VALUE` with the order reversed.

**Trap 1, live.** Four shipments were booked on 2 January 2025 and four on 3 January. Compare the default frame with an explicit `ROWS` frame:

```sql run
SELECT
  shipment_id,
  booking_date,
  COUNT(*) OVER (ORDER BY booking_date) AS range_default,
  COUNT(*) OVER (ORDER BY booking_date, shipment_id
                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_frame
FROM shipments
ORDER BY booking_date, shipment_id
LIMIT 8;
```

`range_default` jumps 4, 4, 4, 4, 8…: each day's bookings count as one step. `rows_frame` counts 1, 2, 3… one row at a time.

**Trap 2, live.** `LAST_VALUE` with the default frame just returns the current row:

```sql run
SELECT
  shipment_id,
  LAST_VALUE(shipment_id) OVER (ORDER BY booking_date, shipment_id) AS last_default,
  LAST_VALUE(shipment_id) OVER (ORDER BY booking_date, shipment_id
                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_whole
FROM shipments
ORDER BY booking_date, shipment_id
LIMIT 4;
```

### Shares of a total

`SUM(x) OVER ()` is the grand total on every row, and `SUM(x) OVER (PARTITION BY mode)` is the mode's total. Divide by either to get a share without a second query.

```sql run
SELECT
  r.mode,
  COUNT(*) AS shipments,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct_of_all
FROM shipments AS s
JOIN routes AS r ON r.route_id = s.route_id
GROUP BY r.mode;
```

`SUM(COUNT(*)) OVER ()` looks odd but reads simply: after grouping, add up every group's count. Sea carries 70.5% of all bookings.

### LAG and LEAD

`LAG(x, n, default)` looks `n` rows back (1 by default) and `LEAD` looks forward. They're how you calculate month-on-month change, or the gap between one order and the next.

```sql run
WITH monthly AS (
  SELECT strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments
  FROM shipments
  GROUP BY month
)
SELECT
  month,
  shipments,
  LAG(shipments) OVER (ORDER BY month)             AS previous_month,
  shipments - LAG(shipments) OVER (ORDER BY month) AS change
FROM monthly
ORDER BY month
LIMIT 6;
```

The first month has no previous one, so `LAG` returns NULL: use `LAG(shipments, 1, 0)` if you'd rather see 0.

## Example

A 3-month moving average of bookings, showing it only once three months are available:

```sql run
WITH monthly AS (
  SELECT strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments
  FROM shipments
  GROUP BY month
)
SELECT
  month,
  shipments,
  CASE
    WHEN COUNT(*) OVER w = 3 THEN ROUND(AVG(shipments) OVER w, 1)
  END AS moving_avg_3,
  shipments - LAG(shipments) OVER (ORDER BY month) AS change_vs_last_month
FROM monthly
WINDOW w AS (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
ORDER BY month;
```

The moving average sits between about 126 and 140 all the way through. June 2025's 106 is a dip, not a trend, and volume is broadly flat. That's the answer to the director's question, and it's far more reliable than reading the raw months.

## Walkthrough

1. Run the example. `WINDOW w AS (…)` names a window once so several functions can share it.
2. Remove the `CASE` so the first two months show a "moving average" of one and two months. That's why it's worth hiding incomplete windows: January's "average" is just January.
3. Run the RANGE trap for yourself. Look at the rows where several shipments share a booking date:

```sql run
SELECT
  shipment_id,
  booking_date,
  freight_charge,
  SUM(freight_charge) OVER (ORDER BY booking_date) AS range_total,
  SUM(freight_charge) OVER (ORDER BY booking_date, shipment_id ROWS UNBOUNDED PRECEDING) AS rows_total
FROM shipments
ORDER BY booking_date, shipment_id
LIMIT 12;
```

4. Notice that `range_total` jumps once per **day**, while `rows_total` climbs once per **shipment**. Both are "correct", but they answer different questions.

## Practice

```exercise
{
  "id": "asql-04-p1",
  "prompt": "For delivered shipments, show each route's share of its mode's freight charges. Show mode, route_id, charges and pct_of_mode (1 decimal place), ordered by mode, then charges descending.",
  "starter": "WITH by_route AS (\n  SELECT r.mode, s.route_id, SUM(s.freight_charge) AS charges\n  FROM shipments AS s\n  JOIN routes AS r ON r.route_id = s.route_id\n  WHERE s.status = 'Delivered'\n  GROUP BY r.mode, s.route_id\n)\nSELECT mode, route_id, charges\nFROM by_route;",
  "solution": "WITH by_route AS (SELECT r.mode, s.route_id, SUM(s.freight_charge) AS charges FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' GROUP BY r.mode, s.route_id) SELECT mode, route_id, charges, ROUND(100.0 * charges / SUM(charges) OVER (PARTITION BY mode), 1) AS pct_of_mode FROM by_route ORDER BY mode, charges DESC;",
  "hint": "Divide by SUM(charges) OVER (PARTITION BY mode). Remember 100.0.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-04-p2",
  "prompt": "For customer 8 (Harmattan Agro), list each shipment with the days since that customer's previous booking. Show shipment_id, booking_date and days_since_previous (a whole number; NULL for the first), ordered by booking_date then shipment_id.",
  "starter": "SELECT\n  shipment_id,\n  booking_date\nFROM shipments\nWHERE customer_id = 8\nORDER BY booking_date, shipment_id;",
  "solution": "SELECT shipment_id, booking_date, CAST(julianday(booking_date) - julianday(LAG(booking_date) OVER (ORDER BY booking_date, shipment_id)) AS INTEGER) AS days_since_previous FROM shipments WHERE customer_id = 8 ORDER BY booking_date, shipment_id;",
  "hint": "julianday(booking_date) - julianday(LAG(booking_date) OVER (ORDER BY booking_date, shipment_id)), wrapped in CAST(… AS INTEGER).",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-04-c1",
  "prompt": "For customers with at least 20 shipments, find the average gap in days between consecutive bookings. Show customer_id, shipments and avg_gap_days (1 decimal place), shortest gap first.",
  "starter": "",
  "solution": "WITH gaps AS (SELECT customer_id, julianday(booking_date) - julianday(LAG(booking_date) OVER (PARTITION BY customer_id ORDER BY booking_date, shipment_id)) AS gap FROM shipments) SELECT customer_id, COUNT(*) AS shipments, ROUND(AVG(gap), 1) AS avg_gap_days FROM gaps GROUP BY customer_id HAVING COUNT(*) >= 20 ORDER BY avg_gap_days, customer_id;",
  "hint": "LAG partitioned by customer_id in a CTE, then GROUP BY customer. AVG ignores the NULL first gap, which is what you want.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-04-d1",
  "prompt": "Show payments received per month in 2026 with the percentage change from the previous month. Show month, received and pct_change (1 decimal place, NULL for January), ordered by month.",
  "starter": "",
  "solution": "WITH m AS (SELECT strftime('%Y-%m', payment_date) AS month, SUM(amount) AS received FROM payments WHERE payment_date >= '2026-01-01' GROUP BY month) SELECT month, received, ROUND(100.0 * (received - LAG(received) OVER (ORDER BY month)) / LAG(received) OVER (ORDER BY month), 1) AS pct_change FROM m ORDER BY month;",
  "hint": "(this − previous) / previous × 100, with LAG for the previous month.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-04-d2",
  "prompt": "For each customer who has booked, show customer_id and first_route: the route_id of their earliest booking (ties broken by the lower shipment_id). Use FIRST_VALUE. One row per customer, ordered by customer_id.",
  "starter": "",
  "solution": "SELECT DISTINCT customer_id, FIRST_VALUE(route_id) OVER (PARTITION BY customer_id ORDER BY booking_date, shipment_id) AS first_route FROM shipments ORDER BY customer_id;",
  "hint": "FIRST_VALUE(route_id) OVER (PARTITION BY customer_id ORDER BY booking_date, shipment_id), then DISTINCT to keep one row each.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-04-d3",
  "prompt": "Show each mode's share of all delivered freight charges: mode, charges and pct_of_total (1 decimal place), largest first.",
  "starter": "",
  "solution": "SELECT r.mode, SUM(s.freight_charge) AS charges, ROUND(100.0 * SUM(s.freight_charge) / SUM(SUM(s.freight_charge)) OVER (), 1) AS pct_of_total FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' GROUP BY r.mode ORDER BY charges DESC;",
  "hint": "SUM(SUM(freight_charge)) OVER () is the grand total of the grouped sums.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does ROWS BETWEEN 2 PRECEDING AND CURRENT ROW give AVG for the first row of a partition?",
    "options": ["NULL", "The average of just that one row", "An error", "The average of the whole partition"],
    "answer": 1,
    "explanation": "The frame has only one row so far. Hide incomplete windows, for example with COUNT(*) OVER the same window."
  },
  {
    "prompt": "SUM(charge) OVER (ORDER BY booking_date) gives three shipments booked on the same day the same running total. Why?",
    "options": ["A bug in SQLite", "The default frame is RANGE, which treats rows with equal ORDER BY values as one step", "SUM ignores duplicates", "The dates are text"],
    "answer": 1,
    "explanation": "Use ROWS and a tie-breaker for one step per row."
  },
  {
    "prompt": "Which expression gives each route's share of its mode's total?",
    "options": ["charges / SUM(charges)", "charges / SUM(charges) OVER (PARTITION BY mode)", "charges / COUNT(*) OVER ()", "RANK() OVER (PARTITION BY mode)"],
    "answer": 1,
    "explanation": "PARTITION BY mode makes the total restart for each mode."
  }
]
```
