---
title: Baselines and honest testing
minutes: 15
summary: Test forecasts the only honest way (on a later period the method never saw), measure them with WAPE, and set the simple baselines any real method has to beat.
---

## The problem

A consultant offers Kolanut a forecasting system and shows a chart where the forecast line sits almost exactly on top of the actual sales. Impressive, until you ask how it was made: the model was fitted to the same months it's being shown on. Forecasting the past, when you already know the answer, is easy.

The only test that counts is the one that mimics real use: build the forecast using data up to a date, then compare it with what actually happened after that date. And a forecast is only worth paying for if it beats the simple rules the depot could use for free.

## The concept

### A time-based hold-out

Choose a cut-off. Everything before it is training data; everything after is the test period. Forecast the whole test period from the training data alone, then compare. Here: train up to 28 February 2026, and forecast March to June 2026, which includes Eid, a payday each month and several promotions.

![A timeline split at 28 February 2026: training from July 2022 to February 2026, and the test period March to June 2026.](/images/courses/forecasting/holdout.svg "A time-based hold-out: forecast the whole test period from the training data alone.")

### Measuring error: WAPE

> WAPE (weighted absolute percentage error) = total absolute error ÷ total actual sales

It reads as "the forecast is off by about x% of sales", it handles days with zero sales (where the usual percentage error breaks), and it weights busy days more than quiet ones, as the business does. Also check **bias**: (total forecast − total actual) ÷ total actual. A forecast that's always 5% high is a different problem from one that's randomly off.

### Baselines

| Baseline | Forecast for each future day |
| :-- | :-- |
| **Naive** | the last day's sales |
| **Seasonal naive, last week** | the same weekday in the last week of training |
| **Seasonal naive, last year** | the same weekday 52 weeks earlier |
| **Weekday average** | the average of the same weekday over the last 28 days |

Days when the depot is closed are known in advance, so every method forecasts zero for them.

## Example

```python
import pandas as pd
import numpy as np

base = "https://academy.cloudtechanalytics.com/datasets/demand/"
sales = pd.read_csv(base + "daily_sales.csv", parse_dates=["date"])
holidays = pd.read_csv(base + "holidays.csv", parse_dates=["date"])
closed_days = set(holidays.loc[holidays["depot_closed"] == 1, "date"])
eid_days = holidays.loc[holidays["holiday"].str.startswith("Eid"), "date"]

def wape(actual, forecast):
    """Weighted absolute percentage error: total absolute error ÷ total actual."""
    return np.abs(actual - forecast).sum() / actual.sum()

def calendar_features(dates, promo):
    """One row per date: trend, weekday, month, payday, pre-Eid, promotions and the 2026 price rise."""
    X = pd.DataFrame(index=dates)
    X["years"] = (dates - pd.Timestamp("2022-07-01")).days / 365.25
    for d in range(7):
        X[f"weekday_{d}"] = (dates.dayofweek == d).astype(int)
    for m in range(1, 13):
        X[f"month_{m}"] = (dates.month == m).astype(int)
    X["payday"] = ((dates.day >= dates.days_in_month - 2) | (dates.day <= 2)).astype(int)
    X["pre_eid"] = [int(any(0 < (e - d).days <= 5 for e in eid_days)) for d in dates]
    X["december_build_up"] = np.where(dates.month == 12, np.minimum(1, dates.day / 20), 0)
    X["promo"] = promo.reindex(dates).fillna(0).values
    X["post_promo"] = promo.shift(1).rolling(7).max().reindex(dates).fillna(0).values * (1 - X["promo"])
    X["after_price_rise"] = (dates >= pd.Timestamp("2026-01-01")).astype(int)
    return X
```

Split the malt drink's series at the end of February 2026 and score four baselines:

```python
malt = sales[sales["product"] == "Malt drink 330ml (24)"].set_index("date")
y = malt["units"]
cutoff = pd.Timestamp("2026-03-01")
train, test = y[y.index < cutoff], y[y.index >= cutoff]

def close_days(forecast):
    forecast = forecast.copy()
    forecast[forecast.index.isin(closed_days)] = 0
    return forecast

last_28 = train.iloc[-28:]
baselines = {
    "naive": pd.Series(train.iloc[-1], index=test.index),
    "same weekday last week": pd.Series([train.iloc[-7:][train.iloc[-7:].index.dayofweek == d.dayofweek].iloc[0] for d in test.index], index=test.index),
    "same weekday last year": pd.Series([y.get(d - pd.Timedelta(days=364)) for d in test.index], index=test.index),
    "weekday average, last 28 days": pd.Series([last_28[last_28.index.dayofweek == d.dayofweek].mean() for d in test.index], index=test.index),
}
scores = pd.Series({name: wape(test, close_days(f)) for name, f in baselines.items()})
scores.round(3)
```

```text
naive                            0.742
same weekday last week           0.410
same weekday last year           0.253
weekday average, last 28 days    0.171
dtype: float64
```

The naive forecast is badly wrong: it repeats the last training day, a busy Saturday, for four months. Seasonal baselines do much better, and the 28-day weekday average is the best of them. That WAPE is the bar for the rest of the course: any method that can't beat it isn't worth using.

## Walkthrough

1. Run the cells. Plot the test period's actual sales against the best baseline.
2. Calculate each baseline's bias. Which over-forecasts, which under-forecasts?
3. Change the weekday average to use the last 56 days. Better or worse?
4. Note the best baseline's WAPE: every model in the next lessons is compared with it.

## Practice

```answer
{
  "id": "ts-03-p1",
  "prompt": "What is the WAPE of the **weekday average, last 28 days** baseline on March to June 2026? Three decimal places.",
  "answer": 0.171,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(scores['weekday average, last 28 days'], 3)",
  "hint": "The last row of the scores.",
  "required": true
}
```

```answer
{
  "id": "ts-03-p2",
  "prompt": "What is the WAPE of **same weekday last year**? Three decimal places.",
  "answer": 0.253,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(scores['same weekday last year'], 3)",
  "hint": "The third row of the scores.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A forecast fits past sales almost perfectly on the months it was built from. What does that prove?",
    "options": ["It will forecast well", "Nothing about the future: test it on a later period it never saw", "It's overfitted", "It's biased"],
    "answer": 1,
    "explanation": "Only a time-based hold-out mimics real use."
  },
  {
    "prompt": "Why use WAPE rather than the average percentage error per day?",
    "options": ["It's simpler", "Daily percentage errors break on zero-sales days and over-weight quiet days; WAPE weights by sales", "WAPE is always smaller", "It ignores bias"],
    "answer": 1,
    "explanation": "WAPE reads as error as a share of total sales."
  },
  {
    "prompt": "Why set baselines before building models?",
    "options": ["Tradition", "A model is only worth using if it clearly beats what simple rules already achieve", "Baselines are the final forecast", "To fill time"],
    "answer": 1,
    "explanation": "Always compare with what you could do for free."
  }
]
```
