---
title: LIMIT
minutes: 15
summary: Return only the first rows of a result to answer "top N" questions and page through data.
---

## The problem

"What were our five most expensive shipments ever?"

You can sort all 2,683 shipments by charge and read the top five. But when a report only needs the top five, returning thousands of rows wastes time, and on a large database it can slow everyone down.

## The concept

`LIMIT n` returns only the first `n` rows of the result. It goes at the very end of the query.

On its own, `LIMIT` just takes whichever rows come first, which may be any rows. **Combined with `ORDER BY`**, it answers "top N" and "bottom N" questions.

`OFFSET` skips rows before the limit starts. `LIMIT 10 OFFSET 10` returns rows 11 to 20, which is how apps show "page 2".

> [!NOTE]
> Other databases write this differently. SQL Server uses `SELECT TOP 5 …`, and standard SQL uses `FETCH FIRST 5 ROWS ONLY`. The idea is the same.

## Example

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
ORDER BY freight_charge DESC
LIMIT 5;
```

## Walkthrough

1. `ORDER BY freight_charge DESC` sorts every shipment, highest charge first.
2. `LIMIT 5` keeps the first five rows of that sorted result.

The order matters: the database sorts first, then cuts. If you left out `ORDER BY`, you'd get five random shipments, not the top five.

Paging through results works the same way:

```sql run
SELECT company_name, signup_date
FROM customers
ORDER BY signup_date
LIMIT 10 OFFSET 10;
```

This skips the ten earliest customers and shows the next ten.

> [!TIP]
> `LIMIT` is also handy when you're exploring a big table for the first time: `SELECT * FROM shipments LIMIT 20;` shows you what the data looks like without returning everything.

## Practice

```exercise
{
  "id": "sql-05-p1",
  "prompt": "Show the shipment_id, containers and weight_kg of the 5 heaviest shipments.",
  "starter": "",
  "solution": "SELECT shipment_id, containers, weight_kg FROM shipments ORDER BY weight_kg DESC LIMIT 5;",
  "hint": "Sort by weight_kg from highest to lowest, then keep 5 rows.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "sql-05-c1",
  "prompt": "Show the 3 air routes with the shortest target_transit_days. Include origin, destination and target_transit_days. Break ties by route_id.",
  "starter": "",
  "solution": "SELECT origin, destination, target_transit_days FROM routes WHERE mode = 'Air' ORDER BY target_transit_days, route_id LIMIT 3;",
  "hint": "Filter to mode = 'Air', sort ascending by days and then route_id, and limit to 3.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why should LIMIT usually be paired with ORDER BY?",
    "options": ["LIMIT doesn't work without it", "Without it, which rows you get isn't defined", "It makes the query shorter", "ORDER BY removes duplicates"],
    "answer": 1,
    "explanation": "Without ORDER BY the database can return any rows first, so 'the first 5' means nothing."
  },
  {
    "prompt": "LIMIT 20 OFFSET 40 returns…",
    "options": ["Rows 1–20", "Rows 20–40", "Rows 41–60", "Rows 40–60"],
    "answer": 2,
    "explanation": "It skips 40 rows, then returns the next 20: rows 41 to 60."
  },
  {
    "prompt": "Which query finds the single most recent booking?",
    "options": ["SELECT * FROM shipments LIMIT 1", "SELECT * FROM shipments ORDER BY booking_date LIMIT 1", "SELECT * FROM shipments ORDER BY booking_date DESC LIMIT 1", "SELECT * FROM shipments WHERE LIMIT 1"],
    "answer": 2,
    "explanation": "Sort newest first with DESC, then keep one row."
  }
]
```
