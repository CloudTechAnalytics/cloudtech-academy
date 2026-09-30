---
title: SELECT
minutes: 25
summary: Choose the columns you need, rename them, calculate new ones and remove duplicates.
---

## The problem

The sales team is preparing calls to customers. They don't need every column in the `customers` table. They need the company name, the city and the industry, and nothing else cluttering the screen.

Later that day, finance asks for each shipment's weight in **tonnes**, but the database stores it in kilograms.

## The concept

`SELECT *` returns every column. Most of the time you want to be specific, and list only the columns you need, separated by commas.

You can also:

- **Rename** a column in the result with `AS`, which is called an **alias**.
- **Calculate** a new column from existing ones, using `+`, `-`, `*` and `/`.
- **Remove duplicates** with `DISTINCT`, so each value appears once.

Being specific makes queries faster, results easier to read, and your intent clear to the next person who reads your SQL.

## Example

```sql run
SELECT
  company_name,
  city,
  industry
FROM customers;
```

And a calculated, renamed column:

```sql run
SELECT
  shipment_id,
  weight_kg,
  weight_kg / 1000.0 AS weight_tonnes
FROM shipments;
```

## Walkthrough

In the first query, the columns come back in the order you list them, not the order they're stored in.

In the second:

- `weight_kg / 1000.0` divides each row's weight by 1,000.
- `AS weight_tonnes` gives the calculated column a readable name. Without it, the column heading would be the expression itself.
- We divide by `1000.0` rather than `1000`. In SQLite (and SQL Server), dividing one whole number by another throws away the decimals, so `1500 / 1000` gives `1`. Adding `.0` makes it decimal division, so `1500 / 1000.0` gives `1.5`.

To see each value only once, use `DISTINCT`:

```sql run
SELECT DISTINCT mode FROM routes;
```

Harbourline runs three transport modes, so you get three rows.

> [!TIP]
> Put each column on its own line once a query has more than two or three. It's easier to read, and easier to comment out a line while you're experimenting.

## Practice

```exercise
{
  "id": "sql-02-p1",
  "prompt": "The sales team wants a call list: show company_name, city and industry for every customer.",
  "starter": "SELECT\n  \nFROM customers;",
  "solution": "SELECT company_name, city, industry FROM customers;",
  "hint": "List the three column names after SELECT, separated by commas.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-02-c1",
  "prompt": "Finance wants each shipment's charge in millions of naira. Show shipment_id and freight_charge divided by 1,000,000 as charge_millions.",
  "starter": "",
  "solution": "SELECT shipment_id, freight_charge / 1000000.0 AS charge_millions FROM shipments;",
  "hint": "Divide by 1000000.0 (with the .0) so you keep the decimals, and name the column with AS.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-c2",
  "prompt": "Which industries do Harbourline's customers work in? List each industry once.",
  "starter": "",
  "solution": "SELECT DISTINCT industry FROM customers;",
  "hint": "DISTINCT goes straight after SELECT.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does AS do in SELECT weight_kg / 1000.0 AS weight_tonnes?",
    "options": ["Changes the column in the database", "Names the column in the result", "Filters the rows", "Sorts the result"],
    "answer": 1,
    "explanation": "An alias only renames the column in your result. The table itself is unchanged."
  },
  {
    "prompt": "In SQLite, SELECT 7 / 2 returns 3 because both numbers are whole. How do you get 3.5?",
    "options": ["SELECT 7 / 2.0", "SELECT 7 // 2", "SELECT ROUND(7 / 2)", "You can't"],
    "answer": 0,
    "explanation": "Making one of the numbers a decimal, such as 2.0, gives a decimal result."
  },
  {
    "prompt": "SELECT DISTINCT city FROM customers returns…",
    "options": ["Every customer's city, including repeats", "Each city once", "Only cities with one customer", "The number of cities"],
    "answer": 1,
    "explanation": "DISTINCT removes duplicate rows from the result, so each city appears once."
  }
]
```
