---
title: ORDER BY
minutes: 9
summary: Sort results by one or more columns, in ascending or descending order.
---

## The problem

Finance is reviewing the most valuable bookings from the first week of January 2026. They want the biggest charges at the top, so they can check those first.

Operations wants the routes listed from the longest journey to the shortest, to plan staffing for long-haul shipments.

A database doesn't promise to return rows in any particular order. If order matters, you have to ask for it.

## The concept

`ORDER BY` sorts the result. It comes after `WHERE`.

- `ASC` sorts smallest to largest, A to Z, earliest to latest. It's the default, so you can leave it out.
- `DESC` sorts largest to smallest, Z to A, latest to earliest.
- You can sort by **several columns**. The second column only decides the order when the first column has a tie.

The order of the clauses you've learned so far is always:

```sql
SELECT … FROM … WHERE … ORDER BY …
```

## Example

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
WHERE booking_date BETWEEN '2026-01-01' AND '2026-01-07'
ORDER BY freight_charge DESC;
```

## Walkthrough

- `WHERE` first narrows the data down to the first week of January 2026.
- `ORDER BY freight_charge DESC` then puts the most expensive shipment first.

Now sort by two columns: routes by mode, and within each mode, longest journeys first.

```sql run
SELECT origin, destination, mode, target_transit_days
FROM routes
ORDER BY mode, target_transit_days DESC;
```

`mode` sorts A to Z (Air, Road, Sea). Inside each mode, `target_transit_days DESC` puts the longest routes first. Each column in `ORDER BY` has its own direction.

> [!TIP]
> You can sort by a column you've renamed with `AS`: `ORDER BY weight_tonnes DESC` works if `weight_tonnes` is an alias in your `SELECT`.

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
