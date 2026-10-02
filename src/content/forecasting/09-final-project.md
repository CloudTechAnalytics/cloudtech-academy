---
title: "Final project: the depot's ordering forecast"
minutes: 20
summary: Plan your final project, a tested forecasting and ordering system for all six products at Kolanut's Lagos depot, and start by backtesting a product other than the malt drink.
---

## The problem

Kolanut's operations director wants the Lagos depot to stop ordering by feel. Your final project is the system that replaces it: forecasts for all six products, tested honestly over time, turned into weekly order quantities with safety stock, and a short guide to when people should override it.

## The concept

**The project, step by step**

| Step | Deliverable | Lesson |
| :-- | :-- | :-- |
| Frame | the decision, horizon, granularity and cost of errors | 1 |
| Explore | each product's trend, seasonality and events, measured | 2 |
| Baselines | the best simple rule per product, on a time-based test | 3 |
| Model | calendar regression (and one alternative), with only allowed features | 4 |
| Effects and breaks | promotion lift and dip, Eid, the price rise, with bias checked | 5 |
| Backtest | rolling-origin results for every product | 6 |
| Order | intervals with checked coverage, safety stock and the ordering rule | 7 |
| Scale | the method run for all products, with review priorities | 8 |

**When should people override the forecast?**

A forecasting system needs a short list of situations where a person must step in: an event the data has never seen (a new competitor, a strike, a fuel shortage), a change in promotion plans after the forecast is made, or a run of forecast errors beyond the agreed limit.

## Example

A first backtest for bottled water, the depot's highest-volume product, comparing the weekday average with the calendar regression across four origins:

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

water = sales[sales["product"] == "Bottled water 75cl (12)"].set_index("date")
y = water["units"]
X = calendar_features(y.index, water["on_promotion"])
is_open = ~y.index.isin(closed_days)

results = []
for origin in pd.to_datetime(["2025-06-01", "2025-12-01", "2026-03-01", "2026-05-01"]):
    window = (y.index >= origin) & (y.index < origin + pd.Timedelta(days=28))
    actual = y[window]
    model = LinearRegression().fit(X[(y.index < origin) & is_open], np.log(y[(y.index < origin) & is_open] + 1))
    reg = pd.Series(np.exp(model.predict(X[window])) - 1, index=actual.index)
    last_28 = y[(y.index < origin) & (y.index >= origin - pd.Timedelta(days=28))]
    avg = pd.Series([last_28[last_28.index.dayofweek == d.dayofweek].mean() for d in actual.index], index=actual.index)
    for f in (reg, avg):
        f[f.index.isin(closed_days)] = 0
    results.append({"origin": origin.date(), "weekday average": round(wape(actual, avg), 3), "calendar regression": round(wape(actual, reg), 3)})
water_backtest = pd.DataFrame(results).set_index("origin")
water_backtest
```

```text
weekday average  calendar regression
origin
2025-06-01            0.202                0.075
2025-12-01            0.173                0.101
2026-03-01            0.116                0.065
2026-05-01            0.157                0.108
```

## Walkthrough

1. Run the backtest for bottled water. Does the regression win at every origin, as it did for malt?
2. Note the rainy-season dip for water (June to September): is it captured by the month features?
3. Plan the rest of the project from the table above.
4. Open the project brief on the course page.

## Practice

```dataset
{"dataset": "demand", "files": ["daily_sales", "holidays"]}
```

```answer
{
  "id": "ts-09-p1",
  "prompt": "For bottled water, what is the calendar regression's WAPE at the **2025-12-01** origin? Three decimal places.",
  "answer": 0.101,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "water_backtest.loc[pd.Timestamp('2025-12-01').date(), 'calendar regression']",
  "hint": "The 2025-12-01 row.",
  "required": true
}
```

```task
{
  "id": "ts-09-t1",
  "prompt": "Write the **override guide** for the depot: at least **three** situations when a person should adjust or override the forecast, one per line in the form **Situation | what to do | how you'll know**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "New competitor opens nearby | ... | ...",
  "rules": [
    { "label": "At least three lines in the form Situation | action | signal", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 3 },
    { "label": "Includes something the data has never seen (new competitor, strike, shortage, policy)", "pattern": "competitor|strike|shortage|fuel|policy|new (product|customer)|flood|curfew" },
    { "label": "Includes a run of large errors or bias as a trigger", "pattern": "error|bias|wape|outside the (range|interval)" }
  ],
  "sample": "A competitor opens a depot nearby or cuts prices | reduce the forecast by a judged amount and review weekly | sales reps report it, or two weeks of sales below the forecast range\nA promotion is added, cancelled or moved after the forecast is made | rerun the forecast with the new promotion dates | the marketing calendar changes\nFuel shortage or transport strike | hold extra safety stock and expect lumpy demand | news, and deliveries to shops falling behind\nForecast errors stay high | review the model and the safety stock with the analyst | WAPE above 15% or bias beyond ±5% for two weeks in a row",
  "note": "The last line turns monitoring into a rule. Without it, a forecast quietly drifts until someone notices empty shelves.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "When should a person override a statistical forecast?",
    "options": ["Never", "When something the data has never seen is happening, plans change after the forecast, or errors exceed agreed limits", "Every week", "When they disagree with it"],
    "answer": 1,
    "explanation": "Overrides should follow rules, not hunches."
  },
  {
    "prompt": "Why backtest every product, not just the biggest?",
    "options": ["It's quicker", "Methods that work for one series can fail on another with different patterns", "The biggest is always easiest", "To use more data"],
    "answer": 1,
    "explanation": "Check the method everywhere it will be used."
  },
  {
    "prompt": "What turns a forecast into an order?",
    "options": ["Rounding", "Adding safety stock for the chosen service level and subtracting stock on hand", "Doubling it", "Nothing: order the forecast"],
    "answer": 1,
    "explanation": "The ordering rule connects forecast and uncertainty to the decision."
  }
]
```
