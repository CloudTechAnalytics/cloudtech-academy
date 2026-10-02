---
title: Pivot tables
minutes: 20
summary: Summarise thousands of rows in seconds - by region, month, channel or rep - with pivot tables, grouping, percentages and slicers.
---

## The problem

SUMIFS works, but a summary of revenue by region *and* month would need 6 × 18 = 108 formulas. The director will then ask for it by channel instead. **Pivot tables** build these summaries by dragging fields, and rebuild them in seconds when the question changes.

## The concept

A pivot table has four areas:

| Area | Holds | Example |
| :-- | :-- | :-- |
| **Rows** | Categories down the side | region |
| **Columns** | Categories across the top | year |
| **Values** | The numbers, summarised | Sum of revenue |
| **Filters** | A filter for the whole pivot | channel = Wholesale |

**Summarise Values By** changes Sum to Count, Average, Max…
**Show Values As** turns numbers into **% of Grand Total**, **% of Column Total**, **Difference From**…

**Dates** can be grouped into Years, Quarters and Months: right-click a date in the pivot → **Group**. Recent Excel versions group dates automatically when you add a date field.

**Slicers** are clickable filter buttons: **PivotTable Analyze → Insert Slicer**.

A pivot table **doesn't update by itself**. After the source data changes: **Data → Refresh All** (Ctrl + Alt + F5).

> [!NOTE]
> Build pivots on a **Table** (your `Orders` table with the revenue, region and category columns from lessons 2 and 6). When rows are added to the Table, Refresh picks them up. A pivot built on a fixed range like A1:J4267 would miss them.

## Example

Revenue by channel, with **Show Values As → % of Grand Total**:

| Channel | Sum of revenue | % of total |
| :-- | --: | --: |
| Wholesale | 580,264,905 | 69.9% |
| Supermarket | 210,387,665 | 25.3% |
| Kiosk | 39,888,675 | 4.8% |
| **Grand Total** | **830,541,245** | **100%** |

Wholesalers are fewer than a quarter of Kolanut's customers but bring in 70% of revenue.

## Walkthrough

1. Click inside the `Orders` table (with its `revenue`, `region` and `category` columns).
2. **Insert → PivotTable → From Table/Range → New Worksheet**, OK.
3. In the PivotTable Fields pane, drag `region` to **Rows** and `revenue` to **Values**. You get Sum of revenue by region.
4. Drag `order_date` to **Columns**. Excel groups it by year (click the `+` to see quarters and months). If it doesn't, right-click a date → **Group** → select Months and Years.
5. Right-click any revenue number → **Number Format** → Number, 0 decimals, with a thousands separator.
6. Sort: right-click a revenue number → **Sort → Largest to Smallest**.
7. **Insert Slicer** for `channel`. Click Wholesale, then Kiosk, and watch the whole pivot change.

![A pivot table of revenue and percentage of total by region, a channel slicer, and the PivotTable Fields pane with region in Rows and two value fields.](/images/courses/excel/pivot-table.webp "Revenue by region with % of total (1). The field list (2), the areas you drag fields into (3), and a slicer (4).")

1. **The pivot table**: region in rows, sorted by revenue, with a second value column showing **% of total**. Lagos is 49.5% of all revenue.
2. **Field list**: every column of the source Table. Ticked fields are in use.
3. **Areas**: Filters, Columns, Rows and Values. Drag fields between them to reshape the summary.
4. **Slicer** for `channel`: click Wholesale and the pivot shows wholesale revenue only.

To get the channel percentages in the Example: `channel` in Rows, `revenue` in Values **twice**; on the second, right-click → **Show Values As → % of Grand Total**.

**Shortcuts for pivot tables**

| Keys | Does |
| :-- | :-- |
| Alt, N, V | Insert a PivotTable |
| Alt + F5 | Refresh the selected pivot |
| Ctrl + Alt + F5 | Refresh all pivots and connections |
| Alt + ↓ (on a field in the pivot) | Filter or sort that field |

## Practice

```answer
{
  "id": "xls-08-p1",
  "prompt": "What percentage of all revenue came from **Wholesale** customers, to one decimal place? Build it with a pivot table.",
  "answer": 69.9,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN c.channel = 'Wholesale' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id",
  "hint": "You need a channel column on Orders first (XLOOKUP from Customers). Then pivot: channel in Rows, revenue in Values, Show Values As → % of Grand Total.",
  "required": true
}
```

