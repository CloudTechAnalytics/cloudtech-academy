---
title: Distributions and outliers
minutes: 25
summary: See the shape of your data with a histogram, recognise skewed and symmetric distributions, measure how unusual a value is with a z-score, flag outliers with the IQR rule, and decide what to do about them.
---

## The problem

Harbourline's operations manager has a list of 247 delivered shipments on its busiest lane, Shanghai to Lagos (Apapa), and two questions:

> "Which shipments were unusually slow? And is 'slow' something that happens randomly, or is there a pattern?"

Averages and standard deviations summarise data in one or two numbers, but they can't show you its **shape**. Two lanes with the same mean and standard deviation can look completely different, and the shape tells you what's actually going on: steady service with rare delays, or two different kinds of shipment mixed together.

## The concept

### The distribution and the histogram

A **distribution** is how often each value occurs. A **histogram** shows it: the values are grouped into ranges (bins) along the bottom, and each bar's height is how many values fall in that range.

In Excel: select the column, then **Insert → Charts → Histogram** (Excel 2016 and later). Right-click the horizontal axis → **Format Axis** to set the bin width. In Google Sheets: **Insert → Chart → Chart type: Histogram**. Or count bins yourself with `COUNTIFS(range, ">="&low, range, "<"&high)`.

### Shapes to recognise

| Shape | What it looks like | Typical data | Mean vs median |
| :-- | :-- | :-- | :-- |
| **Symmetric, bell-shaped** | One peak in the middle, tails equal | heights, measurement errors, many averages | about equal |
| **Right-skewed** | Peak on the left, long tail to the right | income, revenue, delays, waiting times | mean > median |
| **Left-skewed** | Long tail to the left | scores on an easy test | mean < median |
| **Bimodal** | Two peaks | two different groups mixed together | can mislead |

A bimodal histogram is a signal to split the data: it usually means two processes (sea and air, retail and wholesale) are being treated as one.

`=SKEW(range)` gives a number: about 0 is symmetric, positive is right-skewed, negative left-skewed. Values above about 1 are strongly skewed.

### How unusual is a value? The z-score

A **z-score** says how many standard deviations a value is from the mean:

**z = (value − mean) ÷ standard deviation**

In Excel: `=STANDARDIZE(value, mean, sd)`. A z-score of 0 is exactly average; +2 is two SDs above. For bell-shaped data, values beyond ±2 are unusual (about 1 in 20) and beyond ±3 very unusual (about 1 in 400). For skewed data, z-scores are a rougher guide, because the tail is longer on one side.

**Worked example.** Shanghai → Apapa shipments average 39.0 days with a standard deviation of 4.7 days.

| Shipment took | Calculation | z | Reading |
| :-- | :-- | --: | :-- |
| 36 days | (36 − 39.0) ÷ 4.7 | −0.64 | A little faster than average: normal |
| 45 days | (45 − 39.0) ÷ 4.7 | +1.28 | Slower than most, but not unusual |
| 50 days | (50 − 39.0) ÷ 4.7 | +2.34 | Beyond +2: unusually slow, worth a look |

A z-score turns "50 days" into "more than two standard deviations slow", which means the same thing on any route, whatever its normal length.

### Flagging outliers: the IQR rule

A common, robust rule (the one behind box plots):

- **Upper fence** = Q3 + 1.5 × IQR
- **Lower fence** = Q1 − 1.5 × IQR

Values outside the fences are **outliers**. Because it's built from quartiles, extreme values don't distort the rule itself.

### What to do with an outlier

An outlier is a question, not a mistake. Find out why before you act:

1. **A data error** (a typo, a test record, the wrong unit): fix it or remove it, and note what you did.
2. **A real, rare event** (a delayed vessel, a huge one-off order): keep it. It's often the most important thing in the data. Report it separately if it distorts an average.
3. **A different kind of thing** (an air shipment in a list of sea shipments): it belongs in a different group.

Never delete outliers just because they make a chart untidy.

## Example

Shanghai → Lagos (Apapa), delivered shipments, transit days:

- **Mean** 39.0 days, **SD** 4.7 days.
- The histogram has a tall block at **35–38 days** (184 of 247 shipments) and then a **long tail to the right**, out to 53 days. Nothing arrives unusually early.

![A histogram of transit days for 247 delivered Shanghai to Lagos shipments. Tall bars at 35 to 38 days, then low bars out to 53 days. A dashed line marks the mean, 39.0 days; another marks mean plus 2 standard deviations, 48.4 days. The bars beyond it are red.](/images/courses/statistics/transit-histogram.svg "Route 1's transit times: a tight block of on-time shipments and a one-sided tail of delays.")

Z-scores make it concrete. The upper threshold of 2 SDs is 39.0 + 2 × 4.7 ≈ 48.4 days. **20 shipments** are more than 2 SDs slow; **none** are more than 2 SDs fast.

