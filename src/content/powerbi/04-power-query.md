---
title: Power Query
minutes: 20
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

### Merge and append

Two transformations combine queries, and they're easy to mix up:

![On the left, merge: orders and products are matched on product_id, and the merged orders table gains a category column. On the right, append: January and February order tables with the same columns are stacked into one table of 400 rows.](/images/courses/powerbi/merge-append.svg "Merge adds columns by matching a key. Append adds rows from tables with the same columns.")

| | Merge | Append |
| :-- | :-- | :-- |
| Adds | **Columns** from another table | **Rows** from another table |
| Matches on | A key column in both tables | Column names |
| Like | XLOOKUP, SQL `JOIN` | Copy-pasting one list under another, SQL `UNION ALL` |
| Kolanut use | Bring `category` into orders | Combine monthly order files into one |

A merge asks for a **join kind**. The ones you'll use:

| Join kind | Keeps | Use for |
| :-- | :-- | :-- |
| **Left outer** (the default) | Every row of the first table, with matches from the second where they exist | Adding details: every order, with its product's category |
| **Inner** | Only rows that match in both | Keeping only orders for products in a list |
| **Left anti** | Rows of the first table with **no** match | Finding problems: orders whose product_id isn't in products |

A **left anti** merge is a quick data-quality check: if it returns any rows, some orders point to products that don't exist.

### How Power Query records your work

Every click becomes a step written in **M**, Power Query's language. You rarely type M, but reading it helps:

```m
= Table.AddColumn(#"Changed Type", "revenue", each [quantity] * [unit_price] * (1 - [discount_pct] / 100), type number)
```

| Piece | Means |
| :-- | :-- |
| `Table.AddColumn` | The function: add a column to a table |
| `#"Changed Type"` | The input: the result of the previous step, by its name |
| `"revenue"` | The new column's name |
| `each [quantity] * …` | The formula, worked out for **each** row |
| `type number` | The new column's type |

Each step takes the previous step's result and passes its own result on, like a recipe. That's why order matters: delete or move a step and every step after it may break.

### Good habits with steps

1. **Set types early**, straight after loading, and check them: a number column typed as text causes problems in every step after.
2. **Rename steps** that matter (right-click → Rename): `Added revenue` is clearer than `Added Custom` six months later.
3. **Remove columns you don't need**, early. Smaller tables load faster.
4. **Don't edit in Excel first.** Do every change in Power Query, so it repeats on the next refresh instead of being lost.
5. **Check after each important step**: row counts in the status bar, column quality at 100% valid.

**Close & Apply** (Home) saves your steps and loads the result into the model.

This is the Power Query Editor with Kolanut's three queries:

![The Power Query Editor showing the Queries pane, the formula bar with M code, column quality bars, the Applied Steps list and the status bar.](/images/courses/powerbi/power-query-editor.webp "The Power Query Editor.")

1. **Queries pane**: one query per table.
2. **Formula bar**: the M code for the selected step.
3. **Column quality**: Valid, Error and Empty percentages for each column.
4. **Applied Steps**: every change, in order.
5. **Status bar**: *Column profiling based on top 1000 rows*. Click it to profile the whole table.
6. **The ribbon**: Home, Transform and **Add Column** hold the transformations.

## Example

The revenue custom column shown above is exactly what the Custom Column dialog writes for you. In the dialog you only enter:

```m
[quantity] * [unit_price] * (1 - [discount_pct] / 100)
```

## Walkthrough

1. **Home → Transform data**. Select the `orders` query.
2. **View** → tick **Column quality** and **Column distribution**, then switch profiling to the entire data set. All columns should be 100% valid.
3. **Add Column → Custom Column**. Name: `revenue`. Formula: as above. OK.

   ![The Custom Column dialog with the name revenue and the formula quantity times unit_price times one minus discount_pct over 100, and the message No syntax errors have been detected.](/images/courses/powerbi/custom-column.webp "The Custom Column dialog: name (1), formula (2), the column list you can double-click to insert names (3), and the syntax check (4).")

4. Click the `ABC123` icon on the new column's header → **Decimal Number** (or Fixed decimal number, good for currency). The result:

   ![The orders query with the new revenue column typed as a decimal number, the Table.AddColumn formula in the formula bar and Added Custom in Applied Steps.](/images/courses/powerbi/added-custom.webp "The new step's M code (1), the revenue column (2), and the two new Applied Steps (3): Added Custom, then Changed Type1 for the type change.")
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
  "prompt": "Add the `revenue` custom column, load it, and show its total in a Card. What is total revenue? (A rounded figure is fine.)",
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


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-04-d1",
  "prompt": "In Power Query, merge `category` from products into orders. What is total revenue from **Personal care**?",
  "answer": 235483370,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "products"
  ],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Personal care'",
  "hint": "Merge Queries on product_id, expand category, then filter it in a visual.",
  "required": false
}
```

```answer
{
  "id": "pbi-04-d2",
  "prompt": "In Power Query, filter the HR `leave.csv` to **approved = Yes** only. How many leave **days** remain in total?",
  "answer": 570,
  "format": "number",
  "dataset": "hr",
  "files": [
    "leave"
  ],
  "verify": "SELECT SUM(days) FROM leave WHERE approved = 'Yes'",
  "hint": "Filter the approved column in Power Query, Close & Apply, then a Card with Sum of days.",
  "required": false
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
