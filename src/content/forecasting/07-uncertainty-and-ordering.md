---
title: Uncertainty and ordering
minutes: 25
summary: Put a range around a forecast, check whether the range is honest, and turn forecast plus uncertainty into an order quantity with safety stock for the service level the business wants.
---

## The problem

The forecast says the depot will sell 1,050 cases of malt drink in a fortnight. The depot manager asks the question that matters for his order: "And if it's a good fortnight?" If he orders exactly 1,050, he'll run out about half the time, because forecasts are wrong both ways.

A single number isn't enough to order from. He needs a range (how high could it plausibly go?) and a rule for how much extra stock to hold against that uncertainty. That extra is **safety stock**, and choosing it is a business decision about how often running out is acceptable.

## The concept

**Prediction intervals from past errors**

The simplest honest way to get a range: look at how wrong the model was on the training data (its **residuals**), and add their spread to the forecast. With a log model, take the 5th and 95th percentiles of the residuals and add them to the log forecast, giving a 90% interval.

**Check the coverage**

On the test period, count how often actual sales fell inside the interval. A 90% interval should contain about 90% of days. If it contains fewer, it's too narrow, often because the future is less predictable than the past suggested (a break, a new competitor), and you should widen it.

**From forecast to order**

For the period an order must cover:

> order = forecast + safety stock − stock on hand

Safety stock depends on the **service level**: the share of order periods in which you don't run out.

> safety stock ≈ z × standard deviation of the forecast error over the period

with z = 1.28 for 90%, 1.65 for 95%. Higher service costs more stock; the right level balances lost sales against holding costs.

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

malt = sales[sales["product"] == "Malt drink 330ml (24)"].set_index("date")
y = malt["units"]
X = calendar_features(y.index, malt["on_promotion"])
cutoff = pd.Timestamp("2026-03-01")
train_rows = (y.index < cutoff) & ~y.index.isin(closed_days)
test = y[(y.index >= cutoff) & ~y.index.isin(closed_days)]

model = LinearRegression().fit(X[train_rows], np.log(y[train_rows] + 1))
residuals = np.log(y[train_rows] + 1) - model.predict(X[train_rows])
log_fc = model.predict(X.loc[test.index])
low = np.exp(log_fc + np.quantile(residuals, 0.05)) - 1
high = np.exp(log_fc + np.quantile(residuals, 0.95)) - 1
coverage = ((test >= low) & (test <= high)).mean()
print("Share of test days inside the 90% interval:", round(coverage, 3))
```

```text
Share of test days inside the 90% interval: 0.851
```

The interval covers fewer days than it promises: the months after the price rise are less predictable than the years the model learned from. Widen it, or treat it with caution. Now the order for one fortnight, using fortnightly forecast errors from a backtest to size safety stock:

```python
forecast = pd.Series(np.exp(log_fc) - 1, index=test.index)
fortnights = pd.DataFrame({"actual": test, "forecast": forecast}).resample("14D").sum()
error_sd = (fortnights["actual"] - fortnights["forecast"]).std()

next_fortnight_forecast = round(fortnights["forecast"].iloc[-1])
for service, z in [("90%", 1.28), ("95%", 1.65)]:
    safety = round(z * error_sd)
    print(f"{service} service: forecast {next_fortnight_forecast}, safety stock {safety}, order up to {next_fortnight_forecast + safety}")
```

```text
90% service: forecast 1268, safety stock 53, order up to 1321
95% service: forecast 1268, safety stock 68, order up to 1336
```

The extra stock for 95% service rather than 90% is the price of running out less often. Whether it's worth paying is a question for the depot manager and finance, and now it's one they can answer with numbers.

## Walkthrough

1. Run the cells. Calculate the 80% interval's coverage too.
2. Widen the interval with the 2.5th and 97.5th percentiles. What's its coverage?
3. If 300 cases are already in the warehouse, how much should the depot order for 95% service?
4. Write the ordering rule for the depot (the task below).

## Practice

```answer
{
  "id": "ts-07-p1",
  "prompt": "What share of test days fell inside the **90%** interval? As a percentage, one decimal place.",
  "answer": 85.1,
  "format": "percent",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(coverage * 100, 1)",
  "hint": "The first number printed.",
  "required": true
}
```

```task
{
  "id": "ts-07-t1",
  "prompt": "Write the depot's **ordering rule** for the malt drink (50 to 130 words): the formula in words, the **service level** you recommend and why, how **safety stock** is calculated, and one **warning** about the forecast's uncertainty.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Each Monday, order the forecast for ...",
  "rules": [
    { "label": "States the order formula (forecast + safety stock − stock on hand)", "pattern": "forecast[^.]*safety stock[^.]*(stock on hand|in the warehouse|on hand)" },
    { "label": "Recommends a service level with a percentage", "pattern": "\\d+\\s*%\\s*service|service level[^.]*\\d+\\s*%" },
    { "label": "Explains safety stock from forecast errors (error, z, standard deviation)", "pattern": "error|\\bz\\b|standard deviation|spread" },
    { "label": "Includes a warning (too narrow, coverage, price rise, less predictable, widen)", "pattern": "narrow|coverage|less predictable|widen|price rise|caution" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "Each Monday, order the forecast for the fortnight the delivery must cover, plus safety stock, minus the stock on hand. We recommend a 95% service level for the malt drink: running out loses shops to competitors, and malt keeps well, so extra stock costs little. Safety stock is 1.65 times the standard deviation of our past fortnightly forecast errors, recalculated each month from the latest backtest. Warning: since the January price rise, actual sales have fallen outside the forecast range more often than they should, so review safety stock monthly and widen it if stock-outs occur.",
  "note": "The rule is mechanical enough to follow every Monday, and honest enough to say when to stop trusting it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A 90% prediction interval contains actual sales on 80% of test days. What should you do?",
    "options": ["Nothing", "Treat it as too narrow: widen it or find out what changed", "Narrow it further", "Ignore intervals"],
    "answer": 1,
    "explanation": "Check coverage; intervals that are too narrow lead to stock-outs."
  },
  {
    "prompt": "Ordering exactly the forecast means running out roughly:",
    "options": ["Never", "Half the time", "10% of the time", "Always"],
    "answer": 1,
    "explanation": "Actuals exceed an unbiased forecast about half the time."
  },
  {
    "prompt": "Raising the service level from 90% to 95% means:",
    "options": ["Less safety stock", "More safety stock, to run out less often", "No change", "A better forecast"],
    "answer": 1,
    "explanation": "Higher service costs more stock."
  }
]
```
