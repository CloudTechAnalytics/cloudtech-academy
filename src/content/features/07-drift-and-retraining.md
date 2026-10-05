---
title: Drift and retraining
minutes: 25
summary: Detect when the world a model learned from has changed, find which customers changed, and retrain on recent snapshots so the model keeps up.
---

## The problem

In March 2026 a competitor launched a rival wallet with heavy social media advertising. Paystream's churn model, trained on late 2025, didn't know. By the end of April, churn among active customers had climbed above 13%, but the model, still predicting as if it were last year, expected about 11.5%. The retention team planned too few calls, aimed at last year's kind of leaver.

Every model is a snapshot of the past. When the past stops being a good guide to the future, which is called **drift**, the model quietly gets worse. Monitoring for drift and retraining on recent data is the part of machine learning that never ends.

## The concept

### Kinds of drift

| Kind | What changes | Paystream example |
| :-- | :-- | :-- |
| **Label drift** | the overall rate of the outcome | churn rises from about 9% to 13% |
| **Concept drift** | the relationship between features and outcome | social-ads customers now churn far more at the same activity level |
| **Feature drift** | the distribution of the inputs | a new product changes how often people transact |

### Monitoring signals

- **Predicted vs actual rate**, once outcomes are known: the clearest sign.
- **Performance** (AUC, top-decile capture) on each new month as labels mature.
- **Rates by segment**: a change in one group (one channel, one region) shows where the world moved.
- **Feature distributions** compared with training data.

### Retraining

Retrain on the most recent snapshots whose labels are complete, on a schedule (for example monthly) and whenever monitoring flags drift. Keep the same time-based test discipline: the new model is judged on a later snapshot than any it trained on.

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

Train on September to December 2025, as before, then score the 30 April 2026 snapshot:

```python
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score

old_train = pd.concat([build_table(d) for d in ["2025-09-30", "2025-10-31", "2025-11-30", "2025-12-31"]])
april = build_table("2026-04-30")
X_old, y_old = features(old_train), old_train["churned"]
X_apr, y_apr = features(april, X_old.columns), april["churned"]

old_model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_old, y_old)
p_old = old_model.predict_proba(X_apr)[:, 1]
print("Old model, April: predicted", round(p_old.mean(), 3), " actual", round(y_apr.mean(), 3),
      " AUC", round(roc_auc_score(y_apr, p_old), 3))
```

```text
Old model, April: predicted 0.115  actual 0.133  AUC 0.876
```

The model still ranks customers well (AUC 0.876), but it under-predicts how many will leave: 11.5% against 13.3%, about 20 fewer leavers than really left. Where did the world change? Compare churn by acquisition channel over time:

```python
by_month = pd.concat([build_table(d) for d in ["2025-12-31", "2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30"]])
by_month.pivot_table(index="snapshot", columns="acquisition_channel", values="churned", aggfunc="mean").round(3)
```

```text
acquisition_channel  Agent  Organic  Referral  Social ads
snapshot
2025-12-31           0.086    0.092     0.066       0.114
2026-01-31           0.072    0.121     0.064       0.118
2026-02-28           0.088    0.092     0.071       0.127
2026-03-31           0.097    0.100     0.069       0.164
2026-04-30           0.126    0.131     0.064       0.216
```

Customers acquired through social ads, the competitor's target, are leaving at a much higher rate from March. Now retrain on the most recent snapshots whose labels are complete by 30 April (December to February):

```python
new_train = pd.concat([build_table(d) for d in ["2025-12-31", "2026-01-31", "2026-02-28"]])
X_new, y_new = features(new_train), new_train["churned"]
new_model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_new, y_new)
p_new = new_model.predict_proba(features(april, X_new.columns))[:, 1]
print("Retrained model, April: predicted", round(p_new.mean(), 3), " actual", round(y_apr.mean(), 3),
      " AUC", round(roc_auc_score(y_apr, p_new), 3))
```

```text
Retrained model, April: predicted 0.112  actual 0.133  AUC 0.88
```

