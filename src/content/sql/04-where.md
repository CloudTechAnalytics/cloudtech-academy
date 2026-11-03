---
title: WHERE
minutes: 50
summary: Keep only the rows you need. Comparisons on numbers, text and dates, AND, OR and NOT, IN, BETWEEN, LIKE patterns and NULL, step by step.
---

## The problem

Harbourline has thousands of shipments, and nobody wants to scroll through all of them. Kemi's questions are always about a slice of the data:

- "Show me the big bookings: six containers or more."
- "Which shipments were cancelled?"
- "Which customers don't have an account manager yet?"
- "Which of our customers are food companies?"

Each of these keeps some rows and drops the rest. That's what `WHERE` is for.

## The concept

`WHERE` filters rows. It checks a **condition** against every row, keeps the rows where the condition is true, and leaves the rest out of the result.

![Six shipments go into a WHERE box that checks containers >= 6 AND status = 'Delivered'. Two rows pass and appear in the result; the other four are left out.](/images/courses/sql/where-filter.svg "WHERE checks each row. Only rows where the whole condition is true reach the result. (Illustration with simplified data.)")

### The syntax

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

`WHERE` always comes **after** `FROM`. The database reads the table first, filters the rows with `WHERE`, and only then picks the columns in `SELECT`. That's why you can filter on a column you don't show:

```sql run
SELECT company_name
FROM customers
WHERE city = 'Abuja';
```

`city` isn't in the result, but it was used to choose the rows.

### Comparison operators

| Operator | Meaning | Example |
| :-- | :-- | :-- |
| `=` | equal to | `status = 'Delivered'` |
| `<>` or `!=` | not equal to | `mode <> 'Air'` |
| `>` | greater than | `containers > 6` |
| `>=` | greater than or equal to | `containers >= 6` |
| `<` | less than | `weight_kg < 10000` |
| `<=` | less than or equal to | `target_transit_days <= 3` |

On numbers, they work as you'd expect:

```sql run
SELECT shipment_id, containers, freight_charge
FROM shipments
WHERE containers >= 6;
```

```sql run
SELECT origin, destination, target_transit_days
FROM routes
WHERE target_transit_days <= 3;
```

Note the difference between `>` and `>=`: `containers > 6` leaves out shipments of exactly six; `containers >= 6` keeps them.

### Comparing text

Text values go in **single quotes**. Numbers don't:

```sql run
SELECT shipment_id, booking_date, status
FROM shipments
WHERE status = 'Cancelled';
```

Two things to know about text:

- **Spelling must match exactly**, including spaces. `'In transit'` matches; `'In Transit'` and `'Intransit'` don't.
- **Capitals matter with `=`** in SQLite, PostgreSQL and Oracle: `city = 'lagos'` finds nothing, because the data says `'Lagos'`. (SQL Server and MySQL usually ignore case.) If you're not sure how a value is stored, look first with `SELECT DISTINCT`.

```sql run
SELECT DISTINCT status
FROM shipments;
```

`<>` keeps every row that **isn't** the value:

```sql run
SELECT company_name, city, country
FROM customers
WHERE country <> 'Nigeria';
```

### Comparing dates

In this database, dates are stored as text in the format `YYYY-MM-DD`, such as `'2026-03-15'`. That format puts the year first, so dates sort and compare correctly as text: `'2025-12-31' < '2026-01-01'` is true. Write dates in the same format, in single quotes:

```sql run
SELECT shipment_id, booking_date
FROM shipments
WHERE booking_date >= '2026-08-01';
```

> [!NOTE]
> Other databases have a real date type, and accept the same `'YYYY-MM-DD'` text in comparisons. Always use this format: `'03/04/2026'` could mean 3 April or 4 March depending on the country.

### Combining conditions: AND, OR, NOT

| Keyword | A row is kept when... |
| :-- | :-- |
| `AND` | **both** conditions are true |
| `OR` | **at least one** condition is true |
| `NOT` | the condition is **false** |

Big bookings that were actually delivered:

```sql run
SELECT shipment_id, booking_date, containers, status
FROM shipments
WHERE containers >= 6
  AND status = 'Delivered';
```

Shipments that aren't finished yet, either booked or on their way:

```sql run
SELECT shipment_id, status
FROM shipments
WHERE status = 'Booked'
   OR status = 'In transit';
```

`NOT` reverses a condition. `NOT status = 'Delivered'` means the same as `status <> 'Delivered'`. It's most useful with `IN`, `BETWEEN` and `LIKE`, which you'll see below.

### Mixing AND and OR: use brackets

When a condition has both `AND` and `OR`, SQL works out every `AND` **first**, just as maths does `×` before `+`. That can give a very different answer from the one you meant.

