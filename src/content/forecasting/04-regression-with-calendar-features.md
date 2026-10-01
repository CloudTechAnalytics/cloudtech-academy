---
title: Regression with calendar features
minutes: 20
summary: Forecast with a regression model built from what you know about future dates (weekday, month, paydays, Eid, promotions), and learn why lags shorter than the horizon are off-limits.
---

## The problem

The best baseline from lesson 3 averages the last four weeks by weekday. It knows about weekdays, but nothing about Eid, paydays, the December build-up or planned promotions. Yet the depot **knows** those dates in advance: the calendar is fixed, Eid dates are announced, and the sales team plans promotions weeks ahead.

A forecast that uses everything known about the future dates should beat one that only looks backwards. A regression model with **calendar features** is the most direct way to build one, and often the most accurate for this kind of data.

## The concept

**Features known in advance**

For each future date, build the features you already know: trend (years since the start), weekday, month, payday, days before Eid, the December build-up, promotion planned, the week after a promotion, and the price level. Then fit a regression on the past and apply it to future dates.

**Log scale, again**

Patterns here are multiplicative (December adds a percentage), so fit on log(units + 1) and convert back with exp(prediction) − 1. Drop days the depot was closed from training, and forecast zero for them.

**The lag trap**

Yesterday's sales are a powerful predictor of today's, so it's tempting to add "units 1 day ago" as a feature. But you're forecasting weeks 3 and 4 ahead: when you make the forecast, you don't know yesterday's sales for those days. **A lag feature is only allowed if it's at least as long as the horizon** (here, 28 days or more). Using shorter lags in testing gives a forecast that looks great and can't be produced in real life: it's leakage, in time-series form.

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

```python
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import HistGradientBoostingRegressor

malt = sales[sales["product"] == "Malt drink 330ml (24)"].set_index("date")
y = malt["units"]
X = calendar_features(y.index, malt["on_promotion"])
cutoff = pd.Timestamp("2026-03-01")
is_open = ~y.index.isin(closed_days)
train_rows = (y.index < cutoff) & is_open
test = y[y.index >= cutoff]

model = LinearRegression().fit(X[train_rows], np.log(y[train_rows] + 1))
forecast = pd.Series(np.exp(model.predict(X.loc[test.index])) - 1, index=test.index)
forecast[forecast.index.isin(closed_days)] = 0

boost = HistGradientBoostingRegressor(random_state=42).fit(X[train_rows], y[train_rows])
forecast_boost = pd.Series(boost.predict(X.loc[test.index]), index=test.index)
forecast_boost[forecast_boost.index.isin(closed_days)] = 0

print("Calendar regression WAPE:", round(wape(test, forecast), 3), "  bias:", round(forecast.sum() / test.sum() - 1, 3))
print("Gradient boosting WAPE:  ", round(wape(test, forecast_boost), 3))
```

```text
Calendar regression WAPE: 0.092   bias: 0.004
Gradient boosting WAPE:   0.105
```

The calendar regression roughly halves the best baseline's error, with almost no bias. Gradient boosting is close but not better: with good features, the simpler model holds its own again. Weekly totals show what the depot manager would see:

```python
weekly = pd.DataFrame({"actual": test, "forecast": forecast.round()}).resample("W-SUN").sum()
weekly.iloc[1:7]
```

```text
actual  forecast
date
2026-03-08     834     845.0
2026-03-15    1287    1237.0
2026-03-22    1221    1249.0
2026-03-29     882     901.0
2026-04-05    1071    1000.0
2026-04-12    1069    1178.0
```

## Walkthrough

1. Run the cells and plot actual against forecast for March to June 2026.
2. Look at the Eid week (around 20 March). Does the forecast catch the spike?
3. Add a lag-1 feature (`y.shift(1)`) and score again. The WAPE falls, but explain why this forecast couldn't be produced in practice.
4. Replace it with a lag-364 feature (same day last year). Is that allowed? Does it help?

## Practice

```answer
{
  "id": "ts-04-p1",
  "prompt": "What is the WAPE of the **calendar regression** on March to June 2026? Three decimal places.",
  "answer": 0.092,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(wape(test, forecast), 3)",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "ts-04-t1",
  "prompt": "For a forecast made each Monday for days **14 to 28** days ahead, say whether each feature is **allowed** or **not allowed**, one per line in the form **Feature | allowed or not allowed | reason**: units 1 day before; units 7 days before; units 364 days before; promotion planned for that day; payday flag; the average of the last 28 days before the forecast is made.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "units 1 day before | not allowed | ...",
  "rules": [
    { "label": "Six lines in the form Feature | allowed or not allowed | reason", "pattern": "^[^|\\n]+\\|\\s*(allowed|not allowed)\\s*\\|[^|\\n]+$", "min": 6 },
    { "label": "Lag 1 and lag 7 are not allowed", "pattern": "^[^|\\n]*\\b(1|7) days?[^|\\n]*\\|\\s*not allowed", "min": 2 },
    { "label": "Lag 364 is allowed", "pattern": "^[^|\\n]*364[^|\\n]*\\|\\s*allowed" },
    { "label": "Planned promotions and paydays are allowed", "pattern": "^[^|\\n]*(promotion|payday)[^|\\n]*\\|\\s*allowed", "min": 2 }
  ],
  "sample": "units 1 day before | not allowed | for a day 14 or more days ahead, the previous day hasn't happened when the forecast is made\nunits 7 days before | not allowed | also inside the 14-day gap\nunits 364 days before | allowed | last year's sales are known long before\npromotion planned for that day | allowed | promotions are planned weeks ahead\npayday flag | allowed | the calendar is known\naverage of the last 28 days before the forecast is made | allowed | it uses only sales up to the Monday the forecast is made",
  "note": "The test is always the same: on the day the forecast is made, would this value be known?",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You forecast 3 to 4 weeks ahead. Which lag feature is allowed?",
    "options": ["Yesterday's sales", "Last week's sales", "Sales 364 days earlier", "Sales 10 days earlier"],
    "answer": 2,
    "explanation": "A lag must be at least as long as the horizon."
  },
  {
    "prompt": "Why can calendar features be used for future dates?",
    "options": ["They're random", "Weekdays, months, paydays, Eid and planned promotions are known in advance", "They're lags", "They're estimated"],
    "answer": 1,
    "explanation": "Known-in-advance features are a forecast's best friends."
  },
  {
    "prompt": "Why forecast zero for closure days instead of letting the model predict them?",
    "options": ["Models can't predict zero", "Closures are known in advance, so the right forecast is certain", "To lower the WAPE artificially", "It doesn't matter"],
    "answer": 1,
    "explanation": "Use what you know for sure."
  }
]
```
