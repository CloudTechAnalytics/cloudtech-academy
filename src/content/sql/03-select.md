---
title: SELECT
minutes: 35
summary: Choose the columns you need, rename them, calculate new ones, join text together and remove duplicates. Every part of SELECT, step by step.
---

## The problem

The sales team is preparing calls to customers. They don't need every column in the `customers` table. They need the company name, the city and the industry, and nothing else cluttering the screen.

Later that day, finance asks for each shipment's weight in **tonnes**, but the database stores it in kilograms. And marketing wants a single "Company, City" label for each customer for a mailing.

All three are jobs for `SELECT`, the statement you'll write more than any other.

## The concept

`SELECT` asks the database for data. It never changes anything: you can run it as often as you like, and the tables stay exactly as they were.

### The syntax

```sql
SELECT column1, column2, ...
FROM table_name;
```

- `SELECT` is followed by the **columns** you want, separated by commas.
- `FROM` names the **table** they come from.
- The **semicolon** `;` marks the end of the statement. Many tools let you leave it out for a single query, but it's a good habit, and required when you run several statements together.

SQL keywords aren't case-sensitive: `select`, `SELECT` and `Select` all work. Most people write keywords in capitals and names in lower case, so it's easy to see which is which.

### Selecting specific columns

List the columns you want, in the order you want them:

```sql run
SELECT company_name, city, industry
FROM customers;
```

The result has exactly those three columns, in that order. The order you list them in is the order you get them back, not the order they're stored in the table. Swap them and the result swaps too:

```sql run
SELECT industry, company_name
FROM customers;
```

### Selecting every column: SELECT *

The star `*` means "every column":

```sql run
SELECT *
FROM routes;
```

`SELECT *` is handy for a first look at a table you don't know yet. In real queries, name the columns instead:

- The result only has what you need, so it's easier to read.
- It's faster on big tables, because less data is sent.
- If someone adds a column to the table later, your report doesn't suddenly change shape.

### Renaming columns with AS

A column **alias** gives a column a different name in the result. Write `AS` and the new name after the column:

```sql run
SELECT
  full_name AS name,
  role AS job_title
FROM employees;
```

The table isn't changed. Only the headings in your result are.

Some rules for aliases:

- Use letters, numbers and underscores, and start with a letter: `job_title`, `total_2026`.
- If you want spaces or capitals kept exactly, put the alias in double quotes: `AS "Job title"`.
- `AS` is optional (`full_name name` also works), but write it. Without it, a missing comma is very hard to spot, as you'll see under common mistakes.

```sql run
SELECT
  company_name AS "Customer name",
  signup_date AS "Joined on"
FROM customers;
```

### Calculating new columns

You can do arithmetic on columns, and the result appears as a new column. The table itself is unchanged.

| Operator | Meaning | Example |
| :-- | :-- | :-- |
| `+` | add | `containers + 1` |
| `-` | subtract | `amount - 50000` |
| `*` | multiply | `containers * 2` |
| `/` | divide | `weight_kg / 1000.0` |
| `%` | remainder after division | `shipment_id % 2` |

Finance's request, weight in tonnes:

```sql run
SELECT
  shipment_id,
  weight_kg,
  weight_kg / 1000.0 AS weight_tonnes
FROM shipments;
```

Always give a calculated column an alias. Without one, the heading is the whole expression (`weight_kg / 1000.0`), which is hard to read and hard to refer to later.

### Whole-number division

Look closely at `1000.0` above. In SQLite and SQL Server, dividing one whole number by another throws the decimals away:

```sql run
SELECT
  7 / 2 AS whole_division,
  7 / 2.0 AS decimal_division,
  7 % 2 AS remainder;
```

`7 / 2` gives `3`, not `3.5`. If either number has a decimal point, you get the decimal answer. So when you divide columns that hold whole numbers, write the constant with `.0`, or multiply by `1.0` first. (PostgreSQL behaves the same way; MySQL always gives decimals.)

Notice that this query has no `FROM`: SQLite lets you `SELECT` plain values, which is a quick way to test a calculation.

### Brackets and the order of calculation

