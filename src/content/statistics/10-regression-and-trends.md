---
title: Regression and trends
minutes: 25
summary: Fit a straight line to data with SLOPE, INTERCEPT and RSQ, use it to estimate and forecast with FORECAST.LINEAR, read how much the line explains, and know when a trend line will mislead you.
---

## The problem

Two requests land on the analysts' desks the same morning.

Harbourline's sales team wants a quick way to quote: *"A customer is asking what 6 containers from Shanghai to Lagos will cost. Can we get a formula instead of looking up old invoices?"*

Kolanut's managing director wants a number for the budget: *"Revenue's been growing. If the trend continues, what will July 2026 look like?"*

Both are **regression** questions: fit a line through past data and use it to estimate something new. One of them will work very well. The other needs a large health warning. This lesson shows you how to tell which is which.

## The concept

### The line of best fit

Simple linear regression finds the straight line **y = intercept + slope × x** that sits closest to the points on a scatter chart (it minimises the squared vertical distances, hence "least squares").

```excel
=SLOPE(known_ys, known_xs)          how much y changes when x rises by 1
=INTERCEPT(known_ys, known_xs)      y when x is 0
=RSQ(known_ys, known_xs)            r²: share of the variation in y the line explains
=FORECAST.LINEAR(x, known_ys, known_xs)   the line's estimate of y for a new x
```

On a scatter chart, right-click the points → **Add Trendline**, and tick **Display equation** and **Display R-squared**. Google Sheets: **Customise → Series → Trendline**, with the label set to the equation.

### Reading the slope

The slope is in real units: "₦4.2 million per container", "₦730,000 more revenue each month". That's usually the most useful number regression gives you.

### How good is the line? r²

r² runs from 0 to 1. Near 1, the line captures almost everything and estimates from it are reliable. Near 0, the line explains little: the points scatter widely around it and any single estimate could be far off. There's no universal "good" value. For pricing, you'd want 0.9 or more; for messy business trends, 0.3 can still show a real direction while warning you not to trust individual months.

### Residuals: what the line misses

A **residual** is actual minus predicted. Plot or list them. A big residual is a point the line doesn't explain: an outlier worth investigating (December's festive spike). A pattern in the residuals (all positive in the middle, negative at the ends) means a straight line is the wrong shape.

