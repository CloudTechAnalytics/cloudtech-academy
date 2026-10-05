---
title: Top N per group and deduplication
minutes: 20
summary: Return the top rows within every group, the latest record per entity, and one clean row out of several, choosing deliberately how ties are handled.
---

## The problem

Three requests that look different but are the same problem:

1. Sales: "Our top three customers **for each transport mode**, by revenue."
2. Finance: "For each shipment, the **most recent** payment."
3. Data team: "The CRM export has some customers in it twice. Keep **one row per customer**: the newest."

`ORDER BY … LIMIT 3` gives the top three overall, not per mode. `GROUP BY` with `MAX(payment_date)` finds the latest date but loses the rest of the row (the amount, the method). Each request needs "the top N rows **within each group**, with the whole row".

## The concept

The pattern has three steps:

1. **Number** the rows within each group with a window function, in the order that defines "top".
2. Do it in a **CTE** or subquery, because `WHERE` can't see window functions in the same query.
3. **Filter** on the number outside.

```sql
WITH ranked AS (
  SELECT …, ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col DESC, id) AS rn
  FROM …
)
SELECT … FROM ranked WHERE rn <= 3;
```

### Choosing the numbering function decides what happens to ties

| Function | Ties | Use when |
| :-- | :-- | :-- |
| `ROW_NUMBER()` | broken arbitrarily, so add a tie-breaker | you need exactly N rows, such as deduplication |
| `RANK()` | tied rows share a rank, and the next one skips | "everyone in the top 3, including ties" |
| `DENSE_RANK()` | tied rows share a rank, no gaps | "the top 3 *values*", such as the three highest prices |

![ROW_NUMBER, RANK and DENSE_RANK on four routes where two tie, and which to choose for latest row, top three with ties, and second highest](/images/courses/advanced-sql/ranking.svg "Choose ROW_NUMBER, RANK or DENSE_RANK by what ties should do. (Illustration with simplified data.)")

Always add a tie-breaker to `ROW_NUMBER` (usually the ID). Without one the database may pick a different row each time you run the query, and two people running the same report get different answers.

**See the difference.** Oakridge Packaging (customer 85) has five shipments of 8 containers, then several of 6:

```sql run
SELECT
  shipment_id,
  containers,
  ROW_NUMBER() OVER (ORDER BY containers DESC, shipment_id) AS row_num,
  RANK()       OVER (ORDER BY containers DESC)              AS rnk,
  DENSE_RANK() OVER (ORDER BY containers DESC)              AS dense_rnk
FROM shipments
WHERE customer_id = 85
ORDER BY containers DESC, shipment_id
LIMIT 8;
```

`ROW_NUMBER` gives 1 to 8, splitting the tie by ID. `RANK` gives the five tied rows 1, then **jumps to 6**. `DENSE_RANK` gives them 1, then 2. "Top 3 shipments" with `RANK() <= 3` would return all five 8-container shipments; with `ROW_NUMBER() <= 3` exactly three.

> [!NOTE]
> Snowflake, BigQuery, Databricks and DuckDB have a shortcut, `QUALIFY rn <= 3`, which filters on a window function without a CTE. SQLite, PostgreSQL, SQL Server and MySQL don't, so the CTE pattern is the one that works everywhere.

## Example

The top three customers by delivered freight charges, within each mode:

```sql run
WITH customer_mode AS (
  SELECT r.mode, s.customer_id, SUM(s.freight_charge) AS charges
  FROM shipments AS s
  JOIN routes AS r ON r.route_id = s.route_id
  WHERE s.status = 'Delivered'
  GROUP BY r.mode, s.customer_id
),
ranked AS (
  SELECT
    mode,
    customer_id,
    charges,
    ROW_NUMBER() OVER (PARTITION BY mode ORDER BY charges DESC, customer_id) AS rn
  FROM customer_mode
)
SELECT ranked.mode, ranked.rn, c.company_name, ranked.charges
FROM ranked
JOIN customers AS c ON c.customer_id = ranked.customer_id
WHERE ranked.rn <= 3
ORDER BY ranked.mode, ranked.rn;
```

Nine rows: three per mode. Note the order of the work. First total per customer and mode, then number within each mode, then filter, and only then join the names in. Joining names at the end means the ranking runs on fewer, narrower rows.

## Walkthrough

1. Run the example. Then change `rn <= 3` to `rn = 1` to get each mode's single biggest customer.
2. Replace `ROW_NUMBER()` with `RANK()`. Nothing changes here because no two customers have identical charges, but on a column with ties, such as `containers`, `RANK` could return more than three rows per group.
3. Now the "latest record" version. For shipments paid in instalments, keep only the most recent payment, with the full row:

```sql run
WITH numbered AS (
  SELECT
    p.*,
    ROW_NUMBER() OVER (PARTITION BY shipment_id ORDER BY payment_date DESC, payment_id DESC) AS rn,
    COUNT(*) OVER (PARTITION BY shipment_id) AS payments
  FROM payments AS p
)
SELECT shipment_id, payment_id, payment_date, amount, method, payments
FROM numbered
WHERE rn = 1 AND payments > 1
ORDER BY shipment_id
LIMIT 20;
```

