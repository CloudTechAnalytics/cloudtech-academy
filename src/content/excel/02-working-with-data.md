---
title: Working with data
minutes: 30
summary: Import a CSV safely, check data types, and add your first calculated column to a Table.
---

## The problem

The managing director wants one number to start: Kolanut's total revenue since January 2025. The orders file has quantity, price and discount on each line, but no revenue column. You'll add one. Before that, the file has to come into Excel correctly.

## The concept

**Two ways to open a CSV**

| Method | What happens | Use when |
| :-- | :-- | :-- |
| Double-click the file | Excel guesses every column's type, instantly | Quick look only |
| **Data → From Text/CSV** | Shows a preview, lets you check types, loads a Table | Real work |

Excel's guesses can go wrong: codes with leading zeros lose them (`007` becomes `7`), long numbers turn into `1.2E+15`, and day-first dates can be read as month-first. Here is what happened when Kolanut's messy customer export was opened by double-clicking:

![Kolanut's customer export opened by double-clicking. Phone numbers have lost their leading zero or show as 2.34915E+12, and the naira sign appears as garbled characters.](/images/courses/excel/csv-double-click.webp "Double-clicking the CSV: real damage, in seconds.")

1. **Phone** lost its leading zero (`08089165939` became `8089165939`), and numbers in international format became `2.34915E+12`. Those digits are gone for good once you save.
2. **Credit Limit** shows `â‚¦2,050,000`: the `₦` sign was read with the wrong text encoding, so the column can't be turned into numbers.

Importing through **Data → From Text/CSV** lets you catch these before they spread.

**Values vs formatting.** A cell's *value* is what's stored; its *format* is how it's shown. `0.19` formatted as a percentage shows `19%`. Formatting never changes the value, so rounding a display to 0 decimals doesn't round the number used in calculations.

**Calculated columns in a Table.** Type a formula once in a Table column and Excel fills it down for every row, using **structured references**: `[@quantity]` means "the quantity in this row".

**Kolanut revenue for one order line:**

```excel
=[@quantity]*[@unit_price]*(1-[@discount_pct]/100)
```

## Example

Order line 10001: 14 packs × ₦18,600 × (1 − 0 ÷ 100) = **₦260,400**.

A 5% discount line of 20 packs at ₦13,200: 20 × 13,200 × (1 − 5 ÷ 100) = 264,000 × 0.95 = **₦250,800**.

## Walkthrough

1. In a new workbook, go to **Data → From Text/CSV** (keyboard: Alt, A, F, T) and choose `orders.csv`. In some versions it's under **Data → Get Data → From File → From Text/CSV**.
2. Excel shows a preview:

   ![The From Text/CSV preview window for orders.csv, with File Origin, Delimiter and Data Type Detection settings above a preview grid, and Load and Transform Data buttons.](/images/courses/excel/import-preview.webp "The import preview. Nothing is loaded until you click Load.")

   1. **File Origin**: the text encoding. For files containing `₦` or other special characters choose **65001: Unicode (UTF-8)**.
   2. **Delimiter**: what separates columns. CSV means **Comma**.
   3. **Data Type Detection**: how Excel decides column types.
   4. **The preview.** Check that `order_date` shows dates and the numbers are numbers (right-aligned). The dates appear in your computer's date format; here, day first.
   5. **Load** puts the data on a new sheet as a Table. **Transform Data** opens Power Query to clean it first.

   Click **Load**.
3. Rename the sheet `Orders` and the Table `Orders` (Table Design → Table Name).
4. In the first empty column to the right, type the header `revenue` in row 1.
5. In row 2 of that column type the formula above and press Enter. Excel fills it down all 4,266 rows.
6. Select the column and format it: **Home → Number → Comma Style**, and reduce decimals to 0.
7. **View → Freeze Panes → Freeze Top Row**, so the headers stay visible as you scroll.

![The Orders table with the new revenue column filled in, and its formula shown in the formula bar.](/images/courses/excel/revenue-column.webp "The revenue column (2), and its formula in the formula bar (1).")

Excel may display the formula as `=[@quantity]*[@[unit_price]]*(1-[@[discount_pct]]/100)`, with extra brackets around column names that contain an underscore. Both forms mean exactly the same thing.

To get the total, click in any empty cell and type:

```excel
=SUM(Orders[revenue])
```

`Orders[revenue]` means "the whole revenue column of the Orders table". It stays correct if rows are added.

> [!TIP]
> Google Sheets: **File → Import → Upload**, choose *Insert new sheet*. Sheets has no Table structured references, so use `=E2*F2*(1-G2/100)` in the first row and double-click the fill handle (the small square at the cell's corner) to fill down.

## Practice

```answer
{
  "id": "xls-02-p1",
  "prompt": "What is Kolanut's **total revenue** across all order lines (January 2025 to June 2026)? (A rounded figure is fine.)",
  "answer": 830541245,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders",
  "hint": "Add the revenue column with =[@quantity]*[@unit_price]*(1-[@discount_pct]/100), then =SUM() the column.",
  "explanation": "₦830,541,245, about ₦830.5 million over 18 months.",
  "required": true
}
```

```answer
{
  "id": "xls-02-p2",
  "prompt": "And **before** discounts? Add a column for gross value (quantity × unit_price) and total it.",
  "answer": 859628300,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price) FROM orders",
  "hint": "=[@quantity]*[@unit_price] in a new column, then SUM it.",
  "explanation": "₦859,628,300. The difference from revenue, about ₦29.1m, is what discounts cost. You'll dig into that in the mini project.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A cell shows 19%, but the value stored in it is 0.1874. What will a formula that uses this cell work with?",
    "options": ["0.1874, the stored value", "19, the displayed number", "0.19", "Nothing, it's text"],
    "answer": 0,
    "explanation": "Formatting only changes how a value looks. Formulas always use the stored value."
  },
  {
    "prompt": "What does [@quantity] mean in a Table formula?",
    "options": ["The total of the quantity column", "The quantity value in the same row", "The first quantity in the table", "A named cell called quantity"],
    "answer": 1,
    "explanation": "The @ means 'this row'."
  },
  {
    "prompt": "Why import CSVs with Data → From Text/CSV rather than double-clicking?",
    "options": ["It's the only way to open CSVs", "You can check and fix column types before the data loads", "It makes the file smaller", "It removes duplicates"],
    "answer": 1,
    "explanation": "Checking types up front prevents silent errors with IDs, long numbers and dates."
  }
]
```
