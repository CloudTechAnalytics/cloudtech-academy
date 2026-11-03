---
title: Pivot tables
minutes: 30
summary: Summarise thousands of rows in seconds with pivot tables: the four areas, sum, count and average, percentages and growth, date grouping, top N, slicers and refreshing.
---

## The problem

SUMIFS works, but a summary of revenue by region *and* month would need 6 × 18 = 108 formulas. The director will then ask for it by channel instead. **Pivot tables** build these summaries by dragging fields, and rebuild them in seconds when the question changes.

## The concept

A **pivot table** is a summary that Excel builds for you. You tell it which column to group by and which numbers to add up, and it does what dozens of `SUMIFS` formulas would do, in a second. Change your mind, drag a field somewhere else, and the summary rebuilds itself.

The name comes from **pivoting**: turning the same data round to look at it from another side. Revenue by region, then by month, then by channel, all from one table.

### What a pivot table needs

The source must be a clean, **tabular** list:

- **One header row**, with a name in every column.
- **One row per record** (here, per order line).
- **No blank rows or columns** in the middle, and no subtotal rows.
- **The columns you want to group by**: for Kolanut, the `revenue`, `region`, `channel` and `category` columns you added in lessons 2 and 6.

Your `Orders` table already meets all of these. Build pivots on a **Table**, not a fixed range: when rows are added to the Table, a Refresh picks them up. A pivot built on `A1:K4267` would miss them.

### The four areas

![On the left, the four areas of the PivotTable Fields pane: channel in Filters, year in Columns, region in Rows and Sum of revenue in Values. On the right, the resulting pivot table: revenue by region for 2025 and 2026, with grand totals.](/images/courses/excel/pivot-areas.svg "Each area of the field list controls one part of the pivot table.")

| Area | Holds | Each value becomes | Example |
| :-- | :-- | :-- | :-- |
| **Rows** | Categories down the side | A row | `region` |
| **Columns** | Categories across the top | A column | year of `order_date` |
| **Values** | The numbers to summarise | The cells in the middle | Sum of `revenue` |
| **Filters** | A filter for the whole pivot | (a drop-down above it) | `channel` |

You need at least one field in **Values** and usually one in **Rows**. Columns and Filters are optional. Put **text** fields (region, channel) in Rows, Columns or Filters; put **number** fields (revenue, quantity) in Values.

> [!TIP]
> Keep the number of columns small. Six regions down the side and two years across is easy to read; eighteen months across is not. Put the field with more values in **Rows**.

### Summarise Values By: sum, count, average…

Numbers in Values are **summed** by default. Right-click any number in the pivot → **Summarize Values By** to change it.

With `channel` in Rows and `revenue` in Values three times, each summarised a different way:

| Channel | Sum of revenue | Count of revenue | Average of revenue |
| :-- | --: | --: | --: |
| Kiosk | 39,888,675 | 777 | 51,337 |
| Supermarket | 210,387,665 | 1,308 | 160,847 |
| Wholesale | 580,264,905 | 2,181 | 266,055 |
| **Grand Total** | **830,541,245** | **4,266** | **194,689** |

Each summary answers a different question. **Sum**: how much did each channel bring in? **Count**: how many order lines? **Average**: how big is a typical line? Wholesale lines average five times the size of kiosk lines.

> [!WARNING]
> If a number field shows **Count** instead of **Sum** when you add it, some cells in that column are text or blank. Check the source column with the tests from lesson 7.

### Show Values As: percentages and differences

**Summarise Values By** decides *what* to calculate. **Show Values As** (right-click a number) decides *how to show it*:

| Show Values As | Each cell becomes | Use it to ask |
| :-- | :-- | :-- |
| % of Grand Total | Its share of the overall total | What share does each region bring in? |
| % of Column Total | Its share of its column | What share of 2025 came from Lagos? |
| % of Row Total | Its share of its row | How did Lagos split between the years? |
| Difference From | Minus a chosen base item | How much more than last year? |
| % Difference From | The percentage change from a base item | By what percentage did it grow? |
| Running Total In | Adds up as it goes | How much by the end of each month? |

The same region pivot as **% of Grand Total**:

| Region | % of revenue |
| :-- | --: |
| Lagos | 49.5% |
| South West | 15.8% |
| North West | 9.8% |
| North Central | 9.3% |
| South South | 8.2% |
| South East | 7.3% |

And with years across the top as **% of Column Total**, Lagos's share rises from 47.9% of 2025's revenue to 52.5% of 2026's so far. That's a story worth telling: the business is leaning more on Lagos, not less.

To show the amount **and** the percentage side by side, drag `revenue` into Values **twice** and set **Show Values As** only on the second one.

### Grouping dates

A date field in Rows or Columns would give one row per day: 546 of them. **Group** it instead: right-click any date in the pivot → **Group** → choose **Months**, **Quarters** and **Years** (choose Years together with Months, or January 2025 and January 2026 are added together).

Recent versions of Excel group dates automatically when you add a date field; click the **+** next to a year to see its quarters and months.

By quarter, Kolanut's revenue grows almost every quarter:

| Year | Quarter | Revenue |
| :-- | :-- | --: |
| 2025 | Q1 | 119,509,320 |
| 2025 | Q2 | 124,653,750 |
| 2025 | Q3 | 134,848,095 |
| 2025 | Q4 | 160,799,625 |
| 2026 | Q1 | 143,209,130 |
| 2026 | Q2 | 147,521,325 |

December 2025 alone was ₦66,284,310, the biggest month by far: the festive season. That's why Q4 stands out.

