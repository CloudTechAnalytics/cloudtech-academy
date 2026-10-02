---
title: Aggregate functions
minutes: 15
summary: Summarise many rows into one answer with COUNT, SUM, AVG, MIN and MAX.
---

## The problem

The managing director has a board meeting tomorrow and asks for a few numbers about 2025:

- How many shipments did we handle?
- How much did we charge in total?
- What was the average shipment worth?

None of these needs a list of shipments. Each needs **one number** calculated from many rows.

## The concept

**Aggregate functions** take a column of values and return a single value.

| Function | Returns |
| :-- | :-- |
| `COUNT(*)` | the number of rows |
| `COUNT(column)` | the number of rows where that column is not NULL |
| `COUNT(DISTINCT column)` | the number of different values |
| `SUM(column)` | the total |
| `AVG(column)` | the average |
| `MIN(column)` / `MAX(column)` | the smallest / largest value |

Aggregates **ignore NULLs**. `AVG` of a column with some NULLs averages only the values that exist.

`ROUND(value, 2)` rounds to two decimal places, which keeps averages readable.

## Example

```sql run
SELECT
  COUNT(*)                    AS shipments,
  SUM(freight_charge)         AS total_charged,
  ROUND(AVG(freight_charge))  AS average_charge
FROM shipments
WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31'
  AND status <> 'Cancelled';
```

## Walkthrough

1. `WHERE` keeps 2025 bookings and removes cancelled ones, which were never charged.
2. The three aggregates then run over the rows that remain.
3. The result is **one row**, however many shipments there were.

The difference between `COUNT(*)` and `COUNT(column)` matters when a column has NULLs:

```sql run
SELECT
  COUNT(*)                        AS customers,
  COUNT(account_manager_id)       AS with_manager,
  COUNT(DISTINCT account_manager_id) AS managers_used
FROM customers;
```

`COUNT(*)` counts every customer. `COUNT(account_manager_id)` skips the ones with no manager. `COUNT(DISTINCT …)` counts how many different managers look after customers.

> [!WARNING]
> You can't mix aggregates with ordinary columns without saying how to group them. `SELECT company_name, COUNT(*) FROM customers` doesn't mean anything sensible: which company name should sit next to the total? The next lesson, GROUP BY, solves this.

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
