---
title: ORDER BY
minutes: 25
summary: Sort results by one or more columns, ascending or descending, with tie-breakers, calculations and missing values, step by step.
---

## The problem

Finance is reviewing the most valuable bookings from the first week of January 2026. They want the biggest charges at the top, so they can check those first.

Operations wants the routes listed from the longest journey to the shortest, to plan staffing for long-haul shipments.

A database doesn't promise to return rows in any particular order. If order matters, you have to ask for it.

## The concept

`ORDER BY` sorts the rows of a result. Without it, a database is free to return rows in **any** order: often the order they were stored, but not always, and it can change from one run to the next. If the order matters, you must ask for it.

### The syntax

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
ORDER BY column1 [ASC | DESC], column2 [ASC | DESC], ...;
```

`ORDER BY` comes **after** `WHERE`. The clauses you've learned so far always appear in this order:

| Clause | Job | Required? |
| :-- | :-- | :-- |
| `SELECT` | which columns | yes |
| `FROM` | which table | yes (almost always) |
| `WHERE` | which rows | no |
| `ORDER BY` | what order | no |

### Ascending and descending

| Keyword | Order | Numbers | Text | Dates |
| :-- | :-- | :-- | :-- | :-- |
| `ASC` | ascending (the default) | smallest first | A to Z | earliest first |
| `DESC` | descending | largest first | Z to A | latest first |

`ASC` is the default, so `ORDER BY company_name` and `ORDER BY company_name ASC` mean the same thing. Customers in alphabetical order:

```sql run
SELECT company_name, city
FROM customers
ORDER BY company_name;
```

The staff who've been here longest come first when you sort hire dates ascending:

```sql run
SELECT full_name, role, hire_date
FROM employees
ORDER BY hire_date;
```

And `DESC` puts the most recent first:

```sql run
SELECT full_name, role, hire_date
FROM employees
ORDER BY hire_date DESC;
```

### Sorting by several columns

List more than one column, separated by commas. The **first** column decides the order. The second only matters when two rows have the **same** value in the first, like a tie-breaker; the third breaks ties in the second, and so on.

Routes by transport mode, and within each mode, the longest journeys first:

```sql run
SELECT mode, origin, destination, target_transit_days
FROM routes
ORDER BY mode, target_transit_days DESC;
```

Read the result from the top: the five Air routes come first (A to Z), longest first; then the seven Road routes, longest first; then the eighteen Sea routes. **Each column has its own direction**: here `mode` is ascending and `target_transit_days` is descending. Writing `DESC` once at the end doesn't apply to the earlier columns.

### Sorting by a column you don't show

You can sort by any column in the table, even if it isn't in `SELECT`:

```sql run
SELECT company_name, city
FROM customers
ORDER BY signup_date DESC;
```

The newest customers come first, though the signup date isn't displayed. It's allowed, but it can confuse the reader, who can't see why the rows are in that order. Usually it's better to show the column you sort by.

### Sorting by a calculation or an alias

You can sort by a calculated value. If you've given it an alias in `SELECT`, you can use the alias, because `ORDER BY` runs **after** `SELECT`:

```sql run
SELECT
  shipment_id,
  containers,
  freight_charge / containers AS charge_per_container
FROM shipments
ORDER BY charge_per_container DESC;
```

Compare that with `WHERE`, which runs **before** `SELECT` and so can't rely on an alias.

| Step | Clause | Can it use a `SELECT` alias? |
| :-- | :-- | :-- |
| 1 | `FROM` picks the table | no |
| 2 | `WHERE` filters rows | no |
| 3 | `SELECT` picks and calculates columns | (creates them) |
| 4 | `ORDER BY` sorts | **yes** |

### Where missing values go

Rows where the sort column is `NULL` have to go somewhere. SQLite and MySQL put them **first** in ascending order (and last in descending); PostgreSQL and Oracle do the opposite. Shipments that haven't been delivered have no `delivery_date`, so they appear at the top:

```sql run
SELECT shipment_id, status, delivery_date
FROM shipments
ORDER BY delivery_date;
```

Add `NULLS FIRST` or `NULLS LAST` to choose (SQLite, PostgreSQL and Oracle support it):

```sql run
SELECT shipment_id, status, delivery_date
FROM shipments
ORDER BY delivery_date NULLS LAST;
```

### Sorting text

Text sorts character by character, like a dictionary. Two surprises to watch for:

- **Numbers stored as text** sort as text: `'10'` comes before `'9'`, because `'1'` comes before `'9'`. Store numbers as numbers.
- **Capitals**: in SQLite, capital letters sort before small letters (`'Zenith'` before `'apex'`). Other databases have their own rules. If case varies in your data, sort by `LOWER(column)`.

### Sorting by position (and why not to)

`ORDER BY 2` sorts by the second column in `SELECT`. It works, but if someone later adds a column at the front, the query silently sorts by the wrong thing. Write the column name.

## Example

Finance's request: the first week of January 2026, biggest charges first.

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
WHERE booking_date BETWEEN '2026-01-01' AND '2026-01-07'
ORDER BY freight_charge DESC;
```

