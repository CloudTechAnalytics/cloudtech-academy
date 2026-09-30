---
title: DAX fundamentals
minutes: 40
summary: The difference between calculated columns and measures, how filter context works, and the core DAX functions.
---

## The problem

Dragging `revenue` into a visual gives "Sum of revenue", which is fine until you need an average per order line, a count of active customers, or a percentage of the total. Those need **DAX** (Data Analysis Expressions), Power BI's formula language. DAX looks like Excel, but it thinks in **columns and filters**, not cells.

## The concept

**Calculated columns vs measures**

| | Calculated column | Measure |
| :-- | :-- | :-- |
| Calculated | Once per row, when data refreshes | On the fly, for whatever the visual is showing |
| Stored | In the table (uses memory) | Not stored |
| Use for | A value you'll filter or group by (size band, age group) | Numbers you aggregate: totals, averages, ratios |
| Example | `Size = IF(orders[quantity] >= 20, "Large", "Small")` | `Revenue = SUM(orders[revenue])` |

**Rule of thumb:** if it goes in the **Values** well, make it a measure.

**Filter context.** A measure has no fixed answer. In a table of revenue by region, the measure `Revenue` is calculated once per row, each time *filtered* to that region. Slicers, page filters and visual filters add to the context. Understanding "what is filtered right now?" is most of understanding DAX.

**Row context.** Calculated columns, and *iterator* functions ending in X (`SUMX`, `AVERAGEX`), work row by row. `SUMX` evaluates an expression for each row of a table, then adds the results:

```dax
Revenue = SUMX ( orders, orders[quantity] * orders[unit_price] * ( 1 - orders[discount_pct] / 100 ) )
```

This gives the same result as the Power Query `revenue` column plus `SUM`, without storing the column.

**Core functions**

| Function | Returns |
| :-- | :-- |
| `SUM(col)`, `AVERAGE(col)`, `MIN`, `MAX` | Aggregates over the current filter context |
| `COUNTROWS(table)` | Number of rows |
| `DISTINCTCOUNT(col)` | Number of different values |
| `DIVIDE(a, b)` | a ÷ b, returning blank instead of an error when b is 0 |
| `RELATED(col)` | In a calculated column on the many side, the matching value from the one side |
| `IF`, `SWITCH` | Conditional logic |

## Example

Four measures every sales report needs:

```dax
Revenue = SUM ( orders[revenue] )

Order Lines = COUNTROWS ( orders )

Active Customers = DISTINCTCOUNT ( orders[customer_id] )

Avg Revenue per Line = DIVIDE ( [Revenue], [Order Lines] )
```

Notice the last one uses the others: measures build on measures. Change `Revenue` once and everything using it follows.

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
5. Build a Matrix with `Date[Year]` in Rows and all four measures in Values. Each number is calculated for its year: that's filter context at work.
6. Delete the empty column in `_Measures`; the table becomes a measure folder.

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
    "prompt": "In a table visual with one row per region, how many times is the Revenue measure calculated?",
    "options": ["Once for the whole table", "Once per row (region), plus once for the total", "Never, it's stored", "Once per order line"],
    "answer": 1,
    "explanation": "Each cell has its own filter context, and the total row has the unfiltered one."
  }
]
```
