---
title: GROUP BY
minutes: 15
summary: Calculate totals and counts for each customer, route, month or status.
---

## The problem

Harbourline has thousands of shipment records. Your manager wants to know:

> "Which customers have shipped the most containers this year?"

You know how to add up containers for the whole company with `SUM`. Now you need that total **for each customer**, then the biggest ones at the top.

## The concept

`GROUP BY` splits the rows into groups that share a value, then runs your aggregate functions **once per group**.

Think of it as sorting shipment slips into piles, one pile per customer, then counting the containers in each pile.

Two rules keep you out of trouble:

1. Every column in `SELECT` must either be in `GROUP BY` or be inside an aggregate function.
2. `GROUP BY` comes after `WHERE` and before `ORDER BY`.

```sql
SELECT … FROM … WHERE … GROUP BY … ORDER BY … LIMIT …
```

## Example

```sql run
SELECT
  customer_id,
  COUNT(*)        AS shipments,
  SUM(containers) AS containers
FROM shipments
WHERE booking_date >= '2026-01-01'
GROUP BY customer_id
ORDER BY containers DESC
LIMIT 10;
```

## Walkthrough

Line by line:

- `FROM shipments WHERE booking_date >= '2026-01-01'` takes this year's shipments.
- `GROUP BY customer_id` makes one group per customer.
- `COUNT(*)` counts the shipments in each group, and `SUM(containers)` adds up their containers.
- `ORDER BY containers DESC` puts the biggest shippers first. Here `containers` refers to the alias you created.
- `LIMIT 10` keeps the top ten.

The result has one row per customer, not one per shipment. You'll see customer IDs rather than names, because names live in the `customers` table. You'll join the two in the JOINs lesson.

You can group by more than one column. This counts customers for each city and industry combination:

```sql run
SELECT city, industry, COUNT(*) AS customers
FROM customers
GROUP BY city, industry
ORDER BY city, customers DESC;
```

Each row is one city and industry pair, with the number of customers in it.

You can also group by a calculated value. `strftime('%Y-%m', booking_date)` turns a date into its year and month, which gives monthly totals:

```sql run
SELECT
  strftime('%Y-%m', booking_date) AS month,
  COUNT(*) AS shipments
FROM shipments
GROUP BY month
ORDER BY month;
```

> [!NOTE]
> `strftime` is SQLite's date formatting function. PostgreSQL uses `to_char(booking_date, 'YYYY-MM')` and SQL Server uses `FORMAT(booking_date, 'yyyy-MM')`. The GROUP BY idea is identical.

## Practice

```exercise
{
  "id": "sql-07-p1",
  "prompt": "How many shipments are there in each status? Show status and a count named shipments.",
  "starter": "SELECT status, \nFROM shipments\nGROUP BY ",
  "solution": "SELECT status, COUNT(*) AS shipments FROM shipments GROUP BY status;",
  "hint": "Group by status and use COUNT(*).",
  "required": true
}
```

```exercise
{
  "id": "sql-07-p2",
  "prompt": "What is the total freight_charge for each route_id? Show route_id and total_charge, highest total first.",
  "starter": "",
  "solution": "SELECT route_id, SUM(freight_charge) AS total_charge FROM shipments GROUP BY route_id ORDER BY total_charge DESC;",
  "hint": "GROUP BY route_id, SUM(freight_charge), then ORDER BY the total descending.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "sql-07-c1",
  "prompt": "Finance wants money received per month in 2026. Show the month (as 'YYYY-MM') and the total payment amount, in date order. Use the payments table.",
  "starter": "",
  "solution": "SELECT strftime('%Y-%m', payment_date) AS month, SUM(amount) AS received FROM payments WHERE payment_date >= '2026-01-01' GROUP BY month ORDER BY month;",
  "hint": "Group by strftime('%Y-%m', payment_date), filter to 2026 with WHERE, and sort by the month.",
  "required": false,
  "orderMatters": true
}
```

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-07-d1",
  "prompt": "How many customers are there in each city? Show city and customers, most customers first.",
  "starter": "",
  "solution": "SELECT city, COUNT(*) AS customers FROM customers GROUP BY city ORDER BY customers DESC, city;",
  "hint": "GROUP BY city, COUNT(*), then ORDER BY the count descending. Add city as a tie-breaker.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-07-d2",
  "prompt": "How much money came in by each payment method? Show method and total_amount, largest first.",
  "starter": "",
  "solution": "SELECT method, SUM(amount) AS total_amount FROM payments GROUP BY method ORDER BY total_amount DESC;",
  "hint": "SUM(amount) grouped by method.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-07-d3",
  "prompt": "How many shipments were booked in each month of 2025? Show month as 'YYYY-MM' and shipments, in date order.",
  "starter": "",
  "solution": "SELECT strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments FROM shipments WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY month ORDER BY month;",
  "hint": "strftime('%Y-%m', booking_date) turns a date into its month. Filter 2025 first with WHERE.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-07-d4",
  "prompt": "For each status, show status, the number of shipments and the total containers. Name them shipments and containers.",
  "starter": "",
  "solution": "SELECT status, COUNT(*) AS shipments, SUM(containers) AS containers FROM shipments GROUP BY status;",
  "hint": "Two aggregates in one GROUP BY query.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does GROUP BY city do?",
    "options": ["Makes one group, and one result row, per city", "Sorts the rows by city", "Deletes duplicate cities from the table", "Keeps only one city"],
    "answer": 0,
    "explanation": "Each distinct city becomes one group, so aggregates like COUNT(*) give one value per city."
  },
  {
    "prompt": "Where does GROUP BY go?",
    "options": ["Before WHERE", "After WHERE, before ORDER BY", "After ORDER BY", "After LIMIT"],
    "answer": 1,
    "explanation": "Rows are filtered, then grouped, then sorted."
  },
  {
    "prompt": "A query groups shipments by customer_id. How many rows does it return?",
    "options": ["One per shipment", "One per customer who has shipments in the filtered data", "One", "One per status"],
    "answer": 1,
    "explanation": "GROUP BY returns one row per group, here one per customer."
  }
]
```
