---
title: Visualizations
minutes: 15
summary: The visuals you'll use most, how to configure and format them, and how visuals interact on a page.
---

## The problem

Your model and measures are ready. Now they need to become a page someone can read. Power BI has dozens of visuals; a handful do most of the work, and knowing how they interact (click one bar, and the whole page filters) is what makes a report feel alive.

## The concept

**The core visuals**

| Visual | Best for | Wells to fill |
| :-- | :-- | :-- |
| **Card** | One headline number | Fields: a measure |
| **Clustered bar / column** | Comparing categories | Y-axis (category), X-axis (measure) |
| **Line chart** | Trends over time | X-axis: `Date[Year Month]` or Date hierarchy; Y-axis: measures |
| **Matrix** | Cross-tab (like a pivot table) | Rows, Columns, Values |
| **Table** | Detail lists | Columns |
| **Slicer** | On-page filtering | Field: a dimension column |
| **Line and clustered column** | Two measures with different scales | Column y-axis, Line y-axis |

**Formatting** (Format visual, paintbrush icon): titles, data labels, axis units (Millions), colours. For a single highlighted bar: Format → **Bars → Colors** → turn on **Show all** and colour one category.

**Conditional formatting** in tables and matrices: click the field's drop-down in the Values well → **Conditional formatting → Background color / Data bars / Icons**.

**Interactions.** Clicking a data point in one visual **cross-filters** or **cross-highlights** the others. Control it: select a visual → **Format → Edit interactions**, then choose filter, highlight or none on each other visual.

**Drill down.** With a hierarchy (Year → Quarter → Month) on an axis, the drill arrows at the top of the visual move between levels.

