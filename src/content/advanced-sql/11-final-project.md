---
title: "Final project: commercial health check"
minutes: 20
summary: Plan your final project, a commercial health check of Harbourline Freight for its leadership team, and warm up with two of its queries.
---

## The problem

Harbourline Freight's managing director is preparing for a board meeting and asks for a **commercial health check**:

> "Are we growing? Are our customers staying? Are we delivering on our promises? And are we actually getting paid? I want numbers I can defend, with the SQL behind them so the finance team can check them."

That's four questions, and each one needs a pattern from this course. The board will push back on any number that looks odd, so the data has to be checked first and the definitions written down. The full brief and submission are on the course's project page; this lesson gets you started.

## The concept

**From questions to patterns**

| Question | Pattern | Lesson |
| :-- | :-- | :-- |
| Can we trust the data? | Profile, keys, relationships, business rules, reconciliation | 3 |
| Are we growing? | Like-for-like year-to-date pivot, monthly trend with a moving average | 2, 4, 7 |
| Are customers staying? | Cohorts and retention, lapsed customers, RFM | 6, 10 |
| Are we delivering on our promises? | On-time rate by mode and route, period comparison | 1, 7 |
| Are we getting paid? | Receivables aging, top debtors, days to pay | 10 |

**What makes it board-ready**

- **Definitions first**: what counts as revenue (charges on delivered shipments, or cash received?), on time, active and the "as of" date (31 August 2026).
- **Like for like**: no comparison of a full year with eight months.
- **Readable SQL**: one CTE per step, named for what it holds, with a comment where a definition matters.
- **Reconciled totals**: the aging buckets add up to the outstanding total, and the customer list adds up to the company total.
- **Sentences, not just tables**: each result followed by what it means and what to do about it.

## Example

A first look at the delivery question: on-time rate by mode, 2025 against 2026 (both years by delivery date, as of 31 August 2026).

```sql run
WITH delivered AS (
  SELECT
    r.mode,
    strftime('%Y', s.delivery_date) AS year,
    -- on time = transit days <= the route's target
    julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days AS on_time
  FROM shipments AS s
  JOIN routes AS r ON r.route_id = s.route_id
  WHERE s.status = 'Delivered'
)
SELECT
  mode,
  SUM(year = '2025') AS delivered_2025,
  ROUND(100.0 * SUM(CASE WHEN year = '2025' THEN on_time END) / SUM(year = '2025'), 1) AS on_time_2025,
  SUM(year = '2026') AS delivered_2026,
  ROUND(100.0 * SUM(CASE WHEN year = '2026' THEN on_time END) / SUM(year = '2026'), 1) AS on_time_2026
FROM delivered
GROUP BY mode
ORDER BY mode;
```

Road and sea improved, but air fell from 80.4% to 68.9% on time. Rates are shares, not counts, so comparing a full year with eight months is fair here. The counts still matter, though: air had only 153 and 122 deliveries, so part of a change that size could be noise. The Statistics for Data Analysis course shows how to test whether a change like that is real.

## Walkthrough

1. Write your definitions in a comment block at the top of a SQL file: revenue, on time, active customer and the "as of" date.
2. Run the data-quality checks from lesson 3 and note what you found and decided.
3. Build the year-to-date pivot (lesson 7) and the monthly moving average (lesson 4) to answer "are we growing?".
4. Build the cohort table (lesson 6) and the list of lapsed customers.
5. Build the aging report (lesson 10) and reconcile it with the outstanding total.
6. Open the project brief on the course page and check that every task has a query.

## Practice

