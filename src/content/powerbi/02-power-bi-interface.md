---
title: The Power BI interface
minutes: 20
summary: The four views of Power BI Desktop, the panes you'll use constantly, and how report pages work.
---

## The problem

Power BI Desktop opens to a blank canvas and a lot of panes. New users click around, can't find where their data went, or can't work out why a visual shows the same number in every bar. Knowing the layout saves hours of confusion.

## The concept

**Four views** (icons down the left edge):

| View | What you do there |
| :-- | :-- |
| **Report view** | Design pages: add visuals, arrange them, format them |
| **Table view** | Look at the rows in each loaded table; check types and values |
| **Model view** | See tables as boxes and the relationships between them |
| **DAX query view** | Write and test DAX queries (useful later for checking measures) |

(Older guides call Table view "Data view".)

**Panes in Report view** (right side):

- **Data** pane: every table, column and measure in your model. Tick or drag a field to use it.
- **Visualizations** pane: choose a visual type, then drop fields into its **wells** (Axis, Values, Legend…). The paintbrush icon opens **Format visual**.
- **Filters** pane: filters for the selected visual, the current page, or all pages.

**The ribbon** across the top: **Home** (Get data, Transform data, Publish), **Insert**, **Modeling** (new measures, tables, relationships), **View** (themes, gridlines, mobile layout).

**Report pages** are tabs along the bottom, like worksheets. A report usually has an overview page and a few detail pages.

**File types:** your work is saved as a `.pbix` file, which holds the data, model and report together.

## Example

A new visual, step by step: in Report view, tick `revenue` in the Data pane and Power BI creates a column chart with one bar. Then tick `region` and it becomes revenue by region. The fields you tick land in the wells of the selected visual; changing the visual type in the Visualizations pane keeps the same fields.

## Walkthrough

1. Open Power BI Desktop and close the start screen.
2. Hover over each icon on the left edge to find Report, Table, Model and DAX query view.
3. On the right, find the **Data**, **Visualizations** and **Filters** panes. If one is missing: **View → Show panes**.
4. Click the **+** at the bottom to add a page; double-click a page tab to rename it.
5. **File → Save as**: save the empty report as `kolanut-sales.pbix` in the same folder as the course CSV files. You'll build on it in every lesson.

> [!TIP]
> If a visual shows the same number for every category, the table holding the category usually isn't related to the table holding the number. You'll fix that in Model view in lesson 6. It's the most common beginner problem in Power BI.

## Practice

```answer
{
  "id": "pbi-02-p1",
  "prompt": "Which view do you open to see and create **relationships** between tables?",
  "answer": "Model view",
  "accept": ["model", "the model view", "relationship view"],
  "format": "text",
  "required": true
}
```

```answer
{
  "id": "pbi-02-p2",
  "prompt": "Which view lets you scroll through the actual **rows** of a loaded table to check its values?",
  "answer": "Table view",
  "accept": ["table", "data view", "the table view"],
  "format": "text",
  "explanation": "Table view (called Data view in older versions).",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Where do you choose the chart type for a selected visual?",
    "options": ["Data pane", "Visualizations pane", "Filters pane", "Model view"],
    "answer": 1,
    "explanation": "The Visualizations pane holds visual types, the field wells and formatting."
  },
  {
    "prompt": "What does a .pbix file contain?",
    "options": ["Only the report design", "Only the data", "The data, the model and the report together", "A link to Excel"],
    "answer": 2,
    "explanation": "A .pbix bundles everything, which is why it's easy to share as a portfolio file."
  },
  {
    "prompt": "A bar chart shows the same revenue for every region. What's the most likely cause?",
    "options": ["The chart type is wrong", "The region table isn't related to the orders table", "Revenue is text", "The page is hidden"],
    "answer": 1,
    "explanation": "Without a relationship, filtering by region can't reach the orders, so each bar shows the grand total."
  }
]
```
