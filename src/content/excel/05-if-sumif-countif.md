---
title: IF, SUMIF and COUNTIF
minutes: 30
summary: Make decisions with IF, AND, OR and IFS, then count, total and average only the rows you want with COUNTIFS, SUMIFS, AVERAGEIFS and MAXIFS, step by step.
---

## The problem

Filtering answers one question at a time. But the sales director wants a table: revenue by product, lines by month, discounted lines this year. Rebuilding filters for every cell would take all day. **Conditional functions** calculate totals and counts for rows that meet a condition, directly in a formula.

## The concept

Lesson 4's functions work on **every** row: `SUM(Orders[revenue])` adds all 4,266 lines. The functions in this lesson add a **condition**: "add up revenue, but only for product 1", "count the lines, but only the discounted ones". They come in two families:

- **`IF` and friends** decide something **for one row**: "is this line large or small?"
- **`SUMIFS`, `COUNTIFS` and friends** summarise **many rows** that pass a test: "how much did large lines bring in?"

### Conditions: the building block

A **condition** (also called a **logical test**) is a comparison that is either `TRUE` or `FALSE`. Type these into any cell to see:

| You write | Row 2 values | Result |
| :-- | :-- | :-- |
| `=E2>=20` | quantity 14 | FALSE |
| `=E2<20` | quantity 14 | TRUE |
| `=G2=0` | discount 0 | TRUE |
| `=D2<>3` | product 3 | FALSE |

| Operator | Meaning |
| :-- | :-- |
| `=` | equal to |
| `<>` | not equal to |
| `>` and `>=` | greater than, greater than or equal to |
| `<` and `<=` | less than, less than or equal to |

Text in a condition goes in **double quotes**: `=C2="Lagos"`. Text comparisons in Excel ignore upper and lower case, so `"lagos"` matches `Lagos`.

### IF

Returns one value when a condition is true and another when it's false.

```excel
=IF(logical_test, value_if_true, value_if_false)
```

| Argument | Meaning |
| :-- | :-- |
| `logical_test` | The question: anything that gives TRUE or FALSE |
| `value_if_true` | What to return when the answer is TRUE |
| `value_if_false` | What to return when the answer is FALSE |

In the `Orders` table, a new column `size`:

```excel
=IF([@quantity]>=20, "Large", "Small")
```

Row 2 has 14 packs, so it shows `Small`. Row 5 has 28 packs, so it shows `Large`. Across the whole table, 1,032 lines are Large and 3,234 are Small.

The results don't have to be text. They can be numbers or other formulas:

```excel
=IF([@discount_pct]>0, [@quantity]*[@unit_price]-[@revenue], 0)
```

That's the naira given away in discount on each line, or 0 when there was no discount.

> [!WARNING]
> A common mistake is putting quotes round numbers: `=IF(E2>="20", ...)`. With quotes, `"20"` is text, and the comparison won't do what you expect. Numbers never need quotes; text always does.

### AND, OR and NOT

To test more than one thing, put the tests inside `AND` or `OR`:

| Function | TRUE when | Example |
| :-- | :-- | :-- |
| `AND(test1, test2, ...)` | **every** test is true | `AND([@quantity]>=20, [@discount_pct]=0)` |
| `OR(test1, test2, ...)` | **at least one** test is true | `OR([@quantity]>=20, [@discount_pct]>0)` |
| `NOT(test)` | the test is false | `NOT([@discount_pct]=0)` |

On Kolanut's orders:

- `AND(quantity>=20, discount_pct=0)`: large lines sold at full price. **374** lines.
- `OR(quantity>=20, discount_pct>0)`: lines that are large, discounted or both. **2,121** lines.

Put either one inside `IF`:

```excel
=IF(AND([@quantity]>=20, [@discount_pct]=0), "Large, full price", "Other")
```

### IFS: more than two outcomes

`IF` gives two answers. For three or more, you could put an IF inside an IF (a **nested IF**):

