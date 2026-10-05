---
title: Backtesting over time
minutes: 15
summary: Test a forecasting method on many past periods with rolling-origin backtesting, so one lucky or unlucky test period doesn't decide which method you trust.
---

## The problem

The calendar regression beat every baseline on March to June 2026. But that's one test period, with one Eid, one set of promotions and no December. Would it also have won in the run-up to Christmas, when the weekday average and the regression might behave very differently? A method chosen on a single period can let you down on the next.

Forecasters handle this with **backtesting**: replaying history as if they had used the method at many points in the past, each time forecasting only with the data available then.

## The concept

### Rolling-origin backtesting

1. Choose a series of forecast dates (origins), for example the first day of each of several months.
2. At each origin, train on everything before it, and forecast the next 28 days.
3. Score each forecast, then look at the average **and** the spread across origins.

![Four rows, one per forecast origin, each training on everything before its origin and forecasting the next 28 days, labelled September, December, Eid and after the price rise.](/images/courses/forecasting/rolling-origin.svg "Rolling-origin backtesting: several honest tests across different situations.")

Because each origin only uses its own past, every fold is an honest test. The origins should cover the situations you care about: here, a December, an Eid and the period after the price rise.

### What to look for

- **Average WAPE** across origins: the typical accuracy.
- **Worst origin**: how badly can it go wrong?
- **Consistency**: does one method win most months, or only on average?

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
is_open = ~y.index.isin(closed_days)

def regression_forecast(origin, days=28):
    train_rows = (y.index < origin) & is_open
    future = y.index[(y.index >= origin) & (y.index < origin + pd.Timedelta(days=days))]
    model = LinearRegression().fit(X[train_rows], np.log(y[train_rows] + 1))
    f = pd.Series(np.exp(model.predict(X.loc[future])) - 1, index=future)
    f[f.index.isin(closed_days)] = 0
    return f

def weekday_average_forecast(origin, days=28):
    last_28 = y[(y.index < origin) & (y.index >= origin - pd.Timedelta(days=28))]
    future = y.index[(y.index >= origin) & (y.index < origin + pd.Timedelta(days=days))]
    f = pd.Series([last_28[last_28.index.dayofweek == d.dayofweek].mean() for d in future], index=future)
    f[f.index.isin(closed_days)] = 0
    return f

origins = pd.to_datetime(["2025-03-01", "2025-06-01", "2025-09-01", "2025-11-15", "2025-12-01", "2026-01-15", "2026-03-01", "2026-05-01"])
rows = []
for origin in origins:
    actual = y[(y.index >= origin) & (y.index < origin + pd.Timedelta(days=28))]
    rows.append({"origin": origin.date(),
                 "weekday average": wape(actual, weekday_average_forecast(origin)),
                 "calendar regression": wape(actual, regression_forecast(origin))})
backtest = pd.DataFrame(rows).set_index("origin")
print(backtest.round(3))
backtest.agg(["mean", "max"]).round(3)
```

```text
weekday average  calendar regression
origin
2025-03-01            0.130                0.079
2025-06-01            0.223                0.098
2025-09-01            0.203                0.112
2025-11-15            0.143                0.094
2025-12-01            0.309                0.101
2026-01-15            0.415                0.089
2026-03-01            0.278                0.104
2026-05-01            0.117                0.104
      weekday average  calendar regression
mean            0.227                0.098
max             0.415                0.112
```

The regression wins at every origin, and its advantage is largest around the festive season: from 1 December, the weekday average looks back at an ordinary November and under-forecasts the build-up; from 15 January, it looks back at the busy holiday weeks and badly over-forecasts the January slump. The regression knows the calendar, so it handles both. The average WAPEs summarise it, but the row-by-row table is what convinces a sceptical depot manager.

## Walkthrough

1. Run the cells and plot both methods' WAPE by origin.
2. Add the "same weekday last year" baseline to the backtest. Where does it do well?
3. Add origins every month from March 2025 to May 2026. Does the conclusion hold?
4. Find the origin where the regression does worst, and work out why.

## Practice

```answer
{
  "id": "ts-06-p1",
  "prompt": "What is the calendar regression's **average** WAPE across the eight origins? Three decimal places.",
  "answer": 0.098,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(backtest['calendar regression'].mean(), 3)",
  "hint": "The mean row, calendar regression column.",
  "required": true
}
```

```answer
{
  "id": "ts-06-p2",
  "prompt": "What is the weekday average's WAPE at the **2025-12-01** origin? Three decimal places.",
  "answer": 0.309,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(backtest.loc[pd.Timestamp('2025-12-01').date(), 'weekday average'], 3)",
  "hint": "The 2025-12-01 row of the first table.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why backtest over many origins instead of one test period?",
    "options": ["It's faster", "One period can be lucky or unlucky; many origins show typical and worst-case accuracy", "Regulators require it", "To use more features"],
    "answer": 1,
    "explanation": "Methods should win consistently, not once."
  },
  {
    "prompt": "In rolling-origin backtesting, what data trains the forecast at each origin?",
    "options": ["All the data", "Only data before that origin", "Only the test period", "A random sample"],
    "answer": 1,
    "explanation": "Each fold replays history honestly."
  },
  {
    "prompt": "Method A has the lower average WAPE but fails badly every December; method B is slightly worse on average but steady. Which matters more for a depot?",
    "options": ["Always the lower average", "It depends on the cost of the bad months: a December stock-out may outweigh small gains elsewhere", "Always B", "Neither"],
    "answer": 1,
    "explanation": "Look at the worst case, not just the average."
  }
]
```