Kemi wants pharmaceutical customers in Lagos or Abuja. Without brackets:

```sql run
SELECT company_name, city, industry
FROM customers
WHERE city = 'Lagos' OR city = 'Abuja' AND industry = 'Pharmaceuticals';
```

That returns 46 rows: **every** Lagos customer, whatever the industry, plus the pharmaceutical customers in Abuja. SQL read it as `city = 'Lagos' OR (city = 'Abuja' AND industry = 'Pharmaceuticals')`. With brackets:

```sql run
SELECT company_name, city, industry
FROM customers
WHERE (city = 'Lagos' OR city = 'Abuja')
  AND industry = 'Pharmaceuticals';
```

Four rows, which is what Kemi asked for.

> [!TIP]
> Whenever a condition mixes `AND` and `OR`, add brackets, even when you think the default order is right. The next person to read the query will thank you.

### A list of values: IN

`IN` checks whether a value is in a list. It's a tidier way to write several `OR`s on the same column:

```sql run
SELECT company_name, city
FROM customers
WHERE city IN ('Lagos', 'Abuja', 'Kano');
```

That's the same as `city = 'Lagos' OR city = 'Abuja' OR city = 'Kano'`. `NOT IN` keeps everything that isn't in the list:

```sql run
SELECT shipment_id, status
FROM shipments
WHERE status NOT IN ('Delivered', 'Cancelled');
```

### A range: BETWEEN

`BETWEEN low AND high` keeps values in a range, **including both ends**:

```sql run
SELECT shipment_id, containers
FROM shipments
WHERE containers BETWEEN 3 AND 5;
```

You get 3, 4 and 5 containers. It's shorthand for `containers >= 3 AND containers <= 5`. It works on dates too, which is the commonest use:

```sql run
SELECT shipment_id, booking_date, status
FROM shipments
WHERE booking_date BETWEEN '2026-01-01' AND '2026-01-31';
```

That's every shipment booked in January 2026: 137 of them.

> [!WARNING]
> If a column holds a date **and a time**, such as `'2026-01-31 14:30'`, then `BETWEEN '2026-01-01' AND '2026-01-31'` misses most of 31 January, because `'2026-01-31 14:30'` is later than `'2026-01-31'`. The safe pattern is `>= '2026-01-01' AND < '2026-02-01'`.

### Text patterns: LIKE

`LIKE` matches text against a **pattern**. Two characters have special meanings:

| Wildcard | Matches | Example | Matches |
| :-- | :-- | :-- | :-- |
| `%` | any number of characters, including none | `'Lagoon%'` | names starting with Lagoon |
| `_` | exactly one character | `'_a%'` | names whose second letter is a |

| Pattern | Means |
| :-- | :-- |
| `'Apex%'` | starts with Apex |
| `'%Ltd'` | ends with Ltd |
| `'%Foods%'` | contains Foods anywhere |
| `'____'` | exactly four characters |

Marketing wants every food company:

```sql run
SELECT company_name, city
FROM customers
WHERE company_name LIKE '%Foods%';
```

Twelve customers have "Foods" in their names. And customers registered as public companies, whose names end in "Plc":

```sql run
SELECT company_name
FROM customers
WHERE company_name LIKE '%Plc';
```

In SQLite and MySQL, `LIKE` ignores the difference between capitals and small letters (for the letters A to Z), so `LIKE 'lagos'` matches `'Lagos'`. In PostgreSQL it doesn't; use `ILIKE` there. `NOT LIKE` keeps the rows that don't match.

### Missing values: IS NULL

`NULL` means **no value**: the information is missing or unknown. It isn't zero, and it isn't empty text. A shipment that hasn't arrived has no `delivery_date`, so that column is `NULL`.

You **can't** find `NULL` with `=`. In SQL, `NULL = NULL` isn't true, because two unknowns can't be known to be equal. So this finds nothing:

```sql run
SELECT company_name
FROM customers
WHERE account_manager_id = NULL;
```

Use `IS NULL` instead:

```sql run
SELECT company_name, city
FROM customers
WHERE account_manager_id IS NULL;
```

Eight customers don't have an account manager yet. `IS NOT NULL` finds the rows that do have a value:

```sql run
SELECT shipment_id, ship_date, delivery_date
FROM shipments
WHERE delivery_date IS NOT NULL;
```

### Filtering on a calculation

A condition can use a calculation, not just a column. Shipments where the charge per container is over ₦5 million:

```sql run
SELECT
  shipment_id,
  containers,
  freight_charge,
  freight_charge / containers AS charge_per_container
FROM shipments
WHERE freight_charge / containers > 5000000;
```