```excel
=IF([@quantity]>=20, "Large", IF([@quantity]>=10, "Medium", "Small"))
```

That works, but each extra level makes it harder to read. `IFS` lists the tests in order instead:

```excel
=IFS(test1, value1, test2, value2, ..., TRUE, value_otherwise)
=IFS([@quantity]>=20, "Large", [@quantity]>=10, "Medium", TRUE, "Small")
```

Excel checks the tests **from left to right and stops at the first true one**. So a line of 25 packs passes the first test and becomes "Large"; it never reaches the second. The final `TRUE` is a catch-all: if nothing else matched, use this.

| Band | Rule | Lines |
| :-- | :-- | --: |
| Large | 20 packs or more | 1,032 |
| Medium | 10 to 19 packs | 1,777 |
| Small | 9 packs or fewer | 1,457 |

The bands add up to 4,266, every line exactly once. Checking that is a good habit: it proves no line fell through a gap.

> [!TIP]
> Order matters in `IFS`. If you wrote the `>=10` test first, a line of 25 packs would stop there and be called "Medium". Always test from the most specific (or largest) down.

`IFS` is in Excel 2019 and later, and in Google Sheets. In older Excel, use the nested IF.

### COUNTIF and SUMIF: one condition

Now for the summarising family. `COUNTIF` counts the cells in a range that meet a condition.

```excel
=COUNTIF(range, criteria)
```

```excel
=COUNTIF(Orders[discount_pct], ">0")     → 1,747 discounted lines
=COUNTIF(Orders[quantity], ">=20")       → 1,032 large lines
=COUNTIF(Orders[size], "Large")          → 1,032, counting the size column instead
```

`SUMIF` adds up the cells **in another column** for the rows that meet the condition.

```excel
=SUMIF(range, criteria, [sum_range])
```

| Argument | Meaning |
| :-- | :-- |
| `range` | The column to **test** |
| `criteria` | The condition |
| `sum_range` | The column to **add up** for the rows that pass |

```excel
=SUMIF(Orders[product_id], 1, Orders[revenue])       → 59,804,940 from product 1
=SUMIF(Orders[discount_pct], ">0", Orders[revenue])  → 416,170,045 from discounted lines
```

Notice how the criteria are written: a plain value (`1`, `"Large"`) means "equal to"; a comparison goes **inside the quotes** with the number: `">0"`, `">=20"`, `"<>0"`.

### SUMIFS and COUNTIFS: several conditions

The `-IFS` versions (with an S) take as many conditions as you like, in **pairs**: a range to test, then its condition. A row is included only if it passes **all** of them.

```excel
=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)
=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)
```

![The SUMIFS formula broken into its parts: the range to add first, then two pairs of range and condition. Six example rows are tested; only the two that pass both tests are added.](/images/courses/excel/sumifs-anatomy.svg "SUMIFS: what to add comes first, then each test as a range and a condition. Only rows that pass every test are added.")

> [!WARNING]
> **The argument order is different.** In `SUMIF`, the range to add comes **last**. In `SUMIFS`, it comes **first**. Many analysts use `SUMIFS` even for one condition, so they only have to remember one order.

```excel
=SUMIFS(Orders[revenue], Orders[product_id], 1, Orders[discount_pct], ">0")
→ 27,877,340: product 1 lines that were discounted

=COUNTIFS(Orders[quantity], ">=20", Orders[discount_pct], 0)
→ 374: large lines at full price, the same answer as the AND test above
```

`COUNTIFS` and `SUMIFS` only do **AND** (all conditions true). For OR, add two results together, for example `=COUNTIF(..., "Lagos") + COUNTIF(..., "Abuja")`, taking care not to count any row twice.

### AVERAGEIFS, MAXIFS and MINIFS

The same pattern works for averages, largest and smallest values:

| You write | Result | Meaning |
| :-- | :-- | :-- |
| `=AVERAGEIFS(Orders[revenue], Orders[product_id], 1)` | 194,171.88 | Average product 1 line |
| `=AVERAGEIFS(Orders[revenue], Orders[discount_pct], ">0")` | 238,219.83 | Average discounted line |
| `=AVERAGEIFS(Orders[revenue], Orders[discount_pct], 0)` | 164,498.29 | Average full-price line |
| `=MAXIFS(Orders[revenue], Orders[product_id], 1)` | 444,000 | Largest product 1 line |
| `=MINIFS(Orders[revenue], Orders[product_id], 1)` | 13,200 | Smallest product 1 line: one pack |

The averages tell a story: discounted lines are much bigger than full-price ones (₦238k against ₦164k). That fits a business that gives discounts to customers buying in bulk. You found that with two formulas.

### Conditions on dates

To test a date, join the comparison to a date with `&`. `DATE(year, month, day)` builds the date, which avoids any confusion between day-month and month-day formats.

```excel
=SUMIFS(Orders[revenue], Orders[order_date], ">="&DATE(2025,10,1), Orders[order_date], "<="&DATE(2025,12,31))
→ 160,799,625: October to December 2025
```

Two conditions on the **same column** give you a range: on or after 1 October **and** on or before 31 December.

The same `&` trick works with a cell: `">="&K2` means "greater than or equal to whatever is in K2". That lets you change a report's dates without touching the formula.

### Wildcards for text

In criteria, `*` stands for "any characters" and `?` for "exactly one character". The `Customers` table has names such as `Peace Mart` and `Grace Provisions`:

| You write | Counts names that | Result |
| :-- | :-- | --: |
| `=COUNTIF(Customers[customer_name], "*Mart")` | **end** with Mart | 13 |
| `=COUNTIF(Customers[customer_name], "*Mart*")` | **contain** Mart anywhere | 20 |
| `=COUNTIF(Customers[region], "Lagos")` | are exactly Lagos | 34 |
| `=COUNTIFS(Customers[region], "Lagos", Customers[channel], "Wholesale")` | are Lagos **and** Wholesale | 9 |

## Example

**Revenue for every product, in one formula.** Instead of typing each product ID into the formula, put the conditions in cells:

1. On a new sheet, type `product_id` in `A1` and the numbers 1 to 16 in `A2:A17`.
2. In `B1` type `revenue`, and in `B2`:

   ```excel
   =SUMIFS(Orders[revenue], Orders[product_id], A2)
   ```

3. Copy `B2` down to `B17`. Each row tests against its own product ID, because `A2` is relative: it becomes `A3`, `A4`, and so on.
4. In `C1` type `lines`, and in `C2`: `=COUNTIFS(Orders[product_id], A2)`. Copy it down.

![A summary table of product IDs 1 to 16 with revenue from SUMIFS and order lines from COUNTIFS; the formula bar shows the SUMIFS formula for product 1.](/images/courses/excel/sumifs.webp "One SUMIFS formula (1), copied down beside the product IDs (2), gives revenue for every product (3). Product 1 brought in ₦59,804,940.")

Product 1 shows ₦59,804,940 from 308 lines. A total under the table, `=SUM(B2:B17)`, should be exactly ₦830,541,245: every line belongs to one product, so the products must add back up to the grand total.

This is a small version of a **pivot table** (lesson 8). Building it with formulas first shows you what a pivot table does underneath.

## Walkthrough

Work through these in your `Orders` table. Each step builds on the last.

1. **Classify each line.** Add a column `size`:

   ```excel
   =IFS([@quantity]>=20, "Large", [@quantity]>=10, "Medium", TRUE, "Small")
   ```