![Kolanut's 18 months of revenue as dots with a rising trend line. Thin red lines join each dot to the line: these are the residuals. December 2025, at ₦66.3m, sits far above the line.](/images/courses/statistics/trend-residuals.svg "Residuals are the gaps between the data and the line. December 2025's is by far the largest.")

### When regression misleads

- **Extrapolation:** a line fitted to 1–8 containers says nothing reliable about 40 containers. A trend fitted to 18 months says little about 3 years from now.
- **Seasonality:** a straight line through monthly sales ignores December. Compare the same months year on year (lesson 9) or model seasons separately.
- **Cause:** a slope doesn't prove x causes y (lesson 6). Regression measures association.
- **Outliers** can drag the line; check the chart.

## Example

**Quoting Shanghai → Lagos (Apapa).** Harbourline's route 1 shipments, with `containers` as x and `freight_charge` as y:

```excel
=SLOPE(charge, containers)        4,219,636
=INTERCEPT(charge, containers)    -18,339
=RSQ(charge, containers)          0.98
```

The line: **charge ≈ ₦4.22 million per container** (the intercept is effectively zero). r² = 0.98: containers explain 98% of the variation in price. A quote for 6 containers:

```excel
=FORECAST.LINEAR(6, charge, containers)     25,299,478
```

About **₦25.3 million**, and with r² this high the sales team can quote with confidence, for loads within the range the route has carried (1 to 8 containers).

**Kolanut's revenue trend.** Number the months 1 (January 2025) to 18 (June 2026) and fit a line to monthly revenue:

| | Value |
| :-- | --: |
| Slope | ₦729,718 per month |
| r² | 0.32 |
| Forecast for month 19 (July 2026) | ₦53.1 million |

The direction is real: revenue has grown by roughly ₦730,000 a month. But r² is only 0.32. Individual months scatter widely around the line, mostly because December 2025 (₦66.3m) is far above it. Take December out and r² rises to 0.52. The honest budget sentence:

*"Revenue has grown by about ₦0.7m a month over 18 months. A straight-line trend puts July 2026 at about ₦53m, but months vary a lot around the trend (r² = 0.32), so plan for a range: recent months have been between ₦43m and ₦55m."*

## Walkthrough

1. In the logistics `shipments.csv`, filter to `route_id` 1. Insert a scatter chart of `containers` against `freight_charge`, add a trendline with its equation and R².
2. Calculate `SLOPE`, `INTERCEPT` and `RSQ` with formulas, and quote 6 containers with `FORECAST.LINEAR`.
3. In Kolanut's `orders.csv`, build monthly revenue with a pivot table (order_date grouped by month), then copy it to a sheet with a month number 1–18 next to each month.
4. Fit a trendline and calculate slope, r² and the forecast for month 19.
5. Add a **residual** column: actual − `FORECAST.LINEAR`(month). Which month has the largest residual?
6. Write the budget sentence for the managing director, with a range rather than a single number.

## Practice

```dataset
{"dataset": "logistics", "files": ["shipments"]}
```

```answer
{
  "id": "stat-10-p1",
  "prompt": "On route 1, what is the **slope** of `freight_charge` against `containers`: the cost per extra container? Round to the nearest naira.",
  "answer": 4219636,
  "format": "naira",
  "dataset": "logistics",
  "files": ["shipments"],
  "pyVerify": "(lambda s: round(stats.linregress(s['containers'], s['freight_charge']).slope))(data('logistics', 'shipments').query('route_id == 1'))",
  "hint": "=SLOPE(freight_charge, containers) on route 1's rows only.",
  "required": true
}
```

```answer
{
  "id": "stat-10-p2",
  "prompt": "Fitting a straight line to Kolanut's **monthly revenue** (month 1 = January 2025 … 18 = June 2026), what is **r²**? Two decimal places.",
  "answer": 0.32,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "(lambda m: round(stats.linregress(range(1, len(m) + 1), m.values).rvalue ** 2, 2))((lambda o: (o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100)).groupby(pd.to_datetime(o['order_date']).dt.to_period('M')).sum())(data('sales', 'orders')))",
  "required": true
}
```

```answer
{
  "id": "stat-10-p3",
  "prompt": "Using that line, what is `FORECAST.LINEAR` for **month 19** (July 2026)? Give it in **millions of naira**, one decimal place.",
  "answer": 53.1,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "(lambda m: round((lambda l: l.intercept + l.slope * 19)(stats.linregress(range(1, len(m) + 1), m.values)) / 1e6, 1))((lambda o: (o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100)).groupby(pd.to_datetime(o['order_date']).dt.to_period('M')).sum())(data('sales', 'orders')))",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-10-c1",
  "prompt": "Which month has the **largest positive residual** (actual revenue furthest above the trend line)? Answer as YYYY-MM.",
  "answer": "2025-12",
  "format": "text",
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "(lambda m: str(m.index[(lambda l: (m.values - (l.intercept + l.slope * pd.Series(range(1, len(m) + 1)).values)).argmax())(stats.linregress(range(1, len(m) + 1), m.values))]))((lambda o: (o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100)).groupby(pd.to_datetime(o['order_date']).dt.to_period('M')).sum())(data('sales', 'orders')))",
  "explanation": "December 2025, the festive peak. A straight line can't capture seasonality; that's why the forecast needs a range.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A regression of delivery cost on distance gives slope = 85. What does it mean?",
    "options": ["Cost is 85 per delivery", "Each extra unit of distance adds about 85 to the cost", "85% of cost is distance", "The line fits 85% of points"],
    "answer": 1,
    "explanation": "The slope is the change in y for a one-unit change in x."
  },
  {
    "prompt": "r² = 0.98 for price against containers on one route. What does that tell you?",
    "options": ["Containers explain almost all the variation in price, so estimates from the line are reliable within the data's range", "98% of shipments are on time", "Price causes containers", "The forecast is exact for any number of containers"],
    "answer": 0,
    "explanation": "A high r² means a tight fit, within the range the data covers."
  },
  {
    "prompt": "The line was fitted on shipments of 1 to 8 containers. A customer asks for 50. What's the risk?",
    "options": ["None", "Extrapolation: the line may not hold far outside the data, such as with bulk discounts or a different vessel", "The slope changes sign", "r² becomes negative"],
    "answer": 1,
    "explanation": "Don't trust a line far beyond the data it was fitted on."
  },
  {
    "prompt": "Monthly sales trend: r² = 0.3, with one big spike every December. What's the best approach for a forecast?",
    "options": ["Use the straight line exactly", "Report the trend direction with a wide range, and treat seasonality (such as December) separately", "Ignore the trend", "Remove December from the data forever"],
    "answer": 1,
    "explanation": "A straight line can't model seasons. Give a range and handle the season on its own."
  }
]
```
