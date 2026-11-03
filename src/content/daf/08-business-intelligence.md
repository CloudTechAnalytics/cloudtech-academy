---
title: Business intelligence
minutes: 15
summary: Analytics versus BI, the pipeline from source systems to dashboards, a single source of truth, dashboard design, and self-service with governance.
---

## The problem

Every Monday, Kolanut's sales manager asks for the same numbers: last week's revenue, revenue by region, overdue customers. Every Monday an analyst spends two hours rebuilding the same spreadsheet. The numbers are useful; the process is wasteful, and each rebuild risks a new mistake.

**Business intelligence (BI)** fixes this: build the analysis once, connect it to the data, and let it refresh.

## The concept

### Analytics and BI

The words overlap, but a useful distinction:

| | Analytics | Business intelligence |
| :-- | :-- | :-- |
| Question | Often new: *why did North West fall?* | The same ones, repeatedly: *how is each region doing this week?* |
| Output | A one-off analysis, a recommendation | Dashboards and reports that refresh themselves |
| Built for | One decision | Many people, every week |
| Typical tools | Spreadsheets, SQL, Python | Power BI, Tableau, Looker Studio |

Good analysis often becomes BI. Once you know North West matters, you put it on the dashboard so nobody has to ask again.

### The BI pipeline

![Four stages from left to right: source systems (orders, finance, HR, CRM), ETL (extract, transform, load), a data model or warehouse with related tables and agreed measures, and dashboards. A bar underneath says the whole pipeline refreshes on a schedule.](/images/courses/daf/bi-pipeline.svg "The BI pipeline. Build it once, and every refresh repeats stages 2 to 4 on new data.")

1. **Sources**: the systems where work happens: the order system, billing, HR, CRM, and the odd spreadsheet.
2. **ETL** (extract, transform, load): copying data out, cleaning it and shaping it. In Power BI this is Power Query. Every cleaning step from lesson 5 becomes an automated step that runs on each refresh.
3. **Model / warehouse**: clean tables with relationships (lesson 4) and agreed calculations: a **single source of truth**. A large company keeps this in a **data warehouse**, a database built for analysis; a small one may keep it inside the BI file itself.
4. **Dashboards and reports**: the views people look at, refreshed on a schedule.

### A single source of truth

Without BI, every team builds its own spreadsheet, and their numbers disagree. Sales says revenue was ₦48m (before discounts), finance says ₦46m (after discounts and returns), and the meeting is spent arguing about whose number is right.

A **single source of truth** means one place where each KPI is calculated, one way, from one set of cleaned data. Everyone's dashboard reads from it, so everyone sees the same number. The definitions from lesson 2 (name, formula, inclusions, source) are written into the model once.

### Dashboards and reports

| | Dashboard | Report |
| :-- | :-- | :-- |
| Purpose | Monitor: "are we OK?" | Explore and explain: "why?" |
| Size | One screen | Several pages |
| Content | A few KPIs, a trend, an exception list | Detail, breakdowns, tables |
| Used | Daily or weekly, in seconds | When a question comes up |

Most BI tools produce both, and a good dashboard links through to the report for detail.

### Designing a dashboard

1. **Start from the decisions.** Who opens this, and what will they do differently because of it?
2. **Top-left is read first.** Put the headline KPIs there.
3. **Every number needs a comparison**: against last year, last month or target. "₦290.7m" means little; "₦290.7m, up 19% on last year" means something.
4. **Use the chart rules from lesson 7.** Lines for trends, sorted bars for comparisons, one highlight colour.
5. **End with an action list**: the customers to call, the invoices to chase.
6. **Leave things out.** Four KPIs and three visuals beat twenty tiles nobody reads.

### Self-service and governance

Modern BI tools let business users build their own reports from the shared model: **self-service BI**. It's powerful, but it needs **governance**:

- **Certified data**: the official model is marked as trusted, so people build on it rather than on private copies.
- **Access**: each person sees the data they're allowed to; a regional manager might see only their region. In Power BI this is called row-level security.
- **Ownership**: each dashboard and each KPI has an owner who answers questions about it.

### Common BI tools

| Tool | Notes |
| :-- | :-- |
| **Microsoft Power BI** | Widely used in Nigerian companies, because many already pay for Microsoft 365. Covered in its own course here. |
| **Tableau** | Strong on visual exploration; popular in larger companies. |
| **Google Looker Studio** | Free, browser-based, works well with Google Sheets. |
| **Qlik** | Common in some industries, such as manufacturing and banking. |

The ideas in this lesson apply to all of them; the menus differ.

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

Note the leading indicator in the bottom table: a customer ordering less often is an early warning, before revenue falls. That's exactly what happened in the North West, and a list like this would have flagged those shops while there was still time to act.

## Walkthrough

When a law firm like Ashgrove Chambers builds BI for its partners, it follows the same steps:

1. **Agree the KPIs** with the partners: open matters, hearings adjourned, invoices overdue, **collection rate**.
2. **Define each one precisely.** Collection rate = paid invoices ÷ all invoices issued × 100, counted by **number** of invoices. That choice matters: counted by **value** instead, Ashgrove's rate is 81.5%, because paid invoices are larger on average than unpaid ones. Both are reasonable; what's not reasonable is two partners using different ones.
3. **Connect the sources:** the matter management system and the billing system.
4. **Check the numbers** against a manual calculation before anyone relies on the dashboard.
5. **Schedule the refresh**, for example every morning at 7.
6. **Name an owner** for each KPI, who answers when someone asks "why did this change?"

Step 4 is the one people skip. A dashboard that is wrong once loses trust for months.

```dataset
{ "dataset": "legal", "files": ["invoices"], "note": "Ashgrove Chambers' invoices from 2024 to August 2026: amount, status (Paid, Outstanding, Overdue) and payment date." }
```

### Summary

| Term | Meaning |
| :-- | :-- |
| BI | Building analysis once, so it refreshes and many people can use it |
| ETL | Extract, transform, load: the automated cleaning stage |
| Data warehouse / model | Clean, related tables with agreed measures |
| Single source of truth | One place, one definition for each KPI |
| Dashboard / report | Monitor at a glance / explore in detail |
| Governance | Certified data, access rules and owners |

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
