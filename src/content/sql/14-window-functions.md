---
title: Window functions
minutes: 35
summary: Rank rows, number them within groups and calculate running totals without losing detail.
---

## The problem

Two requests land on your desk the same morning:

1. The sales director wants customers **ranked** by containers shipped in 2026, with their rank shown next to their name.
2. Finance wants each month's revenue alongside a **running total** for the year so far.

`GROUP BY` can total things, but it collapses rows. Here you need a calculation across rows *and* to keep every row.

## The concept

A **window function** calculates a value for each row using a set of related rows (its "window"), without collapsing them.

You recognise one by `OVER (…)`:

```sql
function() OVER (PARTITION BY … ORDER BY …)
```

- `PARTITION BY` splits rows into groups; the function restarts in each group. Leave it out and the whole result is one group.
- `ORDER BY` inside `OVER` sets the order the function works through the rows.

Common window functions:

| Function | What it does |
| :-- | :-- |
| `ROW_NUMBER()` | 1, 2, 3, … with no ties |
| `RANK()` | ranks with ties sharing a number, then skipping (1, 2, 2, 4) |
| `DENSE_RANK()` | ties share a number, no gaps (1, 2, 2, 3) |
| `SUM(x) OVER (ORDER BY …)` | running total |
| `LAG(x)` / `LEAD(x)` | the value from the previous / next row |

## Example

```sql run
WITH totals AS (
  SELECT c.company_name, SUM(s.containers) AS containers
  FROM shipments AS s
  JOIN customers AS c ON c.customer_id = s.customer_id
  WHERE s.booking_date >= '2026-01-01'
  GROUP BY c.customer_id, c.company_name
)
SELECT
  company_name,
  containers,
  RANK() OVER (ORDER BY containers DESC) AS container_rank
FROM totals
ORDER BY container_rank
LIMIT 15;
```

## Walkthrough

- The CTE totals 2026 containers per customer, using what you learned in the last few lessons.
- `RANK() OVER (ORDER BY containers DESC)` looks at all rows, orders them by containers, and gives each one its position.
- Every customer row is still there. The rank is simply a new column.

Now a running total. First total each month, then add `SUM(…) OVER (ORDER BY month)`:

```sql run
WITH monthly AS (
  SELECT strftime('%Y-%m', payment_date) AS month, SUM(amount) AS received
  FROM payments
  WHERE payment_date >= '2026-01-01'
  GROUP BY month
)
SELECT
  month,
  received,
  SUM(received) OVER (ORDER BY month) AS received_year_to_date
FROM monthly
ORDER BY month;
```

For each month, the running total adds up every month up to and including that one.

`PARTITION BY` restarts the calculation per group. This numbers each customer's shipments from newest to oldest, so `rn = 1` is their most recent booking:

```sql run
SELECT customer_id, shipment_id, booking_date
FROM (
  SELECT
    customer_id,
    shipment_id,
    booking_date,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY booking_date DESC, shipment_id DESC) AS rn
  FROM shipments
) AS numbered
WHERE rn = 1
ORDER BY booking_date;
```

The customers at the top of this list are the ones who haven't booked for longest. Sales teams use exactly this kind of query to spot customers drifting away.

> [!NOTE]
> You can't filter on a window function in the same query's `WHERE`, because `WHERE` runs first. Wrap the query in a subquery or CTE, as above, and filter outside.

## Practice

```exercise
{
  "id": "sql-13-p1",
  "prompt": "Rank the routes by how many shipments they carried. Show route_id, shipments and route_rank using RANK(), busiest first.",
  "starter": "SELECT\n  route_id,\n  COUNT(*) AS shipments,\n  RANK() OVER (ORDER BY ) AS route_rank\nFROM shipments\nGROUP BY route_id\nORDER BY route_rank;",
  "solution": "SELECT route_id, COUNT(*) AS shipments, RANK() OVER (ORDER BY COUNT(*) DESC) AS route_rank FROM shipments GROUP BY route_id ORDER BY route_rank, route_id;",
  "hint": "Inside OVER, order by COUNT(*) DESC. Window functions run after GROUP BY, so they can use the aggregate.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-13-c1",
  "prompt": "For each month of 2025, show month ('YYYY-MM'), the number of shipments booked, and the previous month's number using LAG. Order by month.",
  "starter": "",
  "solution": "WITH monthly AS (SELECT strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments FROM shipments WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY month) SELECT month, shipments, LAG(shipments) OVER (ORDER BY month) AS previous_month FROM monthly ORDER BY month;",
  "hint": "Count per month in a CTE, then LAG(shipments) OVER (ORDER BY month). January has no previous month, so it shows NULL.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What's the main difference between GROUP BY and a window function?",
    "options": ["Window functions are faster", "Window functions keep every row", "GROUP BY can't count", "There is no difference"],
    "answer": 1,
    "explanation": "GROUP BY collapses rows into one per group; a window function adds a calculated column and keeps the detail."
  },
  {
    "prompt": "Three customers tie for second place. Which function gives ranks 1, 2, 2, 2, 5?",
    "options": ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "LAG()"],
    "answer": 1,
    "explanation": "RANK gives tied rows the same number, then skips ahead. DENSE_RANK would give 1, 2, 2, 2, 3."
  },
  {
    "prompt": "What does PARTITION BY customer_id do in ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY booking_date)?",
    "options": ["Sorts the final result by customer", "Restarts the numbering for each customer", "Removes duplicate customers", "Filters to one customer"],
    "answer": 1,
    "explanation": "Each customer gets their own numbering, starting at 1."
  }
]
```
