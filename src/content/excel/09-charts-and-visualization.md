---
title: Charts and visualization
minutes: 35
summary: Build clear line, bar and combo charts from pivot tables, and use conditional formatting and sparklines to make tables readable.
---

## The problem

The pivot tables show the numbers, but a table of 18 months × 6 regions doesn't jump out at anyone. The sales director needs to *see* the December peak, the Lagos growth and the North West fall. Excel can chart all of it, but its defaults need work before a chart is fit for a meeting.

## The concept

**Pick the chart from the question** (as in Data Analytics Foundations):

| Question | Excel chart |
| :-- | :-- |
| Trend over time | **Line** |
| Compare categories | **Clustered bar** (horizontal) or **column** |
| Parts of a whole, 2–4 parts | **100% stacked bar**, or a donut |
| Two measures with different scales | **Combo** (column + line on a secondary axis), sparingly |

**PivotCharts** (PivotTable Analyze → PivotChart) are linked to the pivot: filter or slice the pivot and the chart follows.

**Fix the defaults, every time**

1. **Title** that states the finding: click the title and type, e.g. "December is our biggest month by far".
2. **Delete what doesn't help**: legend for a single series, heavy gridlines, field buttons on PivotCharts (right-click → Hide All Field Buttons).
3. **Axis**: bars start at 0; format numbers as millions. In Format Axis, set **Display units** to Millions.
4. **Colour**: one colour for everything, one accent for the point you're making.
5. **Sort** bars largest to smallest (sort the pivot and the chart follows).

**Tables can be visual too**

- **Conditional formatting → Data Bars** puts a small bar in each cell.
- **Color Scales** shade high and low values.
- **Sparklines** (Insert → Sparklines → Line) draw a tiny trend chart inside one cell: good for a row per region.

## Example

**Monthly revenue line chart:** pivot with `order_date` grouped into Years and Months in Rows and `revenue` in Values, then **PivotChart → Line**. The chart shows a steady ₦36–49m a month in 2025, a spike to ₦66.3m in December 2025, then a higher base of ₦43–55m a month in 2026 after the January price rise.

**Category bar chart for one month:** `category` in Rows, `revenue` in Values, `order_date` filtered to December 2025, sorted descending, as a clustered bar.

## Walkthrough

1. Build the monthly pivot described above.
2. Click inside it → **PivotTable Analyze → PivotChart → Line → OK**.
3. Right-click a field button on the chart → **Hide All Field Buttons on Chart**.
4. Click the legend → Delete (one series doesn't need one).
5. Double-click the vertical axis → **Display units: Millions**; tick **Show display units label**.
6. Click the chart title and write the finding.
7. Click the December 2025 point twice (to select just that point) → **Add Data Label**.

The result, built on Kolanut's monthly revenue:

![A line chart of Kolanut's monthly revenue from January 2025 to June 2026 titled December is our biggest month by far, with the axis in millions and the December point labelled ₦66.3m.](/images/courses/excel/chart.webp "A finished chart: a title that states the finding (1), axis in millions (2), one labelled point (3), and the monthly figures it's drawn from (4).")

Then, for the regional table, select the H1 2026 revenue column → **Home → Conditional Formatting → Data Bars → Solid Fill**.

**Shortcuts for charts**

| Keys | Does |
| :-- | :-- |
| Alt + F1 | Insert the default chart next to the selected data |
| F11 | Insert a chart on its own sheet |
| Ctrl + 1 | Open the Format pane for the selected chart element |
| Alt, N, R | Recommended Charts |

## Practice

```answer
{
  "id": "xls-09-p1",
  "prompt": "Which **product category** had the highest revenue in **December 2025**?",
  "answer": "Household",
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT p.category FROM orders o JOIN products p ON p.product_id = o.product_id WHERE o.order_date BETWEEN '2025-12-01' AND '2025-12-31' GROUP BY p.category ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "hint": "Pivot: category in Rows, revenue in Values, filter order_date to December 2025, sort largest first.",
  "required": true
}
```

```answer
{
  "id": "xls-09-p2",
  "prompt": "Looking only at **2026**, which month had the highest revenue? (Just the month name.)",
  "answer": "April",
  "accept": ["apr", "april 2026", "apr 2026", "2026-04"],
  "format": "text",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT CASE substr(order_date, 6, 2) WHEN '01' THEN 'January' WHEN '02' THEN 'February' WHEN '03' THEN 'March' WHEN '04' THEN 'April' WHEN '05' THEN 'May' ELSE 'June' END FROM orders WHERE order_date >= '2026-01-01' GROUP BY substr(order_date, 1, 7) ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100.0)) DESC LIMIT 1",
  "hint": "Your monthly line chart shows it, or sort the monthly pivot filtered to 2026.",
  "explanation": "April 2026, at ₦54.6m. Easter fell on 5 April that year.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What's the advantage of a PivotChart over a normal chart of copied numbers?",
    "options": ["It has more colours", "It stays linked to the pivot, so filtering or refreshing updates the chart", "It can't be edited", "It's always a pie chart"],
    "answer": 1,
    "explanation": "PivotCharts follow the pivot's fields, filters and slicers."
  },
  {
    "prompt": "A chart shows revenue in naira up to 70,000,000 on its axis. What makes it easier to read?",
    "options": ["Set axis display units to Millions", "Remove the axis entirely", "Use a 3D effect", "Add more gridlines"],
    "answer": 0,
    "explanation": "₦70m is easier to read than 70,000,000 at a glance."
  },
  {
    "prompt": "Which feature draws a tiny trend line inside a single cell?",
    "options": ["Data bars", "Sparklines", "Slicers", "Flash Fill"],
    "answer": 1,
    "explanation": "Sparklines fit a small line or column chart into one cell, one per row."
  }
]
```
