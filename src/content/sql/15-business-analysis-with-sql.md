---
title: Business analysis with SQL
minutes: 25
summary: Turn a vague business question into measurable ones: agree definitions, compare like with like, sense-check, and write up four findings from Harbourline's data.
---

## The problem

On Friday afternoon, the managing director stops by:

> "I keep hearing we're doing well. Are we? Where's the business coming from, and where are we losing it?"

There's no single query for that. The real skill of an analyst isn't knowing every SQL function; it's turning a vague question like this into specific questions, answering each one correctly, and explaining the result in plain language.

## The concept

You now know the whole toolkit: `SELECT`, `WHERE`, `ORDER BY`, aggregates, `GROUP BY`, `HAVING`, joins, `CASE`, subqueries, CTEs and window functions. This lesson is about using them together to answer a real business question, which is the actual job.

### A method for vague questions

1. **Break the question down** into things you can measure. "Are we doing well?" becomes four questions:
   - Is shipment volume growing?
   - Which customers drive revenue, and how dependent are we on them?
   - Are we delivering on time?
   - Are customers paying, and how fast?
2. **Agree definitions** before you query (see below).
3. **Find the data** for each one: which tables and columns hold it?
4. **Write the query**, one step at a time, using CTEs.
5. **Sense-check the answer** against something you already know.
6. **Present it**: one sentence per finding, with the number that supports it.

### Definitions first

The same data gives different answers depending on what you count. Decide, and write it down:

| Term | Harbourline definition | Why |
| :-- | :-- | :-- |
| Volume | shipments booked, **excluding** cancelled | cancelled bookings never moved |
| Revenue | `freight_charge` of **delivered** shipments | a booking in transit isn't billed yet |
| On time | days from ship to delivery ≤ the route's `target_transit_days` | the promise made to customers |
| Outstanding | charge minus payments, for delivered shipments | money we're owed |
| Comparison period | January to August in both years | 2026 data stops at the end of August |

> [!BUSINESS]
> Two analysts with different definitions will get different answers from the same data, and both will be "right". State your definitions next to your numbers, every time.

### Sense-checking

Before you trust a result, check it against something simple. Do the parts add up to the whole?

```sql run
SELECT status, COUNT(*) AS shipments
FROM shipments
GROUP BY status;
```

The four statuses should add up to the total number of shipments:

```sql run
SELECT
  (SELECT COUNT(*) FROM shipments) AS total,
  (SELECT SUM(n) FROM (SELECT COUNT(*) AS n FROM shipments GROUP BY status)) AS sum_of_parts;
```

Both 2,683. Other quick checks: is any total negative that shouldn't be? Are there dates outside the range you expected? Does a join return more rows than the table you started from? A two-minute check catches most mistakes before your manager does.

### Comparing like with like

2026 data runs to the end of August. Comparing all of 2025 with eight months of 2026 would make 2026 look like a collapse. Compare **the same months** in both years. Joining a monthly summary **to itself**, once as this year and once as last year, matched on the month, does exactly that.

## Example

**1. Is volume growing?** Each month of 2026 against the same month in 2025:

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

And the eight months together:

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
  SUM(prev.shipments) AS jan_aug_2025,
  SUM(cur.shipments)  AS jan_aug_2026,
  ROUND(100.0 * (SUM(cur.shipments) - SUM(prev.shipments)) / SUM(prev.shipments), 1) AS change_pct
FROM monthly AS cur
JOIN monthly AS prev ON prev.month = cur.month AND prev.year = '2025'
WHERE cur.year = '2026';
```

Up 2.9%: 1,019 shipments against 990.

**2. How dependent are we on a few customers?** The top ten customers' share of 2025 revenue:

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
  COUNT(*) AS customers,
  ROUND(100.0 * SUM(CASE WHEN rn <= 10 THEN charged ELSE 0 END) / SUM(charged), 1) AS top10_share_pct
FROM ranked;
```

Ten of 96 customers produced about a third of the revenue.

**3. Are we delivering on time?** By booking year:

```sql run
SELECT
  strftime('%Y', s.booking_date) AS year,
  COUNT(*) AS delivered,
  ROUND(100.0 * SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days THEN 1 ELSE 0 END) / COUNT(*), 1) AS on_time_pct
FROM shipments AS s
JOIN routes AS r ON r.route_id = s.route_id
WHERE s.status = 'Delivered'
GROUP BY year;
```

