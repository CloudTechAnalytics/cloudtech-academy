---
title: Business analysis with SQL
minutes: 40
summary: Turn a vague business question into precise queries, check your numbers, and present a clear answer.
---

## The problem

On Friday afternoon, the managing director stops by:

> "I keep hearing we're doing well. Are we? Where's the business coming from, and where are we losing it?"

There's no single query for that. The real skill of an analyst isn't knowing every SQL function; it's turning a vague question like this into specific questions, answering each one correctly, and explaining the result in plain language.

## The concept

A reliable way to work:

1. **Break the question down** into things you can measure. "Are we doing well?" becomes: Is shipment volume growing? Which customers drive revenue? Are we delivering on time? Are customers paying?
2. **Find the data** for each one. Which tables and columns hold it?
3. **Write the query**, one step at a time, using CTEs.
4. **Sense-check the answer.** Does the total match a number you already know? Are there cancelled or unfinished records that should be excluded?
5. **Present it**: one sentence per finding, with the number that supports it.

> [!BUSINESS]
> Decide your definitions before you query. Does "revenue" mean what we charged, or what we received? Do cancelled shipments count? Write your choices down, because two analysts with different definitions will get different answers from the same data, and both will be "right".

## Example

**Is volume growing?** Compare each month of 2026 with the same month in 2025:

```sql run
WITH monthly AS (
  SELECT
    strftime('%Y', booking_date) AS year,
    strftime('%m', booking_date) AS month,
    COUNT(*) AS shipments
  FROM shipments
  WHERE status <> 'Cancelled'
  GROUP BY year, month
)
SELECT
  cur.month,
  prev.shipments AS shipments_2025,
  cur.shipments  AS shipments_2026,
  ROUND(100.0 * (cur.shipments - prev.shipments) / prev.shipments, 1) AS change_pct
FROM monthly AS cur
JOIN monthly AS prev ON prev.month = cur.month AND prev.year = '2025'
WHERE cur.year = '2026'
ORDER BY cur.month;
```

**Which customers drive revenue?** What share of 2025's charges came from the ten biggest customers:

```sql run
WITH by_customer AS (
  SELECT customer_id, SUM(freight_charge) AS charged
  FROM shipments
  WHERE status = 'Delivered' AND booking_date BETWEEN '2025-01-01' AND '2025-12-31'
  GROUP BY customer_id
),
ranked AS (
  SELECT charged, ROW_NUMBER() OVER (ORDER BY charged DESC) AS rn
  FROM by_customer
)
SELECT
  ROUND(100.0 * SUM(CASE WHEN rn <= 10 THEN charged ELSE 0 END) / SUM(charged), 1) AS top10_share_pct
FROM ranked;
```

## Walkthrough

The first query joins the `monthly` CTE **to itself**: once as `cur` (2026) and once as `prev` (2025), matched on the month number. It only covers months that exist in both years, which is exactly what a fair comparison needs. `100.0 *` forces decimal division so the percentage isn't rounded to a whole number too early.

The second query answers a question managers care about more than they usually say: **how dependent are we on a few customers?** If ten customers bring in a large share of revenue, losing one of them hurts. The query ranks customers by charges, then compares the top ten's total with everyone's total.

Notice the definitions in each: the first excludes cancelled shipments from volume; the second counts only delivered shipments as revenue. Say so when you present the numbers.

A good write-up of these two results would look like:

> Volume in 2026 is running [up/down] by about X% on the same months of 2025. Our ten largest customers produced Y% of 2025 revenue, so keeping them matters as much as winning new ones.

## Practice

```exercise
{
  "id": "sql-14-p1",
  "prompt": "Which 5 routes earned the most from delivered shipments in 2025? Show origin, destination, mode and total_charged, highest first.",
  "starter": "",
  "solution": "SELECT r.origin, r.destination, r.mode, SUM(s.freight_charge) AS total_charged FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' AND s.booking_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY r.route_id, r.origin, r.destination, r.mode ORDER BY total_charged DESC LIMIT 5;",
  "hint": "Join shipments to routes, filter delivered 2025 shipments, group by the route, sum the charge, sort and limit.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-14-p2",
  "prompt": "What percentage of delivered shipments arrived on time, for each mode? A delivery is on time when julianday(delivery_date) - julianday(ship_date) <= target_transit_days. Show mode and on_time_pct rounded to 1 decimal place.",
  "starter": "",
  "solution": "SELECT r.mode, ROUND(100.0 * SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days THEN 1 ELSE 0 END) / COUNT(*), 1) AS on_time_pct FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' GROUP BY r.mode;",
  "hint": "Count on-time rows with SUM(CASE …), divide by COUNT(*), multiply by 100.0 and ROUND to 1 place.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-14-c1",
  "prompt": "Find customers who shipped in 2025 but have not booked anything since 2026-03-01. Show company_name and their last booking_date, oldest first.",
  "starter": "",
  "solution": "SELECT c.company_name, MAX(s.booking_date) AS last_booking FROM customers AS c JOIN shipments AS s ON s.customer_id = c.customer_id GROUP BY c.customer_id, c.company_name HAVING MAX(s.booking_date) < '2026-03-01' AND MAX(s.booking_date) >= '2025-01-01' ORDER BY last_booking, c.company_name;",
  "hint": "Group shipments by customer and use HAVING on MAX(booking_date).",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why should you agree what 'revenue' means before writing the query?",
    "options": ["SQL requires it", "Different definitions give different, equally 'correct' answers", "It makes the query faster", "Revenue can't be calculated otherwise"],
    "answer": 1,
    "explanation": "Charged vs received, including or excluding cancellations: each choice changes the number. State the definition you used."
  },
  {
    "prompt": "Why multiply by 100.0 rather than 100 when calculating a percentage in SQLite?",
    "options": ["To make the number bigger", "To force decimal division", "Because 100 is reserved", "It doesn't matter"],
    "answer": 1,
    "explanation": "Integer division throws away decimals; 100.0 makes the whole calculation decimal."
  },
  {
    "prompt": "The top ten customers make up a very large share of revenue. What does that tell the business?",
    "options": ["Nothing useful", "It depends heavily on a few customers", "It should stop serving small customers", "The data is wrong"],
    "answer": 1,
    "explanation": "It's a concentration risk: losing one large customer would hurt."
  }
]
```
