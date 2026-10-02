---
title: Leakage across time
minutes: 30
summary: See how a random train/test split and one careless feature make a model look far better than it is, and learn the time-based split that gives an honest answer.
---

## The problem

A data scientist at Paystream reports a churn model with an AUC of 0.98. The head of growth is delighted and asks for it in production next week. Two months later it has predicted almost nothing useful.

What went wrong? Two of the commonest mistakes in applied machine learning. The model had a feature that quietly used the future, and it was tested by shuffling rows at random, as if the past and the future were interchangeable. Both make a model look better in testing than it will ever be in use. This lesson recreates both, so you'll recognise them.

## The concept

**Leakage through a feature**

Any feature calculated with data from after the snapshot leaks the answer. With events, it's easy to do by accident: "transactions in the last 30 days" computed on the full table, instead of the table cut at the snapshot, includes the very period you're predicting.

**Leakage through the split**

A random split puts customers from the same month in both training and test. Even with clean features, the model is tested on the **same period** it learned from: same season, same competitor activity, same app version. Real use is different: you train on the past and predict the **future**, which is always a little different.

**The time-based split**

- Build tables at several snapshots.
- **Train** on earlier snapshots, **test** on a later one.
- Only train on snapshots whose labels were **complete** by the time you'd make the test prediction. With a 60-day horizon, a model used on 31 March can only learn from snapshots up to 31 December: January's outcomes run until early April, so they weren't known yet.

The time-based score is usually lower. It's also the honest one.

## Example

The shared setup: the `build_table` function from lesson 2, and a `features` helper that one-hot encodes and lines up columns between tables:

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

First, the mistakes. A random split on one snapshot, then the same with a leaked feature (transactions in the 30 days **after** the snapshot):

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score

jan = build_table("2026-01-31")
X, y = features(jan), jan["churned"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_tr, y_tr)
print("Random split AUC:", round(roc_auc_score(y_te, model.predict_proba(X_te)[:, 1]), 3))

s = pd.Timestamp("2026-01-31")
next30 = tx[(tx["transaction_date"] > s) & (tx["transaction_date"] <= s + pd.Timedelta(days=30))]
X_leak = X.assign(txns_next_30d=jan["customer_id"].map(next30.groupby("customer_id").size()).fillna(0))
X_tr, X_te, y_tr, y_te = train_test_split(X_leak, y, test_size=0.3, random_state=42, stratify=y)
leaky = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_tr, y_tr)
print("With a leaked feature AUC:", round(roc_auc_score(y_te, leaky.predict_proba(X_te)[:, 1]), 3))
```

```text
Random split AUC: 0.904
With a leaked feature AUC: 0.983
```

Now the honest version. Train on four month-end snapshots whose outcomes were known by 31 March, and test on 31 March:

```python
train = pd.concat([build_table(d) for d in ["2025-09-30", "2025-10-31", "2025-11-30", "2025-12-31"]])
test = build_table("2026-03-31")
X_train, y_train = features(train), train["churned"]
X_test, y_test = features(test, X_train.columns), test["churned"]

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_train, y_train)
p_test = model.predict_proba(X_test)[:, 1]
print("Training rows:", len(X_train), " test rows:", len(X_test))
print("Time-based AUC:", round(roc_auc_score(y_test, p_test), 3))
```

```text
Training rows: 4257  test rows: 1207
Time-based AUC: 0.871
```

The leaked model is almost perfect and completely useless: in real use, nobody knows next month's transactions. The random split is honest about features but still flatters the model a little. The time-based score is the one to report.

## Walkthrough

1. Run the cells and compare the three AUCs.
2. Move the test snapshot to 30 April and the training snapshots forward by a month. Is the AUC stable?
3. Try training on January to March snapshots and testing on 31 March. Why is that wrong? (Hint: when were those labels known?)
4. Write the rule for your notebook: which snapshots can train a model used on a given date?

## Practice

```answer
{
  "id": "fe-03-p1",
  "prompt": "What AUC does the model with the **leaked** feature get? Three decimal places.",
  "answer": 0.983,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(roc_auc_score(y_te, leaky.predict_proba(X_te)[:, 1]), 3)",
  "hint": "The second line printed by the first cell.",
  "required": true
}
```

```answer
{
  "id": "fe-03-p2",
  "prompt": "What is the **time-based** AUC on the 31 March 2026 snapshot? Three decimal places.",
  "answer": 0.871,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(roc_auc_score(y_test, p_test), 3)",
  "hint": "The last line of the second cell.",
  "required": true
}
```

```task
{
  "id": "fe-03-t1",
  "prompt": "A colleague's churn model scores an AUC of 0.97. Write **four questions** you'd ask before trusting it, one per line ending with a question mark, covering at least: how the data was **split**, whether any feature could use the **future**, and how the **labels** were defined.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Was the test set ...?",
  "rules": [
    { "label": "Four questions, each ending with ?", "pattern": "\\?\\s*$", "min": 4 },
    { "label": "Asks about the split (random, time, later, period)", "pattern": "split|random|time|later (month|period|snapshot)|period" },
    { "label": "Asks about features using the future (after, future, snapshot)", "pattern": "after the snapshot|future|after the prediction|known (at|on|by)" },
    { "label": "Asks about the label definition (churn, label, target, defined)", "pattern": "label|target|defin" }
  ],
  "sample": "Was the test set a later period than the training data, or a random sample of the same months?\nCould any feature use information from after the snapshot date, such as transactions in the prediction window?\nHow exactly were churned customers defined, and over what horizon?\nWere the training labels complete by the date the model would have been used?",
  "note": "An AUC of 0.97 for churn is a warning sign, not a triumph. Real behaviour is noisy; models that look almost perfect usually know something they shouldn't.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A model is used on 31 March with a 60-day horizon. Which training snapshot has labels that weren't yet known on 31 March?",
    "options": ["30 November", "31 December", "31 January", "31 October"],
    "answer": 2,
    "explanation": "January's 60-day window runs to early April."
  },
  {
    "prompt": "Why does a random split usually flatter a churn model?",
    "options": ["It uses fewer rows", "The model is tested on the same period it learned from, which is easier than predicting a later one", "Random splits remove churners", "It doesn't"],
    "answer": 1,
    "explanation": "Real use always means predicting a future that's a little different."
  },
  {
    "prompt": "What's the surest sign of feature leakage?",
    "options": ["A slightly better AUC", "Results that look too good to be true, driven by a feature that couldn't be known at prediction time", "Many features", "A slow model"],
    "answer": 1,
    "explanation": "Check every feature's timing."
  }
]
```
