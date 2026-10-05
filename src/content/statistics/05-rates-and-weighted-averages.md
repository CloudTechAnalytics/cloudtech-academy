---
title: Rates, percentages and weighted averages
minutes: 25
summary: Report changes in rates without confusing percent and percentage points, calculate weighted averages correctly with SUMPRODUCT, and spot Simpson's paradox, where a trend in every group reverses in the total.
---

## The problem

Harbourline's quarterly board pack has a slide that reads:

> *"Air freight on-time delivery fell 13% this year. Average discount given: 2.7%."*

Both numbers are wrong, and not because of a calculation slip. The on-time rate fell from 80.9% to 67.8%: that's **13.1 percentage points**, which is a **16%** fall. And the discount figure averages the discount percentage across order lines as if every line were the same size, when big orders get bigger discounts. Weighted properly, Kolanut gives away 3.4% of gross sales in discounts, a quarter more than the slide says.

Rates, percentages and averages of averages cause more wrong conclusions in business reporting than any formula error. The rules are simple once you've seen them.

## The concept

### Percent change versus percentage points

When the thing you're measuring is itself a percentage (an on-time rate, a market share, a conversion rate), there are two ways to describe a change:

- **Percentage points (pp):** the simple difference. 80.9% → 67.8% is a fall of **13.1 pp**.
- **Percent change:** the change relative to where you started. (67.8 − 80.9) ÷ 80.9 = **−16.2%**.

Both are correct; they answer different questions. The mistake is writing "fell 13%" when you mean 13 points. Always say which: "on-time delivery fell 13.1 percentage points, from 80.9% to 67.8%". Giving the start and end values removes all doubt.

### Rates need their base

A rate is a count divided by a base: on-time shipments ÷ delivered shipments. Before comparing rates, check:

1. **The base is right.** Cancellations ÷ all bookings, not ÷ delivered shipments. On-time ÷ delivered, not ÷ all bookings (cancelled shipments can't be on time).
2. **The bases are big enough.** 2 of 3 is 67%, but you'd want far more than 3 before quoting it.
3. **You show the counts** next to the percentage: "67.8% (80 of 118)".

### Weighted averages

A simple average treats every row equally. A **weighted average** gives each value a weight, such as its size:

**weighted average = Σ(value × weight) ÷ Σ(weight)**

In Excel: `=SUMPRODUCT(values, weights) / SUM(weights)`.

Use a weighted average whenever the rows differ in size and the question is about the whole: the average discount on sales (weight by sales value), the average price per pack sold (weight by packs), the average salary across departments (weight by headcount). The simple average answers a different question: "what's the discount on a typical order line?"

### Simpson's paradox

Sometimes a pattern that holds in **every** group reverses when the groups are combined, because the groups are different sizes. An illustration with made-up numbers:

| | Depot A on time | Depot B on time |
| :-- | :-- | :-- |
| Easy local deliveries | 90 of 100 (90%) | 760 of 800 (95%) |
| Hard long-distance deliveries | 360 of 600 (60%) | 70 of 100 (70%) |
| **All deliveries** | **450 of 700 (64%)** | **830 of 900 (92%)** |

![Paired bars for Depot A and Depot B. Easy local deliveries: A 90% of 100, B 95% of 800. Hard long-distance: A 60% of 600, B 70% of 100. All deliveries: A 64% of 700, B 92% of 900.](/images/courses/statistics/simpson.svg "B is better in each group, but the overall gap is mostly about mix: A does far more hard deliveries.")

Depot B is better on **both** kinds of delivery. But Depot A looks far worse overall, and B even better, simply because A handles mostly hard deliveries. Judge A on its total and you'd blame the wrong team. When groups differ in mix, compare like with like: break the total down by the thing that differs.

## Example

Air freight on-time rate by year, from Harbourline's delivered shipments (on time = transit days ≤ the route's target):

| Year | On time | Delivered | Rate |
| :-- | --: | --: | --: |
| 2025 | 127 | 157 | 80.9% |
| 2026 | 80 | 118 | 67.8% |

The honest sentence: *"Air on-time delivery fell 13.1 percentage points, from 80.9% to 67.8% (a 16% fall). 2026 covers January to August only, with 118 shipments."*

Kolanut's discounts. The simple average of `discount_pct` over all order lines is **2.66%**. The discount actually given, as a share of gross sales value, weights each line by its value (quantity × unit_price):

```excel
=SUMPRODUCT(discount_pct, quantity * unit_price) / SUMPRODUCT(quantity, unit_price)
```

That's **3.38%**. The difference is the finding: larger lines get larger discounts, so discounts cost more than the per-line average suggests. Finance needs the 3.38%.