As in maths, `*` and `/` are worked out before `+` and `-`. Use brackets to make the order explicit:

```sql run
SELECT
  10 + 5 * 2 AS without_brackets,
  (10 + 5) * 2 AS with_brackets;
```

The freight charge is stored in naira. Here's the charge per container, and the same in thousands of naira:

```sql run
SELECT
  shipment_id,
  containers,
  freight_charge,
  freight_charge / containers AS charge_per_container,
  (freight_charge / containers) / 1000.0 AS charge_per_container_thousands
FROM shipments;
```

### Joining text together

Use `||` to join pieces of text into one, which is called **concatenation**. Text you type yourself goes in **single quotes**:

```sql run
SELECT
  company_name || ', ' || city AS mailing_label
FROM customers;
```

That's marketing's "Company, City" label. Other databases use different syntax for the same thing: SQL Server writes `company_name + ', ' + city`, and MySQL uses `CONCAT(company_name, ', ', city)`. `CONCAT` also works in SQL Server and PostgreSQL.

> [!NOTE]
> Single quotes are for text values (`'Lagos'`). Double quotes are for names, such as an alias with a space (`"Job title"`). Mixing them up is one of the most common SQL errors.

### Fixed values in every row

You can include a value that's the same on every row. It's useful for labelling rows when you combine results later:

```sql run
SELECT
  company_name,
  'Customer' AS record_type,
  2026 AS report_year
FROM customers;
```

### Removing duplicates with DISTINCT

`DISTINCT` straight after `SELECT` removes duplicate rows from the result, so each value appears once:

```sql run
SELECT DISTINCT mode
FROM routes;
```

Harbourline runs 30 routes but only three transport modes, so you get three rows.

With more than one column, `DISTINCT` removes rows where **every** listed column is the same, so you get each **combination** once:

```sql run
SELECT DISTINCT city, country
FROM customers;
```

Each city appears once with its country. If two customers are in Lagos, Nigeria, that combination still appears only once.

### Comments

Anything after `--` on a line is a **comment**: the database ignores it. Use comments to explain why, or to switch a line off while you experiment:

```sql run
-- Call list for the sales team
SELECT
  company_name,
  city
  -- , industry   (not needed this week)
FROM customers;
```

For a comment over several lines, put it between `/*` and `*/`.

### Formatting for people

The database doesn't care about line breaks or spacing. People do. Once a query has more than two or three columns:

- put each column on its own line, indented;
- put `FROM` on its own line;
- line up the commas the same way every time.

The queries in this course follow that style, and it's what you'll see in most teams.

## Example

Back to the three requests. The sales call list:

```sql run
SELECT
  company_name,
  city,
  industry
FROM customers;
```

Finance's weights in tonnes, with the original weight for checking:

```sql run
SELECT
  shipment_id,
  weight_kg,
  weight_kg / 1000.0 AS weight_tonnes
FROM shipments;
```

And marketing's mailing labels, one per city and company, with a clear heading:

```sql run
SELECT DISTINCT
  company_name || ', ' || city AS "Mailing label"
FROM customers;
```

## Walkthrough

Read each query clause by clause, the way the database does:

1. `FROM customers` picks the table.
2. `SELECT company_name, city, industry` picks the columns, in that order, from every row.
3. In the second query, `weight_kg / 1000.0` is worked out for each row separately, and `AS weight_tonnes` names the result. Because of the `.0`, a weight of 1,500 kg becomes 1.5 tonnes rather than 1.
4. In the third, `||` joins three pieces of text for each row: the company name, the text `', '` and the city. `DISTINCT` then keeps each finished label once.

### Common mistakes

| Mistake | What happens | Fix |
| :-- | :-- | :-- |
| A comma after the last column: `SELECT city, industry, FROM customers` | A syntax error near `FROM` | Remove the last comma |
| A missing comma: `SELECT company_name city FROM customers` | No error. You get **one** column, `company_name`, renamed to `city` | Add the comma. This is why writing `AS` for aliases helps |
| Dividing whole numbers: `containers / 3` | Decimals silently thrown away | Divide by `3.0` |
| Double quotes for text: `"Lagos"` | Treated as a column name; an error or a wrong result | Use single quotes: `'Lagos'` |
| A misspelt column: `SELECT compnay_name` | An error: no such column | Check the spelling against the table |

