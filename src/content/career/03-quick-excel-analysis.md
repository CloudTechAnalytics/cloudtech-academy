---
title: Quick Excel Analysis
minutes: 30
handsOn: 12
summary: Take a small business's sales table and answer real questions with it: sort and filter, total with SUM, SUMIF and COUNTIF, summarise with a PivotTable, and show the answer in a chart with a title that says something.
---

## The situation

Mrs Okafor runs a small drinks and snacks kiosk near a university gate. She keeps a simple sales log, and before she reorders stock she wants answers to four questions:

1. How much did we sell in these two weeks?
2. Do drinks or snacks bring in more money?
3. Which product earns the most?
4. Are sales growing from one week to the next?

These are exactly the questions employers expect a new hire to answer in Excel on day one. You'll answer them all in this module, and type your answers into the tasks at the end to check them.

## Get the data in

Open **Excel** or **Google Sheets** (everything here works in both). Copy the table below, click cell **A1** of a new sheet, and paste.

```text
Date	Product	Category	Quantity	Price	Sales
01/06/2026	Zobo 50cl	Drinks	12	800	9600
01/06/2026	Chin chin	Snacks	5	1500	7500
02/06/2026	Kunu 50cl	Drinks	8	700	5600
02/06/2026	Zobo 50cl	Drinks	15	800	12000
03/06/2026	Plantain chips	Snacks	10	1000	10000
03/06/2026	Chapman	Drinks	6	1200	7200
04/06/2026	Chin chin	Snacks	7	1500	10500
04/06/2026	Puff-puff (6)	Snacks	14	500	7000
05/06/2026	Zobo 50cl	Drinks	20	800	16000
05/06/2026	Chapman	Drinks	9	1200	10800
08/06/2026	Kunu 50cl	Drinks	10	700	7000
08/06/2026	Plantain chips	Snacks	4	1000	4000
09/06/2026	Zobo 50cl	Drinks	18	800	14400
09/06/2026	Puff-puff (6)	Snacks	16	500	8000
10/06/2026	Chin chin	Snacks	6	1500	9000
10/06/2026	Chapman	Drinks	11	1200	13200
11/06/2026	Kunu 50cl	Drinks	12	700	8400
11/06/2026	Zobo 50cl	Drinks	22	800	17600
12/06/2026	Plantain chips	Snacks	9	1000	9000
12/06/2026	Puff-puff (6)	Snacks	20	500	10000
```

You should have 20 rows of sales under a header row, in columns **A to F**. If everything landed in column A, select column A and use **Data → Text to Columns → Delimited → Tab**.

Each row is one sale entry: the date, what was sold, how many, the price of one, and **Sales** (quantity × price).

Now click any cell inside the data and press **Ctrl + T** (in Google Sheets: **Format → Convert to table**), and confirm. It becomes a **Table**: filter buttons on every heading, banded rows, and it grows automatically when you add new sales at the bottom.

> [!TIP]
> Check the data before you analyse it. Click the **Sales** heading's column and look at the **status bar** at the bottom of Excel: it shows the Sum, Average and Count of whatever you select, with no formula needed. Count should be 20.

## Sort and filter

Click the arrow on a column heading:

- **Sort Largest to Smallest** on **Sales** puts the biggest sales at the top. The best single entry is 22 Zobo on 11 June: ₦17,600.
- **Filter** on **Category**: untick everything except **Snacks**. Only the snack rows show, and the status bar's Sum shows snack sales.

Filters **hide** rows, they don't delete them. Clear the filter afterwards (arrow → **Clear Filter**) so your formulas and PivotTables see everything.

## Answer questions with formulas

Formulas calculate from the data and update by themselves when the data changes. Click an empty cell to the right of the table, such as **H2**, and type these one at a time:

| Question | Formula | What it does |
| :-- | :-- | :-- |
| Total sales? | `=SUM(F2:F21)` | Adds every value in F2 to F21 |
| Average sale entry? | `=AVERAGE(F2:F21)` | Total ÷ number of entries |
| How many Zobo entries? | `=COUNTIF(B2:B21,"Zobo 50cl")` | Counts cells in B that equal "Zobo 50cl" |
| Total Drinks sales? | `=SUMIF(C2:C21,"Drinks",F2:F21)` | Adds F only where C is "Drinks" |
| Entries of ₦10,000 or more? | `=COUNTIF(F2:F21,">=10000")` | Counts cells in F that are at least 10,000 |

Read **SUMIF** as: "look in **this range** for **this condition**, and add up **that range**". It's the formula behind most "total by…" questions.

