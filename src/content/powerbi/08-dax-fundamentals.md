---
title: DAX fundamentals
minutes: 25
summary: How DAX thinks: calculated columns versus measures, filter context and row context, SUMX, DIVIDE, SWITCH, RELATED and variables, with Kolanut's real results.
---

## The problem

Dragging `revenue` into a visual gives "Sum of revenue", which is fine until you need an average per order line, a count of active customers, or a percentage of the total. Those need **DAX** (Data Analysis Expressions), Power BI's formula language. DAX looks like Excel, but it thinks in **columns and filters**, not cells.

## The concept

**DAX** (Data Analysis Expressions) is the formula language of Power BI. It looks like Excel: functions, brackets, commas. But Excel formulas point at **cells**, and DAX formulas work on **columns and tables**, with the answer depending on what's filtered. That one difference is the key to everything in this lesson and the next.

### Writing DAX

Every DAX formula has the same shape: a **name**, an equals sign, and an **expression**.

```dax
Revenue = SUM ( orders[revenue] )
```

| Part | Meaning |
| :-- | :-- |
| `Revenue` | The name you'll see in the Data pane and in visuals |
| `SUM ( … )` | A function, with its arguments in brackets |
| `orders[revenue]` | A column: table name, then column name in square brackets |
| `[Revenue]` | A measure, written in square brackets with no table name |

Table names with spaces or special characters need single quotes: `'Date'[Year]`. Spaces and line breaks don't matter, so long formulas can be laid out on several lines for readability. Comments start with `//`.

### Calculated columns and measures

DAX can create two different things, and choosing between them is the first decision every time:

| | Calculated column | Measure |
| :-- | :-- | :-- |
| Calculated | Once per row, when data refreshes | On the fly, for whatever the visual is showing |
| Stored | In the table (uses memory) | Not stored |
| Has a value for | Each row | Each cell of a visual |
| Use for | A value you'll filter or group by (size band, age group) | Numbers you aggregate: totals, averages, ratios |
| Example | `Size = IF ( orders[quantity] >= 20, "Large", "Small" )` | `Revenue = SUM ( orders[revenue] )` |
| Created with | Table tools → New column | Home → New measure |

**Rule of thumb:** if it goes in the **Values** well, make it a measure. If it goes on an **axis, in rows or in a slicer**, it's a column.

### Filter context

![A matrix of revenue by region and year. The Lagos 2026 cell has the filters region = Lagos from its row and Year = 2026 from its column. Only the 715 order lines matching both are kept, and SUM of revenue over them gives ₦152,768,595.](/images/courses/powerbi/filter-context.svg "Each cell of a visual evaluates the measure under its own filters: its filter context.")

A measure has no fixed answer. In a matrix of revenue by region and year, the measure `Revenue` is calculated once **per cell**, each time with different filters:

- the **row** adds a filter (region = Lagos);
- the **column** adds a filter (Year = 2026);
- **slicers**, **page filters** and **report filters** add more;
- the **total** row has fewer filters, so it covers more data.

Together these are the cell's **filter context**. Power BI keeps only the rows of `orders` that match, then runs the measure on them. For the Lagos 2026 cell, that's 715 order lines, adding up to ₦152,768,595.

"What is filtered right now?" is the question to ask whenever a DAX number surprises you.

> [!NOTE]
> This is why a measure's total isn't always the sum of the rows above it. The total is calculated in its own, wider filter context. For `SUM`, the two agree; for a ratio or a distinct count, they often don't. A customer who ordered in both years counts once in each year's row, but only once in the total.

### Row context and iterators

A calculated column works **one row at a time**: `orders[quantity]` means "the quantity in this row". That's **row context**.

Functions ending in X (`SUMX`, `AVERAGEX`, `MAXX`, `COUNTX`) are **iterators**: they create a row context inside a measure. They go through a table row by row, evaluate an expression for each row, then combine the results:

```dax
SUMX ( <table>, <expression> )

Revenue = SUMX ( orders, orders[quantity] * orders[unit_price] * ( 1 - orders[discount_pct] / 100 ) )
```

This gives ₦830,541,245 in total, the same as the Power Query `revenue` column plus `SUM`, without storing the column. `SUM ( orders[revenue] )` is really shorthand for `SUMX ( orders, orders[revenue] )`.

