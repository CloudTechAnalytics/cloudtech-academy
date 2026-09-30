---
title: Types of data
minutes: 25
summary: Structured and unstructured data, numbers and categories, and the most important question about any table - what does one row mean?
---

## The problem

You open Kolanut's `orders.csv` for the first time. Some columns hold numbers you can add up (`quantity`). Some hold numbers you must *never* add up (`customer_id`). Some hold dates. Before you calculate anything, you need to know what kind of data each column is, and what a single row stands for.

## The concept

**Structured vs unstructured**

- **Structured data** fits in rows and columns with a fixed meaning: orders, invoices, attendance records. This course works with structured data.
- **Unstructured data** has no fixed layout: emails, WhatsApp messages, scanned contracts, photos. It holds value too, but needs other techniques to analyse.

**Quantitative vs qualitative**

| Type | What it is | Examples |
| :-- | :-- | :-- |
| **Quantitative, discrete** | Counts: whole numbers | Quantity ordered, number of staff |
| **Quantitative, continuous** | Measurements: can take any value | Weight in kg, revenue in naira |
| **Qualitative, nominal** | Categories with no order | Region, product category, payment method |
| **Qualitative, ordinal** | Categories with an order | Job level (Junior < Mid < Senior), rating (Poor, Fair, Good) |

**Identifiers look like numbers but aren't.** `customer_id` 42 is not "twice" customer 21. Adding or averaging IDs is meaningless. Treat them as labels.

**Dates and times** deserve their own type. They let you group by month, measure time between events, and compare periods.

**Grain: what one row represents**

The *grain* of a table is the answer to "one row = one what?". In Kolanut's data:

| File | One row is |
| :-- | :-- |
| `orders.csv` | one product on one order (an order line) |
| `customers.csv` | one customer |
| `products.csv` | one product |

Getting the grain wrong causes real errors. If you think each row in `orders.csv` is a whole order and count rows to get "number of orders", you'll count some orders more than once whenever a shop buys several products on the same day.

## Example

The first rows of `orders.csv`:

| order_id | order_date | customer_id | product_id | quantity | unit_price | discount_pct |
| --: | :-- | --: | --: | --: | --: | --: |
| 10001 | 2025-01-01 | 27 | 3 | 14 | 18600 | 0 |
| 10002 | 2025-01-01 | 56 | 1 | 7 | 13200 | 0 |
| 10003 | 2025-01-01 | 37 | 2 | 4 | 3600 | 0 |

- `order_id`, `customer_id`, `product_id`: identifiers (labels, not quantities).
- `order_date`: a date.
- `quantity`: quantitative, discrete.
- `unit_price`: quantitative, the price actually charged for one unit (one pack).
- `discount_pct`: quantitative, the percentage taken off this line: 0, 5 or 10.

Reading the first row: order line 10001 was **14 packs of product 3 at ₦18,600 a pack**, with no discount.

```dataset
{ "dataset": "sales", "files": ["orders", "customers", "products"] }
```

## Walkthrough

Open `orders.csv` in Google Sheets (File → Import → Upload) or Excel (File → Open).

1. Look at the header row. Each column name tells you what the column holds.
2. Press **Ctrl + ↓** (Cmd + ↓ on a Mac) in column A to jump to the last row. The row number tells you how many rows there are. Remember that row 1 is the header.
3. For each column, decide: identifier, number, category or date?
4. Ask the grain question: what does one row stand for?

> [!WARNING]
> Spreadsheet programs sometimes guess types wrongly: a date read as text, or a long ID shown as `1.23E+15`. When a column looks strange, check its type before you trust any calculation on it.

## Practice

```answer
{
  "id": "daf-03-p1",
  "prompt": "How many order lines (data rows, not counting the header) are in `orders.csv`?",
  "answer": 4266,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders",
  "hint": "Jump to the last row with Ctrl + ↓. The last row number minus 1 (the header) is the number of data rows.",
  "explanation": "4,266 order lines covering January 2025 to June 2026.",
  "required": true
}
```

```answer
{
  "id": "daf-03-p2",
  "prompt": "How many different products does Kolanut sell? (Look in `products.csv`.)",
  "answer": 16,
  "format": "number",
  "dataset": "sales",
  "files": ["products"],
  "verify": "SELECT COUNT(*) FROM products",
  "hint": "One row in products.csv is one product.",
  "explanation": "16 products in four categories: Beverages, Snacks, Household and Personal care.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which column is ordinal: categories that have a natural order?",
    "options": ["Region", "Job level (Junior, Mid, Senior, Manager)", "Monthly salary", "Employee ID"],
    "answer": 1,
    "explanation": "Job levels are categories that go in order. Regions have no order, and salary and IDs aren't categories."
  },
  {
    "prompt": "What is wrong with averaging the customer_id column?",
    "options": ["Nothing, it's a number", "IDs are labels, so their average has no meaning", "Averages only work on dates", "It would be too slow"],
    "answer": 1,
    "explanation": "An ID identifies a thing. Arithmetic on identifiers produces meaningless numbers."
  },
  {
    "prompt": "In orders.csv one row is one product on one order. A shop buys three products on the same day. How many rows does that create?",
    "options": ["One", "Three", "It depends on the quantity", "None"],
    "answer": 1,
    "explanation": "Each product on the order gets its own row: that's the grain of the table."
  }
]
```
