---
title: How to Analyse Excel Data Quickly
badge: Excel Quick Analysis Essentials
minutes: 30
category: Data
icon: chart
summary: Take a small sales table and answer real questions in minutes. Sort, filter, total with formulas, summarise with a PivotTable and show it in a chart.
skills: Turn data into an Excel Table; Sort and filter to find what matters; Total and count with SUM, AVERAGE and COUNTIF; Summarise with a PivotTable and a chart
---

## Get the data in

Open Excel (or Google Sheets; almost everything here works the same). Copy the table below and paste it into cell **A1** of a new sheet. It's two weeks of sales from a small drinks shop.

```text
Date	Product	Category	Quantity	Price	Sales
03/06/2026	Zobo 50cl	Drinks	12	800	9600
03/06/2026	Chin chin	Snacks	5	1500	7500
04/06/2026	Kunu 50cl	Drinks	8	700	5600
04/06/2026	Zobo 50cl	Drinks	15	800	12000
05/06/2026	Plantain chips	Snacks	10	1000	10000
05/06/2026	Chapman	Drinks	6	1200	7200
06/06/2026	Chin chin	Snacks	7	1500	10500
06/06/2026	Zobo 50cl	Drinks	20	800	16000
09/06/2026	Kunu 50cl	Drinks	10	700	7000
09/06/2026	Plantain chips	Snacks	4	1000	4000
10/06/2026	Chapman	Drinks	9	1200	10800
10/06/2026	Zobo 50cl	Drinks	18	800	14400
```

If everything lands in one column, use **Data → Text to Columns**, choose **Delimited** and tick **Tab**.

Now click any cell in the data and press **Ctrl + T**, then **OK**. This turns it into an **Excel Table**: it gets filter buttons, neat formatting, and it grows automatically when you add rows.

## Sort and filter

Click the arrow on a column heading:

- **Sort Largest to Smallest** on *Sales* shows your best sales at the top.
- **Filter** on *Category*: untick everything except *Snacks* to see only snacks.

Clear the filter when you're done (arrow → **Clear Filter**). Filters hide rows; they don't delete anything.

## Answer questions with formulas

Click an empty cell to the right of the table, such as **H2**, and try these:

| Question | Formula | Answer |
| :-- | :-- | :-- |
| Total sales? | `=SUM(F2:F13)` | 114,600 |
| Average sale? | `=AVERAGE(F2:F13)` | 9,550 |
| How many Zobo sales? | `=COUNTIF(B2:B13,"Zobo 50cl")` | 4 |
| Total Drinks sales? | `=SUMIF(C2:C13,"Drinks",F2:F13)` | 82,600 |

Formulas always start with `=`. If you change a number in the table, every answer updates on its own. That's the big advantage over a calculator.

> [!TIP]
> Select the *Sales* column and look at the **status bar** at the bottom of the Excel window. It shows the sum, average and count instantly, with no formula needed.

## Summarise with a PivotTable

A **PivotTable** answers "total by…" questions without any formulas.

1. Click inside the table, then **Insert → PivotTable → OK**.
2. In the field list on the right, drag **Product** to **Rows**.
3. Drag **Sales** to **Values**. It shows *Sum of Sales* for each product.
4. Click the arrow next to *Row Labels* → **More Sort Options** → descending by *Sum of Sales*.

You can now see at a glance that Zobo is the best seller. Drag **Category** into Rows instead of Product to compare Drinks with Snacks.

## Show it in a chart

Click inside the PivotTable, then **Insert → Recommended Charts** and pick a **bar or column chart**. Give it a title that states the point, like "Zobo brings in the most sales", not just "Chart 1".

Use a **line chart** for changes over time, and a **bar chart** for comparing items. Avoid 3D charts and crowded pie charts.

## Try it

Using the drinks shop data:

1. Filter to **Drinks** only, then clear the filter.
2. Use `SUMIF` to find total **Snacks** sales.
3. Build a PivotTable of **Sales by Category**.
4. Add a bar chart with a title that says what it shows.

Want to go further? The free **Excel for Data Analysis** course covers all of this in depth, with a real company dataset.

```quiz
[
  {
    "prompt": "What does pressing Ctrl + T on your data do?",
    "options": ["Deletes it", "Turns it into an Excel Table with filters that grows with new rows", "Prints it", "Makes it a chart"],
    "answer": 1,
    "explanation": "Tables add filters and formatting, and expand automatically."
  },
  {
    "prompt": "Which formula adds up the Sales column F from row 2 to 13?",
    "options": ["=SUM(F2:F13)", "SUM F2 to F13", "=ADD(F2,F13)", "=F2+F13"],
    "answer": 0,
    "explanation": "SUM adds every cell in the range. =F2+F13 would only add two cells."
  },
  {
    "prompt": "In the drinks shop data, what is total Snacks sales?",
    "options": ["32,000", "82,600", "114,600", "7,500"],
    "answer": 0,
    "explanation": "=SUMIF(C2:C13,\"Snacks\",F2:F13) adds 7,500 + 10,000 + 10,500 + 4,000 = 32,000."
  },
  {
    "prompt": "What is a PivotTable good for?",
    "options": ["Typing new data", "Quick totals by group, like sales by product, without formulas", "Checking spelling", "Changing fonts"],
    "answer": 1,
    "explanation": "Drag a field to Rows and a number to Values to get totals by group."
  },
  {
    "prompt": "Which chart is best for comparing sales of different products?",
    "options": ["A bar or column chart", "A 3D pie chart", "No chart", "A line chart of product names"],
    "answer": 0,
    "explanation": "Bars make it easy to compare items side by side."
  }
]
```
