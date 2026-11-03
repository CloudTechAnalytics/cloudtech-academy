---
title: Lift and targeting
minutes: 25
summary: Evaluate a model the way the business will use it, with gains and lift for the top of the list, and choose how many customers to contact from the cost of a call and the value of a save.
---

## The problem

Paystream's retention team can make about 120 calls a month: roughly the top 10% of active customers. Nobody on the team cares about AUC. They care about one thing: **if we call the people the model ranks highest, how many of the real leavers will we reach?**

That's a different question from "how good is the model overall", and it has a direct answer: the **gains** and **lift** at the top of the list. Combined with what a call costs and what a saved customer is worth, it tells the team how many people to call.

## The concept

### Gains and lift

Sort customers by predicted probability, highest first, and cut the list into deciles:

- **Capture rate (gains)**: the share of all churners found in the top k% of the list.
- **Lift**: the churn rate in the top k%, divided by the overall churn rate. A lift of 5 means the top of the list has five times as many churners as a random selection.

A random list captures 10% of churners in its top 10%. A useful model captures far more.

![A gains curve: the model's curve rises steeply above the diagonal of a random list, so the top of the list finds a much larger share of churners.](/images/courses/features/gains.svg "A gains curve, illustrated. You'll measure Paystream's real one in this lesson.")

### From lift to a decision

For the top k% of the list:

> value = (churners reached × save rate × value of a saved customer) − (calls × cost per call)

- **Save rate**: the share of churners a call actually keeps (from past campaigns or a test).
- **Value of a saved customer**: for example, the margin they'd generate in the next year.

The best k is where the value is highest. Beyond it, each extra call reaches too few churners to pay for itself.

## Example

```python
import pandas as pd
import numpy as np

base = "https://academy.cloudtechanalytics.com/datasets/wallet/"
customers = pd.read_csv(base + "customers.csv", parse_dates=["signup_date"])
tx = pd.read_csv(base + "transactions.csv", parse_dates=["transaction_date"])

def build_table(snapshot, horizon=60):
    """One row per customer active in the 90 days to the snapshot.
    Features use data up to the snapshot; the label uses the horizon after it."""
    s = pd.Timestamp(snapshot)
    past = tx[tx["transaction_date"] <= s]
    future = tx[(tx["transaction_date"] > s) & (tx["transaction_date"] <= s + pd.Timedelta(days=horizon))]
    recent = past[past["transaction_date"] > s - pd.Timedelta(days=90)]
    t = customers[customers["customer_id"].isin(recent["customer_id"])].copy()
    t["snapshot"] = s
    t["tenure_days"] = (s - t["signup_date"]).dt.days
    t["days_since_last"] = t["customer_id"].map((s - past.groupby("customer_id")["transaction_date"].max()).dt.days)
    for w in [30, 90]:
        window = past[past["transaction_date"] > s - pd.Timedelta(days=w)]
        by = window.groupby("customer_id")
        t[f"txns_{w}d"] = t["customer_id"].map(by.size()).fillna(0)
        t[f"value_{w}d"] = t["customer_id"].map(by["amount_ngn"].sum()).fillna(0)
        t[f"failed_{w}d"] = t["customer_id"].map(window[window["status"] == "Failed"].groupby("customer_id").size()).fillna(0)
    t["trend"] = t["txns_30d"] / ((t["txns_90d"] - t["txns_30d"]) / 2 + 1)
    t["fail_rate_90d"] = t["failed_90d"] / t["txns_90d"].clip(lower=1)
    t["churned"] = (~t["customer_id"].isin(future["customer_id"])).astype(int)
    return t

numeric = ["tenure_days", "days_since_last", "txns_30d", "txns_90d", "value_30d", "value_90d",
           "failed_30d", "failed_90d", "trend", "fail_rate_90d", "kyc_tier"]
categorical = ["acquisition_channel", "age_band"]

def features(t, columns=None):
    X = pd.get_dummies(t[numeric + categorical], columns=categorical, drop_first=True, dtype=int)
    return X if columns is None else X.reindex(columns=columns, fill_value=0)
```

```python
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

train = pd.concat([build_table(d) for d in ["2025-09-30", "2025-10-31", "2025-11-30", "2025-12-31"]])
test = build_table("2026-03-31")
X_train, y_train = features(train), train["churned"]
X_test, y_test = features(test, X_train.columns), test["churned"]
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_train, y_train)

ranked = pd.DataFrame({"prob": model.predict_proba(X_test)[:, 1], "churned": y_test.to_numpy()})
ranked = ranked.sort_values("prob", ascending=False).reset_index(drop=True)
ranked["decile"] = ranked.index * 10 // len(ranked) + 1

gains = ranked.groupby("decile").agg(customers=("churned", "size"), churners=("churned", "sum"))
gains["capture_cum"] = (gains["churners"].cumsum() / gains["churners"].sum()).round(3)
gains["lift"] = (gains["churners"] / gains["customers"] / ranked["churned"].mean()).round(2)
gains
```

```text
customers  churners  capture_cum  lift
decile
1             121        74        0.574  5.72
2             121        17        0.705  1.31
3             121         9        0.775  0.70
4             120         7        0.829  0.55
5             121        10        0.907  0.77
6             121         7        0.961  0.54
7             120         3        0.984  0.23
8             121         1        0.992  0.08
9             121         1        1.000  0.08
10            120         0        1.000  0.00
```

The top decile alone contains 57% of all March churners: a lift of over 5. The bottom half of the list contains almost none. Now put money on it. Assume a call costs ₦1,500 (staff time and an airtime gift), a call saves 30% of the churners it reaches, and a saved customer is worth ₦12,000 in margin over the next year:

```python
cost_per_call, save_rate, value_saved = 1500, 0.30, 12000
plan = gains.cumsum()[["customers", "churners"]]
plan["value_ngn"] = plan["churners"] * save_rate * value_saved - plan["customers"] * cost_per_call
plan
```

```text
customers  churners  value_ngn
decile
1             121        74    84900.0
2             242        91   -35400.0
3             363       100  -184500.0
4             483       107  -339300.0
5             604       117  -484800.0
6             725       124  -641100.0
7             845       127  -810300.0
8             966       128  -988200.0
9            1087       129 -1166100.0
10           1207       129 -1346100.0
```

Calling the top decile is worth it, about ₦85,000 a month on these assumptions. Extending to the second decile already loses money: it reaches only 17 more churners for 121 more calls.

## Walkthrough

1. Run the cells and plot the cumulative capture rate against the share of customers called (a gains chart), with the diagonal for a random list.
2. Change the save rate to 20%. How many deciles are worth calling now?
3. Check the top decile's capture rate for the gradient boosting model from lesson 4. Does the comparison change?
4. Write the calling recommendation (the task below).

## Practice

```answer
{
  "id": "fe-06-p1",
  "prompt": "What share of all March churners are in the **top decile** of the list? As a percentage, one decimal place.",
  "answer": 57.4,
  "format": "percent",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(gains.loc[1, 'capture_cum'] * 100, 1)",
  "hint": "capture_cum in the first row of the gains table.",
  "required": true
}
```

```answer
{
  "id": "fe-06-p2",
  "prompt": "Under the cost assumptions, what is the value of calling **only the top decile**? (A rounded figure is fine.)",
  "answer": 84900,
  "format": "naira",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "plan.loc[1, 'value_ngn']",
  "hint": "value_ngn in the first row of the plan table.",
  "required": true
}
```

```task
{
  "id": "fe-06-t1",
  "prompt": "Write the **calling recommendation** for the retention team (50 to 130 words): how many customers to call each month, how many churners that should reach, the expected **value**, and which **assumption** most needs checking.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Call the top ... customers each month ...",
  "rules": [
    { "label": "Says how many to call (a number or a decile)", "pattern": "\\d+\\s*(customers|people|calls)|top (\\d+|ten|10)\\s*%|top decile" },
    { "label": "Says how many churners or what share they reach", "pattern": "\\d+\\s*%[^.]*churn|churn[^.]*\\d+\\s*%|\\d+\\s*churners" },
    { "label": "Gives a value in naira", "pattern": "₦\\s*\\d|naira" },
    { "label": "Names an assumption to check (save rate, value, cost)", "pattern": "save rate|assum|value of a saved|cost per call|test" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "Call the top 10% of active customers by predicted churn each month, about 120 people. On the March snapshot, that list contained 57% of all customers who went on to churn, more than five times as many as a random list. With a call costing ₦1,500, a 30% save rate and ₦12,000 of margin per saved customer, calling the top decile is worth about ₦85,000 a month, and extending the list beyond it would lose money. The save rate is the assumption that most needs checking: we should test it by calling half of the top decile next month and comparing churn with the half we don't call.",
  "note": "The test at the end matters most: without it, the save rate is a guess, and the whole plan depends on it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The top 10% of a model's list contains 50% of churners. What is the lift in that decile?",
    "options": ["0.5", "5", "10", "50"],
    "answer": 1,
    "explanation": "It finds churners at five times the rate of a random 10%."
  },
  {
    "prompt": "Why evaluate a targeting model by gains and lift rather than only AUC?",
    "options": ["AUC is wrong", "The team acts only on the top of the list, so what matters is how many churners are there", "Lift is easier to calculate", "AUC can't be used for churn"],
    "answer": 1,
    "explanation": "Measure the model the way it will be used."
  },
  {
    "prompt": "Extending the call list adds calls that reach few churners. When should you stop?",
    "options": ["Never", "When the value of the extra churners saved no longer covers the cost of the extra calls", "At exactly 10%", "When the team is tired"],
    "answer": 1,
    "explanation": "Stop where the marginal value turns negative."
  }
]
```
