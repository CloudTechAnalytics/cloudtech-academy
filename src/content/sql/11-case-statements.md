---
title: CASE statements
minutes: 30
summary: Turn data into categories with CASE: bands, custom sort orders, counting and summing with SUM(CASE ...), percentages and date arithmetic, step by step.
---

## The problem

Operations wants to know how reliable Harbourline really is:

> "For each transport mode, how many deliveries arrived on time, and how many were late?"

The database stores dates, not a column that says "late". You need to **create** that label from the data: a delivery is late when it took longer than the route's target.

## The concept

`CASE` lets a query make decisions. It checks conditions in order and returns a different value depending on which is true, much like `IF` in Excel. Use it to turn raw data into the categories people actually talk about: "large", "late", "high value", "this year".

### The syntax

```sql
CASE
  WHEN condition_1 THEN result_1
  WHEN condition_2 THEN result_2
  ELSE result_otherwise
END
```

- The conditions are checked **from top to bottom**, and the **first** true one wins. The rest are ignored.
- `ELSE` is what you get if nothing matched. Without an `ELSE`, the result is `NULL`.
- Every `CASE` finishes with `END`. Forgetting it is the commonest `CASE` error.
- A `CASE` is an **expression**: it produces one value per row, so it can go anywhere a value can, in `SELECT`, `WHERE`, `GROUP BY`, `ORDER BY` or inside an aggregate.

### Labelling rows in SELECT

Size bands for shipments:

![CASE checks WHEN lines top to bottom and returns the first true one: a delay of 9 is Severe, 3 is Late and 0 is On time; with the lines in the wrong order, 9 is wrongly labelled Late](/images/courses/sql/case.svg "CASE returns the result of the first WHEN that's true; order matters. (Illustration with simplified data.)")

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

Follow a 4-container shipment through: `containers >= 6` is false, so the database tries the next line; `containers >= 3` is true, so the answer is `'Medium'` and checking stops.

### Why the order of WHEN lines matters

Swap the two conditions and see what goes wrong:

```sql run
SELECT
  containers,
  CASE
    WHEN containers >= 3 THEN 'Medium'
    WHEN containers >= 6 THEN 'Large'
    ELSE 'Small'
  END AS size_band
FROM shipments
WHERE containers >= 6
LIMIT 5;
```

Every large shipment is now called `'Medium'`, because 8 is also `>= 3`, and that line comes first. When bands overlap, put the **most specific** condition first.

### The simple form

When every condition compares one column to a fixed value, there's a shorter form:

```sql run
SELECT DISTINCT
  mode,
  CASE mode
    WHEN 'Air'  THEN 'Fast, expensive'
    WHEN 'Road' THEN 'Regional'
    WHEN 'Sea'  THEN 'Slow, cheap per tonne'
  END AS description
FROM routes;
```

`CASE mode WHEN 'Air' ...` means `CASE WHEN mode = 'Air' ...`. The simple form can only test for equality; for anything else (`>=`, `LIKE`, `IS NULL`, several columns), use the full form.

### Counting with CASE: SUM(CASE ...)

This pattern is one of the most useful in SQL. A `CASE` that returns `1` or `0` turns a condition into a number, and `SUM` adds up the 1s, which counts the rows that meet the condition:

```sql run
SELECT
  COUNT(*)                                          AS shipments,
  SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered,
  SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM shipments;
```

Combined with `GROUP BY`, you get several counts per group in one query, side by side, like a pivot table:

```sql run
SELECT
  strftime('%Y', booking_date)                          AS year,
  SUM(CASE WHEN containers >= 6 THEN 1 ELSE 0 END)      AS large,
  SUM(CASE WHEN containers BETWEEN 3 AND 5 THEN 1 ELSE 0 END) AS medium,
  SUM(CASE WHEN containers <= 2 THEN 1 ELSE 0 END)      AS small
FROM shipments
GROUP BY year;
```

### Percentages

Divide a conditional count by the total. Multiply by `100.0` (with the `.0`) to avoid whole-number division:

```sql run
SELECT
  ROUND(100.0 * SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancelled_pct
FROM shipments;
```

### Summing amounts with CASE

`CASE` can return an amount instead of `1`, so `SUM` adds up only the matching values. Revenue by year, as columns:

```sql run
SELECT
  SUM(CASE WHEN booking_date < '2026-01-01' THEN freight_charge ELSE 0 END)  AS revenue_2025,
  SUM(CASE WHEN booking_date >= '2026-01-01' THEN freight_charge ELSE 0 END) AS revenue_2026
FROM shipments
WHERE status <> 'Cancelled';
```

### Grouping by a CASE

Group by the label itself to count each band:

```sql run
SELECT
  CASE
    WHEN containers >= 6 THEN 'Large'
    WHEN containers >= 3 THEN 'Medium'
    ELSE 'Small'
  END AS size_band,
  COUNT(*) AS shipments
FROM shipments
GROUP BY size_band;
```

1,892 small, 511 medium and 280 large shipments. (SQLite lets you group by the alias; in some databases you repeat the `CASE` in `GROUP BY`.)

### A custom sort order

Alphabetical isn't always useful. Statuses make more sense in the order a shipment moves through them. `CASE` turns each status into a number to sort by:

```sql run
SELECT status, COUNT(*) AS shipments
FROM shipments
GROUP BY status
ORDER BY CASE status
  WHEN 'Booked'     THEN 1
  WHEN 'In transit' THEN 2
  WHEN 'Delivered'  THEN 3
  WHEN 'Cancelled'  THEN 4
END;
```

