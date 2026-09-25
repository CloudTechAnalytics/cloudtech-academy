---
title: CTEs
minutes: 30
summary: Break complex questions into named steps with WITH, and avoid double-counting when combining totals.
---

## The problem

The finance director asks for something that sounds simple:

> "How much does each customer still owe us?"

What a customer owes is **what we charged** for delivered shipments, minus **what they've paid**. Charges live in `shipments`; payments live in `payments`, and one shipment can have several payments. Getting this right takes several steps, and doing it in one tangled query is how analysts end up with wrong numbers.

## The concept

A **CTE** (common table expression) is a named, temporary result you define at the top of a query with `WITH`, and then use like a table.

```sql
WITH step_one AS (
  SELECT …
),
step_two AS (
  SELECT … FROM step_one …
)
SELECT … FROM step_two;
```

A CTE does the same job as a subquery in `FROM`, but you read it top to bottom, like a recipe, and you can use each step more than once. CTEs only exist while the query runs.

## Example

```sql run
WITH charged AS (
  SELECT customer_id, SUM(freight_charge) AS total_charged
  FROM shipments
  WHERE status = 'Delivered'
  GROUP BY customer_id
),
paid AS (
  SELECT s.customer_id, SUM(p.amount) AS total_paid
  FROM payments AS p
  JOIN shipments AS s ON s.shipment_id = p.shipment_id
  GROUP BY s.customer_id
)
SELECT
  c.company_name,
  ch.total_charged,
  COALESCE(pd.total_paid, 0)                    AS total_paid,
  ch.total_charged - COALESCE(pd.total_paid, 0) AS balance_owed
FROM charged AS ch
JOIN customers AS c ON c.customer_id = ch.customer_id
LEFT JOIN paid AS pd ON pd.customer_id = ch.customer_id
ORDER BY balance_owed DESC
LIMIT 10;
```

## Walkthrough

1. `charged` adds up the charges for delivered shipments, one row per customer.
2. `paid` adds up payments, one row per customer. Payments don't store the customer, so we join to `shipments` to find it.
3. The final query joins the two summaries to `customers` and subtracts.
4. `LEFT JOIN paid` keeps customers who haven't paid anything, and `COALESCE(pd.total_paid, 0)` turns their NULL into 0 so the subtraction works.

Why two separate summaries? If you joined shipments and payments first and then summed, every shipment with two payments would have its charge counted twice. **Aggregating each table on its own and then joining the totals** avoids that double-counting. It's one of the most common mistakes in real reports.

> [!TIP]
> Build CTEs one step at a time. Write the first CTE, run `SELECT * FROM charged` to check it, then add the next step. When a number looks wrong, you can check each step on its own.

## Practice

```exercise
{
  "id": "sql-12-p1",
  "prompt": "Using a CTE named monthly with one row per month of 2025 (month as 'YYYY-MM' and shipments as the count), return only the months with more than 130 shipments.",
  "starter": "WITH monthly AS (\n  SELECT \n  FROM shipments\n  WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31'\n  GROUP BY \n)\nSELECT * FROM monthly\nWHERE ",
  "solution": "WITH monthly AS (SELECT strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments FROM shipments WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY month) SELECT * FROM monthly WHERE shipments > 130;",
  "hint": "Inside the CTE, group by strftime('%Y-%m', booking_date). Outside it, filter with WHERE shipments > 130.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-12-c1",
  "prompt": "Which shipments are delivered but have received no payment at all? Show shipment_id, customer company_name and freight_charge, largest charge first. Use a CTE for the set of shipments that have payments.",
  "starter": "",
  "solution": "WITH paid_shipments AS (SELECT DISTINCT shipment_id FROM payments) SELECT s.shipment_id, c.company_name, s.freight_charge FROM shipments AS s JOIN customers AS c ON c.customer_id = s.customer_id LEFT JOIN paid_shipments AS ps ON ps.shipment_id = s.shipment_id WHERE s.status = 'Delivered' AND ps.shipment_id IS NULL ORDER BY s.freight_charge DESC, s.shipment_id;",
  "hint": "CTE: SELECT DISTINCT shipment_id FROM payments. Then LEFT JOIN it to delivered shipments and keep rows where it IS NULL.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What keyword starts a CTE?",
    "options": ["CTE", "WITH", "TEMP", "DEFINE"],
    "answer": 1,
    "explanation": "WITH name AS ( … ) defines a CTE."
  },
  {
    "prompt": "You join shipments to payments, then SUM(freight_charge). A shipment paid in two instalments…",
    "options": ["Is counted once", "Has its charge counted twice", "Disappears", "Causes an error"],
    "answer": 1,
    "explanation": "The join creates one row per payment, so the shipment's charge appears twice. Aggregate each table first, then join."
  },
  {
    "prompt": "What does COALESCE(total_paid, 0) do?",
    "options": ["Rounds total_paid", "Returns 0 when total_paid is NULL", "Adds 0 to every value", "Counts the payments"],
    "answer": 1,
    "explanation": "COALESCE returns the first non-NULL value in its list."
  }
]
```
