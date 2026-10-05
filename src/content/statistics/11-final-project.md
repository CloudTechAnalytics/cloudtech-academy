---
title: "Final project: delivery performance review"
minutes: 20
summary: Plan and start your final project, a statistical review of Harbourline Freight's delivery performance that uses every tool in the course, and check your set-up with three warm-ups.
---

## The problem

Harbourline Freight's customers judge it on one thing: does the shipment arrive when promised? The operations director wants a review she can take to the board:

> "How reliable are we, really? Where are we worst, and is it getting better or worse? And give the sales team something useful for quoting."

A review like that needs everything in this course: the right averages and spreads, percentiles a customer can plan around, outliers investigated rather than deleted, rates with confidence intervals, tests that separate real changes from noise, and a regression the sales team can use. This lesson sets up the project; the full brief and submission are on the course's project page.

## The concept

### From questions to statistics

Each of the director's questions maps to a tool:

| Question | Tool | Lesson |
| :-- | :-- | :-- |
| How long do shipments take? | Median, IQR and 90th percentile, by mode and route | 2, 3 |
| How reliable is each route? | On-time rate with a 95% confidence interval | 5, 8 |
| Which shipments went badly wrong? | Histogram, z-scores, the IQR rule | 4 |
| Is anything getting better or worse? | Two-proportion test, 2025 against 2026 | 9 |
| What should a quote look like? | Regression of charge on containers, for one route | 10 |

### Definitions first

State them at the top of your workbook, because every number depends on them:

- **Transit days** = `delivery_date − ship_date`, for **Delivered** shipments only.
- **On time** = transit days ≤ the route's `target_transit_days`.
- **Year** = the year of `booking_date`. 2026 runs from January to August only.

### A fair comparison

Routes have very different targets: one day for Lagos–Ibadan by road, 42 for Shanghai–Onne by sea. Comparing raw transit times across routes is meaningless; compare on-time rates, or days late against each route's own target. And watch for small routes: a route with 36 deliveries has a wide confidence interval.

## Example

A first look at on-time performance by route. With a pivot table of delivered shipments (route in rows; count and average of a 1/0 `on_time` column), sorted by on-time rate, the three least punctual routes are:

| Route | Target | Delivered | On time |
| :-- | --: | --: | --: |
| Lagos → Ibadan (road) | 1 day | 62 | 69.4% |
| Lagos → Abuja (air) | 1 day | 36 | 69.4% |
| London Heathrow → Lagos (air) | 1 day | 53 | 69.8% |

All three have a **one-day** target. That's a finding in itself: the least punctual routes aren't the long sea voyages, they're the short trips with no slack. The question for the director isn't only "why are these routes late?" but also "is a one-day promise realistic?" Before saying either, check the confidence intervals: with 36 to 62 deliveries each, the margins are around ±12 to ±15 points, so these three aren't clearly worse than routes in the low 70s.

Overall, 76.6% of the 2,411 delivered shipments arrived on time.

## Walkthrough

1. Download the logistics dataset. In `shipments.csv`, add `mode`, `origin`, `destination` and `target_transit_days` from `routes.csv` with XLOOKUP.
2. Add `transit_days`, `on_time` (1 or 0) and `year`, and filter to Delivered shipments. Write your three definitions at the top of a Notes sheet.
3. Build a pivot table of on-time rate and count by mode, then by route.
4. For each mode, calculate the median, IQR and 90th percentile of transit days.
5. Pick the route you'll use for the quoting formula and fit `freight_charge` against `containers`.
6. Open the project brief on the course page and list which tool answers each of its tasks.

## Practice

```dataset
{"dataset": "logistics", "files": ["shipments", "routes"]}
```

```answer
{
  "id": "stat-11-p1",
  "prompt": "What percentage of **delivered** shipments arrived **on time** (transit days ≤ the route's target)? One decimal place.",
  "answer": 76.6,
  "format": "percent",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "verify": "SELECT ROUND(100.0 * SUM(julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days) / COUNT(*), 1) FROM shipments s JOIN routes r ON r.route_id = s.route_id WHERE s.status = 'Delivered'",
  "pyVerify": "(lambda d: round(((pd.to_datetime(d['delivery_date']) - pd.to_datetime(d['ship_date'])).dt.days <= d['target_transit_days']).mean() * 100, 1))(data('logistics', 'shipments').merge(data('logistics', 'routes'), on='route_id').query('status == \"Delivered\"'))",
  "required": true
}
```

```answer
{
  "id": "stat-11-p2",
  "prompt": "Among **sea** routes, which **route_id** has the **largest standard deviation** of transit days for delivered shipments?",
  "answer": 11,
  "format": "number",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "pyVerify": "(lambda d: d.assign(t=(pd.to_datetime(d['delivery_date']) - pd.to_datetime(d['ship_date'])).dt.days).groupby('route_id')['t'].std().idxmax())(data('logistics', 'shipments').merge(data('logistics', 'routes'), on='route_id').query('status == \"Delivered\" and mode == \"Sea\"'))",
  "hint": "A pivot table of StdDev of transit_days by route, filtered to mode = Sea.",
  "explanation": "Route 11, Shanghai → Onne: the least predictable sea lane, varying by about 5 days either side of its 42-day average.",
  "required": true
}
```

```answer
{
  "id": "stat-11-p3",
  "prompt": "When a delivered shipment **is late**, what is the **median** number of days late (transit days − target)?",
  "answer": 2,
  "format": "number",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "pyVerify": "(lambda d: (lambda late: late[late > 0].median())((pd.to_datetime(d['delivery_date']) - pd.to_datetime(d['ship_date'])).dt.days - d['target_transit_days']))(data('logistics', 'shipments').merge(data('logistics', 'routes'), on='route_id').query('status == \"Delivered\"'))",
  "explanation": "A median of 2 days, but a mean of about 4.5: most late shipments are a little late, and a few are very late. The median and the mean together tell that story.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why compare routes by on-time rate rather than average transit days?",
    "options": ["Transit days are less accurate", "Routes have very different targets, so raw transit times aren't comparable", "On-time rates are always higher", "Averages can't be calculated per route"],
    "answer": 1,
    "explanation": "Compare each route against its own promise."
  },
  {
    "prompt": "A route with 36 deliveries has a 69% on-time rate; another with 200 has 72%. What should you say?",
    "options": ["The first route is clearly worse", "The difference is small and the first route's interval is wide, so it may not be a real difference", "The second route is worse", "Small routes should be ignored"],
    "answer": 1,
    "explanation": "Check intervals or test before ranking routes on small differences."
  },
  {
    "prompt": "Late shipments: median 2 days late, mean 4.5. What does that tell you?",
    "options": ["The data has errors", "Most late shipments are slightly late, and a few are very late (right skew)", "The mean is wrong", "Half are 4.5 days late"],
    "answer": 1,
    "explanation": "Mean above median means a long right tail."
  }
]
```