Operations' request: routes from the longest journey to the shortest, with origin as a tie-breaker so routes of the same length appear in a predictable order.

```sql run
SELECT origin, destination, mode, target_transit_days
FROM routes
ORDER BY target_transit_days DESC, origin;
```

## Walkthrough

In the first query:

1. `FROM shipments` takes every shipment.
2. `WHERE booking_date BETWEEN '2026-01-01' AND '2026-01-07'` keeps the first week of January.
3. `SELECT` picks three columns.
4. `ORDER BY freight_charge DESC` sorts what's left, largest charge first.

In the second, several routes share the same number of days. Without the tie-breaker `origin`, those routes could come back in a different order each time you run the query. Adding a second sort column makes the result **deterministic**: the same every time. That matters for reports people compare week to week.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| `ORDER BY` before `WHERE` | A syntax error | `... WHERE ... ORDER BY ...` |
| `ORDER BY mode, target_transit_days DESC` expecting both descending | `mode` is still ascending | Write `DESC` after each column that needs it |
| No `ORDER BY`, assuming the stored order | Rows can come back in any order | Always sort when order matters |
| Sorting numbers stored as text | `'10'` before `'9'` | Store numbers as numbers |
| `ORDER BY 2` | Breaks silently when columns change | Use the column name |

### Summary

| You want... | Write |
| :-- | :-- |
| smallest, earliest or A first | `ORDER BY col` (or `ASC`) |
| largest, latest or Z first | `ORDER BY col DESC` |
| a tie-breaker | `ORDER BY col1, col2` |
| different directions | `ORDER BY col1 ASC, col2 DESC` |
| a calculated order | `ORDER BY alias DESC` |
| missing values last | `ORDER BY col NULLS LAST` |

## Practice

```exercise
{
  "id": "sql-04-p1",
  "prompt": "List every route's origin, destination and target_transit_days, from the longest journey to the shortest. Where two routes take the same number of days, put the lower route_id first.",
  "starter": "",
  "solution": "SELECT origin, destination, target_transit_days FROM routes ORDER BY target_transit_days DESC, route_id;",
  "hint": "ORDER BY target_transit_days DESC, then route_id to break ties.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "sql-04-c1",
  "prompt": "Show company_name and signup_date for customers in Lagos, newest customers first. If two signed up on the same day, sort them by company_name A to Z.",
  "starter": "",
  "solution": "SELECT company_name, signup_date FROM customers WHERE city = 'Lagos' ORDER BY signup_date DESC, company_name ASC;",
  "hint": "Filter with WHERE first, then ORDER BY two columns separated by a comma, each with its own direction.",
  "required": false,
  "orderMatters": true
}
```

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-04-d1",
  "prompt": "List every employee's full_name and hire_date, from the longest-serving to the newest.",
  "starter": "",
  "solution": "SELECT full_name, hire_date FROM employees ORDER BY hire_date ASC, employee_id;",
  "hint": "The earliest hire_date first means ascending order. Add employee_id as a tie-breaker.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-04-d2",
  "prompt": "Show shipment_id, booking_date and freight_charge for shipments booked on '2026-07-15', most expensive first.",
  "starter": "",
  "solution": "SELECT shipment_id, booking_date, freight_charge FROM shipments WHERE booking_date = '2026-07-15' ORDER BY freight_charge DESC, shipment_id;",
  "hint": "WHERE comes before ORDER BY. Add shipment_id after freight_charge DESC to break ties.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-04-d3",
  "prompt": "Show company_name, industry and city for every customer, sorted by industry A to Z, then by company_name A to Z within each industry.",
  "starter": "",
  "solution": "SELECT company_name, industry, city FROM customers ORDER BY industry, company_name;",
  "hint": "ORDER BY industry, company_name sorts by the second column only when the first is tied.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the default sort direction if you write ORDER BY booking_date?",
    "options": ["Descending", "Ascending", "Random", "The order rows were inserted"],
    "answer": 1,
    "explanation": "ASC is the default: earliest dates first."
  },
  {
    "prompt": "Where does ORDER BY go in a query?",
    "options": ["Before FROM", "Between FROM and WHERE", "After WHERE", "Before SELECT"],
    "answer": 2,
    "explanation": "The order is SELECT, FROM, WHERE, then ORDER BY."
  },
  {
    "prompt": "In ORDER BY mode, target_transit_days DESC, when does target_transit_days affect the order?",
    "options": ["Always", "Only when two rows have the same mode", "Never", "Only for Sea routes"],
    "answer": 1,
    "explanation": "The second sort column only breaks ties in the first."
  }
]
```
