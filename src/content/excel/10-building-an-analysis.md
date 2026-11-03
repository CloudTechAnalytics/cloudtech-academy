---
title: Building an analysis
minutes: 15
summary: Organise a workbook someone else can trust - raw data, calculations, checks and a one-page summary - and compare periods properly.
---

## The problem

A workbook full of correct formulas can still be useless if nobody else can follow it: numbers typed over formulas, pivots pointing at old ranges, totals that don't match. The managing director wants a first-half review of 2026 against 2025 that her finance team can check. This lesson is about building it properly.

## The concept

**A standard layout.** One sheet per job, in this order:

| Sheet | Contains | Rule |
| :-- | :-- | :-- |
| `README` | Question, sources, date, author, definitions | Written first |
| `Raw` | Data exactly as received | Never edited |
| `Data` | Cleaned Tables with helper columns (revenue, region, category) | Formulas only |
| `Calc` | Pivots and summary formulas | No typed numbers |
| `Summary` | The one page people read: KPIs, a chart or two, the findings | Refers to Calc |
| `Checks` | Reconciliations: totals that must agree | All should say OK |

**Checks catch mistakes.** Examples:

```excel
=IF(ROUND(SUM(Data!Orders[revenue]) - GETPIVOTDATA("revenue", Calc!$A$3), 0) = 0, "OK", "MISMATCH")
=IF(COUNTIF(Orders[region], "Not found") = 0, "OK", "Unmatched customers")
```

**Period-over-period comparison.** For January–June each year:

```excel
H1 2025:  =SUMIFS(Orders[revenue], Orders[order_date], ">="&DATE(2025,1,1), Orders[order_date], "<="&DATE(2025,6,30))
H1 2026:  =SUMIFS(Orders[revenue], Orders[order_date], ">="&DATE(2026,1,1), Orders[order_date], "<="&DATE(2026,6,30))
Growth %: =(H1_2026 - H1_2025) / H1_2025
```

Add a region criterion to get the same by region. Format growth as a percentage with one decimal.

**Growth, step by step.** Growth is the change divided by where you started:

| Step | Formula | Kolanut, H1 |
| :-- | :-- | --: |
| Change | `=new - old` | 290,730,455 − 244,163,070 = 46,567,385 |
| Growth | `=change / old` | 46,567,385 ÷ 244,163,070 = 0.191 |
| Shown as % | Format as Percentage, 1 decimal | **19.1%** |

Divide by the **old** value, not the new one: dividing by 290.7m would give 16.0%, which understates the growth. If the old value could be zero (a brand-new region), wrap it: `=IFERROR((new-old)/old, "new")`.

**Percentage points versus per cent.** When the thing that changes is already a percentage, say which you mean. Supermarkets went from 24.8% of revenue in 2025 to 26.3% in 2026. That's a rise of **1.5 percentage points**, or **6% in relative terms** (1.5 ÷ 24.8). "Up 1.5%" is ambiguous, and a careful reader will ask which.

**Inputs in cells, not in formulas.** Put the period dates in labelled cells on `Calc` (say `B1` = start, `B2` = end) and refer to them: `">="&$B$1`. Next quarter, you change two cells instead of editing every formula. That's what makes a workbook reusable.

> [!BUSINESS]
> Always compare the same period (H1 with H1), and say what's included: "revenue after discounts, all channels, January–June". Kolanut also raised prices 8–12% in January 2026, so part of the growth is price, not volume. A good summary says so.

## Example

**H1 2026 vs H1 2025 by region** (₦ million):

| Region | H1 2025 | H1 2026 | Growth |
| :-- | --: | --: | --: |
| Lagos | 118.2 | 152.8 | +29.3% |
| South West | 28.9 | 51.7 | +78.6% |
| North Central | 25.3 | 27.2 | +7.3% |
| South South | 19.7 | 23.1 | +16.9% |
| South East | 20.9 | 19.4 | −7.1% |
| North West | 31.1 | 16.6 | −46.6% |
| **Total** | **244.2** | **290.7** | **+19.1%** |