4. Check the count without `LIMIT`: 159 shipments have more than one payment. Deduplication works the same way: number the copies newest first and keep `rn = 1`.

## Practice

```exercise
{
  "id": "asql-05-p1",
  "prompt": "For each route, show its most recent booking. Show route_id, shipment_id and booking_date (break ties by the higher shipment_id), ordered by route_id.",
  "starter": "WITH numbered AS (\n  SELECT\n    route_id,\n    shipment_id,\n    booking_date,\n    ROW_NUMBER() OVER () AS rn\n  FROM shipments\n)\nSELECT route_id, shipment_id, booking_date\nFROM numbered\nWHERE rn = 1\nORDER BY route_id;",
  "solution": "WITH numbered AS (SELECT route_id, shipment_id, booking_date, ROW_NUMBER() OVER (PARTITION BY route_id ORDER BY booking_date DESC, shipment_id DESC) AS rn FROM shipments) SELECT route_id, shipment_id, booking_date FROM numbered WHERE rn = 1 ORDER BY route_id;",
  "hint": "Fill in OVER (PARTITION BY route_id ORDER BY booking_date DESC, shipment_id DESC).",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-05-p2",
  "prompt": "For each customer, find their busiest route by number of shipments. If two routes tie, show both. Show customer_id, route_id and shipments, ordered by customer_id then route_id.",
  "starter": "",
  "solution": "WITH counts AS (SELECT customer_id, route_id, COUNT(*) AS shipments FROM shipments GROUP BY customer_id, route_id), ranked AS (SELECT customer_id, route_id, shipments, RANK() OVER (PARTITION BY customer_id ORDER BY shipments DESC) AS rnk FROM counts) SELECT customer_id, route_id, shipments FROM ranked WHERE rnk = 1 ORDER BY customer_id, route_id;",
  "hint": "Count per customer and route, then RANK() within each customer by that count, and keep rank 1. RANK keeps ties; ROW_NUMBER wouldn't.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-05-c1",
  "prompt": "For each mode, show the shipments with the second-highest freight_charge value (if several share that value, show them all). Show mode, shipment_id and freight_charge, ordered by mode then shipment_id.",
  "starter": "",
  "solution": "WITH ranked AS (SELECT r.mode, s.shipment_id, s.freight_charge, DENSE_RANK() OVER (PARTITION BY r.mode ORDER BY s.freight_charge DESC) AS dr FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id) SELECT mode, shipment_id, freight_charge FROM ranked WHERE dr = 2 ORDER BY mode, shipment_id;",
  "hint": "DENSE_RANK numbers distinct values with no gaps, so dr = 2 is the second-highest value.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-05-d1",
  "prompt": "For each year (from booking_date), show its two busiest months. Show year, month ('YYYY-MM') and shipments, ordered by year then shipments descending.",
  "starter": "",
  "solution": "WITH m AS (SELECT strftime('%Y', booking_date) AS year, strftime('%Y-%m', booking_date) AS month, COUNT(*) AS shipments FROM shipments GROUP BY month), r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY year ORDER BY shipments DESC, month) AS rn FROM m) SELECT year, month, shipments FROM r WHERE rn <= 2 ORDER BY year, shipments DESC;",
  "hint": "Count by month, keep the year as a column, then number within each year.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-05-d2",
  "prompt": "For each account manager, show their single largest customer by number of shipments. Show account_manager_id, customer_id and shipments (break ties by the lower customer_id), ordered by account_manager_id. Leave out customers with no account manager.",
  "starter": "",
  "solution": "WITH c AS (SELECT cu.account_manager_id, cu.customer_id, COUNT(*) AS shipments FROM customers AS cu JOIN shipments AS s ON s.customer_id = cu.customer_id WHERE cu.account_manager_id IS NOT NULL GROUP BY cu.account_manager_id, cu.customer_id), r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY account_manager_id ORDER BY shipments DESC, customer_id) AS rn FROM c) SELECT account_manager_id, customer_id, shipments FROM r WHERE rn = 1 ORDER BY account_manager_id;",
  "hint": "Count shipments per manager and customer, number within each manager, keep rn = 1.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why can't you write WHERE ROW_NUMBER() OVER (…) = 1 directly?",
    "options": ["ROW_NUMBER needs GROUP BY", "WHERE runs before window functions are calculated, so filter in an outer query", "It only works with RANK", "You can; it's just slow"],
    "answer": 1,
    "explanation": "Compute the number in a CTE or subquery, then filter outside."
  },
  {
    "prompt": "You want the top 3 salespeople per region and must include anyone tied for third. Which function?",
    "options": ["ROW_NUMBER()", "RANK()", "COUNT()", "LAG()"],
    "answer": 1,
    "explanation": "RANK gives tied rows the same rank, so all of them pass rank <= 3."
  },
  {
    "prompt": "Why add shipment_id to ORDER BY inside ROW_NUMBER() OVER (PARTITION BY route_id ORDER BY booking_date DESC, shipment_id DESC)?",
    "options": ["It's required syntax", "To break ties, so the same row is chosen every time the query runs", "To sort the final output", "To remove duplicates"],
    "answer": 1,
    "explanation": "Without a tie-breaker, rows booked on the same day can come out in any order."
  }
]
```
