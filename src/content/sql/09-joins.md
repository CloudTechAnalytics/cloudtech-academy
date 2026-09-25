---
title: JOINs
minutes: 35
summary: Combine tables with INNER JOIN and LEFT JOIN, and find records with no match.
---

## The problem

Your list of top customers shows `customer_id` 17, 42, 88… The sales director doesn't know customers by number. She needs **company names**, and those are in a different table.

She also asks something trickier:

> "Which customers signed up but have never shipped anything with us?"

Both questions need data from two tables at once.

## The concept

A **JOIN** combines rows from two tables where a condition matches, usually where a foreign key equals a primary key.

- **INNER JOIN** keeps only rows that have a match in both tables. A shipment joined to its customer.
- **LEFT JOIN** keeps **every** row from the left (first) table, and fills the right table's columns with NULL where there's no match.

Tables often share column names like `customer_id`, so give each table a short **alias** and prefix columns with it: `s.customer_id`, `c.customer_id`.

## Example

```sql run
SELECT
  c.company_name,
  COUNT(*)          AS shipments,
  SUM(s.containers) AS containers
FROM shipments AS s
INNER JOIN customers AS c
  ON c.customer_id = s.customer_id
WHERE s.booking_date >= '2026-01-01'
GROUP BY c.customer_id, c.company_name
ORDER BY containers DESC
LIMIT 10;
```

## Walkthrough

- `FROM shipments AS s` starts with shipments and calls the table `s`.
- `INNER JOIN customers AS c` brings in customers as `c`.
- `ON c.customer_id = s.customer_id` is the matching rule: attach each shipment to the customer with the same ID.
- From here it's the GROUP BY you already know, but now you can show `c.company_name`.

We group by both `c.customer_id` and `c.company_name`. The ID guarantees two companies with the same name are never merged; the name is there so you can display it.

Now the second question. `LEFT JOIN` keeps every customer, even those with no shipments. For those customers, every shipment column comes back as NULL, so you can find them with `IS NULL`:

```sql run
SELECT c.company_name, c.signup_date
FROM customers AS c
LEFT JOIN shipments AS s
  ON s.customer_id = c.customer_id
WHERE s.shipment_id IS NULL
ORDER BY c.signup_date;
```

These are customers the sales team should call.

You can chain joins. Each shipment has a route and a customer:

```sql run
SELECT s.shipment_id, c.company_name, r.origin, r.destination, r.mode
FROM shipments AS s
JOIN customers AS c ON c.customer_id = s.customer_id
JOIN routes    AS r ON r.route_id    = s.route_id
WHERE s.booking_date = '2026-08-03';
```

> [!NOTE]
> `JOIN` on its own means `INNER JOIN`. There are also `RIGHT JOIN` and `FULL OUTER JOIN`, but most analysts rarely need them: you can nearly always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the tables.

> [!WARNING]
> Forgetting the `ON` condition, or matching the wrong columns, pairs every row with every other row. With 2,683 shipments and 120 customers that's over 300,000 rows of nonsense. If a join returns far more rows than you expected, check the `ON` clause first.

## Practice

```exercise
{
  "id": "sql-09-p1",
  "prompt": "Show each shipment booked on '2026-08-03' with its shipment_id, the customer's company_name and the freight_charge.",
  "starter": "SELECT s.shipment_id, c.company_name, s.freight_charge\nFROM shipments AS s\nJOIN customers AS c ON \nWHERE ",
  "solution": "SELECT s.shipment_id, c.company_name, s.freight_charge FROM shipments AS s JOIN customers AS c ON c.customer_id = s.customer_id WHERE s.booking_date = '2026-08-03';",
  "hint": "Join on c.customer_id = s.customer_id, then filter s.booking_date.",
  "required": true
}
```

```exercise
{
  "id": "sql-09-p2",
  "prompt": "Which customers have never shipped with Harbourline? Show their company_name and city.",
  "starter": "",
  "solution": "SELECT c.company_name, c.city FROM customers AS c LEFT JOIN shipments AS s ON s.customer_id = c.customer_id WHERE s.shipment_id IS NULL;",
  "hint": "LEFT JOIN customers to shipments, then keep rows where the shipment side IS NULL.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-09-c1",
  "prompt": "Show each account manager's full_name and how many customers they look after, most customers first. (Account managers are in employees; customers.account_manager_id points to them.)",
  "starter": "",
  "solution": "SELECT e.full_name, COUNT(*) AS customers FROM customers AS c JOIN employees AS e ON e.employee_id = c.account_manager_id GROUP BY e.employee_id, e.full_name ORDER BY customers DESC;",
  "hint": "Join customers to employees on e.employee_id = c.account_manager_id, then GROUP BY the employee.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does an INNER JOIN between customers and shipments return for a customer with no shipments?",
    "options": ["One row with NULLs", "Nothing for that customer", "An error", "One row per route"],
    "answer": 1,
    "explanation": "INNER JOIN only keeps matches. A customer with no shipments has no match, so they disappear."
  },
  {
    "prompt": "After a LEFT JOIN from customers to shipments, how do you find customers with no shipments?",
    "options": ["WHERE s.shipment_id IS NULL", "WHERE s.shipment_id = 0", "HAVING COUNT(*) = 0", "WHERE c.customer_id IS NULL"],
    "answer": 0,
    "explanation": "For unmatched customers, every column from shipments is NULL."
  },
  {
    "prompt": "A join returns 321,960 rows when you expected about 2,700. What's the most likely cause?",
    "options": ["The database is slow", "A missing or wrong ON condition", "Too many columns selected", "LIMIT is missing"],
    "answer": 1,
    "explanation": "Without a correct ON, every row is paired with every other row."
  }
]
```
