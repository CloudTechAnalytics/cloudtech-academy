---
title: Advanced joins
minutes: 20
summary: Join a table to itself, test for existence with semi- and anti-joins, walk a hierarchy with a recursive CTE, join on ranges, and build complete grids with CROSS JOIN.
---

## The problem

HR asks for a staff list showing each person's manager. The `employees` table has a `manager_id` column, but it holds a number, not a name, and the manager is just another row in the **same table**.

The same week, sales asks, "Which customers have **ever** used air freight?" A plain join returns one row per air shipment, so a customer with 30 air shipments appears 30 times. You could add `DISTINCT`, but that hides the real question, which is about **existence**, not about combining rows.

Joins you already know (`INNER`, `LEFT`) combine matching rows. This lesson covers the joins that answer other kinds of questions.

## The concept

| Join | Answers | Pattern |
| :-- | :-- | :-- |
| **Self join** | How does a row relate to another row in the same table? | `employees AS e LEFT JOIN employees AS m ON m.employee_id = e.manager_id` |
| **Semi-join** | Which rows have **at least one** match? | `WHERE EXISTS (SELECT 1 FROM … WHERE …)` |
| **Anti-join** | Which rows have **no** match? | `WHERE NOT EXISTS (…)` |
| **Recursive CTE** | Who's under whom, at any depth? | `WITH RECURSIVE` |
| **Range (non-equi) join** | Which band or period does a value fall in? | `ON value BETWEEN band.lo AND band.hi` |
| **Cross join** | Every combination, even ones with no data | `routes CROSS JOIN months` |

![Anti-join, semi-join, self join and cross join, each with a tiny example of which rows come out](/images/courses/advanced-sql/join-patterns.svg "Anti-join, semi-join, self join and cross join: four ways to ask about matches. (Illustration with simplified data.)")

A semi-join never duplicates rows, however many matches there are, and it stops looking at the first match.

**Recursive CTEs** have two parts joined by `UNION ALL`: an **anchor** (the starting rows, such as people with no manager) and a **recursive part** that joins the CTE to the table to find the next level down. It repeats until a level finds no new rows. Always carry a `level` column, and make sure the recursion can end: a loop in the data (A manages B, B manages A) would run forever, and a `WHERE level < 10` guard prevents that.

## Example

The staff list with managers, via a self join. The same table appears twice, with different aliases:

```sql run
SELECT
  e.employee_id,
  e.full_name,
  e.role,
  COALESCE(m.full_name, '(no manager)') AS manager
FROM employees AS e
LEFT JOIN employees AS m ON m.employee_id = e.manager_id
ORDER BY e.employee_id;
```

`LEFT JOIN` keeps the two team leads, who have no manager. An inner join would silently drop the most senior people in the list.

Now the whole reporting tree, with a recursive CTE:

```sql run
WITH RECURSIVE org AS (
  SELECT employee_id, full_name, role, 0 AS level, full_name AS path
  FROM employees
  WHERE manager_id IS NULL                      -- anchor: the top of the tree
  UNION ALL
  SELECT e.employee_id, e.full_name, e.role, o.level + 1, o.path || ' > ' || e.full_name
  FROM employees AS e
  JOIN org AS o ON e.manager_id = o.employee_id -- the next level down
  WHERE o.level < 10                            -- guard against loops
)
SELECT level, path, role
FROM org
ORDER BY path;
```

Harbourline's tree is only two levels deep, but the same query works unchanged for a company with ten.

## Walkthrough

1. Run the self join. Change `LEFT JOIN` to `JOIN` and count the rows: 22, not 24.
2. Run the recursive CTE, then remove `WHERE manager_id IS NULL` from the anchor. Every employee becomes a starting point and people appear several times. The anchor decides where the tree starts.
3. Try a range join. Group shipments into size bands defined in a small inline table:

```sql run
WITH bands(band, lo, hi) AS (
  VALUES ('Small (1-2)', 1, 2), ('Medium (3-5)', 3, 5), ('Large (6-8)', 6, 8)
)
SELECT b.band, COUNT(*) AS shipments, ROUND(AVG(s.freight_charge)) AS avg_charge
FROM shipments AS s
JOIN bands AS b ON s.containers BETWEEN b.lo AND b.hi
GROUP BY b.band, b.lo
ORDER BY b.lo;
```

4. Note that the bands live in data, not in a long `CASE`. When finance changes the bands, you change three rows, not the query.

## Practice

