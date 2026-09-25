---
title: CASE statements
minutes: 25
summary: Create categories and labels with CASE, and use it to count and compare groups.
---

## The problem

Operations wants to know how reliable Harbourline really is:

> "For each transport mode, how many deliveries arrived on time, and how many were late?"

The database stores dates, not a column that says "late". You need to **create** that label from the data: a delivery is late when it took longer than the route's target.

## The concept

`CASE` returns different values depending on conditions, like IF in Excel.

```sql
CASE
  WHEN condition_1 THEN value_1
  WHEN condition_2 THEN value_2
  ELSE value_otherwise
END
```

- Conditions are checked from top to bottom, and the **first** one that's true wins.
- If nothing matches and there's no `ELSE`, the result is NULL.
- A `CASE` expression can go anywhere a value can: in `SELECT`, `WHERE`, `GROUP BY` or inside an aggregate.

## Example

Label shipments by size:

```sql run
SELECT
  shipment_id,
  containers,
  CASE
    WHEN containers >= 6 THEN 'Large'
    WHEN containers >= 3 THEN 'Medium'
    ELSE 'Small'
  END AS size_band
FROM shipments
LIMIT 20;
```

## Walkthrough

For each row, the database checks `containers >= 6` first. If that's false it checks `containers >= 3`, and if neither is true, it falls to `ELSE`. A 4-container shipment fails the first test and passes the second, so it's 'Medium'. The order matters: if you tested `>= 3` first, every large shipment would be labelled 'Medium'.

Now Kemi's question. `julianday()` turns a date into a day number, so subtracting two of them gives the days between. A delivery is on time when the actual transit is no more than the target:

```sql run
SELECT
  r.mode,
  COUNT(*) AS delivered,
  SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days THEN 1 ELSE 0 END) AS on_time,
  SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) >  r.target_transit_days THEN 1 ELSE 0 END) AS late
FROM shipments AS s
JOIN routes AS r ON r.route_id = s.route_id
WHERE s.status = 'Delivered'
GROUP BY r.mode;
```

`SUM(CASE WHEN … THEN 1 ELSE 0 END)` is one of the most useful patterns in SQL: it counts the rows that meet a condition, inside a GROUP BY, without a separate query for each group.

> [!NOTE]
> Date arithmetic is one of the places databases differ most. In PostgreSQL you'd write `delivery_date - ship_date`; in SQL Server, `DATEDIFF(day, ship_date, delivery_date)`.

## Practice

```exercise
{
  "id": "sql-10-p1",
  "prompt": "Show shipment_id, freight_charge and a column named price_band: 'High' when freight_charge is 10,000,000 or more, 'Standard' otherwise. Only include shipments booked on '2026-06-01'.",
  "starter": "",
  "solution": "SELECT shipment_id, freight_charge, CASE WHEN freight_charge >= 10000000 THEN 'High' ELSE 'Standard' END AS price_band FROM shipments WHERE booking_date = '2026-06-01';",
  "hint": "CASE WHEN freight_charge >= 10000000 THEN 'High' ELSE 'Standard' END AS price_band",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-10-c1",
  "prompt": "For each size band (Large: 6+ containers, Medium: 3–5, Small: 1–2), count the shipments. Show size_band and shipments.",
  "starter": "",
  "solution": "SELECT CASE WHEN containers >= 6 THEN 'Large' WHEN containers >= 3 THEN 'Medium' ELSE 'Small' END AS size_band, COUNT(*) AS shipments FROM shipments GROUP BY size_band;",
  "hint": "Put the CASE in SELECT with an alias, then GROUP BY that alias.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a CASE return when no WHEN matches and there's no ELSE?",
    "options": ["0", "An empty string", "NULL", "An error"],
    "answer": 2,
    "explanation": "Without an ELSE, unmatched rows get NULL."
  },
  {
    "prompt": "What does SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) calculate?",
    "options": ["The total charge of cancelled shipments", "The number of cancelled shipments", "The percentage cancelled", "The first cancelled shipment"],
    "answer": 1,
    "explanation": "Each cancelled row contributes 1 and every other row 0, so the sum is a count."
  },
  {
    "prompt": "A CASE tests WHEN containers >= 3 THEN 'Medium' before WHEN containers >= 6 THEN 'Large'. What happens to an 8-container shipment?",
    "options": ["Large", "Medium", "NULL", "Both"],
    "answer": 1,
    "explanation": "The first true condition wins, and 8 >= 3 is true, so it's labelled Medium. Test the narrowest condition first."
  }
]
```
