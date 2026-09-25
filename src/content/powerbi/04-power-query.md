---
title: Power Query
minutes: 35
summary: Shape data with Power Query - applied steps, types, custom columns, merges - and profile columns to spot problems.
---

## The problem

The orders table has quantity, price and discount, but no revenue. You could calculate it later in DAX, but a clean, well-typed `revenue` column at the source keeps the model simple. Power Query is where data gets shaped before it reaches the model, and every step you take is recorded, so it runs again on every refresh.

## The concept

**Open it:** Home → **Transform data**. The Power Query Editor shows:

| Area | Purpose |
| :-- | :-- |
| **Queries** pane (left) | One query per table |
| **Preview** (middle) | The data after all steps so far |
| **Applied Steps** (right) | Every change, in order. Click a step to see the data at that point; delete a step to undo it |
| **Formula bar** | The **M** code for the selected step (View → Formula Bar if hidden) |

**Transformations you'll use constantly**

| Task | Where |
| :-- | :-- |
| Rename a column | Double-click its header |
| Change type | Click the type icon at the left of the header |
| Remove columns | Select → Home → Remove Columns |
| Filter rows | Header drop-down |
| Replace values | Transform → Replace Values |
| **Add a calculated column** | **Add Column → Custom Column** |
| **Bring columns from another query** | **Home → Merge Queries** (like XLOOKUP) |
| Stack tables with the same columns | Home → Append Queries |

**Column profiling.** **View → Column quality / Column distribution / Column profile** show valid, error and empty percentages, distinct counts and value frequencies. By default it profiles only the **first 1,000 rows**: click *"Column profiling based on top 1000 rows"* in the status bar and choose the entire data set.

**Close & Apply** (Home) saves your steps and loads the result into the model.

## Example

The revenue custom column, in M:

```m
= Table.AddColumn(#"Changed Type", "revenue", each [quantity] * [unit_price] * (1 - [discount_pct] / 100), type number)
```

You don't have to type that: the Custom Column dialog writes it. In the dialog you only enter:

```m
[quantity] * [unit_price] * (1 - [discount_pct] / 100)
```

## Walkthrough

1. **Home → Transform data**. Select the `orders` query.
2. **View** → tick **Column quality** and **Column distribution**, then switch profiling to the entire data set. All columns should be 100% valid.
3. **Add Column → Custom Column**. Name: `revenue`. Formula: as above. OK.
4. Click the `ABC123` icon on the new column's header → **Decimal Number** (or Fixed decimal number, good for currency).
5. **Merge** the product category in:
   - With `orders` selected, **Home → Merge Queries**.
   - Choose `products` as the second table; click `product_id` in both; Join Kind **Left Outer**. OK.
   - A new column of nested tables appears. Click its expand icon (↔), untick all but `category`, untick *Use original column name as prefix*. OK.
6. Look at **Applied Steps**: each action is a step, in order.
7. **Home → Close & Apply**. Save.

> [!NOTE]
> Merging the category into orders is fine for learning. In lesson 6 you'll see the better approach, keeping `products` as its own table and relating it to `orders`. Both give the same totals.

## Practice

```answer
{
  "id": "pbi-04-p1",
  "prompt": "Add the `revenue` custom column, load it, and show its total in a Card. What is total revenue, to the nearest naira?",
  "answer": 830541245,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders",
  "hint": "Card visual → drag revenue in. To see the exact number, Format visual → Callout value → Display units: None.",
  "required": true
}
```

```answer
{
  "id": "pbi-04-p2",
  "prompt": "After merging `category` into orders, how many **packs** of **Snacks** were sold in total?",
  "answer": 14799,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT SUM(o.quantity) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Snacks'",
  "hint": "Table or card visual with Sum of quantity, filtered to category = Snacks.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What happens to your Power Query steps when the report is refreshed with new data?",
    "options": ["They're lost", "They run again, in order, on the new data", "Only the last step runs", "You must redo them by hand"],
    "answer": 1,
    "explanation": "Applied steps are a recipe that replays on every refresh."
  },
  {
    "prompt": "Column quality shows 100% valid, but only 1,000 rows were profiled. What should you do?",
    "options": ["Nothing", "Switch profiling to the entire data set to check all rows", "Delete rows after 1,000", "Change the column type"],
    "answer": 1,
    "explanation": "Problems in row 3,000 won't show in a 1,000-row profile."
  },
  {
    "prompt": "Which Power Query feature works like XLOOKUP, bringing columns from another table by a matching key?",
    "options": ["Append Queries", "Merge Queries", "Replace Values", "Group By"],
    "answer": 1,
    "explanation": "Merge joins two queries on matching columns."
  }
]
```
