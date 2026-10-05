---
title: Aggregate functions
minutes: 30
summary: Summarise many rows into one answer with COUNT, SUM, AVG, MIN and MAX: missing values, distinct counts, rounding and filtering first, step by step.
---

## The problem

The managing director has a board meeting tomorrow and asks for a few numbers about 2025:

- How many shipments did we handle?
- How much did we charge in total?
- What was the average shipment worth?

None of these needs a list of shipments. Each needs **one number** calculated from many rows.

## The concept

Every query so far returned one result row for each table row. An **aggregate function** does something different: it takes **many** values and returns **one**. How many shipments? What's the total charged? What's the biggest booking? Each of those is a single number summarising thousands of rows.

### The five aggregate functions

| Function | Returns | Works on |
| :-- | :-- | :-- |
| `COUNT(*)` | the number of rows | any table |
| `COUNT(column)` | the number of rows where the column **has a value** | any column |
| `COUNT(DISTINCT column)` | the number of **different** values | any column |
| `SUM(column)` | the total | numbers |
| `AVG(column)` | the average (mean) | numbers |
| `MIN(column)` | the smallest value | numbers, text, dates |
| `MAX(column)` | the largest value | numbers, text, dates |

![Six values, one of them NULL, with COUNT(*) 6, COUNT(column) 5, SUM 27, AVG 5.4, MIN 2 and MAX 9](/images/courses/sql/aggregates.svg "Aggregates collapse many rows into one value, and they ignore NULL. (Illustration with simplified data.)")

### The syntax

```sql
SELECT AGGREGATE(column) AS name
FROM table_name
WHERE condition;
```

Always give an aggregate an alias. Otherwise the column heading is the expression itself, such as `SUM(freight_charge)`.

### COUNT: how many rows?

`COUNT(*)` counts rows, whatever is in them:

```sql run
SELECT COUNT(*) AS shipments
FROM shipments;
```

Combine it with `WHERE` to count a slice:

```sql run
SELECT COUNT(*) AS cancelled_shipments
FROM shipments
WHERE status = 'Cancelled';
```

### COUNT(column) and missing values

`COUNT(column)` counts only the rows where that column is **not** `NULL`. That makes it a quick way to see how complete a column is:

```sql run
SELECT
  COUNT(*)             AS shipments,
  COUNT(ship_date)     AS shipped,
  COUNT(delivery_date) AS delivered
FROM shipments;
```

2,683 shipments, of which 2,515 have a ship date and 2,411 a delivery date. The rest are still booked, in transit or cancelled.

### COUNT(DISTINCT): how many different values?

```sql run
SELECT
  COUNT(*)                           AS customers,
  COUNT(account_manager_id)          AS with_a_manager,
  COUNT(DISTINCT account_manager_id) AS managers_used
FROM customers;
```

Read the three answers carefully:

- `COUNT(*)` is 120: every customer.
- `COUNT(account_manager_id)` is 112: the eight customers without a manager are skipped.
- `COUNT(DISTINCT account_manager_id)` is 8: eight different account managers share those 112 customers.

### SUM and AVG

`SUM` adds up a column; `AVG` gives the average. Both work only on numbers.

```sql run
SELECT
  SUM(containers) AS total_containers,
  AVG(containers) AS average_containers
FROM shipments;
```

The average is a long decimal, 2.3108… Use `ROUND(value, places)` to make it readable:

```sql run
SELECT
  SUM(containers)           AS total_containers,
  ROUND(AVG(containers), 2) AS average_containers
FROM shipments;
```

`ROUND(x)` with no second number rounds to a whole number, which suits money in naira.

### MIN and MAX

`MIN` and `MAX` work on numbers, text and dates:

```sql run
SELECT
  MIN(booking_date)   AS first_booking,
  MAX(booking_date)   AS latest_booking,
  MIN(freight_charge) AS smallest_charge,
  MAX(freight_charge) AS largest_charge
FROM shipments;
```

