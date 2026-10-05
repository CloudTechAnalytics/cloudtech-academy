---
title: Excel for analysts
minutes: 20
summary: Why Excel is still where most analysis happens, the parts of the screen you'll use, and the shortcuts that save hours.
---

## The problem

Kolanut Distribution's sales team lives in Excel. Every report the managing director reads started as a spreadsheet. Analysts who move around Excel slowly (scrolling, clicking through menus, retyping) spend their day on mechanics instead of answers.

This course takes you from opening a raw file to a finished analysis. First, the ground rules for working in Excel like an analyst.

## The concept

**Why Excel?** It's on almost every office computer, everyone can open your file, and it covers the full cycle: import, clean, calculate, summarise, chart. Larger data goes into databases and Power BI, but Excel stays the everyday tool.

### Workbooks, worksheets, cells and ranges

Four words you'll use in every lesson:

| Word | Means | Example |
| :-- | :-- | :-- |
| **Workbook** | The Excel file itself (`.xlsx`) | `Kolanut-sales.xlsx` |
| **Worksheet** (sheet) | One page of the workbook, with its own grid | `Orders`, `Customers` |
| **Cell** | One box in the grid, named by its column letter and row number | `B2` is column B, row 2 |
| **Range** | A block of cells, written first cell : last cell | `A1:H4267` |

Columns are lettered A, B, C … Z, then AA, AB and so on, up to XFD (16,384 columns). Rows are numbered 1 to 1,048,576. That limit, about a million rows, is one reason very large data moves to a database.

### What can go in a cell

| Type | Example | Excel aligns it | Notes |
| :-- | :-- | :-- | :-- |
| **Number** | `18600` | Right | Can be calculated with |
| **Text** | `Kayode Distributors` | Left | Includes "numbers" Excel couldn't read, such as `₦18,600` |
| **Date** | `2025-01-01` | Right | Stored as a number of days, shown as a date |
| **Formula** | `=E2*F2` | (its result) | Starts with `=`; the cell shows the result |

The alignment is a free check: if a column of numbers has some values sitting on the **left**, those are text, and `SUM` will skip them. You'll use this check in lessons 2 and 7.

> [!NOTE]
> **Value versus format.** A cell's *value* is what's stored; its *format* is how it's shown. `0.25` formatted as a percentage shows `25%`; `194688.52` formatted with no decimals shows `194,689`. The formula bar always shows the true value.

### Ranges versus Tables

A plain **range** is just cells. A **Table** (Insert → Table, or Ctrl + T) is a range that Excel knows is a dataset:

| | Plain range | Table |
| :-- | :-- | :-- |
| Grows when you add rows | No | Yes |
| Filter buttons on the headers | Only if you turn them on | Always |
| Formulas fill down a new column | No | Yes, automatically |
| Readable references | `E2:E4267` | `Orders[quantity]` |
| Banded rows | No | Yes |

This course turns every dataset into a Table first. It's the habit that saves the most mistakes later.

### The Excel window

This is Excel with Kolanut's orders loaded as a Table, exactly as you'll set it up in this course:

![The Excel window with Kolanut's orders table open. Numbered boxes mark the file name, ribbon tabs, ribbon, Name Box, formula bar, table headers, sheet tabs and status bar.](/images/courses/excel/excel-window.webp "Excel for Microsoft 365 with the Orders table. This computer uses Excel's dark theme; yours may be white or grey, but everything is in the same place.")

1. **File name.** The workbook you're in (`Kolanut-sales`). Click it to rename the file or see where it's saved.
2. **Ribbon tabs.** Home, Insert, Formulas, **Data** (import, sort, filter, remove duplicates), View… Extra tabs such as **Table Design** appear only when you click inside a Table.
3. **The ribbon.** The commands for the selected tab, in labelled groups.
4. **Name Box.** Shows the selected cell (`H2`). Type an address like `A4000` and press Enter to jump there.
5. **Formula bar.** Shows what's really in the selected cell. Here `H2` holds a formula, not a typed number: the revenue calculation you'll write in the next lesson.
6. **Table header row** with **filter buttons** (the small arrows). The data is a Table, so every column can be sorted and filtered.
7. **Sheet tabs.** One per worksheet: `Orders`, `Customers`, `Products`. Click to switch, or use Ctrl + Page Up / Page Down.
8. **Status bar.** Shows the mode (`Ready`), and when you select numbers it shows their Sum, Average and Count. Filtered tables report "X of Y records found" here.

**What version?** This course uses Microsoft 365 or Excel 2021 or later, which include `XLOOKUP`, `FILTER` and `UNIQUE`. **Google Sheets** works for almost everything too; where menus differ, we say so.

**Shortcuts worth learning today** (Windows; on a Mac use ⌘ for Ctrl)

| Moving around | |
| :-- | :-- |
| Ctrl + ↓ / ↑ / → / ← | Jump to the edge of the data |
| Ctrl + Home / Ctrl + End | Go to A1 / the last used cell |
| Ctrl + Page Down / Page Up | Next / previous sheet |
| Ctrl + G (or F5) | Go to a cell address |

| Selecting | |
| :-- | :-- |
| Ctrl + Shift + ↓ | Select from here to the last filled cell |
| Ctrl + Space / Shift + Space | Select the whole column / row |
| Ctrl + A | Select the current table or range (press again for the whole sheet) |

| Working with data | |
| :-- | :-- |
| Ctrl + T | Turn a range into a **Table** |
| Ctrl + Shift + L | Turn filters on or off |
| Alt + = | AutoSum |
| F2 | Edit the selected cell |
| F4 (while editing a formula) | Toggle `$` absolute references |
| Ctrl + Z / Ctrl + Y | Undo / redo |

> [!TIP]
> Press and release **Alt**: letters appear over every ribbon tab and command (Excel calls them *KeyTips*). Alt, A opens the Data tab; then F, T starts *From Text/CSV*. Once you know a command's letters, you never need the mouse for it.

## Example

Download Kolanut's three files. You'll use them through the whole course:

```dataset
{ "dataset": "sales" }
```

- `orders.csv`: one row per product on an order (4,266 rows).
- `customers.csv`: one row per customer, with channel, region, city and sales rep.
- `products.csv`: one row per product, with category and **current** list price.

> [!NOTE]
> Kolanut raised prices on 1 January 2026. `products.csv` shows the 2026 list price; each row of `orders.csv` has the price actually charged at the time. That's why orders carry their own `unit_price`.

## Walkthrough

1. Open `customers.csv` in Excel.
2. Click cell A1 and press **Ctrl + ↓**. You land on the last customer. The row number minus one (the header) is the number of customers.
3. Press **Ctrl + →** from A1 to find the last column.
4. Click anywhere in the data and press **Ctrl + T**, confirm *My table has headers*. The data becomes a **Table**: banded rows, filter buttons, and it will grow automatically when you add rows. Most of this course works with Tables.
5. With the Table selected, look at **Table Design → Table Name** and rename it `Customers`. Named tables make formulas readable later.

## Practice

```answer
{
  "id": "xls-01-p1",
  "prompt": "How many customers are in `customers.csv`?",
  "answer": 90,
  "format": "number",
  "dataset": "sales",
  "files": ["customers"],
  "verify": "SELECT COUNT(*) FROM customers",
  "hint": "Ctrl + ↓ from A1, then subtract 1 for the header row.",
  "required": true
}
```

```answer
{
  "id": "xls-01-p2",
  "prompt": "What is the current list price, in naira, of **Bottled water 75cl (12)**?",
  "answer": 4000,
  "format": "naira",
  "dataset": "sales",
  "files": ["products"],
  "verify": "SELECT list_price FROM products WHERE product_name = 'Bottled water 75cl (12)'",
  "hint": "Open products.csv and find the row, or press Ctrl + F and search for 'Bottled water'.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "xls-01-d1",
  "prompt": "Open the HR dataset's `employees.csv`. How many employees does it list?",
  "answer": 80,
  "format": "number",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT COUNT(*) FROM employees",
  "hint": "Click the first empty cell under the data and check the row number, or select a column and read the Count in the status bar (it includes the header).",
  "required": false
}
```

```answer
{
  "id": "xls-01-d2",
  "prompt": "In Kolanut's `products.csv`, how many products are in the **Snacks** category?",
  "answer": 4,
  "format": "number",
  "dataset": "sales",
  "files": [
    "products"
  ],
  "verify": "SELECT COUNT(*) FROM products WHERE category = 'Snacks'",
  "hint": "Turn on a filter (Ctrl + Shift + L) and pick Snacks in the category column.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which shortcut jumps from the top of a column to the last filled cell?",
    "options": ["Ctrl + Home", "Ctrl + ↓", "Shift + ↓", "Alt + ↓"],
    "answer": 1,
    "explanation": "Ctrl + an arrow key jumps to the edge of the data in that direction."
  },
  {
    "prompt": "Why convert a data range into a Table with Ctrl + T?",
    "options": ["It makes the file read-only", "It adds filters, keeps formatting, grows with new rows and lets formulas use column names", "Tables are required for typing", "It deletes duplicates"],
    "answer": 1,
    "explanation": "Tables make the data easier to filter, format and reference."
  },
  {
    "prompt": "Why does each order row carry its own unit_price, when products.csv also has a price?",
    "options": ["It's a mistake", "Prices change over time; the order records the price actually charged", "To make the file bigger", "Excel requires it"],
    "answer": 1,
    "explanation": "The price list shows today's price. Historical orders need the price at the time."
  }
]
```