That's the pattern the manager was asking about. On-time service on this lane is tight (35–38 days), and delays aren't random noise in both directions: they're a separate, one-sided problem. Something occasionally holds shipments up (port congestion, transhipment, customs), and it's worth investigating those 20 shipments by date and customer, rather than treating "39 ± 5 days" as the lane's normal behaviour.

## Walkthrough

1. Open Kolanut's `orders.csv` and add `revenue` = quantity × unit_price × (1 − discount_pct/100).
2. Insert a histogram of `revenue`. Describe its shape in one sentence. Check with `=SKEW(revenue)`.
3. Calculate Q1, Q3, the IQR and the upper fence for `revenue`. Count the outliers with `COUNTIF(revenue, ">"&upper_fence)`.
4. Sort by revenue, largest first, and look at the top outliers. Are they errors, or real large orders?
5. In the HR data, calculate the z-score of the highest salary (₦1,565,000) with `STANDARDIZE`.
6. In the logistics data, filter to delivered shipments on route 1, add `transit_days`, insert a histogram, and count shipments more than 2 SDs above the mean.

## Practice

```answer
{
  "id": "stat-04-p1",
  "prompt": "Using the IQR rule (above Q3 + 1.5 × IQR, quartiles from `QUARTILE.INC`), how many order lines in `orders.csv` are **high outliers** by revenue?",
  "answer": 53,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "(lambda r: (r > r.quantile(0.75) + 1.5 * (r.quantile(0.75) - r.quantile(0.25))).sum())((lambda o: o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100))(data('sales', 'orders')))",
  "hint": "Revenue = quantity × unit_price × (1 − discount_pct/100). Then Q1, Q3, IQR, upper fence, and COUNTIF above it.",
  "explanation": "53 lines above about ₦580,950. They're real: large orders of the most expensive products, not errors. Worth reporting, not deleting.",
  "required": true
}
```

```answer
{
  "id": "stat-04-p2",
  "prompt": "What is the **z-score** of the highest monthly salary (₦1,565,000) in the HR data? Use the mean and `STDEV.S` of all 80 salaries. Two decimal places.",
  "answer": 2.5,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "hr",
  "files": ["employees"],
  "pyVerify": "(lambda s: round((s.max() - s.mean()) / s.std(), 2))(data('hr', 'employees')['monthly_salary'])",
  "hint": "=STANDARDIZE(1565000, AVERAGE(G2:G81), STDEV.S(G2:G81))",
  "required": true
}
```

```answer
{
  "id": "stat-04-p3",
  "prompt": "On route 1 (Shanghai → Lagos Apapa), how many **delivered** shipments took **more than 2 standard deviations longer** than the route's mean transit time?",
  "answer": 20,
  "format": "number",
  "dataset": "logistics",
  "files": ["shipments"],
  "pyVerify": "(lambda t: (t > t.mean() + 2 * t.std()).sum())((lambda s: (pd.to_datetime(s['delivery_date']) - pd.to_datetime(s['ship_date'])).dt.days)(data('logistics', 'shipments').query('route_id == 1 and status == \"Delivered\"')))",
  "hint": "Filter to route_id 1 and Delivered, add transit_days = delivery_date − ship_date, then count values above AVERAGE + 2 × STDEV.S.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-04-c1",
  "prompt": "What is the **skewness** (`=SKEW`) of order-line revenue? Two decimal places. Is it right- or left-skewed?",
  "answer": 0.87,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "round((lambda o: o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100))(data('sales', 'orders')).skew(), 2)",
  "explanation": "0.87: moderately right-skewed, as revenue nearly always is. A few large lines stretch the right tail.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A histogram of delivery times has two clear peaks, at 2 days and at 30 days. What's the most likely explanation?",
    "options": ["Random noise", "Two different kinds of shipment (such as air and sea) mixed together", "A data error", "The bins are too wide"],
    "answer": 1,
    "explanation": "Bimodal data usually means two groups. Split them and summarise each."
  },
  {
    "prompt": "A shipment's z-score is 3.2. What does that mean?",
    "options": ["It took 3.2 days", "It's 3.2 standard deviations above the mean: very unusual", "It's 3.2% late", "It's average"],
    "answer": 1,
    "explanation": "z counts standard deviations from the mean."
  },
  {
    "prompt": "You find an order for 3,000 packs when every other order is under 30. What should you do first?",
    "options": ["Delete it", "Find out why: a typo, a test record, or a real bulk order", "Replace it with the average", "Ignore outliers always"],
    "answer": 1,
    "explanation": "An outlier is a question. Its cause decides whether to fix, keep or separate it."
  },
  {
    "prompt": "Q1 = 80,000 and Q3 = 280,000. What is the upper fence for outliers?",
    "options": ["380,000", "580,000", "480,000", "300,000"],
    "answer": 1,
    "explanation": "IQR = 200,000. Upper fence = 280,000 + 1.5 × 200,000 = 580,000."
  }
]
```