```exercise
{
  "id": "asql-08-p1",
  "prompt": "Which customers have ever booked an Air shipment? Use EXISTS. Show customer_id and company_name, ordered by customer_id.",
  "starter": "SELECT c.customer_id, c.company_name\nFROM customers AS c\nWHERE EXISTS (\n  SELECT 1\n  FROM shipments AS s\n  JOIN routes AS r ON r.route_id = s.route_id\n  WHERE \n)\nORDER BY c.customer_id;",
  "solution": "SELECT c.customer_id, c.company_name FROM customers AS c WHERE EXISTS (SELECT 1 FROM shipments AS s JOIN routes AS r ON r.route_id = s.route_id WHERE s.customer_id = c.customer_id AND r.mode = 'Air') ORDER BY c.customer_id;",
  "hint": "Inside EXISTS, link to the outer row (s.customer_id = c.customer_id) and add r.mode = 'Air'.",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-08-p2",
  "prompt": "For each manager, count their direct reports. Show manager_id, manager_name and direct_reports, most reports first (ties by manager_id).",
  "starter": "",
  "solution": "SELECT m.employee_id AS manager_id, m.full_name AS manager_name, COUNT(*) AS direct_reports FROM employees AS e JOIN employees AS m ON m.employee_id = e.manager_id GROUP BY m.employee_id, m.full_name ORDER BY direct_reports DESC, manager_id;",
  "hint": "Self join employees (e) to employees (m) on m.employee_id = e.manager_id, then group by the manager.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-08-c1",
  "prompt": "Build a complete grid of every route and every month of 2026 (January to August), with the number of shipments booked, 0 where none. Show route_id, month ('YYYY-MM') and shipments, ordered by route_id then month.",
  "starter": "",
  "solution": "WITH RECURSIVE months(m) AS (SELECT '2026-01-01' UNION ALL SELECT date(m, '+1 month') FROM months WHERE m < '2026-08-01'), counts AS (SELECT route_id, date(booking_date, 'start of month') AS m, COUNT(*) AS n FROM shipments GROUP BY route_id, m) SELECT r.route_id, strftime('%Y-%m', mo.m) AS month, COALESCE(c.n, 0) AS shipments FROM routes AS r CROSS JOIN months AS mo LEFT JOIN counts AS c ON c.route_id = r.route_id AND c.m = mo.m ORDER BY r.route_id, month;",
  "hint": "Generate the months with a recursive CTE, CROSS JOIN them with routes (240 rows), then LEFT JOIN the counts.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-08-d1",
  "prompt": "Find routes that have never had a cancelled shipment. Show route_id, origin and destination, ordered by route_id. Use NOT EXISTS.",
  "starter": "",
  "solution": "SELECT r.route_id, r.origin, r.destination FROM routes AS r WHERE NOT EXISTS (SELECT 1 FROM shipments AS s WHERE s.route_id = r.route_id AND s.status = 'Cancelled') ORDER BY r.route_id;",
  "hint": "NOT EXISTS with s.route_id = r.route_id AND s.status = 'Cancelled'.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-08-d2",
  "prompt": "Find pairs of employees in the same team who were hired in the same year. Show team, hire_year, employee_a and employee_b (full names), each pair once, ordered by team, hire_year, employee_a.",
  "starter": "",
  "solution": "SELECT a.team, strftime('%Y', a.hire_date) AS hire_year, a.full_name AS employee_a, b.full_name AS employee_b FROM employees AS a JOIN employees AS b ON b.team = a.team AND strftime('%Y', b.hire_date) = strftime('%Y', a.hire_date) AND b.employee_id > a.employee_id ORDER BY a.team, hire_year, employee_a;",
  "hint": "Self join on team and hire year, with b.employee_id > a.employee_id so each pair appears once and nobody is paired with themselves.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A customer has 30 air shipments. How many times does it appear in WHERE EXISTS (… air shipment …)?",
    "options": ["30", "Once", "Zero", "It depends on the order"],
    "answer": 1,
    "explanation": "A semi-join tests for existence; it never multiplies rows."
  },
  {
    "prompt": "In a recursive CTE, what is the anchor?",
    "options": ["The guard that stops loops", "The first SELECT, which gives the starting rows", "The final ORDER BY", "The UNION ALL"],
    "answer": 1,
    "explanation": "The anchor runs once. The recursive part then keeps adding rows joined to the previous level."
  },
  {
    "prompt": "You need a row for every route and month, including combinations with no shipments. Which join creates them?",
    "options": ["INNER JOIN", "CROSS JOIN routes with a list of months, then LEFT JOIN the data", "Self join", "NOT EXISTS"],
    "answer": 1,
    "explanation": "CROSS JOIN makes every combination; the LEFT JOIN then fills in the numbers that exist."
  }
]
```