```exercise
{
  "id": "asql-11-p1",
  "prompt": "Who should chase the old debt? For unpaid amounts on delivered shipments more than 90 days after delivery (as of 2026-08-31), show account_manager (full name, or 'Unassigned'), customers (the number of distinct customers) and over_90 (the total), largest first.",
  "starter": "WITH paid AS (\n  SELECT shipment_id, SUM(amount) AS paid\n  FROM payments\n  GROUP BY shipment_id\n)\nSELECT\n  \nFROM shipments AS s\nLEFT JOIN paid AS p ON p.shipment_id = s.shipment_id\nJOIN customers AS c ON c.customer_id = s.customer_id\nLEFT JOIN employees AS e ON e.employee_id = c.account_manager_id\nWHERE s.status = 'Delivered'\n  AND s.freight_charge > COALESCE(p.paid, 0)\n  AND s.delivery_date <= date('2026-08-31', '-90 days')\n",
  "solution": "WITH paid AS (SELECT shipment_id, SUM(amount) AS paid FROM payments GROUP BY shipment_id) SELECT COALESCE(e.full_name, 'Unassigned') AS account_manager, COUNT(DISTINCT s.customer_id) AS customers, SUM(s.freight_charge - COALESCE(p.paid, 0)) AS over_90 FROM shipments AS s LEFT JOIN paid AS p ON p.shipment_id = s.shipment_id JOIN customers AS c ON c.customer_id = s.customer_id LEFT JOIN employees AS e ON e.employee_id = c.account_manager_id WHERE s.status = 'Delivered' AND s.freight_charge > COALESCE(p.paid, 0) AND s.delivery_date <= date('2026-08-31', '-90 days') GROUP BY account_manager ORDER BY over_90 DESC;",
  "hint": "Group by COALESCE(e.full_name, 'Unassigned'). The LEFT JOIN to employees keeps customers with no account manager, and their debt still needs an owner.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-11-p2",
  "prompt": "Are we growing? Show bookings and delivered freight charges year to date (January to August) for 2025 and 2026 in one row: shipments_2025, shipments_2026, charges_2025, charges_2026 (charges on Delivered shipments, by booking_date).",
  "starter": "",
  "solution": "SELECT SUM(booking_date BETWEEN '2025-01-01' AND '2025-08-31') AS shipments_2025, SUM(booking_date BETWEEN '2026-01-01' AND '2026-08-31') AS shipments_2026, SUM(CASE WHEN status = 'Delivered' AND booking_date BETWEEN '2025-01-01' AND '2025-08-31' THEN freight_charge ELSE 0 END) AS charges_2025, SUM(CASE WHEN status = 'Delivered' AND booking_date BETWEEN '2026-01-01' AND '2026-08-31' THEN freight_charge ELSE 0 END) AS charges_2026 FROM shipments;",
  "hint": "Conditional aggregation over the same January-to-August window in both years.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "asql-11-c1",
  "prompt": "Delivered charges by booking year look lower in 2026 partly because recent shipments are still in transit. Show, for bookings from January to August of each year: year, booked, delivered, in_transit_or_booked, and delivered_pct (1 decimal place), ordered by year.",
  "starter": "",
  "solution": "SELECT strftime('%Y', booking_date) AS year, COUNT(*) AS booked, SUM(status = 'Delivered') AS delivered, SUM(status IN ('In transit', 'Booked')) AS in_transit_or_booked, ROUND(100.0 * SUM(status = 'Delivered') / COUNT(*), 1) AS delivered_pct FROM shipments WHERE strftime('%m', booking_date) <= '08' GROUP BY year ORDER BY year;",
  "hint": "Bookings made in July and August 2026 have had little time to arrive. Show it, so nobody mistakes it for a fall in business.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why reconcile the aging buckets with the outstanding total before presenting?",
    "options": ["Boards like big numbers", "If they don't add up, a join or filter is wrong, and the board will find it", "It makes the query faster", "It isn't necessary"],
    "answer": 1,
    "explanation": "A reconciliation is the cheapest proof that your query is right."
  },
  {
    "prompt": "2026 delivered charges for bookings to date look lower than 2025's. What should you check first?",
    "options": ["Nothing; revenue fell", "Whether recent bookings are still in transit and so not yet delivered", "Whether SQL rounded the numbers", "The colour of the chart"],
    "answer": 1,
    "explanation": "Recent periods are incomplete. Compare like for like, or show what's still in progress."
  },
  {
    "prompt": "Where should the definitions of revenue, on time and active customer go?",
    "options": ["Nowhere: they're obvious", "At the top of the work, before any results", "In a footnote on the last slide", "Only in your head"],
    "answer": 1,
    "explanation": "Every number depends on them, so they come first."
  }
]
```
