---
title: Dashboard design
minutes: 30
summary: Lay out a report page people understand in five seconds - hierarchy, consistency, restraint and accessibility.
---

## The problem

Your first report page works, but it may look like most first pages: twelve visuals, eight colours, charts squeezed into corners, a title that says "Sales Dashboard". Everything is there and nothing stands out. Good design is mostly about deciding what to leave out and where the eye goes first.

## The concept

**Hierarchy: the most important thing, biggest and first.** People scan a page top-left to bottom-right (a Z or F pattern). Put the headline numbers along the top, the main chart below them, and details lower down.

**The five-second rule.** A manager glancing at the page for five seconds should get the main message. If they can't, the page has too much or the wrong emphasis.

**Design rules that work**

1. **One page, one purpose.** An overview page, then detail pages (by region, by product, by customer).
2. **At most 5–7 visuals** per page. Each must answer a question someone asked.
3. **KPI cards with context.** A number alone ("₦290.7m") means little; add a comparison ("+19.1% vs H1 2025").
4. **Consistent colours.** Pick one colour for "this year", a grey for "last year", and red only for problems. Use a theme (View → Themes) so every visual matches.
5. **Align and space.** Use View → **Gridlines** and **Snap to grid**. Equal gaps, aligned edges.
6. **Titles that say something**: "North West revenue nearly halved" instead of "Revenue by Region".
7. **Slicers together**, in one place, usually along the top or left.

**Accessibility**

- Enough **contrast** between text and background.
- Don't rely on colour alone: red and green look alike to many colour-blind people. Add labels or icons.
- Add **alt text** to visuals (Format → General → Alt text) for screen-reader users.
- Set a sensible **tab order** (View → Selection pane → Tab order).
- Check readable font sizes: nothing below 10–12pt.

**Mobile.** View → **Mobile layout** lets you arrange a phone-friendly version of each page. Managers in the field will use it.

## Example

**Before:** 11 visuals; a pie chart of 16 products; a gauge; three different blues; title "Kolanut Dashboard"; slicers scattered.

**After:**

```
┌──────────────────────────────────────────────────────────────┐
│ Kolanut sales: H1 2026 up 19%, driven by Lagos and South West│
│ [Channel ▾] [Category ▾] [Date range ▾]                      │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│ Revenue      │ YoY %        │ Active       │ Avg per line    │
│ ₦290.7m      │ +19.1%       │ customers 90 │ ₦202,741        │
├──────────────┴──────────────┴──────┬───────┴─────────────────┤
│ Monthly revenue: 2026 vs 2025      │ Revenue by region       │
│ (line, 2025 in grey)               │ (bars, NW in red)       │
├────────────────────────────────────┴─────────────────────────┤
│ Top 10 customers: revenue, YoY % (table with data bars)       │
└──────────────────────────────────────────────────────────────┘
```

## Walkthrough

Redesign your page from the previous lesson:

1. Write the page's purpose in one sentence. Delete any visual that doesn't serve it.
2. Add a text box title that states the main finding.
3. Line up the KPI cards across the top, the same size, with equal gaps.
4. Apply a theme; set 2025 to grey and 2026 to your main colour everywhere.
5. Colour only the North West bar red (Format → Bars → Colors → Show all).
6. Add a **Top 10 customers** table: `customers[customer_name]`, `[Revenue]`, `[YoY %]`; in the Filters pane, set `customer_name` to **Top N = 10 by Revenue**.
7. Add alt text to each visual.
8. Show the page to someone for five seconds and ask what it says.

## Practice

```answer
{
  "id": "pbi-11-p1",
  "prompt": "In your Top 10 customers table filtered to **2026**, which customer is **first**?",
  "answer": "Brother Sunday Wholesale",
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT c.customer_name FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01' GROUP BY c.customer_name ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "hint": "Filters pane on the table visual: customer_name → Filter type Top N → Top 10 → By value: Revenue. Then set the Year slicer to 2026 and sort by Revenue.",
  "required": true
}
```

```answer
{
  "id": "pbi-11-p2",
  "prompt": "A page has 12 visuals and the manager can't find the main message. According to this lesson, roughly what is the **maximum** number of visuals a page should usually have?",
  "answer": 7,
  "tolerance": 2,
  "format": "number",
  "explanation": "About 5–7. Beyond that, visuals compete for attention.",
  "required": true,
  "hint": "The lesson gives a range of about five to seven. Type the top of it."
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Where should the headline KPIs usually go on a report page?",
    "options": ["Bottom right", "Along the top", "In a tooltip", "On a hidden page"],
    "answer": 1,
    "explanation": "People start reading at the top left."
  },
  {
    "prompt": "Why avoid showing good and bad only with green and red?",
    "options": ["They're ugly", "Many colour-blind people can't tell them apart; add labels or icons too", "Power BI doesn't support red", "They print badly"],
    "answer": 1,
    "explanation": "Never rely on colour alone to carry meaning."
  },
  {
    "prompt": "A KPI card shows '₦290.7m'. What would make it more useful?",
    "options": ["A bigger font", "A comparison, like '+19.1% vs H1 2025'", "A 3D border", "More decimal places"],
    "answer": 1,
    "explanation": "Context turns a number into information."
  }
]
```
