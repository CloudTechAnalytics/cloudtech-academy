---
title: Data analysis
minutes: 30
summary: The handful of calculations behind most business analysis - totals, averages, shares and growth - and the traps in each.
---

## The problem

Kolanut's data is clean. Now the managing director asks: "Did we do better in the first half of 2026 than the first half of 2025, and where did the money come from?"

Answering needs only a few calculations, used carefully. Most business analysis is built from the same small toolkit.

## The concept

| Calculation | What it tells you | Formula |
| :-- | :-- | :-- |
| **Total** | How much, overall | Add the values |
| **Count** | How many | Count the rows (or distinct items) |
| **Average (mean)** | A typical value | Total ÷ count |
| **Median** | The middle value when sorted | Half the values are above, half below |
| **Share of total** | How much one part contributes | Part ÷ total × 100 |
| **Growth rate** | How much something changed | (New − old) ÷ old × 100 |

**Mean or median?** The mean is pulled towards extreme values; the median isn't. When a few values are much larger than the rest, as with salaries or order sizes, the median is often the fairer "typical" figure. Report both when they differ a lot.

**Compare like with like.** Compare January with January, the first half of one year with the first half of the next. Comparing December with January mostly shows the Christmas season, not performance.

**Revenue at Kolanut** is calculated per order line as:

> revenue = quantity × unit_price × (1 − discount_pct ÷ 100)

## Example

Revenue by region, first half (January–June) of each year, in millions of naira:

| Region | H1 2025 | H1 2026 |
| :-- | --: | --: |
| Lagos | 118.2 | 152.8 |
| South West | 28.9 | 51.7 |
| North Central | 25.3 | 27.2 |
| South South | 19.7 | 23.1 |
| South East | 20.9 | 19.4 |
| North West | 31.1 | 16.6 |
| **Total** | **244.2** | **290.7** |

**Growth.** (290.7 − 244.2) ÷ 244.2 × 100 = **19.0%**. The business grew.

**Share.** Lagos brought in 152.8 ÷ 290.7 × 100 = **52.6%** of H1 2026 revenue: more than half the business comes from one region.

**The exception.** North West went the other way, from 31.1 to 16.6. A total that grew 19% hides a region that nearly halved. That's why analysts always break totals down.

## Walkthrough

**Mean versus median on real data.** Across all 4,266 of Kolanut's order lines:

- The **mean** order line is worth **₦194,689**.
- The **median** order line is worth about **₦166,680**.

The mean is higher because wholesalers place a smaller number of very large orders (up to ₦713,400 on a single line), which pull the average up. If a manager asks "what does a typical order line look like?", the median is the more honest answer.

**Averages by group** often tell the real story. Average quantity per order line:

| Channel | Average packs per line |
| :-- | --: |
| Wholesale | 19.0 |
| Supermarket | 11.1 |
| Kiosk | 3.6 |

One overall average (13.8 packs) would describe none of these customers well.

> [!WARNING]
> A percentage without its base can mislead. "Sales in our smallest region grew 50%!" could mean ₦2m became ₦3m. Always show the underlying numbers next to growth rates.

## Practice

```answer
{
  "id": "daf-06-p1",
  "prompt": "Using the table in the Example, what share of **H1 2026** revenue came from the **South West**, to one decimal place?",
  "answer": 17.8,
  "tolerance": 0.11,
  "format": "percent",
  "hint": "South West H1 2026 ÷ total H1 2026 × 100.",
  "explanation": "51.7 ÷ 290.7 × 100 = 17.8%. South West is now Kolanut's second-largest region.",
  "required": true
}
```

```answer
{
  "id": "daf-06-p2",
  "prompt": "By what percentage did **North West** revenue fall from H1 2025 to H1 2026? Give the size of the fall as a positive number, to one decimal place.",
  "answer": 46.6,
  "tolerance": 0.11,
  "format": "percent",
  "hint": "(Old − new) ÷ old × 100, using 31.1 and 16.6.",
  "explanation": "(31.1 − 16.6) ÷ 31.1 × 100 = 46.6%. Almost half of the region's revenue disappeared in a year when the business grew 19%.",
  "required": true
}
```

```answer
{
  "id": "daf-06-p3",
  "prompt": "In `orders.csv`, what is the **average quantity** per order line, to one decimal place?",
  "answer": 13.8,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(AVG(quantity), 1) FROM orders",
  "hint": "Use =AVERAGE() on the quantity column, then round to one decimal place.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Salaries at a company are mostly ₦300,000–₦600,000, with three directors on ₦5,000,000. Which figure best describes a typical salary?",
    "options": ["The mean", "The median", "The maximum", "The total"],
    "answer": 1,
    "explanation": "The directors pull the mean up. The median stays with the typical employee."
  },
  {
    "prompt": "Which comparison is the fairest way to judge whether sales improved?",
    "options": ["December 2025 vs January 2026", "January–June 2025 vs January–June 2026", "Last week vs last year", "Best month vs worst month"],
    "answer": 1,
    "explanation": "Same months, different years: the seasons cancel out."
  },
  {
    "prompt": "Total revenue grew 19%. What should an analyst do next?",
    "options": ["Report 19% and stop", "Break the total down by region, product or channel to see where the growth came from and whether any part fell", "Recalculate it as a median", "Remove the regions that fell"],
    "answer": 1,
    "explanation": "Totals hide exceptions. North West fell 47% inside a total that rose 19%."
  }
]
```
