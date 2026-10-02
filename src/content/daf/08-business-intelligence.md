---
title: Business intelligence
minutes: 15
summary: How BI turns one-off analysis into dashboards people use every week, and the pipeline behind them.
---

## The problem

Every Monday, Kolanut's sales manager asks for the same numbers: last week's revenue, revenue by region, overdue customers. Every Monday an analyst spends two hours rebuilding the same spreadsheet. The numbers are useful; the process is wasteful, and each rebuild risks a new mistake.

**Business intelligence (BI)** fixes this: build the analysis once, connect it to the data, and let it refresh.

## The concept

**Analytics vs BI.** The words overlap, but a useful distinction:

- **Analytics** answers a question, often a new one: *why did North West fall?*
- **BI** monitors the business with the same questions, repeatedly: *how is each region doing this week?*

Good analysis often becomes BI. Once you know North West matters, you put it on the dashboard.

**The BI pipeline**

```
Source systems  →  Extract, transform, load (ETL)  →  Data warehouse / model  →  Reports & dashboards
(orders, finance,    (clean, combine, calculate)        (one trusted version)       (Power BI, Tableau,
 HR, CRM)                                                                             Looker Studio)
```

1. **Sources**: the systems where work happens.
2. **ETL**: copying data out, cleaning it and shaping it. In Power BI this is Power Query.
3. **Model / warehouse**: clean tables with relationships and agreed calculations, a *single source of truth*.
4. **Dashboards**: the views people look at, refreshed on a schedule.

**Dashboards vs reports.** A **dashboard** is a one-screen summary of KPIs for monitoring. A **report** goes deeper, with several pages and details to explore. Most BI tools produce both.

**Common BI tools:** Microsoft Power BI, Tableau, Google Looker Studio, Qlik. Power BI is widely used in Nigerian companies because many already pay for Microsoft 365; it's covered in its own course here.

## Example

A sensible first dashboard for Kolanut's sales manager:

| Area | Visual | Why |
| :-- | :-- | :-- |
| Top row | 4 KPI cards: revenue this month, vs same month last year, active customers, average order line | Answers "are we OK?" in two seconds |
| Middle | Line chart of monthly revenue, this year vs last | Shows the trend and season |
| Middle | Bar chart of revenue by region, sorted, with growth % | Shows where to look |
| Bottom | Table of customers whose orders dropped most vs last quarter | Tells reps who to call |
| Side | Filters (slicers) for region, channel, product category | Lets each manager see their own area |

Four KPIs, three visuals, one action list. The discipline is leaving things *out*.

## Walkthrough

When a law firm like Ashgrove Chambers builds BI for its partners, it follows the same steps:

1. **Agree the KPIs** with the partners: open matters, hearings adjourned, invoices overdue, **collection rate**.
2. **Define each one precisely.** Collection rate = paid invoices ÷ all invoices issued × 100, counted by number of invoices.
3. **Connect the sources:** the matter management system and the billing system.
4. **Check the numbers** against a manual calculation before anyone relies on the dashboard.
5. **Schedule the refresh**, for example every morning at 7.

Step 4 is the one people skip. A dashboard that is wrong once loses trust for months.

```dataset
{ "dataset": "legal", "files": ["invoices"], "note": "Ashgrove Chambers' invoices from 2024 to August 2026: amount, status (Paid, Outstanding, Overdue) and payment date." }
```

## Practice

```answer
{
  "id": "daf-08-p1",
  "prompt": "Check a KPI before it goes on the dashboard. Using `invoices.csv`, what is Ashgrove Chambers' **collection rate by number of invoices** (invoices with status Paid ÷ all invoices × 100), to one decimal place?",
  "answer": 79.8,
  "format": "percent",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(100.0 * SUM(status = 'Paid') / COUNT(*), 1) FROM invoices",
  "hint": "Count all invoices, count the ones whose status is Paid (a filter or COUNTIF helps), then divide.",
  "explanation": "327 of 410 invoices are paid: 79.8%. About one invoice in five is still unpaid.",
  "required": true
}
```

```answer
{
  "id": "daf-08-p2",
  "prompt": "How many of Ashgrove Chambers' invoices are **Overdue**?",
  "answer": 70,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT COUNT(*) FROM invoices WHERE status = 'Overdue'",
  "hint": "Filter the status column to Overdue and count the rows.",
  "explanation": "70 invoices, worth ₦188 million in total, a good candidate for a weekly 'who to chase' list on the dashboard.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "daf-08-d1",
  "prompt": "An HR dashboard KPI: **attendance rate** = Present records ÷ all records in `attendance.csv`. What is it? One decimal place.",
  "answer": 88.8,
  "format": "percent",
  "dataset": "hr",
  "files": [
    "attendance"
  ],
  "verify": "SELECT ROUND(100.0 * SUM(status = 'Present') / COUNT(*), 1) FROM attendance",
  "hint": "COUNTIF(status, \"Present\") ÷ COUNTA(status).",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which step of the BI pipeline cleans and combines data from different systems?",
    "options": ["Dashboards", "ETL (extract, transform, load)", "Source systems", "Slicers"],
    "answer": 1,
    "explanation": "ETL takes raw data out of the source systems and shapes it for analysis."
  },
  {
    "prompt": "What does 'single source of truth' mean?",
    "options": ["Only one person may see the data", "Everyone uses the same cleaned data and the same KPI definitions", "The company has only one database", "Dashboards can't be changed"],
    "answer": 1,
    "explanation": "When sales and finance calculate revenue the same way from the same data, meetings argue about decisions, not numbers."
  },
  {
    "prompt": "What should you do before a new dashboard is shared?",
    "options": ["Add more visuals", "Check its numbers against an independent calculation", "Remove the filters", "Change the colours"],
    "answer": 1,
    "explanation": "Trust is hard to win back. Verify first."
  }
]
```