## Walkthrough

1. In Kolanut's `orders.csv`, calculate the simple average of `discount_pct`, then the value-weighted average with `SUMPRODUCT`. Why are they different?
2. Calculate the simple average `unit_price` and the price per pack weighted by `quantity`. Which answers "what does a pack sell for on average?"
3. In the logistics data, build `transit_days` and `on_time` (transit ≤ `target_transit_days`) for delivered shipments, with `mode` and booking year from the lookups.
4. Make a pivot table: mode in rows, year in columns, average of `on_time` (TRUE/FALSE averages to a rate when you use `=--on_time` as a 1/0 column).
5. For air freight, write the change in percentage points and in percent.
6. Calculate the cancellation rate per year: cancelled ÷ all bookings. Check you used the right base.

## Practice

```dataset
{"dataset": "logistics", "files": ["shipments", "routes"]}
```

```answer
{
  "id": "stat-05-p1",
  "prompt": "Air freight on-time delivery went from **80.9%** in 2025 to **67.8%** in 2026. By how many **percentage points** did it fall?",
  "answer": 13.1,
  "format": "number",
  "pyVerify": "round(80.9 - 67.8, 1)",
  "required": true
}
```

```answer
{
  "id": "stat-05-p2",
  "prompt": "What is Kolanut's **value-weighted** average discount: total discount given ÷ total gross value (quantity × unit_price)? As a percentage, two decimal places.",
  "answer": 3.38,
  "format": "percent",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(100.0 * SUM(quantity * unit_price * discount_pct / 100.0) / SUM(quantity * unit_price), 2) FROM orders",
  "pyVerify": "(lambda o: round((o['discount_pct'] * o['quantity'] * o['unit_price']).sum() / (o['quantity'] * o['unit_price']).sum(), 2))(data('sales', 'orders'))",
  "hint": "=SUMPRODUCT(discount_pct, quantity, unit_price) / SUMPRODUCT(quantity, unit_price)",
  "required": true
}
```

```answer
{
  "id": "stat-05-p3",
  "prompt": "What share of all shipments **booked in 2025** were **Cancelled**? As a percentage, one decimal place.",
  "answer": 5.6,
  "format": "percent",
  "dataset": "logistics",
  "files": ["shipments"],
  "verify": "SELECT ROUND(100.0 * SUM(status = 'Cancelled') / COUNT(*), 1) FROM shipments WHERE booking_date BETWEEN '2025-01-01' AND '2025-12-31'",
  "pyVerify": "(lambda s: round((s['status'] == 'Cancelled').mean() * 100, 1))(data('logistics', 'shipments').query('booking_date < \"2026-01-01\"'))",
  "hint": "Cancelled bookings ÷ all bookings in 2025 (the base is every booking, not just delivered ones).",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-05-c1",
  "prompt": "In the Simpson's paradox table above, what is **Depot B's** overall on-time rate? As a percentage, rounded to a whole number.",
  "answer": 92,
  "format": "percent",
  "pyVerify": "round(830 / 900 * 100)",
  "explanation": "830 of 900. B handles mostly easy deliveries, so its total looks far better than A's, even though the per-type gap is only 5 to 10 points.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Market share rises from 20% to 25%. Which statement is correct?",
    "options": ["It rose 5%", "It rose 5 percentage points, a 25% increase", "It rose 25 percentage points", "It rose 5 points, a 5% increase"],
    "answer": 1,
    "explanation": "25 − 20 = 5 pp; 5 ÷ 20 = 25%."
  },
  {
    "prompt": "Three products have margins of 10%, 20% and 30%, but the 10% product makes 80% of sales. What's the overall margin closest to?",
    "options": ["20%", "About 13%", "30%", "10%"],
    "answer": 1,
    "explanation": "Weight by sales: mostly the 10% product. (Illustration: 0.8 × 10 + 0.1 × 20 + 0.1 × 30 = 13%.)"
  },
  {
    "prompt": "What's the right base for an on-time delivery rate?",
    "options": ["All bookings", "Delivered shipments", "Cancelled shipments", "Customers"],
    "answer": 1,
    "explanation": "Only delivered shipments can be on time or late."
  },
  {
    "prompt": "Depot B beats Depot A on every delivery type but looks worse overall. What's the likely cause?",
    "options": ["A calculation error", "The depots handle different mixes of easy and hard deliveries (Simpson's paradox)", "Depot B is lying", "Rates can't be compared"],
    "answer": 1,
    "explanation": "Compare like with like by breaking totals down by the factor that differs."
  }
]
```