Notice that the calculation is written out again in `WHERE`. You can't write `WHERE charge_per_container > 5000000`, because `WHERE` runs **before** `SELECT`, so the alias doesn't exist yet when the rows are filtered. (SQLite happens to allow it, but most databases don't, so don't rely on it.)

## Example

Kemi's four questions, answered. Big bookings:

```sql run
SELECT shipment_id, booking_date, containers
FROM shipments
WHERE containers >= 6;
```

Cancelled shipments:

```sql run
SELECT shipment_id, booking_date, freight_charge
FROM shipments
WHERE status = 'Cancelled';
```

Customers without an account manager:

```sql run
SELECT company_name, city
FROM customers
WHERE account_manager_id IS NULL;
```

Food companies in Lagos or Port Harcourt:

```sql run
SELECT company_name, city
FROM customers
WHERE company_name LIKE '%Foods%'
  AND city IN ('Lagos', 'Port Harcourt');
```

## Walkthrough

Read the last query the way the database runs it:

1. `FROM customers` takes all 120 customers.
2. `WHERE company_name LIKE '%Foods%'` checks each name for "Foods" anywhere.
3. `AND city IN ('Lagos', 'Port Harcourt')` also requires the city to be one of the two. Because it's `AND`, a row needs both to be true.
4. `SELECT company_name, city` shows two columns of the rows that passed.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| `WHERE status = Delivered` | An error: SQL thinks `Delivered` is a column | Text goes in single quotes: `'Delivered'` |
| `WHERE city = "Lagos"` | Double quotes mean a name, not text: an error or a wrong result | Use single quotes |
| `WHERE account_manager_id = NULL` | No rows, and no error | `IS NULL` |
| `WHERE a = 1 OR b = 2 AND c = 3` | `AND` runs first, so the result isn't what you meant | Add brackets |
| `WHERE city = 'lagos'` | No rows in SQLite: capitals don't match | Match the stored value, or use `LIKE` |
| `WHERE booking_date = '02/01/2026'` | No rows: the format doesn't match | Use `'2026-01-02'` |
| `WHERE` before `FROM` | A syntax error | `SELECT ... FROM ... WHERE ...` |

### Summary

| You want rows where... | Write |
| :-- | :-- |
| a value equals something | `WHERE status = 'Delivered'` |
| a value isn't something | `WHERE mode <> 'Air'` |
| a number is at least something | `WHERE containers >= 6` |
| both conditions are true | `WHERE a AND b` |
| either condition is true | `WHERE a OR b` (with brackets if mixed with `AND`) |
| a value is one of a list | `WHERE city IN ('Lagos', 'Abuja')` |
| a value is in a range | `WHERE containers BETWEEN 3 AND 5` |
| text matches a pattern | `WHERE company_name LIKE '%Foods%'` |
| a value is missing | `WHERE delivery_date IS NULL` |
| a value is present | `WHERE delivery_date IS NOT NULL` |

## Practice

```exercise
{
  "id": "sql-03-p1",
  "prompt": "Show the shipment_id, booking_date and freight_charge of every cancelled shipment.",
  "starter": "SELECT shipment_id, booking_date, freight_charge\nFROM shipments\nWHERE ",
  "solution": "SELECT shipment_id, booking_date, freight_charge FROM shipments WHERE status = 'Cancelled';",
  "hint": "Compare the status column to the text 'Cancelled' in single quotes.",
  "required": true
}
```