2. **Count each band.** Below or beside the table, type `Large`, `Medium` and `Small` in three cells, say `K2:K4`. In `L2`: `=COUNTIF(Orders[size], K2)`, and copy down. You should get 1,032, 1,777 and 1,457.
3. **Check the total.** `=SUM(L2:L4)` must be 4,266. If it isn't, a line fell through a gap in your IFS.
4. **Revenue per band.** In `M2`: `=SUMIFS(Orders[revenue], Orders[size], K2)`, copied down. Large lines bring in ₦361,021,385, more than 43% of all revenue from less than a quarter of the lines.
5. **Product 1 revenue:** `=SUMIF(Orders[product_id], 1, Orders[revenue])`, which should be 59,804,940.
6. **Discounted lines in 2026:**

   ```excel
   =COUNTIFS(Orders[order_date], ">="&DATE(2026,1,1), Orders[discount_pct], ">0")
   ```

7. **Check step 6 another way.** Filter the table: order_date in 2026, discount_pct not 0. The status bar count should match your formula. Two methods agreeing is the best evidence you're right.

### Summary

| Need | Use |
| :-- | :-- |
| A different result depending on a test | `IF(test, if_true, if_false)` |
| Several tests together | `AND(...)`, `OR(...)`, `NOT(...)` |
| Three or more outcomes | `IFS(test1, v1, test2, v2, TRUE, otherwise)` |
| Count rows that pass tests | `COUNTIF` (one) or `COUNTIFS` (several) |
| Add up rows that pass tests | `SUMIF(test_range, test, sum_range)` or `SUMIFS(sum_range, test_range, test, ...)` |
| Average, largest, smallest that pass | `AVERAGEIFS`, `MAXIFS`, `MINIFS` |
| A date range | Two tests on one column: `">="&DATE(...)` and `"<="&DATE(...)` |
| Part of a text value | Wildcards `*` and `?` |

## Practice

```answer
{
  "id": "xls-05-p1",
  "prompt": "What was the total revenue from **product 1 (Malt drink 330ml)**? (A rounded figure is fine.)",
  "answer": 59804940,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE product_id = 1",
  "hint": "=SUMIF(Orders[product_id], 1, Orders[revenue])",
  "required": true
}
```

```answer
{
  "id": "xls-05-p2",
  "prompt": "How many order lines in **2026** had a discount greater than 0?",
  "answer": 593,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE order_date >= '2026-01-01' AND discount_pct > 0",
  "hint": "=COUNTIFS(Orders[order_date], \">=\"&DATE(2026,1,1), Orders[discount_pct], \">0\")",
  "required": true
}
```

```answer
{
  "id": "xls-05-p3",
  "prompt": "What was revenue in the **fourth quarter of 2025** (1 October to 31 December)? (A rounded figure is fine.)",
  "answer": 160799625,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2025-10-01' AND '2025-12-31'",
  "hint": "SUMIFS with two conditions on order_date: \">=\"&DATE(2025,10,1) and \"<=\"&DATE(2025,12,31).",
  "explanation": "₦160.8m: nearly 30% of 2025's revenue came in the last three months.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "xls-05-c1",
  "prompt": "How many order lines are **Large** (20 packs or more)?",
  "answer": 1032,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE quantity >= 20",
  "hint": "Either COUNTIF on a size column, or directly: =COUNTIF(Orders[quantity], \">=20\").",
  "required": false
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "xls-05-d1",
  "prompt": "In `attendance.csv`, how many times was employee **1073** marked **Late**?",
  "answer": 5,
  "format": "number",
  "dataset": "hr",
  "files": [
    "attendance"
  ],
  "verify": "SELECT COUNT(*) FROM attendance WHERE employee_id = 1073 AND status = 'Late'",
  "hint": "=COUNTIFS(Attendance[employee_id], 1073, Attendance[status], \"Late\")",
  "required": false
}
```

```answer
{
  "id": "xls-05-d2",
  "prompt": "What is the total value of **Overdue** invoices in the legal dataset?",
  "answer": 188070000,
  "format": "naira",
  "dataset": "legal",
  "files": [
    "invoices"
  ],
  "verify": "SELECT SUM(amount_ngn) FROM invoices WHERE status = 'Overdue'",
  "hint": "=SUMIF(Invoices[status], \"Overdue\", Invoices[amount_ngn])",
  "explanation": "That's money the firm has earned but not collected: exactly the kind of figure a partner wants on page one.",
  "required": false
}
```