> [!TIP]
> When a query fails, read the error message slowly. It usually names the word it couldn't understand, and the mistake is just before it.

### Summary

| You want to... | Write |
| :-- | :-- |
| Choose columns | `SELECT col1, col2 FROM table` |
| See every column | `SELECT * FROM table` |
| Rename a column in the result | `col AS new_name` |
| Calculate a column | `col1 * col2 AS result` |
| Keep decimals when dividing | `col / 1000.0` |
| Join text | `col1 \|\| ' ' \|\| col2` |
| Remove duplicate rows | `SELECT DISTINCT col FROM table` |
| Add a note | `-- comment` |

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

## More practice

Optional drills on the same skills. They don't count towards the certificate, but each one is a small, realistic request from someone at Harbourline. Do as many as you need until the pattern feels automatic.

```exercise
{
  "id": "sql-02-d1",
  "prompt": "Operations wants a list of lanes: show origin, destination and mode for every route.",
  "starter": "",
  "solution": "SELECT origin, destination, mode FROM routes;",
  "hint": "List the three columns after SELECT, separated by commas.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-d2",
  "prompt": "Show shipment_id, weight_kg, and the weight in tonnes as weight_tonnes (weight_kg divided by 1000.0).",
  "starter": "",
  "solution": "SELECT shipment_id, weight_kg, weight_kg / 1000.0 AS weight_tonnes FROM shipments;",
  "hint": "Divide by 1000.0, not 1000, so SQLite keeps the decimals. Name the column with AS.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-d3",
  "prompt": "Which payment methods has Harbourline received money by? List each method once.",
  "starter": "",
  "solution": "SELECT DISTINCT method FROM payments;",
  "hint": "DISTINCT goes straight after SELECT.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-d4",
  "prompt": "HR wants a staff list with friendlier headings: show each employee's full_name as name and role as job_title.",
  "starter": "",
  "solution": "SELECT full_name AS name, role AS job_title FROM employees;",
  "hint": "Rename each column with AS.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-d5",
  "prompt": "Make a route label for each route: origin, then ' to ', then destination, in one column called lane.",
  "starter": "",
  "solution": "SELECT origin || ' to ' || destination AS lane FROM routes;",
  "hint": "Join the pieces with || and put the fixed text ' to ' in single quotes.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-d6",
  "prompt": "Show each shipment's shipment_id, containers and the charge per container (freight_charge divided by containers) as charge_per_container.",
  "starter": "",
  "solution": "SELECT shipment_id, containers, freight_charge / containers AS charge_per_container FROM shipments;",
  "hint": "Divide one column by the other, and name the result with AS.",
  "required": false
}
```

```exercise
{
  "id": "sql-02-d7",
  "prompt": "List each combination of team and role in the employees table once.",
  "starter": "",
  "solution": "SELECT DISTINCT team, role FROM employees;",
  "hint": "DISTINCT works across all the columns you list.",
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
  },
  {
    "prompt": "What does SELECT company_name city FROM customers return?",
    "options": ["Two columns, company_name and city", "An error", "One column: company_name, renamed city", "Nothing"],
    "answer": 2,
    "explanation": "With the comma missing, city becomes an alias for company_name. No error, just the wrong result."
  },
  {
    "prompt": "Which joins first_name and last_name with a space between them, in SQLite?",
    "options": ["first_name + last_name", "first_name || ' ' || last_name", "first_name || \" \" || last_name", "JOIN(first_name, last_name)"],
    "answer": 1,
    "explanation": "|| concatenates text, and the space is a text value, so it goes in single quotes."
  },
  {
    "prompt": "SELECT DISTINCT city, country FROM customers returns…",
    "options": ["Each city once, whatever the country", "Each country once", "Each city and country combination once", "An error: DISTINCT takes one column"],
    "answer": 2,
    "explanation": "DISTINCT applies to the whole row, so each combination of the listed columns appears once."
  }
]
```
