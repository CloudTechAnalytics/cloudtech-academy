---
title: "Spread: range, IQR and standard deviation"
minutes: 25
summary: Measure how spread out data is with the range, the interquartile range and the standard deviation, know which standard deviation to use, and compare variability fairly with the coefficient of variation.
---

## The problem

Harbourline Freight's customers keep asking the same question: "How long will my shipment take?" The operations manager's answer is the average: "Sea freight takes about 27 days."

A customer planning a factory production run doesn't just need the average. They need to know **how reliable** it is. If almost every shipment arrives in 25–29 days, they can plan around 27. If some take 10 days and others 50, the average is nearly useless and they need to hold more stock.

Two datasets can have exactly the same average and behave completely differently. **Spread** (or variability) is the second number you report alongside every average.

## The concept

**Range: the simplest spread**

`=MAX(range) - MIN(range)`. Easy to explain, but it depends entirely on the two most extreme values, so one unusual shipment can double it.

**Quartiles and the interquartile range (IQR)**

Sort the data and cut it into four equal parts:

- **Q1** (25th percentile): a quarter of values are below it.
- **Q2** = the median.
- **Q3** (75th percentile): three quarters are below it.

The **IQR = Q3 − Q1** is the range of the middle half of the data. Extremes don't affect it, which makes it the natural partner of the median.

```excel
=QUARTILE.INC(range, 1)      Q1
=QUARTILE.INC(range, 3)      Q3
=PERCENTILE.INC(range, 0.9)  the 90th percentile
```

Percentiles answer service-level questions directly: "90% of sea shipments arrive within X days" is a promise a customer can plan around.

**Standard deviation: the typical distance from the mean**

The **standard deviation (SD)** measures how far values typically are from the mean, in the same units as the data. Roughly:

1. Find each value's distance from the mean.
2. Square the distances (so negatives don't cancel positives), and average them: that's the **variance**.
3. Take the square root to get back to the original units: the **standard deviation**.

```excel
=STDEV.S(range)    a sample: divides by n − 1
=STDEV.P(range)    a whole population: divides by n
```

**Which one?** Use `STDEV.S` when your data is a **sample** and you want to describe the wider population, which is almost always the case (this month's shipments as a guide to future shipments). Use `STDEV.P` only when the data **is** the whole population and you only care about it. With a few hundred rows the two are nearly identical; with 10 rows they differ noticeably.

The SD goes with the mean; the IQR goes with the median. On skewed data, report the median and IQR.

**Comparing spread fairly: the coefficient of variation**

Managers' salaries vary by about ₦121,000 and juniors' by about ₦62,000. Are managers' salaries more variable? Not relative to their size. The **coefficient of variation (CV)** puts spread on a common scale:

**CV = standard deviation ÷ mean × 100%**

Junior salaries: CV ≈ 22%. Manager salaries: CV ≈ 9%. Junior pay is actually twice as variable relative to its level.

> [!TIP]
> Spread can be hidden by mixing groups. If you calculate the SD of sea transit times across **all** routes, Shanghai's 39-day voyages and Tema's 4-day hops get mixed together and the spread looks huge. Each route on its own may be very consistent. Always ask: is this spread within one process, or between different ones?

## Example

Sea freight transit times, in Harbourline's logistics data. Add a column `transit_days` = `delivery_date − ship_date` to `shipments.csv`, look up each shipment's `mode` from `routes.csv` with XLOOKUP, and filter to **Delivered** **Sea** shipments.

| | All sea routes | Route 1 only (Shanghai → Lagos Apapa) |
| :-- | --: | --: |
| Mean | 27.0 days | 39.0 days |
| Standard deviation | 12.6 days | 4.7 days |
| CV | 47% | 12% |

Across all sea routes, the spread is enormous (a CV of 47%), because it mixes 4-day coastal hops with 40-day voyages from China. On a single route, shipments are far more predictable: Shanghai to Apapa takes 39 days, give or take about 5.

So the useful answer to the customer isn't "27 days". It's per route: "From Shanghai, plan for 39 days; most shipments arrive within about 5 days either side."

## Walkthrough

1. Open Kolanut's `orders.csv`. Calculate the mean and standard deviation of `quantity` with `AVERAGE` and `STDEV.S`. Then `STDEV.P`. How different are they with 4,266 rows?
2. Calculate Q1, Q3 and the IQR of `quantity` with `QUARTILE.INC`. The middle half of order lines are between which quantities?
3. Open the HR `employees.csv`. Calculate the median and IQR of `monthly_salary`, then the mean and SD. Which pair would you report, and why?
4. Calculate the CV for Junior and for Manager salaries: `=STDEV.S(IF(D2:D81="Junior", G2:G81)) / AVERAGEIFS(G2:G81, D2:D81, "Junior")`.
5. Open the logistics `shipments.csv` and `routes.csv`. Build `transit_days` and `mode`, filter to delivered sea shipments, and calculate the SD. Then do the same for route 1 only.
6. Write the sentence you'd give a customer shipping from Shanghai.

## Practice

```dataset
{"dataset": "sales", "files": ["orders"]}
```

```answer
{
  "id": "stat-03-p1",
  "prompt": "What is the **sample standard deviation** (`STDEV.S`) of `quantity` in Kolanut's `orders.csv`? Two decimal places.",
  "answer": 7.96,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(SQRT(SUM((quantity - (SELECT AVG(quantity) FROM orders)) * (quantity - (SELECT AVG(quantity) FROM orders))) / (COUNT(*) - 1)), 2) FROM orders",
  "pyVerify": "round(data('sales', 'orders')['quantity'].std(), 2)",
  "required": true
}
```

```answer
{
  "id": "stat-03-p2",
  "prompt": "What is the **interquartile range** (Q3 − Q1, using `QUARTILE.INC`) of `monthly_salary` in the HR data?",
  "answer": 498750,
  "format": "naira",
  "dataset": "hr",
  "files": ["employees"],
  "pyVerify": "(lambda s: s.quantile(0.75) - s.quantile(0.25))(data('hr', 'employees')['monthly_salary'])",
  "hint": "=QUARTILE.INC(G2:G81, 3) - QUARTILE.INC(G2:G81, 1)",
  "explanation": "The middle half of salaries span about ₦500,000: from ₦332,500 to ₦831,250.",
  "required": true
}
```

```answer
{
  "id": "stat-03-p3",
  "prompt": "What is the **coefficient of variation** of **Junior** salaries, as a percentage? One decimal place. (Use `STDEV.S`.)",
  "answer": 21.9,
  "format": "percent",
  "dataset": "hr",
  "files": ["employees"],
  "pyVerify": "(lambda s: round(s.std() / s.mean() * 100, 1))(data('hr', 'employees').query('job_level == \"Junior\"')['monthly_salary'])",
  "hint": "Standard deviation ÷ mean × 100, both for Junior staff only.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-03-c1",
  "prompt": "For **delivered sea** shipments in the logistics data, what is the **90th percentile** of transit days (delivery date − ship date)? Use `PERCENTILE.INC`.",
  "answer": 40,
  "format": "number",
  "dataset": "logistics",
  "files": [
    "shipments",
    "routes"
  ],
  "pyVerify": "(lambda s: (pd.to_datetime(s['delivery_date']) - pd.to_datetime(s['ship_date'])).dt.days.quantile(0.9))(data('logistics', 'shipments').merge(data('logistics', 'routes'), on='route_id').query('status == \"Delivered\" and mode == \"Sea\"'))",
  "explanation": "90% of delivered sea shipments arrive within about 40 days: a promise you could put in a contract, where the average of 27 days isn't.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Two suppliers both deliver in 10 days on average. Supplier A's SD is 1 day; supplier B's is 6 days. Which is easier to plan around?",
    "options": ["A", "B", "Both the same", "You can't say"],
    "answer": 0,
    "explanation": "Same average, but A is far more predictable."
  },
  {
    "prompt": "Your data is a sample of this year's orders and you want to describe orders in general. Which function?",
    "options": ["STDEV.P", "STDEV.S", "VAR.P", "MAX − MIN"],
    "answer": 1,
    "explanation": "STDEV.S is for samples, which is the usual case."
  },
  {
    "prompt": "Salaries are strongly right-skewed. Which pair of summaries should you report?",
    "options": ["Mean and SD", "Median and IQR", "Mode and range", "Mean and range"],
    "answer": 1,
    "explanation": "Median and IQR aren't pulled by extremes."
  },
  {
    "prompt": "Managers' salaries have a larger SD than juniors' in naira, but a smaller CV. What does that mean?",
    "options": ["Managers' pay varies more relative to its level", "Juniors' pay varies more relative to its level", "The data is wrong", "CV and SD always agree"],
    "answer": 1,
    "explanation": "The CV compares spread relative to the mean; managers earn far more, so the same naira spread is small relative to their pay."
  }
]
```