```answer
{
  "id": "xls-08-p2",
  "prompt": "Which **sales rep** brought in the most revenue in **2026** (January–June)? Give their full name.",
  "answer": "Chidi Okonkwo",
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT c.sales_rep FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01' GROUP BY c.sales_rep ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "hint": "Bring sales_rep onto Orders with XLOOKUP. Pivot: sales_rep in Rows, revenue in Values, order_date (Years) in Columns or as a Filter set to 2026.",
  "explanation": "Chidi Okonkwo, one of the two Lagos reps, with ₦81.2m in the first half of 2026.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "xls-08-c1",
  "prompt": "Which **month** had the highest revenue in the whole dataset? Answer with the month and year, for example March 2025.",
  "answer": "December 2025",
  "accept": ["dec 2025", "december, 2025", "2025-12", "dec-25", "dec 25", "december 25", "12/2025"],
  "format": "text",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT CASE substr(order_date, 6, 2) WHEN '01' THEN 'January' WHEN '02' THEN 'February' WHEN '03' THEN 'March' WHEN '04' THEN 'April' WHEN '05' THEN 'May' WHEN '06' THEN 'June' WHEN '07' THEN 'July' WHEN '08' THEN 'August' WHEN '09' THEN 'September' WHEN '10' THEN 'October' WHEN '11' THEN 'November' ELSE 'December' END || ' ' || substr(order_date, 1, 4) FROM orders GROUP BY substr(order_date, 1, 7) ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100.0)) DESC LIMIT 1",
  "hint": "Pivot with order_date grouped by Years and Months in Rows, revenue in Values, then sort largest to smallest.",
  "required": false
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "xls-08-d1",
  "prompt": "Build a pivot table on the HR `employees.csv` with department in Rows and a count of **Active** employees. Which department has the most active employees?",
  "answer": "Operations",
  "format": "text",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT department FROM employees WHERE status = 'Active' GROUP BY department ORDER BY COUNT(*) DESC LIMIT 1",
  "hint": "Put status in Filters and choose Active.",
  "required": false
}
```

```answer
{
  "id": "xls-08-d2",
  "prompt": "Pivot `attendance.csv` with status in Filters (Late) and employee_id in Rows. How many **different employees** were late at least once in June?",
  "answer": 51,
  "format": "number",
  "dataset": "hr",
  "files": [
    "attendance"
  ],
  "verify": "SELECT COUNT(DISTINCT employee_id) FROM attendance WHERE status = 'Late'",
  "hint": "Count the rows of the pivot (not counting Grand Total), or select the employee_id cells and read Count in the status bar.",
  "explanation": "Lateness is spread across most of the staff, not a few people: that changes what HR should do about it.",
  "required": false
}
```

```answer
{
  "id": "xls-08-d3",
  "prompt": "Which **channel** brought Kolanut the most revenue in **2025**? (Add channel to the orders with XLOOKUP, or build the pivot on the data model.)",
  "answer": "Wholesale",
  "format": "text",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT c.channel FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY c.channel ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "hint": "Channel in Rows, Sum of revenue in Values, a year filter on order_date.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You added 200 new rows to the Orders table. What must you do for the pivot table to include them?",
    "options": ["Nothing", "Refresh the pivot table", "Rebuild it from scratch", "Save and reopen the file"],
    "answer": 1,
    "explanation": "Pivots are snapshots until refreshed. Built on a Table, a refresh picks up new rows."
  },
  {
    "prompt": "Which setting shows each region's revenue as a share of the total?",
    "options": ["Summarise Values By → Average", "Show Values As → % of Grand Total", "Group → Months", "Insert Slicer"],
    "answer": 1,
    "explanation": "Show Values As changes how a number is expressed, here as a percentage of the grand total."
  },
  {
    "prompt": "Where would you put 'channel' so the whole pivot shows only Wholesale?",
    "options": ["Rows", "Columns", "Values", "Filters (or a slicer)"],
    "answer": 3,
    "explanation": "Filters and slicers restrict the whole pivot without adding rows or columns."
  }
]
```