### The core functions

**Aggregations**: summarise a column over the current filter context.

| Function | Returns | Kolanut, all dates |
| :-- | :-- | --: |
| `SUM ( orders[revenue] )` | Total | 830,541,245 |
| `AVERAGE ( orders[revenue] )` | Mean | 194,688.52 |
| `MIN ( orders[revenue] )` / `MAX ( … )` | Smallest / largest | 3,420 / 713,400 |
| `COUNTROWS ( orders )` | Number of rows in a table | 4,266 |
| `DISTINCTCOUNT ( orders[customer_id] )` | Number of different values | 90 |

**Safe division**:

```dax
DIVIDE ( <numerator>, <denominator> [, <alternate result>] )
```

`DIVIDE ( [Revenue], [Order Lines] )` returns blank instead of an error when the denominator is 0 or blank. Use it instead of `/` for every ratio; a visual full of errors because one month had no orders is worse than a blank cell.

**Logic**:

```dax
IF ( <test>, <value if true> [, <value if false>] )
SWITCH ( TRUE (), <test1>, <value1>, <test2>, <value2>, …, <else> )
```

```dax
Size Band =
SWITCH (
    TRUE (),
    orders[quantity] >= 20, "Large",
    orders[quantity] >= 10, "Medium",
    "Small"
)
```

`SWITCH ( TRUE (), … )` works like Excel's `IFS`: it returns the value for the first test that's true. As a calculated column on `orders`, it gives 1,032 Large, 1,777 Medium and 1,457 Small lines.

**Relationships**:

| Function | Used in | Does |
| :-- | :-- | :-- |
| `RELATED ( products[category] )` | A calculated column on the **many** side | Fetches the matching value from the one side, like XLOOKUP |
| `RELATEDTABLE ( orders )` | A calculated column on the **one** side | Returns the matching rows from the many side |

For example, a calculated column on `customers`: `Order Lines = COUNTROWS ( RELATEDTABLE ( orders ) )` gives each customer's number of order lines.

### Variables

Long measures are easier to read with **variables**. `VAR` names an intermediate result; `RETURN` gives the answer:

```dax
Avg Revenue per Line =
VAR TotalRevenue = SUM ( orders[revenue] )
VAR Lines = COUNTROWS ( orders )
RETURN
    DIVIDE ( TotalRevenue, Lines )
```

Each variable is calculated once, so variables can also make measures faster.

### Formatting and organising measures

- Set each measure's format once (**Measure tools → Format**): whole number with separators for counts, currency for money, percentage for ratios.
- Keep measures together in a dedicated table (the walkthrough shows how).
- Name them as a reader would: `Revenue`, `Order Lines`, `Active Customers`. Avoid `Measure 1`.

## Example

Four measures every sales report needs:

```dax
Revenue = SUM ( orders[revenue] )

Order Lines = COUNTROWS ( orders )

Active Customers = DISTINCTCOUNT ( orders[customer_id] )

Avg Revenue per Line = DIVIDE ( [Revenue], [Order Lines] )
```

Notice the last one uses the others: measures build on measures. Change `Revenue` once and everything using it follows.

In a matrix with `Date[Year]` in Rows, 2025 shows:

| Measure | 2025 |
| :-- | --: |
| Revenue | 539,810,790 |
| Order Lines | 2,832 |
| Active Customers | 81 |
| Avg Revenue per Line | 190,611 |

The 2026 row is yours to find in the practice. Note that `Active Customers` for the two years together is 90, not 81 plus the 2026 figure: customers who ordered in both years are counted once in the total.

A calculated column using a relationship:

```dax
Category = RELATED ( products[category] )
```

## Walkthrough

