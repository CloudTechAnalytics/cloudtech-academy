---
title: Sorting and filtering
minutes: 25
summary: Find the rows that matter with multi-level sorts, filters, SUBTOTAL and the FILTER function.
---

## The problem

A sales manager asks three quick questions: *What was our single biggest order line? How many lines got the full 10% discount? How busy was December?* Each answer is buried somewhere in 4,266 rows. Sorting and filtering bring the right rows to the top.

## The concept

**Sorting** reorders rows. **Data → Sort** lets you sort by several columns in turn: region A→Z, then within each region, revenue largest first (use **Add Level**).

**Filtering** hides rows that don't match, without deleting them. Turn filters on with **Ctrl + Shift + L** (Tables have them already). Each column's drop-down offers:

- tick-boxes for specific values;
- **Number Filters** (Greater Than, Top 10…);
- **Date Filters** (This Month, Between…), and dates grouped by year and month in the list.

**Counting what you see.** `SUM` and `COUNT` include hidden rows. `SUBTOTAL` ignores rows hidden by a filter:

```excel
=SUBTOTAL(9, Orders[revenue])
```

The first argument picks the calculation: 9 = sum, 3 = count of non-empty cells, 1 = average. A Table's **Total Row** (Table Design → Total Row) uses `SUBTOTAL` automatically.

**The FILTER function** (Excel 365/2021 and Google Sheets) returns matching rows as a new range, so your original data stays untouched:

```excel
=FILTER(Orders, Orders[discount_pct]=10, "none")
```

> [!WARNING]
> Sort the **whole table**, never a single column. Sorting one column alone scrambles your data: quantities end up next to the wrong orders. Inside a Table, sorting from a column's drop-down always moves whole rows, which is another reason to use Tables.

## Example

To find the biggest single order line: click the `revenue` drop-down → **Sort Largest to Smallest**. The top row is order line **14243**: 29 packs of Body lotion 400ml at ₦24,600 on 27 June 2026, worth ₦713,400.

## Walkthrough

This is what filtering `discount_pct` to 10 looks like:

![The discount_pct filter drop-down open, with only 10 ticked; the status bar reads 525 of 4266 records found.](/images/courses/excel/filter-dropdown.webp "Filtering discount_pct to 10. The row numbers turn blue and skip, a sign that rows are hidden.")

1. **The filter button** on the column header. Once a filter is on, it shows a funnel icon.
2. **Number Filters**: conditions like *Greater Than* or *Top 10*. Text columns show *Text Filters*; date columns show *Date Filters*.
3. **The value list**: tick the values to keep. Use the search box above it for long lists.
4. **The status bar** reports the result: **525 of 4266 records found**.

**How many lines had a 10% discount?**

1. Click the `discount_pct` drop-down, untick *Select All*, tick **10**, OK.
2. The status bar at the bottom of the window shows *"X of 4266 records found"*. Or turn on the Table's **Total Row** and set the `order_id` total to **Count**.
3. Clear the filter afterwards: **Data → Clear**.

**How many lines in December 2025?**

1. Open the `order_date` drop-down. Dates are grouped: expand **2025**, untick everything except **December**.
2. Read the count the same way.

**Shortcuts for sorting and filtering**

| Keys | Does |
| :-- | :-- |
| Ctrl + Shift + L | Filters on / off |
| Alt + ↓ (on a header cell) | Open that column's filter drop-down |
| Alt, A, S, S | Open the Sort dialog |
| Alt, A, C | Clear all filters |

## Practice

```answer
{
  "id": "xls-03-p1",
  "prompt": "How many order lines received a **10%** discount?",
  "answer": 525,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE discount_pct = 10",
  "hint": "Filter discount_pct to 10 and read the count in the status bar or Total Row.",
  "required": true
}
```

```answer
{
  "id": "xls-03-p2",
  "prompt": "How many order lines were placed in **December 2025**?",
  "answer": 334,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE order_date BETWEEN '2025-12-01' AND '2025-12-31'",
  "hint": "Use the date groups in the order_date filter: 2025 → December.",
  "explanation": "334 lines, the busiest month in the data by far. Other months range from about 190 to 265.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "xls-03-c1",
  "prompt": "What is the revenue of the **second** largest order line, in naira?",
  "answer": 699000,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT quantity * unit_price * (1 - discount_pct / 100.0) AS r FROM orders ORDER BY r DESC LIMIT 1 OFFSET 1",
  "hint": "Sort revenue largest to smallest and read row 3 (row 2 is the largest). Or use =LARGE(Orders[revenue], 2).",
  "explanation": "₦699,000: 30 packs of detergent at ₦23,300 on 28 February 2026.",
  "required": false
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "xls-03-d1",
  "prompt": "In the HR `employees.csv`, how many employees in the **IT** department are still **Active**?",
  "answer": 11,
  "format": "number",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT COUNT(*) FROM employees WHERE department = 'IT' AND status = 'Active'",
  "hint": "Filter department to IT and status to Active, then read the count in the status bar.",
  "required": false
}
```

```answer
{
  "id": "xls-03-d2",
  "prompt": "Sort the HR `employees.csv` by monthly_salary, largest first. What is the **full name** of the highest-paid employee?",
  "answer": "Babatunde Adeyemi",
  "format": "text",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT full_name FROM employees ORDER BY monthly_salary DESC LIMIT 1",
  "hint": "Data → Sort, by monthly_salary, Largest to Smallest.",
  "required": false
}
```

```answer
{
  "id": "xls-03-d3",
  "prompt": "How many order lines for **product 5** were placed in **March 2026**?",
  "answer": 15,
  "format": "number",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT COUNT(*) FROM orders WHERE product_id = 5 AND order_date BETWEEN '2026-03-01' AND '2026-03-31'",
  "hint": "Filter product_id to 5, then use a Date Filter on order_date for March 2026.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You filter to Lagos customers and use =SUM(C2:C500). What does it add up?",
    "options": ["Only the visible Lagos rows", "All rows, including the hidden ones", "Nothing, it returns an error", "Only the first row"],
    "answer": 1,
    "explanation": "SUM ignores filters. Use SUBTOTAL(9, …) to total only visible rows."
  },
  {
    "prompt": "What goes wrong if you select one column and sort it on its own?",
    "options": ["Nothing", "The values in that column no longer line up with the rest of their row", "Excel deletes the column", "The column turns into text"],
    "answer": 1,
    "explanation": "Always sort the whole table so rows stay together."
  },
  {
    "prompt": "What does =FILTER(Orders, Orders[discount_pct]=10) do to the original data?",
    "options": ["Deletes the other rows", "Nothing: it returns a separate list of the matching rows", "Sorts it", "Hides rows"],
    "answer": 1,
    "explanation": "FILTER returns a new, live list and leaves the source untouched."
  }
]
```
