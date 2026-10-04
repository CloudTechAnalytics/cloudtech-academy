---
title: LIMIT
minutes: 25
summary: Return only the first rows of a sorted result: top N and bottom N, ties at the cut-off, paging with OFFSET, and how other databases write it.
---

## The problem

"What were our five most expensive shipments ever?"

You can sort all 2,683 shipments by charge and read the top five. But when a report only needs the top five, returning thousands of rows wastes time, and on a large database it can slow everyone down.

## The concept

`LIMIT` keeps only the first rows of a result. On its own, "the first rows" means whatever the database happens to return first, which can be any rows. **Combined with `ORDER BY`**, it answers the questions managers ask all the time: the top five, the ten most recent, the cheapest three.

### The syntax

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
ORDER BY column
LIMIT number OFFSET skip;
```

`LIMIT` goes at the **very end**. The full order of the clauses so far:

```sql
SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ... OFFSET ...
```

### Top N: ORDER BY, then LIMIT

The database sorts first and then cuts:

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
ORDER BY freight_charge DESC
LIMIT 5;
```

1. `ORDER BY freight_charge DESC` sorts all 2,683 shipments, highest charge first.
2. `LIMIT 5` keeps the first five rows of that sorted list.

Change the direction and the same pattern gives the **bottom** five:

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
WHERE status = 'Delivered'
ORDER BY freight_charge
LIMIT 5;
```

### LIMIT without ORDER BY

Leave out `ORDER BY` and you get five rows, but not five meaningful ones:

```sql run
SELECT shipment_id, freight_charge
FROM shipments
LIMIT 5;
```

That's useful for one thing: a quick look at a table you don't know yet, without returning thousands of rows.

```sql run
SELECT *
FROM payments
LIMIT 10;
```

### Ties at the cut-off

What if several rows share the value where the cut falls? 112 shipments carried 8 containers, the most of any. So this query returns five of them, but **which** five isn't defined:

```sql run
SELECT shipment_id, containers
FROM shipments
ORDER BY containers DESC
LIMIT 5;
```

Add a tie-breaker to make the answer the same every time:

```sql run
SELECT shipment_id, containers, booking_date
FROM shipments
ORDER BY containers DESC, booking_date
LIMIT 5;
```

Now it's "the five earliest 8-container shipments", which is a question with one answer. When someone asks for "the top five", check whether ties are possible, and say how you broke them.

### Skipping rows: OFFSET

`OFFSET n` skips the first `n` rows before `LIMIT` starts counting. Apps use it to show results in pages:

| Page (10 per page) | Write |
| :-- | :-- |
| 1 | `LIMIT 10 OFFSET 0` (or just `LIMIT 10`) |
| 2 | `LIMIT 10 OFFSET 10` |
| 3 | `LIMIT 10 OFFSET 20` |
| page p | `LIMIT 10 OFFSET (p − 1) × 10` |

The second page of customers, in signup order:

```sql run
SELECT company_name, signup_date
FROM customers
ORDER BY signup_date
LIMIT 10 OFFSET 10;
```

`OFFSET` also answers "the second highest" or "the third most recent":

```sql run
SELECT shipment_id, freight_charge
FROM shipments
ORDER BY freight_charge DESC
LIMIT 1 OFFSET 1;
```

That skips the most expensive shipment and returns the next one.

### The same idea in other databases

`LIMIT` is SQLite, MySQL and PostgreSQL. Other databases write it differently:

| Database | Top 5 |
| :-- | :-- |
| SQLite, MySQL, PostgreSQL | `... ORDER BY x DESC LIMIT 5` |
| SQL Server | `SELECT TOP 5 ... ORDER BY x DESC` |
| SQL Server, PostgreSQL, Oracle (standard SQL) | `... ORDER BY x DESC OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY` |
| Oracle | `... ORDER BY x DESC FETCH FIRST 5 ROWS ONLY` |

The idea is identical: sort, then keep the first rows.

## Example

Back to the question: "What were our five most expensive shipments ever?"

```sql run
SELECT shipment_id, booking_date, containers, freight_charge
FROM shipments
ORDER BY freight_charge DESC
LIMIT 5;
```

And a related one from finance: "Which five delivered shipments in 2026 had the lowest charge per container?"

```sql run
SELECT
  shipment_id,
  containers,
  freight_charge / containers AS charge_per_container
FROM shipments
WHERE status = 'Delivered'
  AND booking_date >= '2026-01-01'
ORDER BY charge_per_container
LIMIT 5;
```

## Walkthrough

The second query uses every clause you've learned, in order:

1. `FROM shipments`: start with every shipment.
2. `WHERE status = 'Delivered' AND booking_date >= '2026-01-01'`: keep delivered shipments booked in 2026.
3. `SELECT`: show three columns, one of them calculated and named `charge_per_container`.
4. `ORDER BY charge_per_container`: sort the remaining rows, lowest first. The alias works here because `ORDER BY` runs after `SELECT`.
5. `LIMIT 5`: keep the first five.

> [!TIP]
> On a big table, `LIMIT` can make a query much faster, because the database can stop once it has enough rows. But it still has to look at every row to sort them, so `ORDER BY ... LIMIT` on millions of rows can still take time.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| `LIMIT` without `ORDER BY` for a "top N" | Any N rows, not the top N | Sort first |
| `LIMIT` before `ORDER BY` | A syntax error | `ORDER BY` then `LIMIT` |
| Ignoring ties at the cut-off | A different "top 5" on different runs | Add a tie-breaker column |
| `OFFSET` without `ORDER BY` | Pages overlap or skip rows | Always sort when paging |
| `SELECT TOP 5` in SQLite | A syntax error | `LIMIT 5` |

### Summary

| You want... | Write |
| :-- | :-- |
| a quick look at a table | `SELECT * FROM t LIMIT 10` |
| the top N | `ORDER BY x DESC LIMIT n` |
| the bottom N | `ORDER BY x LIMIT n` |
| a fair top N with ties | `ORDER BY x DESC, y LIMIT n` |
| page p of size s | `LIMIT s OFFSET (p − 1) × s` |
| the second highest | `ORDER BY x DESC LIMIT 1 OFFSET 1` |

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

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-05-d1",
  "prompt": "Show shipment_id, customer_id and freight_charge for the 10 most expensive shipments. Break ties by shipment_id.",
  "starter": "",
  "solution": "SELECT shipment_id, customer_id, freight_charge FROM shipments ORDER BY freight_charge DESC, shipment_id LIMIT 10;",
  "hint": "ORDER BY freight_charge DESC, then LIMIT 10.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-05-d2",
  "prompt": "Who are the 3 customers who signed up most recently? Show company_name and signup_date. Break ties by customer_id.",
  "starter": "",
  "solution": "SELECT company_name, signup_date FROM customers ORDER BY signup_date DESC, customer_id LIMIT 3;",
  "hint": "Most recent first means DESC.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "sql-05-d3",
  "prompt": "Show the 5 smallest payments ever received: payment_id, amount and method. Break ties by payment_id.",
  "starter": "",
  "solution": "SELECT payment_id, amount, method FROM payments ORDER BY amount, payment_id LIMIT 5;",
  "hint": "Smallest first is the default, ascending order.",
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
