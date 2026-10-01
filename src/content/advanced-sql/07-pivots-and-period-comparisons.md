---
title: Pivots and period comparisons
minutes: 20
summary: Turn rows into columns with conditional aggregation, compare periods like for like, and calculate growth without dividing by zero.
---

## The problem

A board pack draft has this line: **"Shipments fell 33% in 2026: 1,075 against 1,608 in 2025."**

Both numbers are correct. The conclusion is wrong. 2025 is a full year, while 2026 runs only to the end of August. Compare January to August with January to August, and bookings went **up**: 1,052 in 2025 against 1,075 in 2026, a rise of 2.2%.

Period comparisons are where analysts most often embarrass themselves, and the board slide is where it's most costly. This lesson covers the two tools for them: **pivots**, which put periods side by side as columns, and **like-for-like** comparisons.

## The concept

**Pivoting with conditional aggregation**

A pivot turns values in a column (years, modes, statuses) into separate columns. The portable way works in every database: an aggregate wrapped around a `CASE`.

```sql
SELECT
  r.mode,
  SUM(CASE WHEN s.booking_date < '2026-01-01' THEN 1 ELSE 0 END) AS y2025,
  SUM(CASE WHEN s.booking_date >= '2026-01-01' THEN 1 ELSE 0 END) AS y2026
FROM …
GROUP BY r.mode;
```

Shorter spellings exist. PostgreSQL and SQLite allow `COUNT(*) FILTER (WHERE …)`, and SQL Server, Oracle and Snowflake have a `PIVOT` operator. But `SUM(CASE …)` works everywhere and is the one you'll read most in other people's code.

**Like for like**

Compare periods of the same length and the same season:

- **Year to date (YTD)**: January to the last complete month, in both years.
- **Same month last year**: August 2026 against August 2025, not against July 2026, if the business is seasonal.
- Only **complete** periods. A month that's half over always looks like a collapse.

**Growth without errors**

Growth is `(this − last) / last`. If `last` is 0, SQL Server and PostgreSQL raise an error, and SQLite and MySQL return NULL. Make the intention explicit with `NULLIF(last, 0)`, which turns a zero into NULL so the result is NULL, meaning "no comparison possible".

## Example

Year to date by mode, side by side, with the change:

```sql run
WITH ytd AS (
  SELECT
    r.mode,
    SUM(CASE WHEN s.booking_date BETWEEN '2025-01-01' AND '2025-08-31' THEN 1 ELSE 0 END) AS ytd_2025,
    SUM(CASE WHEN s.booking_date BETWEEN '2026-01-01' AND '2026-08-31' THEN 1 ELSE 0 END) AS ytd_2026
  FROM shipments AS s
  JOIN routes AS r ON r.route_id = s.route_id
  GROUP BY r.mode
)
SELECT
  mode,
  ytd_2025,
  ytd_2026,
  ytd_2026 - ytd_2025 AS change,
  ROUND(100.0 * (ytd_2026 - ytd_2025) / NULLIF(ytd_2025, 0), 1) AS pct_change
FROM ytd
ORDER BY ytd_2026 DESC;
```

Sea, the bulk of the business, is slightly down (2.6%), and the smaller air and road businesses grew by 14% to 17%. There was no 33% fall: that was the calendar, not the business.

## Walkthrough

1. Run the example. Then change both date ranges to whole years (`'2025-01-01' AND '2025-12-31'`, and the same for 2026) and see misleading falls of 23% to 36% appear.
2. Put it back to January to August. That's the version to show.
3. Run this month-by-month comparison, which shows the seasonal pattern behind the totals:

```sql run
SELECT
  strftime('%m', booking_date) AS month,
  SUM(booking_date < '2026-01-01') AS y2025,
  SUM(booking_date >= '2026-01-01') AS y2026
FROM shipments
WHERE strftime('%m', booking_date) <= '08'
GROUP BY month
ORDER BY month;
```

4. Find June: 106 in 2025, 138 in 2026. Most of the year-to-date rise comes from one weak month in 2025, so the honest summary is "flat, with a weak June last year", not "growing".

## Practice

