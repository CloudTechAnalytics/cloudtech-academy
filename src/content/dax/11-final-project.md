---
title: "Final project: Kolanut commercial dashboard"
minutes: 20
summary: Plan your final project, a DAX-driven commercial dashboard for Kolanut's leadership, and warm up with three of its measures.
---

## The problem

Kolanut Distribution's managing director wants one Power BI report for the monthly leadership meeting:

> "Are we growing, and is it real growth or just the price rise? Which channels and customers are driving it? Who's slipping away? And I want to trust every number on it."

Every question needs measures from this course: like-for-like time intelligence, price and volume effects, shares and ranks, active and lapsed customers. And "trust every number" means a tested measure library, not a page of dragged-in columns. The full brief and submission are on the course's project page; this lesson gets you started.

## The concept

**From questions to measures**

| Question | Measures | Lesson |
| :-- | :-- | :-- |
| Are we growing? | Revenue, Revenue LY (like for like), YoY %, Revenue YTD, Rolling 3M | 6 |
| Price or volume? | Revenue at 2025 Prices, Price Effect, Volume Effect | 5 |
| Which channels and customers? | % of Total, Customer Rank, Rank LY, Top 5 Share | 4, 8 |
| Who's slipping away? | Active Customers 30d, Lapsed Customers 30d, New Customers | 7, 9 |
| Where's the concentration risk? | Cumulative Share, ABC Class | 9 |

**What makes the measure library trustworthy**

- Base measures defined once, and everything else built on them.
- Display folders, formats and a description on every measure.
- Like-for-like comparisons everywhere a part year could appear.
- A test sheet: key totals reconciled with the source, and the price and volume effects adding up to the total growth.

## Example

A first look at growth by channel, January to June, with the like-for-like `YoY %` from lesson 6:

| Channel | H1 2025 | H1 2026 | YoY % |
| :-- | --: | --: | --: |
| Kiosk | 13,013,460 | 13,077,855 | 0.5% |
| Supermarket | 61,940,025 | 76,556,135 | 23.6% |
| Wholesale | 169,209,585 | 201,096,465 | 18.8% |

Kiosk revenue is flat. But prices rose about 12% in January, so flat revenue means kiosks are buying **fewer** packs: 875 units against 935, down 6.4%. That's the kind of finding the managing director needs, and it only shows up when you look past the headline growth.

## Walkthrough

1. Start from your `kolanut-dax.pbix` model. Check the relationships, the marked date table and the `Date With Sales` column.
2. Organise `_Measures` into display folders: Sales, Time, Price & Volume, Customers.
3. Build a test page (hidden before you publish) with the `EVALUATE ROW` checks from lesson 10 and a card showing `[Price Effect] + [Volume Effect] - ([Revenue] - [Revenue LY (like for like)])`, which should be 0 for 2026. For that to hold at year level, change `Volume Effect` to subtract `[Revenue LY (like for like)]` instead of the plain last-year revenue.
4. Sketch the report: an overview page (KPIs and trend), a channels and customers page, and a customer health page.
5. Open the project brief on the course page and list the measures each task needs.

## Practice

```dataset
{"dataset": "sales", "files": ["orders", "customers", "products"]}
```

```answer
{
  "id": "dax-11-p1",
  "prompt": "What is the like-for-like **YoY %** for **Wholesale** in 2026 (January to June against January to June 2025)? One decimal place.",
  "answer": 18.8,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN o.order_date >= '2026-01-01' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(CASE WHEN o.order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) - 1), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Wholesale'",
  "hint": "A table by customers[channel] with YoY %, filtered to 2026.",
  "required": true
}
```

```answer
{
  "id": "dax-11-p2",
  "prompt": "What share of **2026** revenue came from **Wholesale**? One decimal place.",
  "answer": 69.2,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN c.channel = 'Wholesale' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01'",
  "hint": "% of Total by channel, filtered to 2026.",
  "required": true
}
```

```answer
{
  "id": "dax-11-p3",
  "prompt": "By how much did **Kiosk units** change in January to June 2026 against January to June 2025? A percentage to one decimal place (it's negative).",
  "answer": -6.4,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN o.order_date >= '2026-01-01' THEN o.quantity END) * 1.0 / SUM(CASE WHEN o.order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN o.quantity END) - 1), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Kiosk'",
  "hint": "Write Units LY (like for like) the same way as Revenue LY (like for like), then a Units YoY % measure.",
  "explanation": "Kiosks are buying 6.4% fewer packs; the price rise is hiding it. A recommendation could be a kiosk-sized pack, or a loyalty price for small retailers.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Kiosk revenue is up 0.5% after a 12% price rise. What does that tell you?",
    "options": ["Kiosks are stable", "Kiosks are buying fewer packs, and the price rise is hiding a fall in volume", "Kiosk prices didn't rise", "The measure is wrong"],
    "answer": 1,
    "explanation": "Separate price from volume before calling a channel healthy."
  },
  {
    "prompt": "Why put [Price Effect] + [Volume Effect] − growth on a hidden test page?",
    "options": ["To make the report longer", "It should be 0; if it isn't, one of the measures is wrong", "Power BI requires it", "To speed up the report"],
    "answer": 1,
    "explanation": "Two routes to the same number is one of the best tests of a measure library."
  },
  {
    "prompt": "Which comparison should the YoY % on the overview page use while 2026 is incomplete?",
    "options": ["2026 against all of 2025", "Like for like: the same dates in 2025 as have sales in 2026", "2026 against 2024", "No comparison at all"],
    "answer": 1,
    "explanation": "Compare the same months, or a part year will look like a collapse."
  }
]
```
