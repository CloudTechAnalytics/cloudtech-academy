---
title: Data quality checks in SQL
minutes: 20
summary: Profile a table before you trust it, test keys, relationships and business rules, and investigate suspicious rows instead of deleting them.
---

## The problem

You've just been given access to Harbourline's database, and finance wants a receivables report by Friday. Before you write a single report query, ask the question every experienced analyst asks first: **can I trust this data?**

A report built on data nobody checked can be wrong in ways no query will warn you about: customers counted twice, shipments marked Delivered with no delivery date, payments that belong to no shipment. Twenty minutes of checks can save the week you'd otherwise spend explaining a wrong number to finance.

## The concept

Data quality checks are short queries that test what you're assuming. Run them on any new table, and again whenever the data is refreshed.

| Check | Question | Typical query |
| :-- | :-- | :-- |
| **Profile** | How many rows, NULLs, distinct values, min and max? | `COUNT(*)`, `COUNT(col)`, `COUNT(DISTINCT col)`, `MIN`, `MAX` |
| **Keys** | Is the ID really unique? | `COUNT(*)` against `COUNT(DISTINCT id)` |
| **Relationships** | Does every foreign key point at a real row? Does every parent have children? | `NOT EXISTS`, `LEFT JOIN … IS NULL` |
| **Business rules** | Do the values make sense together? | e.g. Delivered shipments have both dates; delivery is after shipping |
| **Duplicates** | Are rows repeated under different IDs? | `GROUP BY` the natural key `HAVING COUNT(*) > 1` |
| **Reconciliation** | Do totals agree with another source? | e.g. payments never exceed the charge |

**A failed check is a question, not a verdict.** When a check finds rows, look at them before doing anything. Some are errors. Some are perfectly legitimate and tell you something about the business. Write down what you found and what you decided, so the next person doesn't repeat the investigation.

## Example

A business-rule check: each status should come with the right dates. Booked and Cancelled shipments haven't shipped, In transit ones have a ship date only, and Delivered ones have both.

```sql run
SELECT
  status,
  COUNT(*) AS shipments,
  COUNT(ship_date) AS with_ship_date,
  COUNT(delivery_date) AS with_delivery_date
FROM shipments
GROUP BY status;
```

Every status passes. Now a duplicate check on the natural key: the same customer booking the same route on the same day with the same number of containers.

```sql run
SELECT s.*
FROM shipments AS s
JOIN (
  SELECT customer_id, route_id, booking_date, containers
  FROM shipments
  GROUP BY customer_id, route_id, booking_date, containers
  HAVING COUNT(*) > 1
) AS d
  ON  d.customer_id = s.customer_id
  AND d.route_id = s.route_id
  AND d.booking_date = s.booking_date
  AND d.containers = s.containers;
```

Two shipments match: 101206 and 101207, both booked by customer 27 on 2 October 2025. They aren't duplicates. They shipped on different days with different weights and different charges, so they're two real containers that happened to be booked together. Deleting one would have understated that customer's revenue by ₦3.7 million.

## Walkthrough

1. Profile the customers table: `SELECT COUNT(*), COUNT(DISTINCT customer_id), COUNT(account_manager_id), MIN(signup_date), MAX(signup_date) FROM customers;`. 120 customers, unique IDs, 8 with no account manager.
2. Check a relationship from the other side: customers with no shipments at all. There are 15. They signed up but never booked. Is that a data problem, or a sales opportunity?
3. Check a timing rule: does any customer's first booking come before their signup date? One does: Horizon Foods Plc (customer 79) signed up on 27 January 2025 but first booked on 12 January. That's probably a late account set-up, so it's worth noting but harmless.
4. Check payments against shipping: 59 payments are dated before the shipment even left. Are they prepayments, or payments recorded on the wrong date? That's a question for finance, not something to "fix" in SQL.
5. Write the results in a short data-quality note: check, result, decision.

## Practice

