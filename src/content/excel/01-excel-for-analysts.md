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

**The parts you'll use**

| Part | What it is |
| :-- | :-- |
| **Workbook** | The file (`.xlsx`). |
| **Worksheet** | A tab inside the workbook. Keep raw data, calculations and results on separate sheets. |
| **Cell** | One box, named by column and row: `C5`. |
| **Formula bar** | Shows what's really in a cell: a value or a formula. |
| **Name Box** | Left of the formula bar. Shows the current cell; type `A4000` there and press Enter to jump. |
| **Ribbon** | The tabs at the top: Home, Insert, Data, Formulas… |

**What version?** This course uses Microsoft 365 or Excel 2021 or later, which include `XLOOKUP`, `FILTER` and `UNIQUE`. **Google Sheets** works for almost everything too; where menus differ, we say so.

**Shortcuts worth learning today** (Windows; on a Mac use Cmd for Ctrl)

| Shortcut | Does |
| :-- | :-- |
| Ctrl + ↓ / ↑ / → / ← | Jump to the edge of the data |
| Ctrl + Shift + ↓ | Select from here to the last filled cell |
| Ctrl + T | Turn a range into a **Table** |
| Ctrl + Shift + L | Turn filters on or off |
| Alt + = | AutoSum |
| F4 (while editing a formula) | Toggle `$` absolute references |
| Ctrl + Z | Undo, your best friend |

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
