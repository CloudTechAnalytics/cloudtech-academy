---
title: HAVING
minutes: 20
summary: Filter groups after they're calculated, such as customers with more than 30 shipments.
---

## The problem

Harbourline is planning a loyalty discount for its most active customers. The rule the sales director proposes is simple:

> "Anyone who booked more than 30 shipments in 2025."

You can count shipments per customer with `GROUP BY`. But you can't write `WHERE COUNT(*) > 30`, because `WHERE` runs before the counting happens.

## The concept

`HAVING` filters **groups**, after the aggregates are calculated. `WHERE` filters **rows**, before grouping.

| | `WHERE` | `HAVING` |
| :-- | :-- | :-- |
| Filters | individual rows | groups |
| Runs | before `GROUP BY` | after `GROUP BY` |
| Can use aggregates like `COUNT(*)` | no | yes |

The full order of clauses is now:

```sql
SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT …
```

## Example

```sql run
SELECT
  customer_id,
  COUNT(*) AS shipments_2025
FROM shipments
WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY customer_id
HAVING COUNT(*) > 30
ORDER BY shipments_2025 DESC;
```

## Walkthrough

The database works through it in this order:

1. `FROM shipments` takes all shipments.
2. `WHERE …` keeps only 2025 bookings. This is a row filter.
3. `GROUP BY customer_id` builds one group per customer.
4. `COUNT(*)` counts each group.
5. `HAVING COUNT(*) > 30` keeps only groups with more than 30 shipments. This is a group filter.
6. `ORDER BY` sorts what's left.

Use both together when you need both kinds of filter. Here, routes that are expensive on average **and** busy enough for the average to mean something:

```sql run
SELECT
  route_id,
  COUNT(*)                   AS shipments,
  ROUND(AVG(freight_charge)) AS avg_charge
FROM shipments
WHERE status <> 'Cancelled'
GROUP BY route_id
HAVING COUNT(*) >= 50
ORDER BY avg_charge DESC;
```

> [!TIP]
> If a condition doesn't involve an aggregate, put it in `WHERE`, not `HAVING`. It gives the same answer, but filtering rows early means less work for the database.

## Practice

```exercise
{
  "id": "sql-08-p1",
  "prompt": "Which customers booked more than 40 shipments in total, across all dates? Show customer_id and the number of shipments.",
  "starter": "",
  "solution": "SELECT customer_id, COUNT(*) AS shipments FROM shipments GROUP BY customer_id HAVING COUNT(*) > 40;",
  "hint": "GROUP BY customer_id, then HAVING COUNT(*) > 40.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-08-c1",
  "prompt": "Find the industries where Harbourline has at least 12 customers. Show industry and the number of customers, most customers first, then industry A to Z.",
  "starter": "",
  "solution": "SELECT industry, COUNT(*) AS customers FROM customers GROUP BY industry HAVING COUNT(*) >= 12 ORDER BY customers DESC, industry;",
  "hint": "This one uses the customers table. Group by industry and keep groups with COUNT(*) >= 12.",
  "required": false,
  "orderMatters": true
}
```

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-08-d1",
  "prompt": "Which cities have more than 10 customers? Show city and the number of customers.",
  "starter": "",
  "solution": "SELECT city, COUNT(*) AS customers FROM customers GROUP BY city HAVING COUNT(*) > 10;",
  "hint": "HAVING filters the groups after counting.",
  "required": false
}
```

```exercise
{
  "id": "sql-08-d2",
  "prompt": "Which routes carried more than 100 shipments in 2025? Show route_id and shipments, busiest first.",
  "starter": "",
  "solution": "SELECT route_id, COUNT(*) AS shipments FROM shipments WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY route_id HAVING COUNT(*) > 100 ORDER BY shipments DESC, route_id;",
  "hint": "WHERE picks the 2025 rows before grouping; HAVING keeps the busy routes after.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-08-d3",
  "prompt": "Which customers have been charged more than 600,000,000 naira in freight in total? Show customer_id and total_charge, highest first.",
  "starter": "",
  "solution": "SELECT customer_id, SUM(freight_charge) AS total_charge FROM shipments GROUP BY customer_id HAVING SUM(freight_charge) > 600000000 ORDER BY total_charge DESC;",
  "hint": "HAVING SUM(freight_charge) > 600000000",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which clause can filter on SUM(containers) > 100?",
    "options": ["WHERE", "HAVING", "ORDER BY", "FROM"],
    "answer": 1,
    "explanation": "Conditions on aggregates go in HAVING, because they only exist after grouping."
  },
  {
    "prompt": "In a query with both WHERE and HAVING, which runs first?",
    "options": ["HAVING", "WHERE", "They run at the same time", "It depends on the database"],
    "answer": 1,
    "explanation": "WHERE filters rows before grouping; HAVING filters the groups afterwards."
  },
  {
    "prompt": "You want only 2026 bookings, grouped by customer. Where does booking_date >= '2026-01-01' belong?",
    "options": ["HAVING", "WHERE", "GROUP BY", "ORDER BY"],
    "answer": 1,
    "explanation": "It's a condition on individual rows, so it belongs in WHERE."
  }
]
```