On text, `MIN` is the first alphabetically and `MAX` the last:

```sql run
SELECT MIN(company_name) AS first, MAX(company_name) AS last
FROM customers;
```

### Aggregates ignore NULL

Every aggregate except `COUNT(*)` skips `NULL` values. So `AVG` of a column with gaps averages **only the values that exist**, not treating the gaps as zero. That's usually what you want, but be aware of it: an average over 50 known values out of 100 rows describes those 50, not all 100.

### Filter first, then summarise

`WHERE` runs **before** the aggregates. Whatever rows `WHERE` removes are never counted or added. This matters at Harbourline, because cancelled shipments still have a `freight_charge` recorded, although the customer was never billed:

```sql run
SELECT
  COUNT(*)            AS cancelled,
  SUM(freight_charge) AS charge_recorded
FROM shipments
WHERE status = 'Cancelled';
```

That's over ₦1.1 billion that would inflate "total revenue" if you forgot to exclude cancellations. So a revenue figure needs a `WHERE`:

```sql run
SELECT
  COUNT(*)                   AS shipments,
  SUM(freight_charge)        AS total_charged,
  ROUND(AVG(freight_charge)) AS average_charge
FROM shipments
WHERE status <> 'Cancelled';
```

### Calculations inside an aggregate

You can aggregate a calculation, not just a column. The total weight in tonnes:

```sql run
SELECT ROUND(SUM(weight_kg / 1000.0), 1) AS total_tonnes
FROM shipments
WHERE status <> 'Cancelled';
```

And you can calculate with aggregates. The average charge per container across all delivered shipments is the total charge divided by the total containers:

```sql run
SELECT
  SUM(freight_charge) / SUM(containers) AS charge_per_container
FROM shipments
WHERE status = 'Delivered';
```

### Aggregates and ordinary columns don't mix (yet)

This query looks reasonable but doesn't make sense:

```sql
SELECT company_name, COUNT(*)
FROM customers;
```

`COUNT(*)` gives one number for the whole table. Which of the 120 company names should sit next to it? Most databases refuse to run it. SQLite runs it and picks one name arbitrarily, which is worse, because it looks like an answer. To show a count **per** company, city or month, you need `GROUP BY`, the next lesson.

## Example

Finance's 2025 summary: how many shipments, the total charged, and the average charge, excluding cancellations.

```sql run
SELECT
  COUNT(*)                   AS shipments,
  SUM(freight_charge)        AS total_charged,
  ROUND(AVG(freight_charge)) AS average_charge
FROM shipments
WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31'
  AND status <> 'Cancelled';
```

## Walkthrough

1. `FROM shipments` takes every shipment.
2. `WHERE` keeps 2025 bookings and removes cancelled ones, which were never billed.
3. `COUNT(*)`, `SUM` and `AVG` each run over the rows that remain.
4. The result is **one row**, however many shipments there were.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| Forgetting `WHERE status <> 'Cancelled'` | Totals include charges never billed | Filter first |
| `COUNT(column)` when you meant every row | Rows with `NULL` in that column are missed | `COUNT(*)` |
| `SUM` on a text column | An error, or a meaningless 0 | Aggregate a number column |
| An ordinary column next to an aggregate, with no `GROUP BY` | An error, or an arbitrary value in SQLite | Use `GROUP BY` (next lesson) |
| `AVG` assumed to include missing values | The average only covers known values | Check `COUNT(column)` alongside |
| `WHERE COUNT(*) > 5` | An error: `WHERE` runs before aggregates | Use `HAVING` (lesson 9) |

### Summary

| You want... | Write |
| :-- | :-- |
| how many rows | `COUNT(*)` |
| how many have a value | `COUNT(col)` |
| how many different values | `COUNT(DISTINCT col)` |
| a total | `SUM(col)` |
| an average, rounded | `ROUND(AVG(col), 2)` |
| smallest / largest / earliest / latest | `MIN(col)` / `MAX(col)` |
| a summary of some rows only | add `WHERE` before the aggregate runs |