```exercise
{
  "id": "asql-07-p1",
  "prompt": "Pivot shipment status by year of booking. Show year, booked, in_transit, delivered and cancelled (counts), ordered by year.",
  "starter": "SELECT\n  strftime('%Y', booking_date) AS year,\n  SUM(CASE WHEN status = 'Booked' THEN 1 ELSE 0 END) AS booked\nFROM shipments\nGROUP BY year\nORDER BY year;",
  "solution": "SELECT strftime('%Y', booking_date) AS year, SUM(CASE WHEN status = 'Booked' THEN 1 ELSE 0 END) AS booked, SUM(CASE WHEN status = 'In transit' THEN 1 ELSE 0 END) AS in_transit, SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered, SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled FROM shipments GROUP BY year ORDER BY year;",
  "hint": "One SUM(CASE WHEN status = '…' THEN 1 ELSE 0 END) per status. The value is 'In transit', with a space.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-07-p2",
  "prompt": "Compare payments received year to date (January to August) in 2025 and 2026. Show one row: ytd_2025, ytd_2026 and pct_change (1 decimal place).",
  "starter": "",
  "solution": "WITH t AS (SELECT SUM(CASE WHEN payment_date BETWEEN '2025-01-01' AND '2025-08-31' THEN amount ELSE 0 END) AS ytd_2025, SUM(CASE WHEN payment_date BETWEEN '2026-01-01' AND '2026-08-31' THEN amount ELSE 0 END) AS ytd_2026 FROM payments) SELECT ytd_2025, ytd_2026, ROUND(100.0 * (ytd_2026 - ytd_2025) / NULLIF(ytd_2025, 0), 1) AS pct_change FROM t;",
  "hint": "SUM(CASE WHEN payment_date BETWEEN … THEN amount ELSE 0 END) for each year, then the growth formula with NULLIF.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "asql-07-c1",
  "prompt": "For the 10 customers with the highest delivered freight charges, show customer_id, sea, air, road (delivered charges by mode, 0 where none) and total, highest total first.",
  "starter": "",
  "solution": "SELECT s.customer_id, SUM(CASE WHEN r.mode = 'Sea' THEN s.freight_charge ELSE 0 END) AS sea, SUM(CASE WHEN r.mode = 'Air' THEN s.freight_charge ELSE 0 END) AS air, SUM(CASE WHEN r.mode = 'Road' THEN s.freight_charge ELSE 0 END) AS road, SUM(s.freight_charge) AS total FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' GROUP BY s.customer_id ORDER BY total DESC LIMIT 10;",
  "hint": "Pivot the mode with SUM(CASE WHEN r.mode = 'Sea' THEN s.freight_charge ELSE 0 END), and order by the total.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-07-d1",
  "prompt": "Show August's bookings by mode for 2025 and 2026 side by side: mode, aug_2025, aug_2026, ordered by mode.",
  "starter": "",
  "solution": "SELECT r.mode, SUM(CASE WHEN strftime('%Y-%m', s.booking_date) = '2025-08' THEN 1 ELSE 0 END) AS aug_2025, SUM(CASE WHEN strftime('%Y-%m', s.booking_date) = '2026-08' THEN 1 ELSE 0 END) AS aug_2026 FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id GROUP BY r.mode ORDER BY r.mode;",
  "hint": "Compare strftime('%Y-%m', booking_date) with '2025-08' and '2026-08'.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-07-d2",
  "prompt": "Show payments received by method per year: method, y2025 and y2026 (totals of amount by payment_date year), ordered by method.",
  "starter": "",
  "solution": "SELECT method, SUM(CASE WHEN payment_date < '2026-01-01' THEN amount ELSE 0 END) AS y2025, SUM(CASE WHEN payment_date >= '2026-01-01' THEN amount ELSE 0 END) AS y2026 FROM payments GROUP BY method ORDER BY method;",
  "hint": "SUM(CASE … THEN amount ELSE 0 END) per year.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "It's mid-September. Which comparison of this year's sales with last year's is fair?",
    "options": ["This year so far against all of last year", "January to August this year against January to August last year", "September so far against last September", "This year so far against last December"],
    "answer": 1,
    "explanation": "Compare complete periods of the same length and season."
  },
  {
    "prompt": "Why write ROUND(100.0 * (this - last) / NULLIF(last, 0), 1)?",
    "options": ["NULLIF rounds the number", "If last is 0 the result is NULL instead of an error or a misleading number", "It removes NULLs", "It's needed for ROUND"],
    "answer": 1,
    "explanation": "Growth from zero has no meaningful percentage."
  },
  {
    "prompt": "Which pattern pivots rows into columns in every SQL database?",
    "options": ["PIVOT", "SUM(CASE WHEN … THEN … ELSE 0 END)", "QUALIFY", "UNION ALL"],
    "answer": 1,
    "explanation": "Conditional aggregation is portable; PIVOT and FILTER are not available everywhere."
  }
]
```