**Tooltips.** Hovering shows details; add extra measures to the **Tooltips** well to show more (e.g. YoY % when hovering a region's bar).

### Choosing a visual from the question

| The reader asks | Visual | Kolanut |
| :-- | :-- | :-- |
| "How much, in total?" | **Card**, with a comparison measure nearby | Revenue ₦830.5m |
| "How has it changed?" | **Line chart** on a date axis | Monthly revenue, this year and last |
| "Which is biggest?" | **Bar chart**, sorted | Revenue by region |
| "What's the breakdown by two things?" | **Matrix** | Category by year |
| "Which ones, exactly?" | **Table** | Customers whose orders fell most |
| "How do two measures relate?" | **Scatter chart** | Customers: credit limit against revenue |
| "Two measures, different scales, over time" | **Line and clustered column** | Revenue (columns) and order lines (line) by month |

Pie, donut, gauge and map visuals exist too. Use them rarely: a sorted bar chart compares values more accurately than a pie, and a map is only useful when location itself matters.

### Filters at four levels

Besides slicers, the **Filters pane** filters at different scopes:

| Level | Affects | Example |
| :-- | :-- | :-- |
| **Visual** | One visual | A top 5 customers bar chart (Filter type: Top N) |
| **Page** | Every visual on the page | This page shows 2026 only |
| **Report** (all pages) | Every page | Exclude a test customer everywhere |
| **Drillthrough** | A detail page, reached by right-clicking a data point | Right-click Lagos → Drill through → Region detail |

Slicers sit on the page where users can see and change them. Filters-pane filters are often set by the report author and can be locked or hidden. A number that looks wrong is often explained by a forgotten filter, so check the Filters pane first.

### Filter or highlight?

When a user clicks a bar, other visuals respond in one of two ways:

| Interaction | What the other visual shows | Good for |
| :-- | :-- | :-- |
| **Filter** | Only the selected data | Cards, tables, line charts: the number simply changes |
| **Highlight** | All the data, with the selected part dark and the rest pale | Bar and column charts: you see the part against the whole |
| **None** | No change | A visual that should always show the full picture |

Set them with **Format → Edit interactions**: select the visual you'll click, then choose the icon above each other visual.

## Example

A first report page for Kolanut:

- **Top row:** three Cards: `Revenue`, `YoY %`, `Active Customers`.
- **Left:** Line chart: `Date[Year Month]` on the X-axis, `Revenue` and `Revenue LY` on the Y-axis.
- **Right:** Clustered bar: `customers[region]` on the Y-axis, `Revenue` on the X-axis, `YoY %` in Tooltips, sorted descending.
- **Bottom:** Matrix: `products[category]` in Rows, `Date[Year]` in Columns, `Revenue` in Values, with data bars.
- **Side:** Slicers for `customers[channel]` and `Date[Year]`.

Click the North West bar and every other visual shows North West only.

Here's a first version of that page built in Power BI Desktop, with a card, a slicer and two bar charts:

![A Power BI report page with a Total Revenue card showing 830.54M, a channel slicer, a bar chart of Total Revenue by region and a column chart of Total Revenue by category, next to the Filters, Visualizations and Data panes.](/images/courses/powerbi/report-page.webp "A report page: card (1), slicer (2), bar chart (3), column chart (4), and the Filters (5), Visualizations (6) and Data (7) panes.")

Tick **Wholesale** in the slicer and every visual on the page recalculates for wholesale customers only:

![The same report with Wholesale ticked in the channel slicer: the card now shows 580.26M and both charts show smaller values.](/images/courses/powerbi/slicer-filter.webp "The slicer (1) filters the page: Total Revenue drops from ₦830.5m to ₦580.3m (2), the wholesale share you calculated in the Excel course.")

## Walkthrough

1. Add the three cards. For each, Format → Callout value → Display units **Millions** for revenue.
2. Add the line chart. If the X-axis shows a hierarchy (Year, Quarter, Month, Day), use `Date[Year Month]` instead, or drill down to Month.
3. Add the region bar chart; sort by Revenue (… menu → Sort axis → Revenue, descending).
4. Add the matrix with data bars on Revenue.
5. Add slicers; set their style to **Tile** or **Dropdown** (Format → Slicer settings).
6. Click around. Then select the line chart → **Format → Edit interactions** and set the region bar chart to **filter** rather than highlight the line chart.

## Practice

```answer
{
  "id": "pbi-10-p1",
  "prompt": "Click **North West** in the region bar chart with the Year slicer set to **2026**. What does the Revenue card show? (A rounded figure is fine.)",
  "answer": 16646820,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'North West' AND o.order_date >= '2026-01-01'",
  "hint": "Set the card's display units to None to read the exact value.",
  "required": true
}
```

```answer
{
  "id": "pbi-10-p2",
  "prompt": "In the category-by-year matrix, what was **Snacks** revenue in **2025**? (A rounded figure is fine.)",
  "answer": 80124630,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "products"
  ],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Snacks' AND o.order_date BETWEEN '2025-01-01' AND '2025-12-31'",
  "required": true,
  "hint": "Put products[category] in Rows and Date[Year] in Columns, then read the Snacks row under 2025."
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-10-d1",
  "prompt": "In the category-by-year matrix, what was **Household** revenue in **2026**?",
  "answer": 83195160,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "products"
  ],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Household' AND o.order_date >= '2026-01-01'",
  "hint": "Read the Household row under the 2026 column.",
  "required": false
}
```

```answer
{
  "id": "pbi-10-d2",
  "prompt": "Add a Channel slicer. With **Wholesale** selected and the Year slicer on **2025**, what does the Revenue card show?",
  "answer": 379168440,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Wholesale' AND o.order_date BETWEEN '2025-01-01' AND '2025-12-31'",
  "hint": "Two slicers filter the card together.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which visual lets report users filter the whole page by channel with a click?",
    "options": ["Card", "Slicer", "Matrix", "Tooltip"],
    "answer": 1,
    "explanation": "Slicers are on-page filters."
  },
  {
    "prompt": "Clicking a bar highlights part of the other visuals instead of filtering them. How do you change that?",
    "options": ["Delete the visual", "Format → Edit interactions, then choose Filter for each target visual", "Change the theme", "Refresh the data"],
    "answer": 1,
    "explanation": "Edit interactions sets how each visual responds to selections in another."
  },
  {
    "prompt": "Where do you add YoY % so it appears when hovering over a region's bar?",
    "options": ["Legend", "Tooltips well", "Filters on this page", "Small multiples"],
    "answer": 1,
    "explanation": "Fields in the Tooltips well appear on hover."
  }
]
```