Retraining barely changes the April prediction (11.2%), even though it uses the most recent complete data. The reason is timing: the newest snapshot with known outcomes is 28 February, and its outcomes only partly reflect a competitor that launched in March. A model can only learn from outcomes that have already happened. While a change is still unfolding, retraining can't catch up on its own, which is why monitoring and human judgement ("the competitor launched in March; expect churn among social-ads customers to stay high") matter.

## Walkthrough

1. Run the cells and compare the old and retrained models' predicted rates with the actual April rate. Why didn't retraining help much?
2. Calculate each model's churn rate by channel in the top decile. Has the retrained model shifted towards social-ads customers?
3. Write a monitoring plan with triggers (the task below).
4. Discuss: what could the business do while the model catches up? (A short-term adjustment, extra calls to social-ads customers, a counter-offer.)

## Practice

```answer
{
  "id": "fe-07-p1",
  "prompt": "What is the **actual churn rate** at the 30 April 2026 snapshot? As a percentage, one decimal place.",
  "answer": 13.3,
  "format": "percent",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(y_apr.mean() * 100, 1)",
  "hint": "The 'actual' value in the first cell's output.",
  "required": true
}
```

```answer
{
  "id": "fe-07-p2",
  "prompt": "At the 30 April snapshot, what is the churn rate of customers acquired through **Social ads**? As a percentage, one decimal place.",
  "answer": 21.6,
  "format": "percent",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(april.loc[april['acquisition_channel'] == 'Social ads', 'churned'].mean() * 100, 1)",
  "hint": "The Social ads value in the 2026-04-30 row of the table.",
  "required": true
}
```

```task
{
  "id": "fe-07-t1",
  "prompt": "Write a **monitoring plan** for Paystream's churn model, one line each for: **What we track**, **How often**, **Trigger for review** (with a number), **Retraining** (which snapshots), and **Owner**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "What we track: ...\nHow often: ...",
  "rules": [
    { "label": "What we track line", "pattern": "^\\s*[-*]?\\s*what we track\\s*:" },
    { "label": "How often line with a frequency", "pattern": "^\\s*[-*]?\\s*how often\\s*:[^\\n]*(daily|weekly|monthly|quarterly|every|each)" },
    { "label": "Trigger line with a number", "pattern": "^\\s*[-*]?\\s*trigger[^:\\n]*:[^\\n]*\\d" },
    { "label": "Retraining line mentioning snapshots or recent data", "pattern": "^\\s*[-*]?\\s*retrain\\w*\\s*:[^\\n]*(snapshot|recent|latest|month)" },
    { "label": "Owner line", "pattern": "^\\s*[-*]?\\s*owner\\s*:" }
  ],
  "sample": "What we track: predicted vs actual churn rate, AUC and top-decile capture as each month's outcomes mature, and churn by acquisition channel and region.\nHow often: monthly, when the 60-day outcomes for the snapshot two months earlier become available.\nTrigger for review: actual churn more than 2 percentage points above predicted, top-decile capture below 40%, or any channel's churn rate doubling.\nRetraining: every month on the latest three snapshots with complete labels, and immediately when a trigger fires; the new model must beat the old one on the most recent complete snapshot.\nOwner: the growth data scientist, reporting to the head of growth.",
  "note": "Notice the delay built into \"How often\": with a 60-day horizon, you only learn how good March's predictions were at the end of May. Monitoring always lags.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A model's AUC holds steady, but its predicted churn rate is far below the actual rate. What kind of drift is most obvious?",
    "options": ["None", "Label drift: the overall outcome rate has risen", "Feature drift only", "Overfitting"],
    "answer": 1,
    "explanation": "The ranking still works; the level has moved."
  },
  {
    "prompt": "Why can't the model be retrained on April's own outcomes at the end of April?",
    "options": ["It can", "April's 60-day outcomes aren't known until the end of June", "April has too few customers", "Retraining is monthly"],
    "answer": 1,
    "explanation": "Labels always arrive after the horizon."
  },
  {
    "prompt": "Churn jumps only among social-ads customers. What does that tell you?",
    "options": ["The data is wrong", "Where the world changed, which guides both the investigation and the business response", "Nothing", "To drop that channel from the model"],
    "answer": 1,
    "explanation": "Segment monitoring locates drift."
  }
]
```
