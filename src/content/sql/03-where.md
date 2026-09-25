---
title: WHERE
minutes: 30
summary: Filter rows with comparisons, AND/OR, IN, BETWEEN, LIKE and NULL checks.
---

## The problem

Harbourline has thousands of shipments, and nobody wants to scroll through all of them. Kemi's questions are always about a slice of the data:

- "Show me the big bookings: six containers or more."
- "Which shipments were cancelled?"
- "Which customers don't have an account manager yet?"

Each of these keeps some rows and drops the rest. That's what `WHERE` is for.

## The concept

`WHERE` comes after `FROM` and keeps only the rows where a condition is true.

| Operator | Meaning | Example |
| :-- | :-- | :-- |
| `=` | equal to | `status = 'Delivered'` |
| `<>` or `!=` | not equal to | `mode <> 'Air'` |
| `>` `>=` `<` `<=` | greater / less than | `containers >= 6` |
| `AND`, `OR` | combine conditions | `containers >= 6 AND status = 'Delivered'` |
| `IN (…)` | matches any value in a list | `city IN ('Lagos', 'Abuja')` |
| `BETWEEN a AND b` | within a range, including both ends | `booking_date BETWEEN '2026-01-01' AND '2026-01-31'` |
| `LIKE` | matches a text pattern | `company_name LIKE '%Foods%'` |
| `IS NULL` | has no value | `account_manager_id IS NULL` |

Text values go in **single quotes**: `'Delivered'`. Numbers don't: `6`.

> [!NOTE]
> Dates in this database are stored as text in the format `YYYY-MM-DD`, such as `'2026-03-15'`. That format sorts correctly, so `>`, `<` and `BETWEEN` work on it as you'd expect.

## Example

```sql run
SELECT shipment_id, booking_date, containers, status
FROM shipments
WHERE containers >= 6
  AND status = 'Delivered';
```

## Walkthrough

- `WHERE containers >= 6` keeps shipments of six containers or more.
- `AND status = 'Delivered'` also requires the shipment to be delivered. With `AND`, **both** conditions must be true.
- With `OR`, **either** condition is enough.

When you mix `AND` and `OR`, use brackets to say what you mean:

```sql run
SELECT company_name, city
FROM customers
WHERE (city = 'Lagos' OR city = 'Abuja')
  AND industry = 'Pharmaceuticals';
```

Without the brackets, `AND` is applied first and you'd get every Lagos customer plus only the pharmaceutical customers in Abuja.

`IN` is a tidier way to write several `OR`s on one column: `city IN ('Lagos', 'Abuja')`.

`LIKE` matches patterns. `%` stands for "any characters", so `'%Foods%'` matches any name containing "Foods".

Finally, **NULL** means "no value". You can't test for it with `=`, because `NULL = NULL` isn't true in SQL. Always use `IS NULL` or `IS NOT NULL`:

```sql run
SELECT company_name, city
FROM customers
WHERE account_manager_id IS NULL;
```

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
  }
]
```
