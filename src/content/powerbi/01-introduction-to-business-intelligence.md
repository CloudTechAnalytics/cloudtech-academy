---
title: Introduction to business intelligence with Power BI
minutes: 20
summary: What Power BI is, its parts (Desktop, Service, Mobile), the workflow you'll follow in this course, and how to get set up.
---

## The problem

Every Monday, Kolanut Distribution's analyst rebuilds the same Excel report: revenue by region, by month, by product. It takes a morning, and the managing director sees it on Tuesday. She wants to open a dashboard on Monday at 8am, click on a region, and see the numbers update.

That's what **Power BI** is for: building an analysis once, connecting it to data, and letting people explore it themselves.

## The concept

**Power BI** is Microsoft's business intelligence tool. It has three main parts:

| Part | What it's for | Cost |
| :-- | :-- | :-- |
| **Power BI Desktop** | Building reports on your Windows computer: load data, model it, write calculations, design pages | Free |
| **Power BI Service** (app.powerbi.com) | Publishing, sharing, scheduled refresh, dashboards in the browser | Free to publish to your own workspace; sharing with others needs a Pro (or higher) licence |
| **Power BI Mobile** | Viewing reports on a phone | Free app; access follows the Service licence |

**The Power BI workflow**, which this course follows step by step:

1. **Get data**: connect to files, databases or online services.
2. **Transform**: clean and shape it in **Power Query**.
3. **Model**: relate the tables and add a date table.
4. **Calculate**: write **DAX** measures (revenue, growth, % of total).
5. **Visualise**: build report pages with charts, cards and slicers.
6. **Publish and share** through the Service.

**How it relates to Excel.** Power Query and pivot-style thinking are shared with Excel, so the Excel course helps a lot. The big differences: Power BI handles millions of rows, keeps several related tables in one model, and produces interactive reports rather than static sheets.

## Example

By the end of this course you'll have built a Kolanut sales report with:

- KPI cards: revenue, growth versus last year, active customers;
- a monthly revenue line comparing this year with last year;
- revenue by region with growth, highlighting the regions that fell;
- slicers for channel, category and date;

and then a dashboard of your own for a law firm as the final project.

## Walkthrough

**Get set up**

1. Install **Power BI Desktop** from the Microsoft Store (search "Power BI Desktop"). The Store version updates itself.
2. Open it. You don't need to sign in to build reports; sign-in is only needed to publish.
3. Download the course data:

```dataset
{ "dataset": "sales" }
```

> [!WARNING]
> Power BI Desktop runs on **Windows only**. On a Mac you'll need a Windows computer, a Windows virtual machine, or a cloud PC. The concepts in these lessons still apply if you only read along, but the practice needs Desktop.

> [!NOTE]
> Signing in to the Power BI Service needs a **work or school email address**. Personal addresses such as Gmail aren't accepted. You'll only need this in lesson 13 (publishing), and the lesson explains alternatives for sharing a portfolio piece without it.

## Practice

```answer
{
  "id": "pbi-01-p1",
  "prompt": "Which part of Power BI do you use to **build** reports on your own computer? (Give its full name.)",
  "answer": "Power BI Desktop",
  "accept": ["desktop", "pbi desktop", "powerbi desktop", "Power BI desktop app"],
  "format": "text",
  "explanation": "Power BI Desktop is where you load, model and design. The Service is where reports are shared.",
  "required": true,
  "hint": "It's free and installed on your own Windows computer; the other main part runs in the browser."
}
```

```answer
{
  "id": "pbi-01-p2",
  "prompt": "In the Power BI workflow, which tool do you use for the **transform** step (cleaning and shaping data)?",
  "answer": "Power Query",
  "accept": ["power query editor", "powerquery"],
  "format": "text",
  "explanation": "Power Query, the same engine as Excel's Get & Transform.",
  "required": true,
  "hint": "It opens from Home → Transform data."
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Where do other people usually view a published Power BI report?",
    "options": ["Power BI Desktop", "The Power BI Service in a browser (or the mobile app)", "Excel", "Power Query"],
    "answer": 1,
    "explanation": "Reports are built in Desktop and consumed in the Service or on mobile."
  },
  {
    "prompt": "What is DAX used for?",
    "options": ["Cleaning text", "Writing calculations such as measures", "Drawing charts", "Installing Power BI"],
    "answer": 1,
    "explanation": "DAX (Data Analysis Expressions) is Power BI's calculation language."
  },
  {
    "prompt": "Which statement about cost is correct?",
    "options": ["Power BI Desktop is paid", "Desktop is free; sharing reports with others in the Service needs a paid licence such as Pro", "Everything in Power BI is free", "Only the mobile app is free"],
    "answer": 1,
    "explanation": "Building is free. Sharing in the Service needs Pro (or a higher-level licence) for the people involved."
  }
]
```