Numbers can be grouped too: right-click a quantity in Rows → **Group** → Starting at 1, Ending at 30, By 10 gives bands 1–10, 11–20, 21–30.

### Sorting and filtering inside a pivot

- **Sort**: right-click a number → **Sort → Largest to Smallest**. The pivot keeps that order when it refreshes.
- **Filter a row field**: click the drop-down on **Row Labels**. **Value Filters → Top 10** shows the top N items by value: the top 5 customers, the top 3 products.
- **Filters area**: drag `channel` to Filters, and a drop-down above the pivot limits everything to one channel.

### Slicers

A **slicer** is a set of buttons that filters the pivot with one click, which is clearer than a drop-down for anyone reading your report.

1. Click inside the pivot.
2. **PivotTable Analyze → Insert Slicer**, tick `channel`, OK.
3. Click **Wholesale**: the pivot shows wholesale only. Ctrl + click to choose several. The clear-filter icon in the corner shows everything again.

A **timeline** (**PivotTable Analyze → Insert Timeline**) is a slicer for dates: drag across months to filter a period.

### Refreshing

A pivot table is a **snapshot**. It doesn't update by itself when the source data changes. After editing or adding rows: **Data → Refresh All** (Ctrl + Alt + F5), or right-click the pivot → **Refresh**.

> [!WARNING]
> Forgetting to refresh is the most common pivot mistake. If a number looks out of date, refresh before you look for anything else.

### GETPIVOTDATA

If you type `=` and click a cell inside a pivot, Excel writes a `GETPIVOTDATA` formula instead of a simple reference:

```excel
=GETPIVOTDATA("revenue", $A$3, "region", "Lagos")
```

That's deliberate: it finds "Lagos revenue" by name, so it still works when the pivot is re-sorted or reshaped. It's useful for a summary page that quotes pivot figures. If you'd rather have plain references, turn it off under **PivotTable Analyze → Options ▾ → Generate GetPivotData**.

## Example

**Revenue by channel, with each channel's share.** `channel` in Rows, `revenue` in Values twice, the second shown as **% of Grand Total**:

| Channel | Sum of revenue | % of total |
| :-- | --: | --: |
| Wholesale | 580,264,905 | 69.9% |
| Supermarket | 210,387,665 | 25.3% |
| Kiosk | 39,888,675 | 4.8% |
| **Grand Total** | **830,541,245** | **100%** |

Wholesalers are 21 of Kolanut's 90 customers, fewer than a quarter, but bring in 70% of revenue. A director would want to know which wholesalers, and whether any are at risk: that's the next question, and with `customer_name` in Rows and a **Top 10** filter, the next pivot.

**This half-year against the same half last year.** The data stops at June 2026, so comparing 2026 with all of 2025 isn't fair. Filter both years to January–June (group by Months and Years, and filter the months): the first half of 2025 brought in ₦244,163,070 and the first half of 2026 ₦290,730,455, **19.1% more**. **Show Values As → % Difference From**, with Base field Years and Base item 2025, calculates that for you.

## Walkthrough

1. Click inside the `Orders` table (with its `revenue`, `region`, `channel` and `category` columns).
2. **Insert → PivotTable → From Table/Range → New Worksheet**, OK.
3. In the PivotTable Fields pane, drag `region` to **Rows** and `revenue` to **Values**. You get Sum of revenue by region.
4. Drag `order_date` to **Columns**. Excel groups it by year (click the `+` to see quarters and months). If it doesn't, right-click a date → **Group** → select Months and Years.
5. Right-click any revenue number → **Number Format** → Number, 0 decimals, with a thousands separator.
6. Sort: right-click a revenue number in the Grand Total column → **Sort → Largest to Smallest**.
7. Check the Grand Total is ₦830,541,245, the same as your `SUM` from lesson 4. If not, the pivot needs refreshing or its source range is wrong.
8. **Insert Slicer** for `channel`. Click Wholesale, then Kiosk, and watch the whole pivot change.
9. Drag `order_date` out of Columns, and drag `revenue` into Values a second time. Right-click the second one → **Show Values As → % of Grand Total**.

![A pivot table of revenue and percentage of total by region, a channel slicer, and the PivotTable Fields pane with region in Rows and two value fields.](/images/courses/excel/pivot-table.webp "Revenue by region with % of total (1). The field list (2), the areas you drag fields into (3), and a slicer (4).")

1. **The pivot table**: region in rows, sorted by revenue, with a second value column showing **% of total**. Lagos is 49.5% of all revenue.
2. **Field list**: every column of the source Table. Ticked fields are in use.
3. **Areas**: Filters, Columns, Rows and Values. Drag fields between them to reshape the summary.
4. **Slicer** for `channel`: click Wholesale and the pivot shows wholesale revenue only.

**Shortcuts for pivot tables**

| Keys | Does |
| :-- | :-- |
| Alt, N, V | Insert a PivotTable |
| Alt + F5 | Refresh the selected pivot |
| Ctrl + Alt + F5 | Refresh all pivots and connections |
| Alt + ↓ (on a field in the pivot) | Filter or sort that field |

### Summary

| Need | Do |
| :-- | :-- |
| Summarise by a category | Category in **Rows**, number in **Values** |
| A second dimension | Another category in **Columns** |
| Count or average instead of sum | Right-click → **Summarize Values By** |
| Shares, differences, running totals | Right-click → **Show Values As** |
| Months, quarters, years | Right-click a date → **Group** |
| Top N items | Row Labels → **Value Filters → Top 10** |
| One-click filtering | **Insert Slicer** or **Insert Timeline** |
| Up-to-date numbers | **Refresh All** (Ctrl + Alt + F5) |

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
