---
title: XLOOKUP
minutes: 35
summary: Bring columns from one table into another with XLOOKUP, and recognise VLOOKUP and INDEX/MATCH in older files.
---

## The problem

The director asks: *"How much did we sell in Lagos? And how much in Beverages?"* The orders table has `customer_id` and `product_id`, but no region and no category. Those live in `customers.csv` and `products.csv`. You need to bring them across, row by row. That's a **lookup**.

## The concept

**XLOOKUP** finds a value in one column and returns the matching value from another:

```excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
```

- `lookup_value`: what you're looking for (this order's customer_id)
- `lookup_array`: where to look for it (the customer_id column of Customers)
- `return_array`: what to bring back (the region column of Customers)
- `if_not_found`: optional text to show instead of `#N/A`

**Region for each order line:**

```excel
=XLOOKUP([@customer_id], Customers[customer_id], Customers[region], "Not found")
```

XLOOKUP matches **exactly** by default, which is what you want for IDs.

**In older files you'll meet two other methods:**

```excel
=VLOOKUP(C2, Customers!A:H, 4, FALSE)
=INDEX(Customers!D:D, MATCH(C2, Customers!A:A, 0))
```

- **VLOOKUP** needs the ID in the first column and a column *number* (4). Insert a column and the number silently points at the wrong data. Always use `FALSE` for exact match; the default (`TRUE`) returns wrong values on unsorted data.
- **INDEX/MATCH** was the robust choice before XLOOKUP and still works everywhere.

Google Sheets supports XLOOKUP too.

> [!WARNING]
> A lookup returns the **first** match. If the lookup table has duplicate IDs (like the messy customer export in the next lesson), you'll silently get one of them. Always check that the ID column you're looking up in is unique.

## Example

Order line 10001 has `customer_id` 27 and `product_id` 3.

- `XLOOKUP(27, Customers[customer_id], Customers[region])` returns the region of customer 27.
- `XLOOKUP(3, Products[product_id], Products[category])` returns **Beverages** (product 3 is Orange juice 1L).

After the walkthrough below, the Orders table has three looked-up columns:

![The Orders table with new region, channel and category columns filled by XLOOKUP; the formula bar shows the XLOOKUP for region.](/images/courses/excel/xlookup.webp "XLOOKUP in the formula bar (1) and the three new columns it fills (2). None says Not found, so every ID matched.")

## Walkthrough

1. Load `customers.csv` and `products.csv` into the same workbook as Tables named `Customers` and `Products` (Data → From Text/CSV, as in lesson 2).
2. In the Orders table, add a column `region`:
   `=XLOOKUP([@customer_id], Customers[customer_id], Customers[region], "Not found")`
3. Add a column `category`:
   `=XLOOKUP([@product_id], Products[product_id], Products[category], "Not found")`
4. Filter each new column for "Not found". There should be none; if there are, some IDs don't match.
5. Now combine with SUMIFS from the last lesson:
   `=SUMIFS(Orders[revenue], Orders[region], "Lagos")`

## Practice

```answer
{
  "id": "xls-06-p1",
  "prompt": "What is Kolanut's total revenue from customers in the **Lagos** region, to the nearest naira?",
  "answer": 411162300,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'Lagos'",
  "hint": "Add a region column with XLOOKUP, then =SUMIFS(Orders[revenue], Orders[region], \"Lagos\").",
  "explanation": "₦411.2m, just under half of all revenue.",
  "required": true
}
```

```answer
{
  "id": "xls-06-p2",
  "prompt": "What is total revenue from the **Beverages** category, to the nearest naira?",
  "answer": 224612360,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Beverages'",
  "hint": "Add a category column with XLOOKUP from Products, then SUMIFS on it.",
  "required": true
}
```

```answer
{
  "id": "xls-06-p3",
  "prompt": "What is the name of customer **42**?",
  "answer": "Divine Superstore Uyo",
  "format": "text",
  "dataset": "sales",
  "files": ["customers"],
  "verify": "SELECT customer_name FROM customers WHERE customer_id = 42",
  "hint": "=XLOOKUP(42, Customers[customer_id], Customers[customer_name])",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In =XLOOKUP(A2, Products[product_id], Products[category]), what is Products[category]?",
    "options": ["What we're looking for", "Where we search", "What we bring back", "The value if not found"],
    "answer": 2,
    "explanation": "The third argument is the return array."
  },
  {
    "prompt": "Why is VLOOKUP(C2, Customers!A:H, 4, FALSE) fragile?",
    "options": ["It can't match text", "If someone inserts a column in the lookup table, 4 points at the wrong column", "FALSE makes it slow", "It only works on numbers"],
    "answer": 1,
    "explanation": "The column number is hard-coded. XLOOKUP and INDEX/MATCH refer to the column itself."
  },
  {
    "prompt": "A lookup shows #N/A for some rows. What does it mean?",
    "options": ["The formula is misspelled", "The value wasn't found in the lookup column", "Division by zero", "The file is too large"],
    "answer": 1,
    "explanation": "#N/A is 'not available': no match. Check for extra spaces, text vs number IDs, or missing records."
  }
]
```
