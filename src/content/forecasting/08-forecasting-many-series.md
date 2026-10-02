---
title: Forecasting many series
minutes: 15
summary: Apply one tested method to every product, compare accuracy across them, and decide where human review is still needed.
---

## The problem

The malt drink is one of six products at the depot, and Kolanut has other depots. Nobody can hand-tune a model for each product in each place every week. The forecasting method has to run automatically across every series, and the team has to know where it's reliable and where a person should check it.

## The concept

**One method, many series**

Wrap the whole method (features, training, forecast) in a function, and run it for each product. Score every product with the same backtest, so they're comparable.

**Accuracy differs by product**

- High-volume, stable products are usually easiest.
- Products with strong seasonality or frequent promotions are harder.
- Low-volume products have more random noise relative to their sales, so their WAPE is higher even with a good model.

**Where to spend human attention**

Rank products by **WAPE × sales value**: the products where forecast errors cost the most money. Review those by hand, and let the method run on the rest.

**Top-down or bottom-up?**

Totals are easier to forecast than their parts, because errors partly cancel out. If the business needs a total (for the depot's warehouse space or cash), forecast it directly as well as summing the products, and compare.

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

def forecast_product(product, cutoff="2026-03-01"):
    s = sales[sales["product"] == product].set_index("date")
    y = s["units"]
    X = calendar_features(y.index, s["on_promotion"])
    cut = pd.Timestamp(cutoff)
    train_rows = (y.index < cut) & ~y.index.isin(closed_days)
    test = y[y.index >= cut]
    model = LinearRegression().fit(X[train_rows], np.log(y[train_rows] + 1))
    f = pd.Series(np.exp(model.predict(X.loc[test.index])) - 1, index=test.index)
    f[f.index.isin(closed_days)] = 0
    value = (test * s.loc[test.index, "price_ngn"]).sum()
    return pd.Series({"units": test.sum(), "wape": round(wape(test, f), 3),
                      "sales_value_m": round(value / 1e6, 1), "error_value_m": round(wape(test, f) * value / 1e6, 1)})

results = pd.DataFrame({p: forecast_product(p) for p in sales["product"].unique()}).T
results.sort_values("error_value_m", ascending=False)
```

```text
units   wape  sales_value_m  error_value_m
Malt drink 330ml (24)     17241.0  0.092          250.8           23.0
Orange juice 1L (12)       7489.0  0.088          156.1           13.8
Detergent 900g (12)        6504.0  0.088          154.9           13.6
Bar soap (48)              8326.0  0.096          134.5           12.9
Bottled water 75cl (12)   28709.0  0.082          114.6            9.4
Plantain chips 150g (20)  10411.0  0.085          104.7            8.9
```

Accuracy is broadly similar across products, but the money at stake isn't: the products at the top of the table are where a forecaster's review time is best spent.

## Walkthrough

1. Run the cells. Which product has the highest WAPE, and why might that be?
2. Forecast the depot's total daily units directly, and compare its WAPE with the products' WAPEs.
3. Run the backtest from lesson 6 for every product. Is any product's method unstable over time?
4. Decide which products you'd review by hand each week, and write it down.

## Practice

```answer
{
  "id": "ts-08-p1",
  "prompt": "Which product has the **largest error value** (WAPE × sales value) on March to June 2026? Type its name exactly as in the data.",
  "answer": "Malt drink 330ml (24)",
  "format": "text",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "results['error_value_m'].astype(float).idxmax()",
  "hint": "The top row of the table.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is a total usually easier to forecast than each of its parts?",
    "options": ["Totals are bigger numbers", "Errors in the parts partly cancel out when added together", "Totals have no seasonality", "They aren't"],
    "answer": 1,
    "explanation": "Aggregation reduces relative noise."
  },
  {
    "prompt": "How should you choose which products to review by hand?",
    "options": ["The highest WAPE", "The largest WAPE × sales value: where errors cost the most", "Alphabetically", "The newest"],
    "answer": 1,
    "explanation": "Spend attention where it's worth most."
  },
  {
    "prompt": "A low-volume product has a WAPE of 25% while others have 10%. What's the likely reason?",
    "options": ["A broken model", "Random noise is larger relative to small sales", "Too many features", "A data error"],
    "answer": 1,
    "explanation": "Small series are noisier; judge them in context."
  }
]
```
