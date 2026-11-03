---
title: Calibration
minutes: 25
summary: Check whether a model's probabilities mean what they say, measure calibration with a reliability table and the Brier score, and understand why it matters whenever probabilities drive money.
---

## The problem

The retention team plans its budget from the model: "the model says these 200 customers have an average 30% chance of leaving, so about 60 will leave without a call". That only works if a 30% prediction really means 30 out of 100 such customers leave. If the model's 30% really means 15%, the budget is wrong by half.

A model can rank customers well (high AUC) and still give probabilities that are too high or too low. Whether the probabilities can be taken at face value is called **calibration**, and it matters whenever you add predictions up, compare them with costs, or forecast.

## The concept

### AUC and calibration measure different things

- **AUC**: does the model put churners above non-churners? Only the **order** matters.
- **Calibration**: when the model says 20%, do about 20% churn? The **values** matter.

### The reliability table

Group customers by predicted probability (for example into deciles) and compare, in each group, the **average prediction** with the **actual churn rate**. A calibrated model's two columns match. Plotted, the points lie on the diagonal.

![A reliability diagram: a calibrated model's points follow the diagonal; an overconfident model's points fall below it, predicting 40% where about 25% churn.](/images/courses/features/reliability.svg "Calibrated points sit on the diagonal. An illustration of the idea.")

### The Brier score

The average of (prediction − outcome)², from 0 (perfect) upwards. Lower is better. It rewards both good ranking and good calibration. Compare it with the Brier score of predicting the overall churn rate for everyone.

### Fixing calibration

`CalibratedClassifierCV` re-maps a model's probabilities using cross-validation (with `method="sigmoid"` or `"isotonic"`). It needs enough data, and it fixes the shape of the probabilities, not a change in the world (lesson 7).

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
from sklearn.metrics import brier_score_loss

train = pd.concat([build_table(d) for d in ["2025-09-30", "2025-10-31", "2025-11-30", "2025-12-31"]])
test = build_table("2026-03-31")
X_train, y_train = features(train), train["churned"]
X_test, y_test = features(test, X_train.columns), test["churned"]
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_train, y_train)
p = model.predict_proba(X_test)[:, 1]

print("Average predicted churn:", round(p.mean(), 3), " actual churn:", round(y_test.mean(), 3))
print("Brier score, model:        ", round(brier_score_loss(y_test, p), 4))
print("Brier score, one rate for all:", round(brier_score_loss(y_test, np.full(len(y_test), y_train.mean())), 4))
```

```text
Average predicted churn: 0.102  actual churn: 0.107
Brier score, model:         0.0607
Brier score, one rate for all: 0.0958
```

The model is clearly better than one rate for everyone (a Brier score of 0.061 against 0.096), and its average prediction (10.2%) is a little below March's actual churn (10.7%). Look at where:

```python
reliability = pd.DataFrame({"predicted": p, "actual": y_test.to_numpy()})
reliability["decile"] = pd.qcut(reliability["predicted"], 10, labels=False, duplicates="drop") + 1
reliability.groupby("decile").agg(customers=("actual", "size"), predicted=("predicted", "mean"),
                                  actual=("actual", "mean")).round(3)
```

```text
customers  predicted  actual
decile
1             121      0.002   0.000
2             121      0.007   0.008
3             120      0.012   0.008
4             121      0.019   0.025
5             121      0.028   0.058
6             120      0.038   0.083
7             121      0.054   0.058
8             120      0.084   0.075
9             121      0.179   0.140
10            121      0.598   0.612
```

In most deciles the predictions and actual rates are close, so the model's ranking and probabilities are broadly sound. But overall it slightly under-predicts March's churn: it learned from September to December, when churn was lower. That's not a calibration flaw you can fix with `CalibratedClassifierCV`; it's the world changing, and lesson 7 deals with it.

## Walkthrough

1. Run the cells. Plot the reliability table: predicted on the x-axis, actual on the y-axis, with a diagonal line.
2. Repeat for the gradient boosting model from lesson 4. Is it better or worse calibrated?
3. Try `CalibratedClassifierCV(model, method="sigmoid", cv=5)` on the training data. Does it change the March averages?
4. Use the reliability table to estimate how many of the top 100 customers will churn. Compare with the actual number.

## Practice

```answer
{
  "id": "fe-05-p1",
  "prompt": "What is the model's **average predicted churn probability** on the 31 March snapshot? As a percentage, one decimal place.",
  "answer": 10.2,
  "format": "percent",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(p.mean() * 100, 1)",
  "hint": "The first number printed.",
  "required": true
}
```

```answer
{
  "id": "fe-05-p2",
  "prompt": "What is the model's **Brier score** on the 31 March snapshot? Four decimal places.",
  "answer": 0.0607,
  "tolerance": 0.0006,
  "format": "number",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(brier_score_loss(y_test, p), 4)",
  "hint": "The second line printed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A model ranks customers perfectly but every probability is twice the true rate. What's its AUC, and is it calibrated?",
    "options": ["AUC 1.0, calibrated", "AUC 1.0, not calibrated", "AUC 0.5, calibrated", "AUC 0.5, not calibrated"],
    "answer": 1,
    "explanation": "AUC only measures order; calibration measures whether values are right."
  },
  {
    "prompt": "When does calibration matter most?",
    "options": ["Never", "When probabilities are added up, compared with costs or used to forecast", "Only for regression", "Only when AUC is low"],
    "answer": 1,
    "explanation": "Budgets and expected values need probabilities you can take at face value."
  },
  {
    "prompt": "A model under-predicts because churn rose after it was trained. Will CalibratedClassifierCV on the old training data fix it?",
    "options": ["Yes", "No: that's a change in the world, which needs recent data and retraining", "Only with isotonic", "Only with more trees"],
    "answer": 1,
    "explanation": "Calibration fixes the model's shape, not drift."
  }
]
```