**Findings for the summary page:**

1. First-half revenue grew 19.1%, helped by the January price rise.
2. Lagos and the South West delivered most of the growth.
3. North West nearly halved and South East slipped. These two need attention.

## Walkthrough

1. Create the sheets above and write the `README`.
2. On `Calc`, list the six regions down column A. In B and C, write the SUMIFS for H1 2025 and H1 2026 with a region condition; in D, growth.
3. Add a total row with `SUM`, and on `Checks` confirm the H1 2026 total equals a SUMIFS on dates alone.
4. On `Summary`: three KPI cells at the top (H1 2026 revenue, growth %, largest-falling region), a bar chart of growth by region with North West highlighted, and the three findings as sentences.
5. Protect your work from accidental typing: **Review → Protect Sheet** on `Calc` and `Summary`.

## Practice

```answer
{
  "id": "xls-10-p1",
  "prompt": "What was Kolanut's revenue growth from **H1 2025 to H1 2026**, to one decimal place? Calculate it from the order data, not the rounded table.",
  "answer": 19.1,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN order_date BETWEEN '2026-01-01' AND '2026-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) / SUM(CASE WHEN order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) - 1), 1) FROM orders",
  "hint": "Two SUMIFS with date ranges, then (new − old) ÷ old.",
  "required": true
}
```

```answer
{
  "id": "xls-10-p2",
  "prompt": "Which region had the **second-worst** growth (the smallest growth after North West)?",
  "answer": "South East",
  "accept": ["south-east", "southeast"],
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT region FROM (SELECT c.region, SUM(CASE WHEN o.order_date >= '2026-01-01' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(CASE WHEN o.order_date <= '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) AS g FROM orders o JOIN customers c ON c.customer_id = o.customer_id GROUP BY c.region) ORDER BY g LIMIT 1 OFFSET 1",
  "hint": "Build the regional growth table and sort it smallest to largest.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "xls-10-d1",
  "prompt": "What percentage of the **IT** department's employees have **resigned**? One decimal place.",
  "answer": 8.3,
  "format": "percent",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT ROUND(100.0 * SUM(status = 'Resigned') / COUNT(*), 1) FROM employees WHERE department = 'IT'",
  "hint": "COUNTIFS for IT and Resigned, divided by COUNTIF for IT.",
  "required": false
}
```

```answer
{
  "id": "xls-10-d2",
  "prompt": "By what percentage did **Kiosk** revenue grow from **H1 2025** to **H1 2026**? One decimal place (negative if it fell).",
  "answer": 0.5,
  "format": "percent",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN o.order_date BETWEEN '2026-01-01' AND '2026-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(CASE WHEN o.order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) - 1), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Kiosk'",
  "hint": "Two SUMIFS (one per half-year, both with channel = Kiosk), then new ÷ old − 1.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why keep an untouched Raw sheet in the workbook?",
    "options": ["Excel requires it", "So anyone can trace every number back to the source data", "It makes the file faster", "Pivots can't read Tables"],
    "answer": 1,
    "explanation": "The raw data is the evidence your analysis rests on."
  },
  {
    "prompt": "What is a 'check' in a workbook?",
    "options": ["A tick box", "A formula confirming two independent calculations agree", "A spell-check", "A cell with a typed number"],
    "answer": 1,
    "explanation": "Reconciliation checks catch broken ranges, missed rows and lookups that failed."
  },
  {
    "prompt": "Revenue grew 19% and prices rose about 10%. What should the summary say?",
    "options": ["Sales volume grew 19%", "Revenue grew 19%, partly because of the price rise, so volume grew less", "Prices don't affect revenue", "Nothing about prices"],
    "answer": 1,
    "explanation": "Separating price from volume stops readers over-crediting the sales team."
  }
]
```