> [!WARNING]
> Every formula starts with `=`. Without it, Excel just shows your typing as text. And check ranges carefully: `F2:F20` instead of `F2:F21` silently misses the last row.

**Percentages.** To find what share of sales came from drinks, divide the drinks total by the overall total: `=SUMIF(C2:C21,"Drinks",F2:F21)/SUM(F2:F21)`, then click **Home → %** to show it as a percentage.

## Summarise with a PivotTable

A **PivotTable** gives you "total by…" for every group at once, without typing formulas.

1. Click inside the table, then **Insert → PivotTable → OK** (Google Sheets: **Insert → Pivot table → Create**).
2. In the field list, drag **Product** to **Rows**.
3. Drag **Sales** to **Values**. You'll see *Sum of Sales* for each product.
4. Sort it: click the arrow on *Row Labels* → **More Sort Options** → **Descending** by *Sum of Sales*.

Now the best seller is at the top. Swap **Product** for **Category** in Rows to compare drinks and snacks, or drag **Quantity** into Values as well to see units next to money.

> [!NOTE]
> A product can sell the most **units** without bringing in the most **money**. Puff-puff sells lots of packs at ₦500 each; Chapman sells fewer at ₦1,200. Always say which one you mean.

## Show it in a chart

Click inside the PivotTable, then **Insert → Recommended Charts** and choose a **bar** or **column** chart.

- Use **bars** to compare items (products, categories) and a **line** to show change over time.
- Avoid 3D charts and pie charts with lots of slices.
- Change the title from "Total" to a sentence that says what the chart shows, like *Zobo brings in a third of all sales*. That's called an **action title**. Mrs Okafor shouldn't have to work out the point for herself.

## Try it

Use the kiosk data to answer these. Type just the number (₦ and commas are fine).

```answer
{
  "id": "career-m03-a1",
  "prompt": "What were total **Snacks** sales over the two weeks?",
  "answer": 75000,
  "format": "naira",
  "hint": "=SUMIF(C2:C21,\"Snacks\",F2:F21)",
  "explanation": "₦75,000 against ₦121,800 for drinks.",
  "required": true
}
```

```answer
{
  "id": "career-m03-a2",
  "prompt": "What **percentage** of total sales came from **Drinks**? One decimal place.",
  "answer": 61.9,
  "format": "percent",
  "hint": "Drinks total divided by the overall total (₦196,800).",
  "explanation": "₦121,800 ÷ ₦196,800 = 61.9%. Drinks bring in about three naira in every five.",
  "required": true
}
```

```answer
{
  "id": "career-m03-a3",
  "prompt": "Build a PivotTable of Sales by Product. Which product brings in the **most money**?",
  "answer": "Zobo 50cl",
  "format": "text",
  "accept": ["zobo", "zobo 50 cl"],
  "hint": "Product in Rows, Sales in Values, sorted descending.",
  "explanation": "Zobo brought in ₦69,600, more than twice the next product, Chapman (₦31,200).",
  "required": true
}
```

```answer
{
  "id": "career-m03-a4",
  "prompt": "Week 1 is 1–5 June and week 2 is 8–12 June. By what **percentage** did sales grow from week 1 to week 2? One decimal place.",
  "answer": 4.6,
  "format": "percent",
  "hint": "Total each week (SUM over the right rows, or filter by date), then (week 2 ÷ week 1 − 1) × 100.",
  "explanation": "Week 1: ₦96,200. Week 2: ₦100,600. Growth = 100,600 ÷ 96,200 − 1 = 4.6%.",
  "required": true
}
```

```task
{
  "id": "career-m03-t1",
  "prompt": "Write an **action title** for a bar chart of sales by product: one line that tells Mrs Okafor the main finding, with a number.",
  "minutes": 3,
  "rows": 2,
  "placeholder": "e.g. Sales by product",
  "rules": [
    { "label": "Names a product", "pattern": "zobo|chapman|kunu|chin chin|plantain|puff" },
    { "label": "Includes a number, amount or share", "pattern": "\\d|third|half|quarter|twice|double" },
    { "label": "One short line (4 to 16 words)", "minWords": 4, "maxWords": 16 }
  ],
  "sample": "Zobo brings in ₦69,600, over a third of all sales",
  "note": "A title like *Sales by product* just describes the chart. This one tells her what to reorder first.",
  "required": true
}
```

Want to go further? The free **Excel for Data Analysis** course takes these skills much further, with XLOOKUP, data cleaning and a full sales analysis on a real company dataset.