```answer
{
  "id": "xls-05-d3",
  "prompt": "What is the total **monthly salary** of **Active** employees in the **Sales** department?",
  "answer": 8115000,
  "format": "naira",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT SUM(monthly_salary) FROM employees WHERE department = 'Sales' AND status = 'Active'",
  "hint": "SUMIFS with two conditions: department = \"Sales\" and status = \"Active\".",
  "required": false
}
```

```answer
{
  "id": "xls-05-d4",
  "prompt": "Back to Kolanut: what is the **average revenue of a discounted order line** (discount above 0)? Round to the nearest naira.",
  "answer": 238220,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(AVG(quantity * unit_price * (1 - discount_pct / 100.0))) FROM orders WHERE discount_pct > 0",
  "hint": "=ROUND(AVERAGEIFS(Orders[revenue], Orders[discount_pct], \">0\"), 0)",
  "explanation": "₦238,220, against ₦164,498 for a full-price line. Discounts go with bigger orders.",
  "required": false
}
```

```answer
{
  "id": "xls-05-d5",
  "prompt": "How many Kolanut order lines were **large (20 packs or more) and sold at full price** (discount 0)?",
  "answer": 374,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE quantity >= 20 AND discount_pct = 0",
  "hint": "=COUNTIFS(Orders[quantity], \">=20\", Orders[discount_pct], 0)",
  "required": false
}
```

```answer
{
  "id": "xls-05-d6",
  "prompt": "How many Kolanut customers have a name **containing** the word \"Provisions\"?",
  "answer": 15,
  "format": "number",
  "dataset": "sales",
  "files": ["customers"],
  "verify": "SELECT COUNT(*) FROM customers WHERE LOWER(customer_name) LIKE '%provisions%'",
  "hint": "=COUNTIF(Customers[customer_name], \"*Provisions*\"). The stars are wildcards.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In =SUMIFS(H:H, D:D, \"Lagos\"), which column is added up?",
    "options": ["H:H", "D:D", "\"Lagos\"", "None of them"],
    "answer": 0,
    "explanation": "The first argument of SUMIFS is always the range to add up; the pairs after it are the conditions."
  },
  {
    "prompt": "What does =COUNTIFS(A:A, \"Lagos\", B:B, \">100000\") count?",
    "options": ["Rows where A is Lagos OR B is over 100,000", "Rows where A is Lagos AND B is over 100,000", "All Lagos rows", "The total of B for Lagos"],
    "answer": 1,
    "explanation": "Every condition in COUNTIFS must be true for a row to count."
  },
  {
    "prompt": "In a SUMIFS condition, what does \">=100000\" mean?",
    "options": ["100,000 or more", "Less than 100,000", "Exactly 100,000", "Not 100,000"],
    "answer": 0,
    "explanation": ">= means greater than or equal to."
  },
  {
    "prompt": "=IFS([@quantity]>=10, \"Medium\", [@quantity]>=20, \"Large\", TRUE, \"Small\"). What does a line of 25 packs show?",
    "options": ["Large", "Medium", "Small", "An error"],
    "answer": 1,
    "explanation": "IFS stops at the first true test. 25 >= 10 is true, so it never reaches the Large test. Test the largest band first."
  },
  {
    "prompt": "Which formula counts lines that are large OR discounted?",
    "options": ["=COUNTIFS(Orders[quantity], \">=20\", Orders[discount_pct], \">0\")", "A helper column with =OR([@quantity]>=20, [@discount_pct]>0), then COUNTIF on TRUE", "=COUNTIF(Orders[quantity], \">=20 OR >0\")", "=SUMIFS(Orders[quantity], \">=20\")"],
    "answer": 1,
    "explanation": "COUNTIFS only does AND. For OR, test each row with OR in a helper column and count the TRUEs (2,121 lines)."
  }
]
```
