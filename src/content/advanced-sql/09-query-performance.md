---
title: Query performance
minutes: 25
summary: Read a query plan, understand what an index does, and write queries a database can run quickly on millions of rows.
---

## The problem

Your SQL runs in a second on Harbourline's 2,683 shipments. At your next job, the shipments table has 80 million rows, and the same query runs for twenty minutes, then times out and holds up everyone else's reports.

The data volume is out of your hands, but how you write the query isn't. The difference between a query that **searches** an index and one that **scans** every row can be a thousandfold at scale. Analysts who write fast queries get their numbers sooner and are trusted with access to bigger systems.

## The concept

**Scan or search**

To find rows, a database either **scans** (reads every row in the table) or **searches** (uses an **index** to jump straight to the rows it needs). An index is like the index at the back of a book: a sorted list of values, each pointing to where the matching rows are. Searching 80 million rows through an index takes a few steps, while scanning them means reading all 80 million.

**Reading the plan**

`EXPLAIN QUERY PLAN` (SQLite), `EXPLAIN` (PostgreSQL, MySQL) or the "estimated execution plan" (SQL Server) shows what the database intends to do, without running the query. Look for:

| In the plan | Meaning |
| :-- | :-- |
| `SCAN table` | reads every row. Fine for small tables, slow for big ones |
| `SEARCH table USING INDEX` | jumps to matching rows. What you want for selective filters |
| `USING COVERING INDEX` | the index holds every column needed, so the table isn't touched |
| `CORRELATED SCALAR SUBQUERY` | a subquery that runs once **per row** of the outer query |

**Habits that keep queries fast**

1. **Keep filters sargable**: leave the column bare. `WHERE strftime('%Y', booking_date) = '2026'` has to calculate the year for every row, so it can't use an index on `booking_date`. `WHERE booking_date >= '2026-01-01' AND booking_date < '2027-01-01'` can.
2. **Select only the columns you need.** `SELECT *` reads and sends everything, and stops covering indexes from working.
3. **Aggregate before you join.** Total payments per shipment first, then join 2,409 rows down to 2,250, rather than joining everything and grouping at the end.
4. **Avoid correlated subqueries in `SELECT`** on big tables. Replace them with a join to a pre-aggregated CTE.
5. **Prefer `UNION ALL` to `UNION`** when duplicates are impossible or wanted. `UNION` has to sort everything to remove them.
6. **Beware leading wildcards.** `LIKE '%Foods'` can't use an index; `LIKE 'Kings%'` can.

Indexes aren't free: each one slows down inserts and updates and takes space. In most jobs analysts don't create indexes on production databases themselves; they show the plan to a data engineer or DBA and ask. Writing sargable queries is always in your hands.

## Example

Harbourline's practice database has no indexes, so every query scans:

```sql run
EXPLAIN QUERY PLAN
SELECT * FROM shipments WHERE customer_id = 42;
```

`SCAN shipments`. Now create an index and ask again. Your browser has its own copy of the database, so this changes nothing for anyone else:

```sql run
CREATE INDEX IF NOT EXISTS idx_shipments_customer ON shipments(customer_id);
EXPLAIN QUERY PLAN
SELECT * FROM shipments WHERE customer_id = 42;
```

`SEARCH shipments USING INDEX idx_shipments_customer (customer_id=?)`. The database now jumps straight to customer 42's rows.

## Walkthrough

1. Create an index on booking dates, and compare the plans of the two ways of filtering on a year:

```sql run
CREATE INDEX IF NOT EXISTS idx_shipments_booking ON shipments(booking_date);
EXPLAIN QUERY PLAN
SELECT COUNT(*) FROM shipments WHERE strftime('%Y', booking_date) = '2026';
```

```sql run
EXPLAIN QUERY PLAN
SELECT COUNT(*) FROM shipments WHERE booking_date >= '2026-01-01' AND booking_date < '2027-01-01';
```

2. Read the two plans. The first still **scans** (the whole index, calculating the year for every entry). The second **searches** a range of the index: `booking_date>? AND booking_date<?`. Same answer, very different work at scale.
3. Look at the plan for a correlated subquery:

```sql run
EXPLAIN QUERY PLAN
SELECT
  c.company_name,
  (SELECT SUM(p.amount)
   FROM payments AS p
   JOIN shipments AS s ON s.shipment_id = p.shipment_id
   WHERE s.customer_id = c.customer_id) AS total_paid
FROM customers AS c;
```

4. Find `CORRELATED SCALAR SUBQUERY` in the plan: the subquery runs once for each of the 120 customers. With a million customers it would run a million times. The practice tasks below rewrite it.

> [!NOTE]
> On a database this small every query is fast, so timings tell you little. The plan is what tells you how a query will behave when the table is a thousand times bigger.

## Practice