```exercise
{
  "id": "asql-03-p1",
  "prompt": "List the customers who have never booked a shipment. Show customer_id, company_name and signup_date, ordered by signup_date. Use NOT EXISTS.",
  "starter": "SELECT c.customer_id, c.company_name, c.signup_date\nFROM customers AS c\nWHERE NOT EXISTS (\n  \n)\nORDER BY c.signup_date;",
  "solution": "SELECT c.customer_id, c.company_name, c.signup_date FROM customers AS c WHERE NOT EXISTS (SELECT 1 FROM shipments AS s WHERE s.customer_id = c.customer_id) ORDER BY c.signup_date, c.customer_id;",
  "hint": "Inside NOT EXISTS: SELECT 1 FROM shipments AS s WHERE s.customer_id = c.customer_id.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-03-p2",
  "prompt": "Reconcile the money on delivered shipments. Show one row: charged (total freight_charge), received (total payments on those shipments) and outstanding (charged − received).",
  "starter": "WITH paid AS (\n  SELECT shipment_id, SUM(amount) AS paid\n  FROM payments\n  GROUP BY shipment_id\n)\nSELECT\n  \nFROM shipments AS s\nLEFT JOIN paid AS p ON p.shipment_id = s.shipment_id\nWHERE s.status = 'Delivered';",
  "solution": "WITH paid AS (SELECT shipment_id, SUM(amount) AS paid FROM payments GROUP BY shipment_id) SELECT SUM(s.freight_charge) AS charged, SUM(COALESCE(p.paid, 0)) AS received, SUM(s.freight_charge - COALESCE(p.paid, 0)) AS outstanding FROM shipments AS s LEFT JOIN paid AS p ON p.shipment_id = s.shipment_id WHERE s.status = 'Delivered';",
  "hint": "Total the payments per shipment first, so a shipment paid in two instalments isn't counted twice. Then COALESCE unpaid shipments to 0.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "asql-03-c1",
  "prompt": "List the payments dated before the shipment's ship_date. Show payment_id, shipment_id, payment_date, ship_date and method, ordered by payment_id.",
  "starter": "",
  "solution": "SELECT p.payment_id, p.shipment_id, p.payment_date, s.ship_date, p.method FROM payments AS p JOIN shipments AS s ON s.shipment_id = p.shipment_id WHERE p.payment_date < s.ship_date ORDER BY p.payment_id;",
  "hint": "Join payments to shipments and compare the two dates. Text dates in YYYY-MM-DD compare correctly.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-03-d1",
  "prompt": "Profile the shipments table in one row: total_rows, distinct_ids, min_booking, max_booking, min_containers, max_containers.",
  "starter": "",
  "solution": "SELECT COUNT(*) AS total_rows, COUNT(DISTINCT shipment_id) AS distinct_ids, MIN(booking_date) AS min_booking, MAX(booking_date) AS max_booking, MIN(containers) AS min_containers, MAX(containers) AS max_containers FROM shipments;",
  "hint": "If total_rows and distinct_ids differ, the ID isn't unique.",
  "required": false
}
```

```exercise
{
  "id": "asql-03-d2",
  "prompt": "Find customers whose first booking is earlier than their signup_date. Show customer_id, company_name, signup_date and first_booking.",
  "starter": "",
  "solution": "SELECT c.customer_id, c.company_name, c.signup_date, MIN(s.booking_date) AS first_booking FROM customers AS c JOIN shipments AS s ON s.customer_id = c.customer_id GROUP BY c.customer_id, c.company_name, c.signup_date HAVING MIN(s.booking_date) < c.signup_date;",
  "hint": "GROUP BY the customer and compare MIN(booking_date) with signup_date in HAVING.",
  "required": false
}
```

```exercise
{
  "id": "asql-03-d3",
  "prompt": "Some shipments are paid in instalments. List the shipments with more than one payment: shipment_id, payments (the count) and paid (the total), ordered by payments descending then shipment_id. Top 10 only.",
  "starter": "",
  "solution": "SELECT shipment_id, COUNT(*) AS payments, SUM(amount) AS paid FROM payments GROUP BY shipment_id HAVING COUNT(*) > 1 ORDER BY payments DESC, shipment_id LIMIT 10;",
  "hint": "GROUP BY shipment_id HAVING COUNT(*) > 1.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A duplicate check finds two shipments with the same customer, route, date and containers. What should you do first?",
    "options": ["Delete the one with the higher ID", "Look at the other columns: different ship dates, weights or charges mean they're probably two real shipments", "Average them", "Ignore the check"],
    "answer": 1,
    "explanation": "A failed check is a question. Here the rows were two genuine containers."
  },
  {
    "prompt": "COUNT(*) is 2,683 and COUNT(DISTINCT shipment_id) is 2,683. What does that tell you?",
    "options": ["There are 2,683 NULLs", "shipment_id is unique", "There are duplicates", "Nothing useful"],
    "answer": 1,
    "explanation": "Equal counts mean no ID appears twice."
  },
  {
    "prompt": "Why total payments per shipment in a CTE before joining them to shipments?",
    "options": ["CTEs are faster", "A shipment paid in instalments would otherwise appear once per payment and its charge would be counted several times", "Payments can't be joined directly", "To remove NULLs"],
    "answer": 1,
    "explanation": "Joining a one-to-many table repeats the 'one' side. Aggregate the many side first."
  }
]
```