75.6% in 2025, 78.4% so far in 2026: better, but still about one delivery in five is late.

**4. Are customers paying?** What's still owed on delivered shipments, summarising payments **first** to avoid double counting:

```sql run
WITH paid AS (
  SELECT shipment_id, SUM(amount) AS paid
  FROM payments
  GROUP BY shipment_id
)
SELECT
  COUNT(*)                                     AS shipments_owing,
  SUM(s.freight_charge - COALESCE(p.paid, 0))  AS amount_owed
FROM shipments AS s
LEFT JOIN paid AS p ON p.shipment_id = s.shipment_id
WHERE s.status = 'Delivered'
  AND s.freight_charge - COALESCE(p.paid, 0) > 0;
```

And how quickly customers pay once a shipment is delivered:

```sql run
SELECT
  ROUND(AVG(julianday(p.payment_date) - julianday(s.delivery_date)), 1) AS avg_days_to_pay
FROM payments AS p
JOIN shipments AS s ON s.shipment_id = p.shipment_id;
```

## Walkthrough

Each query uses one or two ideas from the course:

| Question | Main techniques |
| :-- | :-- |
| Volume growth | a monthly CTE, joined to itself to compare years |
| Customer dependence | `GROUP BY`, `ROW_NUMBER()`, then `SUM(CASE ...)` for a share |
| On time | a join to routes, date arithmetic, `SUM(CASE ...)` as a percentage |
| Money owed | summarise payments first, `LEFT JOIN`, `COALESCE` |

The answers become a short write-up for the managing director. Every sentence has its number and its definition:

> **Volume** is up 2.9% on the same eight months of last year (1,019 shipments against 990, excluding cancellations).
>
> **Revenue is concentrated**: our ten largest customers produced about a third (32.5%) of 2025's delivered revenue, so keeping them matters as much as winning new ones.
>
> **Reliability is improving** but still a weakness: 78.4% of 2026 deliveries arrived within the route's target, up from 75.6%.
>
> **Collections**: customers pay about 13 days after delivery on average, but ₦1.41 billion is still owed on 244 delivered shipments. Finance should chase the largest balances first.

That's the analyst's job: a vague question in, four clear answers out, each backed by a query anyone can rerun.

### Common mistakes

| Mistake | Effect | Fix |
| :-- | :-- | :-- |
| Comparing a full year with a part year | A fake decline | Compare the same months |
| Different definitions in different queries | Numbers that don't reconcile | Agree definitions first |
| Joining before summing | Double-counted totals | Summarise each table, then join |
| Reporting a number without its definition | Arguments about whose number is right | State what's included |
| No sense check | Errors reach the manager | Check that parts add up to the whole |

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

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-14-d1",
  "prompt": "Which industry brought in the most freight revenue in 2025? Show industry and revenue for every industry, highest first.",
  "starter": "",
  "solution": "SELECT c.industry, SUM(s.freight_charge) AS revenue FROM shipments AS s JOIN customers AS c ON c.customer_id = s.customer_id WHERE s.booking_date BETWEEN '2025-01-01' AND '2025-12-31' AND s.status <> 'Cancelled' GROUP BY c.industry ORDER BY revenue DESC;",
  "hint": "Join to customers, filter 2025, leave out cancelled shipments, group by industry.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-14-d2",
  "prompt": "What share of shipments were cancelled each year? Show year ('YYYY') and cancel_pct rounded to 1 decimal place.",
  "starter": "",
  "solution": "SELECT strftime('%Y', booking_date) AS year, ROUND(100.0 * SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_pct FROM shipments GROUP BY year ORDER BY year;",
  "hint": "100.0 * cancelled / all, with SUM(CASE …) for the cancelled count. Use 100.0 so the division keeps its decimals.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-14-d3",
  "prompt": "Each account manager's book of business: show full_name, number of customers, and total freight_charge of their customers' shipments, highest total first.",
  "starter": "",
  "solution": "SELECT e.full_name, COUNT(DISTINCT c.customer_id) AS customers, SUM(s.freight_charge) AS total_charge FROM employees AS e JOIN customers AS c ON c.account_manager_id = e.employee_id JOIN shipments AS s ON s.customer_id = c.customer_id GROUP BY e.employee_id, e.full_name ORDER BY total_charge DESC;",
  "hint": "Two joins: employees to customers, customers to shipments. Count customers with COUNT(DISTINCT …) because the join repeats each customer once per shipment.",
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