```exercise
{
  "id": "asql-09-p1",
  "prompt": "Rewrite the correlated subquery from the walkthrough as a join to a pre-aggregated CTE. Show company_name and total_paid for customers who have made payments, highest first.",
  "starter": "WITH paid_by_customer AS (\n  SELECT s.customer_id, SUM(p.amount) AS total_paid\n  FROM payments AS p\n  JOIN shipments AS s ON s.shipment_id = p.shipment_id\n  GROUP BY s.customer_id\n)\nSELECT\n  \nFROM customers AS c\n",
  "solution": "WITH paid_by_customer AS (SELECT s.customer_id, SUM(p.amount) AS total_paid FROM payments AS p JOIN shipments AS s ON s.shipment_id = p.shipment_id GROUP BY s.customer_id) SELECT c.company_name, pc.total_paid FROM customers AS c JOIN paid_by_customer AS pc ON pc.customer_id = c.customer_id ORDER BY pc.total_paid DESC;",
  "hint": "Join customers to paid_by_customer on customer_id. An inner join keeps only customers who have paid.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-09-p2",
  "prompt": "Count bookings per mode for March 2026, with a sargable date filter (no function on booking_date). Show mode and shipments, ordered by mode.",
  "starter": "SELECT r.mode, COUNT(*) AS shipments\nFROM shipments AS s\nJOIN routes AS r ON r.route_id = s.route_id\nWHERE strftime('%Y-%m', s.booking_date) = '2026-03'\nGROUP BY r.mode\nORDER BY r.mode;",
  "solution": "SELECT r.mode, COUNT(*) AS shipments FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.booking_date >= '2026-03-01' AND s.booking_date < '2026-04-01' GROUP BY r.mode ORDER BY r.mode;",
  "hint": "Use s.booking_date >= '2026-03-01' AND s.booking_date < '2026-04-01'. A half-open range (< the first of next month) works for any month length.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-09-c1",
  "prompt": "This query lists customers with a delivered Sea shipment, but it joins every shipment and then removes duplicates: SELECT DISTINCT c.customer_id, c.company_name FROM customers c JOIN shipments s ON s.customer_id = c.customer_id JOIN routes r ON r.route_id = s.route_id WHERE r.mode = 'Sea' AND s.status = 'Delivered'. Rewrite it with EXISTS so no duplicates are created. Show customer_id and company_name, ordered by customer_id.",
  "starter": "",
  "solution": "SELECT c.customer_id, c.company_name FROM customers AS c WHERE EXISTS (SELECT 1 FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.customer_id = c.customer_id AND r.mode = 'Sea' AND s.status = 'Delivered') ORDER BY c.customer_id;",
  "hint": "A semi-join stops at the first matching shipment for each customer, so there's nothing to deduplicate.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-09-d1",
  "prompt": "Look at the plan for a search inside company names. Run: EXPLAIN QUERY PLAN SELECT customer_id FROM customers WHERE company_name LIKE '%Foods%'. Then write the query itself: customer_id and company_name for every company whose name contains 'Foods', ordered by customer_id.",
  "starter": "",
  "solution": "SELECT customer_id, company_name FROM customers WHERE company_name LIKE '%Foods%' ORDER BY customer_id;",
  "hint": "A leading % can never use an index, so on a large table this always scans. Sometimes that's the only way to answer the question, and that's fine on a small table like customers.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-09-d2",
  "prompt": "Aggregate before joining: show each route's origin, destination and total delivered containers, by totalling shipments per route in a CTE first. Show route_id, origin, destination and containers, highest first.",
  "starter": "",
  "solution": "WITH per_route AS (SELECT route_id, SUM(containers) AS containers FROM shipments WHERE status = 'Delivered' GROUP BY route_id) SELECT r.route_id, r.origin, r.destination, pr.containers FROM per_route AS pr JOIN routes AS r ON r.route_id = pr.route_id ORDER BY pr.containers DESC, r.route_id;",
  "hint": "Group shipments by route_id in the CTE, then join the 30 totals to routes.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which filter can use an index on order_date?",
    "options": ["WHERE YEAR(order_date) = 2026", "WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'", "WHERE CAST(order_date AS TEXT) LIKE '2026%'", "WHERE strftime('%Y', order_date) = '2026'"],
    "answer": 1,
    "explanation": "Leave the column bare so the database can search a range of the index."
  },
  {
    "prompt": "A plan shows CORRELATED SCALAR SUBQUERY under a scan of a 2-million-row table. What's the risk?",
    "options": ["None", "The subquery runs once per row: 2 million times", "It returns the wrong answer", "It locks the table"],
    "answer": 1,
    "explanation": "Rewrite it as a join to a pre-aggregated CTE."
  },
  {
    "prompt": "Your query on a production database is slow and the plan shows a full scan on a filtered column. What should you usually do?",
    "options": ["Create the index yourself on production", "Make sure the filter is sargable, then share the plan with a data engineer or DBA and ask about an index", "Add SELECT *", "Run it at night and hope"],
    "answer": 1,
    "explanation": "Indexes affect everyone who writes to the table; they're usually the data team's decision."
  }
]
```
