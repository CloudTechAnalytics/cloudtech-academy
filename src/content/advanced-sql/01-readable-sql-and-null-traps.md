---
title: Readable SQL and NULL traps
minutes: 20
summary: Write queries other analysts can check, and avoid the NULL, integer-division and NOT IN traps that silently give wrong answers.
---

## The problem

Harbourline Freight's sales director asks a simple question: "How many of our customers are **not** looked after by Obinna?" Obinna Abdullahi (employee 3) manages 15 of the 120 customers. A colleague's query says the answer is 97:

```sql run
SELECT COUNT(*) AS customers
FROM customers
WHERE account_manager_id <> 3;
```

120 − 15 is 105. Eight customers have gone missing, and the query gave no error and no warning. It just returned a wrong number, and that number could easily end up in a slide deck.

This course is about the SQL that working analysts write: longer queries, harder questions, and real data that doesn't behave. It starts with the habits that stop queries quietly lying to you.

## The concept

**NULL means "unknown", not "nothing"**

The 8 missing customers have no account manager: `account_manager_id` is `NULL`. SQL treats NULL as an unknown value, so any comparison with it is also unknown:

| Expression | Result |
| :-- | :-- |
| `NULL <> 3` | NULL (unknown), so `WHERE` drops the row |
| `NULL = NULL` | NULL, not true |
| `NULL IS NULL` | true |
| `5 + NULL` | NULL |
| `'Lagos' \|\| NULL` | NULL |
| `COUNT(column)` | counts only non-NULL values |
| `AVG(column)` | averages only non-NULL values |

`WHERE` keeps a row only when the condition is **true**, so unknown rows silently vanish. The fix is to say what you mean about NULLs:

```sql
WHERE account_manager_id <> 3 OR account_manager_id IS NULL
```

or replace the NULL first with `COALESCE(account_manager_id, 0) <> 3`.

**The NOT IN trap**

`NOT IN (subquery)` is the most dangerous NULL trap. If the subquery returns even one NULL, `NOT IN` returns no rows at all, because SQL can't be sure the value isn't equal to the unknown one. `NOT EXISTS` doesn't have this problem, so prefer it.

**Integer division**

In SQLite, SQL Server and PostgreSQL, dividing one whole number by another gives a whole number: `7 / 2` is `3`, and `2000 / 2411` is `0`. Multiply by `100.0` (or `1.0`) first to get a decimal. MySQL is the exception: it returns a decimal.

**Readable SQL**

A query is something other people need to check. Write it so they can:

- One clause per line, with the columns indented under `SELECT`.
- Short but meaningful aliases: `s` for shipments, `r` for routes, never `a`, `b`, `c`.
- A CTE for each step, named for what it holds (`delivered`, `monthly_totals`).
- A comment where a definition matters: `-- on time = transit days <= route target`.

## Example

Three versions of "how many employees have no customers?" Only one is right.

```sql run
SELECT
  (SELECT COUNT(*)
   FROM employees
   WHERE employee_id NOT IN (SELECT account_manager_id FROM customers)) AS not_in_version,
  (SELECT COUNT(*)
   FROM employees AS e
   WHERE NOT EXISTS (
     SELECT 1 FROM customers AS c WHERE c.account_manager_id = e.employee_id
   )) AS not_exists_version,
  (SELECT COUNT(*)
   FROM employees AS e
   LEFT JOIN customers AS c ON c.account_manager_id = e.employee_id
   WHERE c.customer_id IS NULL) AS left_join_version;
```

`NOT IN` says 0. The other two say 16, which is right: only the 8 account managers have customers, so the operations, customs, finance and team-lead staff (16 people) have none. The `NOT IN` version fails because `customers.account_manager_id` contains NULLs.

Now integer division. The on-time rate for delivered shipments, written two ways:

```sql run
-- on time = transit days <= the route's target
SELECT
  SUM(julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days) / COUNT(*) AS integer_division,
  ROUND(100.0 * SUM(julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days) / COUNT(*), 1) AS on_time_pct
FROM shipments AS s
JOIN routes AS r ON r.route_id = s.route_id
WHERE s.status = 'Delivered';
```

The first column says 0%. The second says 76.6%. Same data, same logic: the only difference is `100.0`.

## Walkthrough

1. Run the first query in the problem section and note the 97.
2. Change the condition to `account_manager_id <> 3 OR account_manager_id IS NULL` and check you get 105.
3. In the NOT IN example, change the inner query to `SELECT account_manager_id FROM customers WHERE account_manager_id IS NOT NULL`. `NOT IN` now gives 16 too. That's the fix if you must use `NOT IN`, but `NOT EXISTS` is safer because it doesn't depend on anyone remembering.
4. In the integer-division example, remove `100.0 *` from the second column and watch it fall to 0.

> [!TIP]
> Whenever a count looks plausible but you can't reconcile it, check the NULLs first: `SELECT COUNT(*), COUNT(column) FROM table` tells you at once how many are missing.