## Practice

```exercise
{
  "id": "sql-06-p1",
  "prompt": "How much did Harbourline receive in payments in total? Return one column named total_received.",
  "starter": "SELECT \nFROM payments;",
  "solution": "SELECT SUM(amount) AS total_received FROM payments;",
  "hint": "SUM the amount column of the payments table.",
  "required": true
}
```

```exercise
{
  "id": "sql-06-p2",
  "prompt": "How many shipments are in transit right now (status 'In transit')? Name the column in_transit.",
  "starter": "",
  "solution": "SELECT COUNT(*) AS in_transit FROM shipments WHERE status = 'In transit';",
  "hint": "COUNT(*) with a WHERE filter on status.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-06-c1",
  "prompt": "For 2026 bookings (from '2026-01-01'), return in one row: the number of different customers who booked, the largest number of containers in a single shipment, and the average weight_kg rounded to a whole number.",
  "starter": "",
  "solution": "SELECT COUNT(DISTINCT customer_id), MAX(containers), ROUND(AVG(weight_kg)) FROM shipments WHERE booking_date >= '2026-01-01';",
  "hint": "COUNT(DISTINCT customer_id), MAX(containers) and ROUND(AVG(weight_kg)), filtered with WHERE booking_date >= '2026-01-01'.",
  "required": false
}
```

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-06-d1",
  "prompt": "How many customers does Harbourline have in Lagos? Return one number.",
  "starter": "",
  "solution": "SELECT COUNT(*) FROM customers WHERE city = 'Lagos';",
  "hint": "COUNT(*) with a WHERE filter.",
  "required": false
}
```

```exercise
{
  "id": "sql-06-d2",
  "prompt": "What are the smallest and largest freight_charge ever billed? Return them in one row as min_charge and max_charge.",
  "starter": "",
  "solution": "SELECT MIN(freight_charge) AS min_charge, MAX(freight_charge) AS max_charge FROM shipments;",
  "hint": "MIN and MAX in the same SELECT.",
  "required": false
}
```

```exercise
{
  "id": "sql-06-d3",
  "prompt": "How many different shipments were paid, at least partly, by Cheque? Return one number.",
  "starter": "",
  "solution": "SELECT COUNT(DISTINCT shipment_id) FROM payments WHERE method = 'Cheque';",
  "hint": "COUNT(DISTINCT shipment_id) counts each shipment once, even if it was paid in several cheques.",
  "required": false
}
```

```exercise
{
  "id": "sql-06-d4",
  "prompt": "What was the average freight_charge of delivered shipments, rounded to the nearest naira? Name it avg_charge.",
  "starter": "",
  "solution": "SELECT ROUND(AVG(freight_charge)) AS avg_charge FROM shipments WHERE status = 'Delivered';",
  "hint": "ROUND(AVG(freight_charge)) with WHERE status = 'Delivered'.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which rows does COUNT(account_manager_id) skip?",
    "options": ["Rows where account_manager_id is NULL", "Rows where account_manager_id is a number", "The first row", "None, it counts every row"],
    "answer": 0,
    "explanation": "COUNT(column) counts only non-NULL values. COUNT(*) counts every row."
  },
  {
    "prompt": "How many rows does SELECT SUM(amount) FROM payments return?",
    "options": ["One per payment", "One", "One per method", "None"],
    "answer": 1,
    "explanation": "Without GROUP BY, an aggregate collapses all rows into a single row."
  },
  {
    "prompt": "Which function counts how many different routes were used?",
    "options": ["COUNT(route_id)", "COUNT(*)", "COUNT(DISTINCT route_id)", "SUM(route_id)"],
    "answer": 2,
    "explanation": "DISTINCT inside COUNT counts each different value once."
  }
]
```