```exercise
{
  "id": "sql-03-p2",
  "prompt": "Which customers don't have an account manager yet? Show their company_name and city.",
  "starter": "",
  "solution": "SELECT company_name, city FROM customers WHERE account_manager_id IS NULL;",
  "hint": "Missing values are NULL. Use IS NULL, not = NULL.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-03-c1",
  "prompt": "Show shipment_id, booking_date and status for shipments booked in January 2026 that were not delivered.",
  "starter": "",
  "solution": "SELECT shipment_id, booking_date, status FROM shipments WHERE booking_date BETWEEN '2026-01-01' AND '2026-01-31' AND status <> 'Delivered';",
  "hint": "Use BETWEEN '2026-01-01' AND '2026-01-31' for the dates, and <> for 'not equal to'.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-c2",
  "prompt": "List the company_name of every customer in the food or agriculture business (industry 'Food & Beverage' or 'Agriculture') based in Lagos or Port Harcourt.",
  "starter": "",
  "solution": "SELECT company_name FROM customers WHERE industry IN ('Food & Beverage', 'Agriculture') AND city IN ('Lagos', 'Port Harcourt');",
  "hint": "Two IN lists joined with AND keeps the logic clear without brackets.",
  "required": false
}
```

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-03-d1",
  "prompt": "Show company_name and industry for every customer based in Abuja.",
  "starter": "",
  "solution": "SELECT company_name, industry FROM customers WHERE city = 'Abuja';",
  "hint": "Text values go in single quotes: WHERE city = 'Abuja'.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d2",
  "prompt": "Show shipment_id, containers and freight_charge for shipments of 6 or more containers booked in 2026 (from '2026-01-01').",
  "starter": "",
  "solution": "SELECT shipment_id, containers, freight_charge FROM shipments WHERE containers >= 6 AND booking_date >= '2026-01-01';",
  "hint": "Two conditions joined with AND. Dates in YYYY-MM-DD compare correctly as text.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d3",
  "prompt": "List company_name, city and country for every customer outside Nigeria.",
  "starter": "",
  "solution": "SELECT company_name, city, country FROM customers WHERE country <> 'Nigeria';",
  "hint": "Use <> (or !=) for 'not equal to'.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d4",
  "prompt": "Which shipments haven't arrived yet? Show shipment_id and status for shipments that are 'Booked' or 'In transit'. Use IN.",
  "starter": "",
  "solution": "SELECT shipment_id, status FROM shipments WHERE status IN ('Booked', 'In transit');",
  "hint": "WHERE status IN ('Booked', 'In transit')",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d5",
  "prompt": "Find every customer whose company_name contains the word 'Foods'. Show company_name and city.",
  "starter": "",
  "solution": "SELECT company_name, city FROM customers WHERE company_name LIKE '%Foods%';",
  "hint": "LIKE with % on both sides matches the word anywhere in the name.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d6",
  "prompt": "Show origin, destination and mode for every route that isn't by sea and takes 5 days or fewer (target_transit_days).",
  "starter": "",
  "solution": "SELECT origin, destination, mode FROM routes WHERE mode <> 'Sea' AND target_transit_days <= 5;",
  "hint": "Two conditions with AND: one using <>, one using <=.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d7",
  "prompt": "Show shipment_id and weight_kg for shipments weighing between 20,000 and 30,000 kg, including both.",
  "starter": "",
  "solution": "SELECT shipment_id, weight_kg FROM shipments WHERE weight_kg BETWEEN 20000 AND 30000;",
  "hint": "BETWEEN includes both ends of the range.",
  "required": false
}
```

```exercise
{
  "id": "sql-03-d8",
  "prompt": "Which shipments have been sent but not delivered? Show shipment_id and ship_date where ship_date has a value and delivery_date doesn't.",
  "starter": "",
  "solution": "SELECT shipment_id, ship_date FROM shipments WHERE ship_date IS NOT NULL AND delivery_date IS NULL;",
  "hint": "Combine IS NOT NULL and IS NULL with AND.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which condition finds customers with no account manager?",
    "options": ["account_manager_id = NULL", "account_manager_id IS NULL", "account_manager_id = ''", "account_manager_id = 0"],
    "answer": 1,
    "explanation": "NULL isn't equal to anything, not even another NULL, so = NULL never matches. Use IS NULL."
  },
  {
    "prompt": "containers BETWEEN 2 AND 4 matches which values?",
    "options": ["3 only", "2, 3 and 4", "2 and 3", "3 and 4"],
    "answer": 1,
    "explanation": "BETWEEN includes both ends of the range."
  },
  {
    "prompt": "company_name LIKE 'Apex%' matches…",
    "options": ["Names containing Apex anywhere", "Names starting with Apex", "Names ending with Apex", "Only the exact name Apex"],
    "answer": 1,
    "explanation": "The % comes after Apex, so the name must start with Apex and can continue with anything."
  },
  {
    "prompt": "WHERE city = 'Lagos' OR city = 'Abuja' AND industry = 'Retail' returns…",
    "options": ["Retail customers in Lagos or Abuja", "Every Lagos customer, plus retail customers in Abuja", "Only retail customers in Abuja", "An error"],
    "answer": 1,
    "explanation": "AND is worked out before OR. Put brackets round the OR to get retail customers in both cities."
  },
  {
    "prompt": "Which is the same as status IN ('Booked', 'In transit')?",
    "options": ["status = 'Booked' AND status = 'In transit'", "status = 'Booked' OR status = 'In transit'", "status BETWEEN 'Booked' AND 'In transit'", "status LIKE 'Booked%In transit'"],
    "answer": 1,
    "explanation": "IN is shorthand for several ORs on the same column."
  },
  {
    "prompt": "Why can't most databases run WHERE charge_per_container > 5000000 when charge_per_container is an alias in SELECT?",
    "options": ["Aliases can't contain underscores", "WHERE runs before SELECT, so the alias doesn't exist yet", "Numbers that big aren't allowed", "WHERE only works on text"],
    "answer": 1,
    "explanation": "Repeat the calculation in WHERE instead."
  }
]
```
