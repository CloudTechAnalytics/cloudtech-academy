---
title: Business storytelling
minutes: 15
summary: Turn a report into an argument - context, finding, cause and recommendation - with titles, annotations, bookmarks and navigation.
---

## The problem

A good dashboard lets people explore. But at the quarterly review, the managing director has 15 minutes and wants to know three things: *How did we do? What changed? What should we do?* A dashboard that makes her hunt for the answers loses the room. For that meeting you need a **story**: a short sequence that leads to a decision.

## The concept

**The story structure**

1. **Context**: where we are. "H1 revenue grew 19% to ₦290.7m."
2. **Complication**: what changed or what's at risk. "But the growth came from two regions, and North West nearly halved."
3. **Cause**: what the data says about why. "North West customers didn't leave. They ordered half as often."
4. **Recommendation**: what to do, and how we'll know it worked. "Visit the top five North West accounts this month; target 150 order lines next half-year."

**Know your audience.** Executives want the conclusion first and detail on request. Operational managers want the detail for *their* area. Build the story page for the first, and the explorable pages for the second.

**Tools in Power BI**

| Tool | Use |
| :-- | :-- |
| **Text box titles** | State each page's finding |
| **Annotations** | A text box and arrow pointing at the December peak or the North West fall |
| **Bookmarks** (View → Bookmarks) | Save a page's state (filters, selections, visible visuals) and return to it with a click |
| **Buttons + page navigation** (Insert → Buttons) | Build a guided path: Overview → Regions → North West deep-dive |
| **Tooltip pages** | A small page that appears on hover with extra detail |
| **Selection pane** | Show or hide visuals, used together with bookmarks |

**Honesty.** A story selects; it mustn't distort. Keep axes at zero for bars, compare equal periods, mention the price rise when you show revenue growth, and show the counts behind percentages.

## Example

A three-page story for the review:

1. **"H1 2026: up 19%, but unevenly."** Cards (revenue, YoY %), and a bar chart of the change in revenue by region, in naira, sorted: Lagos and South West large positives, North West a large negative in red.
2. **"North West: same customers, half the orders."** Three cards for H1 2025 vs 2026 (revenue, customers who ordered, order lines), and a monthly line of North West order lines with an annotation where the decline starts.
3. **"What we recommend."** Three short recommendations, each with its target KPI.

Buttons at the bottom of each page move to the next.

## Walkthrough

1. Add a measure for the change in naira: `Revenue Change = [Revenue] - [Revenue LY]`.
2. On a new page, build a bar chart of `Revenue Change` by region for the first half (filter `Date[Month Number]` to 1–6 and `Date[Year]` to 2026). Sort descending; colour negatives red via conditional formatting (Format → Bars → Colors → fx → rules: less than 0 → red).
3. Title the page with the finding.
4. Build page 2 with North West filtered, and add an annotation text box.
5. **Insert → Buttons → Navigator → Page navigator**, or single buttons with Action → Page navigation.
6. Rehearse: can you tell the story in three minutes using only these pages?

## Practice

```answer
{
  "id": "pbi-12-p1",
  "prompt": "Which region contributed the **largest increase in naira** from H1 2025 to H1 2026?",
  "answer": "Lagos",
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT c.region FROM orders o JOIN customers c ON c.customer_id = o.customer_id GROUP BY c.region ORDER BY SUM(CASE WHEN o.order_date >= '2026-01-01' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) - SUM(CASE WHEN o.order_date <= '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) DESC LIMIT 1",
  "hint": "Your Revenue Change bar chart, sorted descending, shows it at the top.",
  "required": true
}
```

```answer
{
  "id": "pbi-12-p2",
  "prompt": "By how many **naira** did North West revenue fall from H1 2025 to H1 2026? Give the size of the fall as a positive number. (A rounded figure is fine.)",
  "answer": 14501100,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT SUM(CASE WHEN o.order_date <= '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) - SUM(CASE WHEN o.order_date >= '2026-01-01' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'North West'",
  "required": true,
  "hint": "Compare North West revenue for January–June 2025 with January–June 2026, then subtract."
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-12-d1",
  "prompt": "Which **channel** grew the most **in naira** from H1 2025 to H1 2026?",
  "answer": "Wholesale",
  "format": "text",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT c.channel FROM orders o JOIN customers c ON c.customer_id = o.customer_id GROUP BY c.channel ORDER BY SUM(CASE WHEN o.order_date BETWEEN '2026-01-01' AND '2026-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) - SUM(CASE WHEN o.order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) DESC LIMIT 1",
  "hint": "A matrix of channel by half-year, plus a measure for the difference.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What comes after 'context' and 'complication' in the story structure?",
    "options": ["The raw data", "Cause, then recommendation", "A pie chart", "The appendix"],
    "answer": 1,
    "explanation": "Explain why it happened, then what to do."
  },
  {
    "prompt": "What does a bookmark save?",
    "options": ["The data at a point in time", "The state of a page: filters, selections and which visuals are visible", "A copy of the .pbix", "A DAX measure"],
    "answer": 1,
    "explanation": "Bookmarks capture view state, not data."
  },
  {
    "prompt": "Revenue grew 19%, partly from a 10% price rise. What should the story say?",
    "options": ["Volume grew 19%", "Revenue grew 19%, partly from the price rise", "Nothing about prices", "Growth was 29%"],
    "answer": 1,
    "explanation": "Selecting what to show is fine; leaving out what changes the meaning isn't."
  }
]
```