### Handling missing values

`CASE` is a clear way to replace `NULL` with something readable:

```sql run
SELECT
  company_name,
  CASE
    WHEN account_manager_id IS NULL THEN 'Unassigned'
    ELSE 'Assigned'
  END AS manager_status
FROM customers
ORDER BY manager_status DESC
LIMIT 10;
```

For the plain "use this value if it's missing" case there's a shortcut, `COALESCE(column, fallback)`, which returns the first value that isn't `NULL`. You'll use it in the CTEs lesson.

### Keep the results one type

Every `THEN` and the `ELSE` should return the same kind of value: all text, or all numbers. Mixing them (`THEN 'Late' ELSE 0`) works in SQLite but fails in most databases, and confuses anyone using the result.

### Date arithmetic for "late"

Kemi's question needs the number of days between two dates. `julianday()` turns a date into a day number, so subtracting two gives the days between:

```sql run
SELECT
  shipment_id,
  ship_date,
  delivery_date,
  julianday(delivery_date) - julianday(ship_date) AS days_in_transit
FROM shipments
WHERE status = 'Delivered'
LIMIT 5;
```

> [!NOTE]
> Date arithmetic is where databases differ most. In PostgreSQL you write `delivery_date - ship_date`; in SQL Server, `DATEDIFF(day, ship_date, delivery_date)`; in MySQL, `DATEDIFF(delivery_date, ship_date)`.

## Example

Kemi's question: for each mode, how many deliveries arrived on time and how many were late, and what share was on time?

```sql run
SELECT
  r.mode,
  COUNT(*) AS delivered,
  SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days THEN 1 ELSE 0 END) AS on_time,
  SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) >  r.target_transit_days THEN 1 ELSE 0 END) AS late,
  ROUND(100.0 * SUM(CASE WHEN julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days THEN 1 ELSE 0 END) / COUNT(*), 1) AS on_time_pct
FROM shipments AS s
JOIN routes AS r ON r.route_id = s.route_id
WHERE s.status = 'Delivered'
GROUP BY r.mode;
```

## Walkthrough

1. The join brings each delivered shipment together with its route's `target_transit_days`.
2. For every shipment, `julianday(delivery_date) - julianday(ship_date)` gives the days it actually took.
3. The first `CASE` returns 1 if that's within the target, otherwise 0. `SUM` counts the 1s: the on-time deliveries.
4. The second does the same for late ones. Together they add up to `delivered`.
5. The last column divides on-time by the total and rounds: about three-quarters on time for every mode.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| Forgetting `END` | A syntax error | Every `CASE` ends with `END` |
| Broad conditions first (`>= 3` before `>= 6`) | Everything lands in the first band | Most specific first |
| No `ELSE` | Unmatched rows become `NULL` | Add an `ELSE` |
| `COUNT(CASE WHEN ... THEN 1 ELSE 0 END)` | Counts every row, because 0 isn't `NULL` | Use `SUM`, or drop the `ELSE 0` |
| `100 * count / total` | Whole-number division: 0 or 100 | `100.0 * count / total` |
| Mixing text and numbers in the results | Errors in most databases | Return one type |

### Summary

| You want... | Write |
| :-- | :-- |
| a label from a condition | `CASE WHEN cond THEN 'A' ELSE 'B' END AS label` |
| a label from fixed values | `CASE col WHEN 'x' THEN 'X' ... END` |
| to count rows that match | `SUM(CASE WHEN cond THEN 1 ELSE 0 END)` |
| a percentage | `ROUND(100.0 * SUM(CASE ...) / COUNT(*), 1)` |
| a total of matching amounts | `SUM(CASE WHEN cond THEN amount ELSE 0 END)` |
| a custom sort order | `ORDER BY CASE col WHEN 'a' THEN 1 ... END` |

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

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-10-d1",
  "prompt": "For every route, show origin, destination and a column distance_band: 'Long haul' when target_transit_days is 20 or more, 'Regional' when it's 5 to 19, 'Local' otherwise.",
  "starter": "",
  "solution": "SELECT origin, destination, CASE WHEN target_transit_days >= 20 THEN 'Long haul' WHEN target_transit_days >= 5 THEN 'Regional' ELSE 'Local' END AS distance_band FROM routes;",
  "hint": "CASE checks conditions in order, so put the biggest band first.",
  "required": false
}
```

```exercise
{
  "id": "sql-10-d2",
  "prompt": "Count customers by region: 'Nigeria' for Nigerian customers and 'Rest of West Africa' for everyone else. Show region and customers.",
  "starter": "",
  "solution": "SELECT CASE WHEN country = 'Nigeria' THEN 'Nigeria' ELSE 'Rest of West Africa' END AS region, COUNT(*) AS customers FROM customers GROUP BY region;",
  "hint": "Build the CASE column, then GROUP BY it.",
  "required": false
}
```

```exercise
{
  "id": "sql-10-d3",
  "prompt": "In one row, count shipments that were Delivered as delivered and shipments that were Cancelled as cancelled. Use SUM with CASE.",
  "starter": "",
  "solution": "SELECT SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered, SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled FROM shipments;",
  "hint": "SUM(CASE WHEN … THEN 1 ELSE 0 END) counts the rows that match.",
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
    "prompt": "In what order does CASE check its WHEN conditions?",
    "options": ["Top to bottom, stopping at the first one that's true", "Bottom to top", "All at once, using the last match", "In random order"],
    "answer": 0,
    "explanation": "So put the most specific condition first, for example containers >= 6 before containers >= 3."
  }
]
```
