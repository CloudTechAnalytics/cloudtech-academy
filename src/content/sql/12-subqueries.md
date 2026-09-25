---
title: Subqueries
minutes: 30
summary: Use the result of one query inside another, in WHERE, SELECT and FROM.
---

## The problem

Finance wants to review unusually expensive bookings:

> "Show me every shipment that cost more than our average shipment."

To answer it, you need the average first, and then the shipments above it. You could run two queries and copy the number across by hand. But next month the average changes, and your copied number is wrong.

## The concept

A **subquery** is a query inside another query, written in brackets. The inner query runs first and its result is used by the outer one.

There are three common places to put one:

1. **In `WHERE`**, to compare against a calculated value or a list.
2. **In `SELECT`**, to show a calculated value on every row.
3. **In `FROM`**, to treat a result as if it were a table.

A subquery that returns a single value is called a **scalar** subquery. One that returns a list of values works with `IN`.

## Example

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
WHERE freight_charge > (SELECT AVG(freight_charge) FROM shipments)
ORDER BY freight_charge DESC;
```

## Walkthrough

- `(SELECT AVG(freight_charge) FROM shipments)` runs first and returns one number.
- The outer query keeps shipments whose charge is above that number.
- Because the average is calculated each time the query runs, the report stays correct as data changes.

A subquery that returns a **list** works with `IN`. Here, customers in the Pharmaceuticals industry, found by ID:

```sql run
SELECT shipment_id, booking_date, containers
FROM shipments
WHERE customer_id IN (
  SELECT customer_id FROM customers WHERE industry = 'Pharmaceuticals'
);
```

A subquery in `FROM` builds a temporary table you can query again. This finds the average number of shipments per customer, which needs two levels of aggregation:

```sql run
SELECT ROUND(AVG(shipment_count), 1) AS avg_shipments_per_customer
FROM (
  SELECT customer_id, COUNT(*) AS shipment_count
  FROM shipments
  GROUP BY customer_id
) AS per_customer;
```

The inner query gives one row per customer; the outer query averages those counts. In most databases a subquery in `FROM` needs an alias, here `per_customer`.

> [!TIP]
> When a subquery gets long, it becomes hard to read from the inside out. The next lesson, CTEs, lets you write the same thing top to bottom.

## Practice

```exercise
{
  "id": "sql-11-p1",
  "prompt": "Show shipment_id and weight_kg for every shipment heavier than the average shipment.",
  "starter": "",
  "solution": "SELECT shipment_id, weight_kg FROM shipments WHERE weight_kg > (SELECT AVG(weight_kg) FROM shipments);",
  "hint": "Compare weight_kg to (SELECT AVG(weight_kg) FROM shipments).",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-11-c1",
  "prompt": "List the company_name of customers who booked at least one Air shipment. Each company once. (Air is a mode in routes.)",
  "starter": "",
  "solution": "SELECT company_name FROM customers WHERE customer_id IN (SELECT customer_id FROM shipments WHERE route_id IN (SELECT route_id FROM routes WHERE mode = 'Air'));",
  "hint": "Work inside out: air route_ids from routes, then customer_ids from shipments on those routes, then company names.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In WHERE freight_charge > (SELECT AVG(freight_charge) FROM shipments), which part runs first?",
    "options": ["The outer query", "The subquery in brackets", "They run together", "Whichever is shorter"],
    "answer": 1,
    "explanation": "The inner query produces the average, which the outer query then compares against."
  },
  {
    "prompt": "Which operator works with a subquery that returns a list of IDs?",
    "options": ["=", "IN", "LIKE", "BETWEEN"],
    "answer": 1,
    "explanation": "= expects a single value; IN matches any value in a list."
  },
  {
    "prompt": "Why use a subquery instead of typing the average in by hand?",
    "options": ["It's faster to type", "It stays correct when the data changes", "Databases can't store numbers", "It hides the average"],
    "answer": 1,
    "explanation": "The subquery recalculates every time, so the report never uses a stale number."
  }
]
```
