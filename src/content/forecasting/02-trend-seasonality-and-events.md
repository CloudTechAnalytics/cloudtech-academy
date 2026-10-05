---
title: Trend, seasonality and events
minutes: 15
summary: Break a series into its building blocks (trend, weekly and yearly seasonality, paydays, holidays and promotions) by measuring each one directly from the data.
---

## The problem

The depot manager has a feel for the patterns: "Saturdays are busy, Sundays are dead, December is mad, and everyone buys drinks before Eid." He's right, but feelings can't be put into a spreadsheet or a model. How much busier is Saturday? How mad is December? Is the month-end payday bump real or a story?

Every forecasting method, from the simplest to the most advanced, works by capturing these patterns. Measuring them first tells you which ones matter and gives you something to check every model against.

## The concept

### The building blocks of a demand series

| Component | What it is | Kolanut example |
| :-- | :-- | :-- |
| **Trend** | the long-run direction | slow growth year on year |
| **Weekly seasonality** | a repeating pattern each week | Saturday high, Sunday low |
| **Yearly seasonality** | a repeating pattern each year | December peak, quiet January |
| **Calendar events** | dates that move or recur | paydays at month-end, Eid, Christmas closures |
| **Promotions** | planned changes that lift sales | week-long price promotions |
| **Noise** | what's left | weather, a big customer's order |

### Measuring each one

- **Trend**: a 28-day or 365-day rolling average smooths the rest away.
- **Seasonal profiles**: average units by weekday, or by month, divided by the overall average, give **seasonal indices** (1.25 = 25% above average).
- **Events**: compare event days with similar non-event days.

![Daily units of bottled water from July 2022 to June 2026 as a pale jagged line, with a 28-day rolling average as a dark line that rises slowly and peaks each December.](/images/courses/forecasting/water-series.svg "Bottled water: the rolling average reveals the trend and the December peaks under the daily noise.")

### Additive or multiplicative?

When December adds a **percentage** (say 30%) rather than a fixed number of units, and that percentage stays similar as sales grow, the pattern is multiplicative. That's typical of demand, and it's why many forecasts model the log of sales, as you did with rents in Machine Learning Fundamentals.

## Example

```python
import pandas as pd
import numpy as np

base = "https://academy.cloudtechanalytics.com/datasets/demand/"
sales = pd.read_csv(base + "daily_sales.csv", parse_dates=["date"])
holidays = pd.read_csv(base + "holidays.csv", parse_dates=["date"])
malt = sales[sales["product"] == "Malt drink 330ml (24)"].set_index("date")
closed = malt.index.isin(holidays.loc[holidays["depot_closed"] == 1, "date"])
open_days = malt[~closed]

weekday_index = open_days.groupby(open_days.index.day_name())["units"].mean() / open_days["units"].mean()
weekday_index.reindex(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).round(2)
```

```text
date
Monday       1.01
Tuesday      0.99
Wednesday    0.99
Thursday     1.03
Friday       1.13
Saturday     1.28
Sunday       0.56
Name: units, dtype: float64
```

Saturday sells about a quarter more than an average day, and Sunday about half. Now the year, the month-end payday effect and promotions:

```python
month_index = open_days.groupby(open_days.index.month)["units"].mean() / open_days["units"].mean()
print("December index:", round(month_index[12], 2), "  January index:", round(month_index[1], 2))

payday = (open_days.index.day >= open_days.index.days_in_month - 2) | (open_days.index.day <= 2)
print("Payday days vs other days:", round(open_days.loc[payday, "units"].mean() / open_days.loc[~payday, "units"].mean(), 2))
print("Promotion days vs other days:", round(open_days.loc[open_days["on_promotion"] == 1, "units"].mean() / open_days.loc[open_days["on_promotion"] == 0, "units"].mean(), 2))
```

```text
December index: 1.34   January index: 0.86
Payday days vs other days: 1.09
Promotion days vs other days: 1.44
```

December runs well above an average month and January below it; paydays and promotions each lift sales. These are rough measurements (a promotion in a slow month and one in a busy month are lumped together), but they show which patterns any forecast must capture.

## Walkthrough

1. Run the cells. Plot the 28-day rolling average (`malt["units"].rolling(28).mean().plot()`) to see the trend under the noise.
2. Measure the pre-Eid effect: average units in the 5 days before each Eid against the same weekdays two weeks earlier.
3. Compare December's index for the malt drink with detergent's. Which is more seasonal?
4. List the patterns in order of how much they matter for a weekly order.

## Practice

```answer
{
  "id": "ts-02-p1",
  "prompt": "What is the **Saturday** seasonal index for the malt drink (average Saturday units ÷ average open-day units)? Two decimal places.",
  "answer": 1.28,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(weekday_index['Saturday'], 2)",
  "hint": "The Saturday row of the first output.",
  "required": true
}
```

```answer
{
  "id": "ts-02-p2",
  "prompt": "What is the malt drink's **December** index? Two decimal places.",
  "answer": 1.34,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(month_index[12], 2)",
  "hint": "The first number in the second output.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A seasonal index of 0.55 for Sunday means:",
    "options": ["Sundays sell 55 units", "Sundays sell about 45% less than an average day", "55% of sales are on Sunday", "Sunday sales grow 55%"],
    "answer": 1,
    "explanation": "An index is relative to the average: 1.0 is average."
  },
  {
    "prompt": "December adds about 30% each year, and the size in units grows as sales grow. What kind of seasonality is it?",
    "options": ["Additive", "Multiplicative", "None", "Random"],
    "answer": 1,
    "explanation": "A percentage effect is multiplicative; modelling log(sales) handles it."
  },
  {
    "prompt": "Why measure patterns before building a model?",
    "options": ["It's required", "To know which patterns matter, and to check the model captures them", "Models can't find patterns", "To make the data smaller"],
    "answer": 1,
    "explanation": "Measurements are your yardstick for any model."
  }
]
```
