---
title: Promotions, events and structural breaks
minutes: 25
summary: Measure what promotions and Eid really add (including the dip after a promotion), and handle a structural break like a price rise so the forecast doesn't keep predicting a world that's gone.
---

## The problem

The marketing team says promotions lift malt drink sales by half. The finance team isn't convinced: "Sales jump during the promotion week, but don't they fall the week after? Are we just moving sales forward?" Meanwhile, in January 2026 Kolanut raised its prices by about 12%, and since then the old forecasting habit ("same as last year, plus growth") has kept over-ordering.

A forecasting model can answer both questions, and it must, or it will keep making the same mistakes. The model's coefficients measure each effect, and a well-chosen feature lets it adapt to a change that the past alone can't explain.

## The concept

### Measuring effects from the model

In the log-scale calendar regression, each coefficient `c` means the feature multiplies sales by `exp(c)`. So `exp(c) − 1` is the percentage effect of a promotion, of the pre-Eid days, of payday, all estimated together, holding the others equal. That's better than comparing raw averages, which mix promotions in busy and quiet months.

### The post-promotion dip

Promotions often **pull sales forward**: shops stock up at the low price and buy less the following week. The true gain is the promotion lift minus the dip afterwards. Measure both.

### Structural breaks

A **structural break** is a lasting change in the level or pattern: a price rise, a new competitor, a lost major customer. Past data from before the break describes a world that no longer exists. Options:

- add a **flag** for the period after the break, so the model learns the new level;
- give **more weight to recent data**, or train only on data after the break (if there's enough);
- and in either case, check the forecast's **bias** after the break.

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
test = y[y.index >= cutoff]

model = LinearRegression().fit(X[train_rows], np.log(y[train_rows] + 1))
effects = (np.exp(pd.Series(model.coef_, index=X.columns)) - 1) * 100
effects[["promo", "post_promo", "pre_eid", "payday", "after_price_rise"]].round(1)
```

```text
promo               44.7
post_promo         -12.7
pre_eid             45.2
payday              10.9
after_price_rise    -7.0
dtype: float64
```

A promotion lifts sales by close to half, as marketing says, but the week after a promotion runs noticeably lower, as finance suspected. The price rise has cut volume since January. Now see what happens if the model is not told about the price rise:

```python
def fit_and_score(columns):
    m = LinearRegression().fit(X.loc[train_rows, columns], np.log(y[train_rows] + 1))
    f = pd.Series(np.exp(m.predict(X.loc[test.index, columns])) - 1, index=test.index)
    f[f.index.isin(closed_days)] = 0
    return round(wape(test, f), 3), round(f.sum() / test.sum() - 1, 3)

all_columns = list(X.columns)
without_break = [c for c in all_columns if c != "after_price_rise"]
print("With the price-rise flag:    WAPE, bias =", fit_and_score(all_columns))
print("Without the price-rise flag: WAPE, bias =", fit_and_score(without_break))
```

```text
With the price-rise flag:    WAPE, bias = (np.float64(0.092), np.float64(0.004))
Without the price-rise flag: WAPE, bias = (np.float64(0.112), np.float64(0.071))
```

Without the flag, the model keeps predicting pre-rise volumes and over-forecasts every week: a bias that would mean over-ordering month after month. With it, the bias almost disappears.

## Walkthrough

1. Run the cells. Work out the net gain of a promotion: one week at the promotion lift, then one week at the post-promotion dip, compared with two normal weeks.
2. Try training only on data from January 2026 onwards, without the flag. How does it compare? (Two months of data is very little.)
3. Measure the pre-Eid effect for detergent. Why is it smaller?
4. Write a short note for finance on what promotions really add (the task below).

## Practice

```answer
{
  "id": "ts-05-p1",
  "prompt": "According to the model, by what percentage does a **promotion** lift malt drink sales? One decimal place.",
  "answer": 44.7,
  "format": "percent",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(effects['promo'], 1)",
  "hint": "The promo row of the effects.",
  "required": true
}
```

```answer
{
  "id": "ts-05-p2",
  "prompt": "What is the **bias** of the forecast **without** the price-rise flag (forecast total ÷ actual total − 1)? As a percentage, one decimal place.",
  "answer": 7.1,
  "format": "percent",
  "dataset": "demand",
  "files": ["daily_sales", "holidays"],
  "pyVerify": "round(fit_and_score(without_break)[1] * 100, 1)",
  "hint": "The second number on the last line.",
  "required": true
}
```

```task
{
  "id": "ts-05-t1",
  "prompt": "Write a note for the finance team (40 to 120 words) on what a week-long promotion really adds to malt drink sales, using the model's **promotion lift** and **post-promotion dip**, and saying what the net effect over the **two weeks** is.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "During a promotion week, sales rise by about ...",
  "rules": [
    { "label": "Gives the promotion lift as a percentage", "pattern": "\\d+(\\.\\d+)?\\s*%[^.]*(promot|lift|rise)|(promot|lift|rise)[^.]*\\d+(\\.\\d+)?\\s*%" },
    { "label": "Mentions the dip afterwards", "pattern": "dip|after|following week|pull" },
    { "label": "Gives a net effect over two weeks", "pattern": "net|two weeks|2 weeks|overall" },
    { "label": "Between 40 and 120 words", "minWords": 40, "maxWords": 120 }
  ],
  "sample": "During a promotion week, malt drink sales rise by about 45%, holding everything else equal, but the following week they run about 12% below normal as shops use up the stock they bought cheaply. Over the two weeks, that's a net gain of roughly 33% of one normal week's sales, about two-thirds of what the promotion-week figure suggests, and all of it at the promotional price. Whether that's worth it depends on the margin given away, which the forecast can't tell us.",
  "note": "The model separates the two effects cleanly; the money question then belongs to finance.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Sales rise 45% in a promotion week and fall 12% the week after. What's the two-week net gain, in normal weeks of sales?",
    "options": ["0.45", "About 0.33", "0.57", "0.12"],
    "answer": 1,
    "explanation": "+0.45 − 0.12 = 0.33 of a normal week."
  },
  {
    "prompt": "What is a structural break?",
    "options": ["A missing day of data", "A lasting change in the level or pattern of the series, such as a price rise", "A promotion", "A holiday"],
    "answer": 1,
    "explanation": "Past data from before it describes a different world."
  },
  {
    "prompt": "After a price rise, a forecast is consistently 7% too high. What's the most direct fix?",
    "options": ["Ignore it", "Add a feature for the period after the rise, or weight recent data more, and recheck the bias", "Use more past data", "Remove the trend"],
    "answer": 1,
    "explanation": "Tell the model the world has changed."
  }
]
```