1. Create a table for your measures: **Home → Enter data**, name it `_Measures`, load it with its one empty column. (The underscore keeps it at the top of the Data pane.)
2. Select `_Measures`, then **Home → New measure**, and type the `Revenue` measure in the formula bar. Press Enter.

   ![Power BI Desktop with a DAX measure being written in the formula bar under the Measure tools ribbon, and the new measure listed in the Data pane.](/images/courses/powerbi/dax-measure.webp "Writing a measure: the formula bar (1) opens under the Measure tools tab (2), and the measure appears in the Data pane with a calculator icon (3).")

   > [!WARNING]
   > A measure can't share its name with a column in the same table, and names ignore capital letters. Create `Revenue` in the **orders** table, which already has a `revenue` column, and Power BI refuses:
   >
   > ![A Power BI dialog titled Rename measure saying the name Revenue is already used for a column on table orders.](/images/courses/powerbi/name-clash.webp "The error (1) for the formula in the bar (2).")
   >
   > That's one reason to keep measures in their own `_Measures` table. If you do create a measure in a data table, give it a different name, such as `Total Revenue`.
3. Add `Order Lines`, `Active Customers` and `Avg Revenue per Line` the same way.
4. Format them: select a measure → Measure tools → set format (Whole number with thousands separator for counts; currency for revenue).
5. Build a Matrix with `Date[Year]` in Rows and all four measures in Values. Each number is calculated for its year: that's filter context at work. Check the 2025 row against the table above.
6. Add `customers[region]` to Rows under Year. Each number changes again: now two filters apply to every cell.
7. Delete the empty column in `_Measures`; the table becomes a measure folder.

### Summary

| Term | Meaning |
| :-- | :-- |
| Calculated column | Calculated per row, stored; for grouping and filtering |
| Measure | Calculated per cell, on the fly; for numbers in Values |
| Filter context | The filters a cell brings: rows, columns, slicers, page filters |
| Row context | "This row", in a calculated column or an X function |
| `SUMX` and friends | Evaluate an expression per row, then aggregate |
| `DIVIDE` | Division that returns blank instead of an error |
| `RELATED` | Fetch a value from the one side of a relationship |
| `VAR` … `RETURN` | Name intermediate results in a long formula |

## Practice

```answer
{
  "id": "pbi-08-p1",
  "prompt": "What is **Avg Revenue per Line** for **2026** (January–June)? (A rounded figure is fine.)",
  "answer": 202741,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(AVG(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders WHERE order_date >= '2026-01-01'",
  "hint": "Your matrix with Date[Year] in Rows shows it in the 2026 row.",
  "explanation": "₦202,741, up from 2025, mostly because of the January price rise.",
  "required": true
}
```

```answer
{
  "id": "pbi-08-p2",
  "prompt": "How many **order lines** were there in **Q1 2026** (January–March)?",
  "answer": 695,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'",
  "hint": "The Order Lines measure in a matrix with Date[Year] and Date[Quarter] in Rows.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-08-d1",
  "prompt": "Write a measure `Total Quantity = SUM(orders[quantity])`. How many packs were sold in **2026**?",
  "answer": 19630,
  "format": "number",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT SUM(quantity) FROM orders WHERE order_date >= '2026-01-01'",
  "hint": "Card with the measure, sliced to 2026 by your date table.",
  "required": false
}
```

```answer
{
  "id": "pbi-08-d2",
  "prompt": "In the HR data, write `Avg Salary = AVERAGE(employees[monthly_salary])`. What is it for **Managers** (job_level)? Round to the nearest naira.",
  "answer": 1403000,
  "format": "naira",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT ROUND(AVG(monthly_salary)) FROM employees WHERE job_level = 'Manager'",
  "hint": "Put job_level in a table next to the measure.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You want to show 'Revenue per active customer' in a card. Should it be a calculated column or a measure?",
    "options": ["Calculated column", "Measure", "Either, they're identical", "Neither"],
    "answer": 1,
    "explanation": "It's an aggregate ratio that must respond to filters, so it's a measure."
  },
  {
    "prompt": "Why use DIVIDE([A], [B]) instead of [A] / [B]?",
    "options": ["It's faster to type", "It returns blank instead of an error when B is zero", "It rounds the result", "It only works on integers"],
    "answer": 1,
    "explanation": "DIVIDE handles division by zero gracefully."
  },
  {
    "prompt": "In a table with one row per region, the Revenue measure shows a different number on each row. Why?",
    "options": ["Each row filters the measure to its own region", "The measure is broken", "Each row uses a different measure", "The numbers are random"],
    "answer": 0,
    "explanation": "A measure is recalculated for each row's filter. That's called filter context."
  }
]
```