## Practice

```exercise
{
  "id": "asql-01-p1",
  "prompt": "List every customer not managed by employee 3, including those with no account manager. Show customer_id and company_name. You should get 105 rows.",
  "starter": "SELECT customer_id, company_name\nFROM customers\nWHERE account_manager_id <> 3;",
  "solution": "SELECT customer_id, company_name FROM customers WHERE account_manager_id <> 3 OR account_manager_id IS NULL;",
  "hint": "Add OR account_manager_id IS NULL, or compare COALESCE(account_manager_id, 0) <> 3.",
  "required": true
}
```

```exercise
{
  "id": "asql-01-p2",
  "prompt": "For each transport mode, show mode, delivered (the number of delivered shipments) and on_time_pct: the percentage delivered within the route's target_transit_days, rounded to 1 decimal place.",
  "starter": "SELECT\n  r.mode,\n  COUNT(*) AS delivered,\n  -- on_time_pct here\nFROM shipments AS s\nJOIN routes AS r ON r.route_id = s.route_id\nWHERE s.status = 'Delivered'\nGROUP BY r.mode;",
  "solution": "SELECT r.mode, COUNT(*) AS delivered, ROUND(100.0 * SUM(julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days) / COUNT(*), 1) AS on_time_pct FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' GROUP BY r.mode;",
  "hint": "In SQLite a comparison is 1 or 0, so SUM(condition) counts the rows where it's true. Multiply by 100.0 before dividing.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "asql-01-c1",
  "prompt": "Find the employees who manage no customers, using NOT EXISTS. Show employee_id, full_name and role, ordered by employee_id.",
  "starter": "",
  "solution": "SELECT e.employee_id, e.full_name, e.role FROM employees AS e WHERE NOT EXISTS (SELECT 1 FROM customers AS c WHERE c.account_manager_id = e.employee_id) ORDER BY e.employee_id;",
  "hint": "WHERE NOT EXISTS (SELECT 1 FROM customers AS c WHERE c.account_manager_id = e.employee_id).",
  "required": false,
  "orderMatters": true
}
```

## More practice

Optional drills on the same traps.

```exercise
{
  "id": "asql-01-d1",
  "prompt": "Show how complete the shipment dates are: total_rows, with_ship_date and with_delivery_date, using COUNT(*) and COUNT(column).",
  "starter": "",
  "solution": "SELECT COUNT(*) AS total_rows, COUNT(ship_date) AS with_ship_date, COUNT(delivery_date) AS with_delivery_date FROM shipments;",
  "hint": "COUNT(column) skips NULLs; COUNT(*) counts every row.",
  "required": false
}
```

```exercise
{
  "id": "asql-01-d2",
  "prompt": "List every customer with their account manager's name, showing 'Unassigned' when there isn't one. Show company_name and account_manager, ordered by company_name.",
  "starter": "",
  "solution": "SELECT c.company_name, COALESCE(e.full_name, 'Unassigned') AS account_manager FROM customers AS c LEFT JOIN employees AS e ON e.employee_id = c.account_manager_id ORDER BY c.company_name;",
  "hint": "A LEFT JOIN keeps customers with no manager; COALESCE replaces the NULL name.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-01-d3",
  "prompt": "What share of all shipments were cancelled? Show cancelled, total and cancelled_pct (1 decimal place).",
  "starter": "",
  "solution": "SELECT SUM(status = 'Cancelled') AS cancelled, COUNT(*) AS total, ROUND(100.0 * SUM(status = 'Cancelled') / COUNT(*), 1) AS cancelled_pct FROM shipments;",
  "hint": "SUM(status = 'Cancelled') counts the cancelled rows. Remember 100.0.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "WHERE region <> 'North' returns 40 rows, but you expected 46. What's the most likely cause?",
    "options": ["The table is locked", "Six rows have a NULL region, and NULL <> 'North' is unknown, so WHERE drops them", "<> doesn't work on text", "The query needs ORDER BY"],
    "answer": 1,
    "explanation": "Any comparison with NULL is unknown, and WHERE keeps only rows where the condition is true."
  },
  {
    "prompt": "Why is NOT EXISTS safer than NOT IN (subquery)?",
    "options": ["It's always faster", "If the subquery returns a NULL, NOT IN returns no rows; NOT EXISTS isn't affected", "NOT IN is deprecated", "NOT EXISTS ignores duplicates"],
    "answer": 1,
    "explanation": "One NULL in the list makes every NOT IN comparison unknown."
  },
  {
    "prompt": "SUM(on_time) / COUNT(*) returns 0, but about three quarters of shipments are on time. Why?",
    "options": ["SUM ignores 1s", "Integer division: a whole number divided by a whole number is truncated", "COUNT(*) counts NULLs twice", "The data is empty"],
    "answer": 1,
    "explanation": "Multiply by 100.0 or 1.0 first so the division is done in decimals."
  }
]
```
