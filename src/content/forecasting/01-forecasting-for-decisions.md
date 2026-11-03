---
title: Forecasting for decisions
minutes: 20
summary: What a forecast is for, how the decision sets the horizon and the level of detail, and a first look at four years of daily demand at Kolanut's Lagos depot.
---

## The problem

Kolanut's Lagos depot orders stock from its suppliers every week, and deliveries take two weeks to arrive. Order too little and the shelves are empty when shops come to restock, so they buy from a competitor. Order too much and money sits in the warehouse, and drinks go past their best-before date.

So every Monday, the depot manager needs a number: how much of each product will sell in the weeks the next order has to cover. Today that number is a guess based on "last month, plus a bit". This course replaces the guess with forecasts built from four years of daily sales, tested honestly, and turned into order quantities.

## The concept

### A forecast serves a decision

Before choosing any method, answer four questions:

| Question | Kolanut's depot |
| :-- | :-- |
| **What decision** does the forecast feed? | the weekly order to the supplier |
| **Horizon**: how far ahead? | weeks 3 and 4 from now (the order arrives in two weeks) |
| **Granularity**: what level of detail? | units per product per week (daily forecasts, added up) |
| **Cost of errors**: which hurts more? | running out (lost sales and customers) usually hurts more than overstock |

![Four weeks on a timeline. The order is placed today and takes two weeks to arrive, so weeks 1 and 2 are covered by stock and the forecast that matters is weeks 3 and 4.](/images/courses/forecasting/decision-timeline.svg "Why the horizon is weeks 3 and 4: the period the order must last.")

### Time series data

A time series is a measurement taken at regular intervals: daily units here. Unlike the rows in earlier courses, the order matters. Yesterday's sales tell you something about today's, and the past is all you have to learn from.

### What forecasts can and can't do

A forecast extends the patterns of the past: trends, seasons, regular events. It can't foresee things that have never happened (a competitor's launch, a strike). Good forecasting is honest about that, with a range as well as a number.

## Example

Load the data. Kolanut's depot sells six products; most of this course follows one of them, the malt drink:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/demand/"
sales = pd.read_csv(base + "daily_sales.csv", parse_dates=["date"])
holidays = pd.read_csv(base + "holidays.csv", parse_dates=["date"])
print(sales["date"].min().date(), "to", sales["date"].max().date(), "|", sales["product"].nunique(), "products")

malt = sales[sales["product"] == "Malt drink 330ml (24)"].set_index("date")["units"]
malt.resample("YE").sum()
```

```text
2022-07-01 to 2026-06-30 | 6 products
date
2022-12-31    24519
2023-12-31    48109
2024-12-31    51876
2025-12-31    53298
2026-12-31    24990
Freq: YE-DEC, Name: units, dtype: int64
```

The first and last years are half-years (July 2022 onwards, and January to June 2026). The full years grow slowly. Now weekly totals for the last few months, the level of detail the ordering decision uses:

```python
malt.resample("W-SUN").sum().tail(8)
```

```text
date
2026-05-17    1013
2026-05-24     980
2026-05-31     933
2026-06-07     921
2026-06-14     930
2026-06-21     911
2026-06-28     909
2026-07-05     285
Freq: W-SUN, Name: units, dtype: int64
```

## Walkthrough

1. Load the data and plot the malt drink's daily units: `malt.plot(figsize=(12, 4))`. You'll see weekly wiggles, a big peak every December, and occasional days at zero.
2. Plot the weekly totals instead. Which patterns are easier to see?
3. Look at `holidays`: the days the depot was closed explain the zeros.
4. Write down the decision, horizon, granularity and cost of errors for a forecast you know (your own business, or a shop you use).

## Practice

```dataset
{"dataset": "demand", "files": ["daily_sales", "holidays"]}
```

```answer
{
  "id": "ts-01-p1",
  "prompt": "How many units of the malt drink did the depot sell in **2025**?",
  "answer": 53298,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales"],
  "pyVerify": "int(malt.loc['2025'].sum())",
  "hint": "The 2025 row of the yearly totals.",
  "required": true
}
```

```task
{
  "id": "ts-01-t1",
  "prompt": "A pharmacy chain wants to forecast demand for malaria medicine. Write one line each for **Decision:**, **Horizon:**, **Granularity:** and **Cost of errors:**, with a specific choice and a short reason on each.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "Decision: ...\nHorizon: ...",
  "rules": [
    { "label": "A Decision line", "pattern": "^\\s*[-*]?\\s*decision\\s*:" },
    { "label": "A Horizon line with a time period", "pattern": "^\\s*[-*]?\\s*horizon\\s*:[^\\n]*(day|week|month)" },
    { "label": "A Granularity line", "pattern": "^\\s*[-*]?\\s*granularity\\s*:" },
    { "label": "A Cost of errors line comparing too little with too much", "pattern": "^\\s*[-*]?\\s*cost of errors?\\s*:[^\\n]*(run(ning)? out|stock-?out|too little|shortage|empty|overstock|too much)[^\\n]*" }
  ],
  "sample": "Decision: how much of each malaria medicine each branch orders from the central warehouse each week.\nHorizon: 1 to 2 weeks ahead, because the warehouse delivers to branches within a week.\nGranularity: units per product per branch per week, since each branch orders separately.\nCost of errors: running out is far worse than overstock: patients go elsewhere or go untreated, while extra stock keeps for months.",
  "note": "The cost of errors is what turns a forecast into an order: when running out costs more, you order above the forecast (lesson 7).",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should you decide before choosing a forecasting method?",
    "options": ["The software", "The decision it serves, the horizon, the granularity and the cost of errors", "The colour of the chart", "The number of models"],
    "answer": 1,
    "explanation": "The decision sets everything else."
  },
  {
    "prompt": "Supplier deliveries take two weeks. Which horizon matters for today's order?",
    "options": ["Tomorrow", "Weeks 3 and 4 from now, which the order must cover", "Next year", "Last week"],
    "answer": 1,
    "explanation": "Forecast the period the order is for."
  },
  {
    "prompt": "What can't a forecast built from past sales foresee?",
    "options": ["December peaks", "A brand-new event that has never happened, such as a competitor's surprise launch", "Weekly patterns", "Growth trends"],
    "answer": 1,
    "explanation": "Forecasts extend past patterns; new shocks need judgement."
  }
]
```
