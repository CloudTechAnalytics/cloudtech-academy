---
title: GROUP BY
minutes: 30
summary: Calculate totals per customer, route, month or status: how grouping works, the golden rule, several columns, calculated groups and NULL, step by step.
---

## The problem

Harbourline has thousands of shipment records. Your manager wants to know:

> "Which customers have shipped the most containers this year?"

You know how to add up containers for the whole company with `SUM`. Now you need that total **for each customer**, then the biggest ones at the top.

## The concept

An aggregate on its own gives one answer for the whole table. `GROUP BY` gives one answer **per group**: shipments per customer, revenue per month, customers per city.

It works in three steps:

1. **Split** the rows into groups that share the same value in the `GROUP BY` column.
2. **Summarise** each group separately with the aggregate functions.
3. **Return** one row per group.

![Seven shipments are split into three groups by status: Delivered, In transit and Cancelled. Each group is counted and its containers added up, giving a result with one row per status.](/images/courses/sql/group-by.svg "GROUP BY status: split the rows by status, summarise each group, return one row per group. (Illustration with simplified data.)")

### The syntax

```sql
SELECT group_column, AGGREGATE(column) AS name
FROM table_name
WHERE condition
GROUP BY group_column
ORDER BY ...;
```

`GROUP BY` comes **after** `WHERE` and **before** `ORDER BY`:

```sql
SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ... LIMIT ...
```

### Your first GROUP BY

How many shipments are in each status?

```sql run
SELECT status, COUNT(*) AS shipments
FROM shipments
GROUP BY status;
```

Four statuses, four rows. Add more aggregates and each one is worked out per group:

```sql run
SELECT
  status,
  COUNT(*)        AS shipments,
  SUM(containers) AS containers
FROM shipments
GROUP BY status;
```

### The golden rule

Every column in `SELECT` must be **either**:

- listed in `GROUP BY`, **or**
- inside an aggregate function.

Why? Each result row represents a whole group. `status` is the same for every row in its group, so it can be shown. `containers` differs from row to row, so on its own it has no single value for the group; `SUM(containers)` does.

This breaks the rule:

```sql
SELECT status, shipment_id, COUNT(*)
FROM shipments
GROUP BY status;
```

There are 2,411 delivered shipments. Which `shipment_id` should appear on the "Delivered" row? Most databases reject the query. SQLite runs it and shows one arbitrary ID, which looks like an answer but means nothing.

### Grouping by a column you summarise elsewhere

Customers per city, largest first:

```sql run
SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
ORDER BY customers DESC;
```

Average, shortest and longest planned journey for each transport mode:

```sql run
SELECT
  mode,
  COUNT(*)                          AS routes,
  ROUND(AVG(target_transit_days), 1) AS average_days,
  MIN(target_transit_days)          AS shortest,
  MAX(target_transit_days)          AS longest
FROM routes
GROUP BY mode;
```

Air routes average under two days; sea routes 23.

### Filter rows first, then group

`WHERE` removes rows **before** they're grouped, so they never reach any group. This year's busiest customers by containers, excluding cancellations:

```sql run
SELECT
  customer_id,
  COUNT(*)        AS shipments,
  SUM(containers) AS containers
FROM shipments
WHERE booking_date >= '2026-01-01'
  AND status <> 'Cancelled'
GROUP BY customer_id
ORDER BY containers DESC
LIMIT 10;
```

The result shows customer IDs rather than names, because names live in the `customers` table. You'll bring them together in the JOINs lesson.

### Grouping by several columns

List more than one column and you get one group for each **combination**:

```sql run
SELECT city, industry, COUNT(*) AS customers
FROM customers
GROUP BY city, industry
ORDER BY city, customers DESC;
```

Each row is one city and industry pair. A pair with no customers simply doesn't appear: `GROUP BY` only creates groups for values that exist.

### Grouping by a calculation

You can group by a calculated value. `strftime('%Y-%m', booking_date)` turns a date into its year and month, such as `'2026-03'`, which gives monthly figures:

```sql run
SELECT
  strftime('%Y-%m', booking_date) AS month,
  COUNT(*)                        AS shipments,
  SUM(containers)                 AS containers
FROM shipments
GROUP BY month
ORDER BY month;
```

Change the format to `'%Y'` for yearly totals:

```sql run
SELECT
  strftime('%Y', booking_date) AS year,
  COUNT(*)                     AS shipments
FROM shipments
GROUP BY year;
```

> [!NOTE]
> `strftime` is SQLite's date-formatting function. The idea is the same elsewhere, with different names: `to_char(booking_date, 'YYYY-MM')` in PostgreSQL and Oracle, `FORMAT(booking_date, 'yyyy-MM')` in SQL Server, and `DATE_FORMAT(booking_date, '%Y-%m')` in MySQL.

### Groups and NULL

Rows where the grouping column is `NULL` form **one group of their own**. Customers per account manager, including the ones with none:

```sql run
SELECT account_manager_id, COUNT(*) AS customers
FROM customers
GROUP BY account_manager_id
ORDER BY account_manager_id;
```

The first row, with an empty manager, is the eight customers nobody looks after yet.

### Sorting grouped results

`ORDER BY` runs after grouping, so it can sort by the group column or by an aggregate's alias:

```sql run
SELECT method, COUNT(*) AS payments, SUM(amount) AS total
FROM payments
GROUP BY method
ORDER BY total DESC;
```

Bank transfers bring in by far the most money.

## Example

Kemi wants to know who ships the most this year: the top ten customers by containers.

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

The database works through it in this order:

1. `FROM shipments`: every shipment.
2. `WHERE booking_date >= '2026-01-01'`: only this year's.
3. `GROUP BY customer_id`: one group per customer.
4. `SELECT`: for each group, the customer ID, `COUNT(*)` of its shipments and `SUM(containers)`.
5. `ORDER BY containers DESC`: biggest shippers first. `containers` here is the alias you created.
6. `LIMIT 10`: the top ten.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| A column in `SELECT` that's neither grouped nor aggregated | An error, or an arbitrary value in SQLite | Add it to `GROUP BY` or wrap it in an aggregate |
| `GROUP BY` before `WHERE` | A syntax error | `WHERE` then `GROUP BY` |
| Expecting a row for a group with no data | It isn't there | `GROUP BY` only shows values that exist |
| Grouping by `booking_date` for monthly totals | One group per **day** | Group by `strftime('%Y-%m', booking_date)` |
| Filtering a total with `WHERE SUM(...) > ...` | An error | Use `HAVING` (next lesson) |

### Summary

| You want... | Write |
| :-- | :-- |
| a count per group | `SELECT g, COUNT(*) FROM t GROUP BY g` |
| several figures per group | `SELECT g, COUNT(*), SUM(x), AVG(y) ... GROUP BY g` |
| one group per combination | `GROUP BY g1, g2` |
| monthly totals | `GROUP BY strftime('%Y-%m', date_col)` |
| some rows only | `WHERE` before `GROUP BY` |
| biggest groups first | `ORDER BY total DESC` |

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
