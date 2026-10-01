---
title: Features from events
minutes: 15
summary: Turn a stream of transactions into one row per customer with recency, frequency, value, time windows, trends and failure rates, and check each feature actually relates to churn.
---

## The problem

A model can't learn from 65,825 separate transactions. It needs one row per customer at the snapshot, with numbers that summarise their behaviour: how recently they transacted, how often, how much, and whether things are getting better or worse. Paystream's retention team already has hunches: "people who stop transacting are leaving", "failed payments drive people away". Good features turn those hunches into columns a model can test.

## The concept

**The building blocks**

| Family | Feature | Idea |
| :-- | :-- | :-- |
| **Recency** | days since last transaction | someone who hasn't transacted in 50 days is drifting |
| **Frequency** | transactions in the last 30 and 90 days | how engaged they are |
| **Monetary** | value transacted in the last 30 and 90 days | how much they rely on the wallet |
| **Trend** | last 30 days compared with the 60 days before | is activity falling? |
| **Experience** | failed transactions, and the failure rate | are they having a bad time? |
| **Profile** | tenure, KYC tier, acquisition channel | who they are and how they arrived |

**Time windows**

Calculate the same measure over several windows (30 and 90 days). Comparing windows gives **trend** features, often the most predictive of all, because churn is usually a fade, not a sudden stop:

> trend = transactions in the last 30 days ÷ (monthly average over the 60 days before + 1)

The `+ 1` stops division by zero for customers with no earlier activity. A trend below 1 means activity is falling.

**Missing means zero (here)**

A customer with no failed transactions in the window has no rows to count, so the count comes back missing. Here, missing genuinely means zero: fill it with 0. Don't do that blindly elsewhere: sometimes missing means unknown.

**Check before you model**

For each new feature, look at the churn rate across its range (for example by quartile). If churn barely changes, the feature probably won't help.

## Example

Build the features at one snapshot. This is the function you'll reuse for the rest of the course:

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

jan = build_table("2026-01-31")
jan[["customer_id", "days_since_last", "txns_30d", "txns_90d", "trend", "fail_rate_90d", "churned"]].head()
```

```text
customer_id  days_since_last  txns_30d  txns_90d     trend  fail_rate_90d  churned
1    PS-00002                7       3.0         4  2.000000       0.000000        0
2    PS-00003                1       5.0        16  0.769231       0.062500        0
3    PS-00004                0       7.0        35  0.466667       0.057143        0
4    PS-00005               18       1.0         6  0.285714       0.000000        0
5    PS-00006                4      10.0        28  1.000000       0.000000        0
```

Now the check: does churn change across each feature's range?

```python
jan["trend_band"] = pd.qcut(jan["trend"], 4, labels=["lowest", "low", "high", "highest"])
print(jan.groupby("trend_band", observed=True)["churned"].mean().round(3))
print(jan.groupby(jan["days_since_last"] > 30)["churned"].mean().round(3))
```

```text
trend_band
lowest     0.276
low        0.048
high       0.018
highest    0.010
Name: churned, dtype: float64
days_since_last
False    0.042
True     0.539
Name: churned, dtype: float64
```

Customers whose activity is falling fastest churn far more often (28%) than those whose activity is rising (1%), and customers who haven't transacted for more than 30 days churn more than ten times as often as the rest (54% against 4%). Both hunches hold, and both are now columns.

## Walkthrough

1. Run the cells. Read `build_table` line by line: find where the past and future are separated.
2. Check the churn rate by quartile of `fail_rate_90d` and of `value_90d`. Which looks stronger?
3. Add a feature of your own, such as the number of different transaction types used in the last 90 days, and check it the same way.
4. Look at `jan.describe()`: any features with strange values?

## Practice

```answer
{
  "id": "fe-02-p1",
  "prompt": "At the 31 January 2026 snapshot, what is the **median days_since_last** among active customers?",
  "answer": 4,
  "format": "number",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "jan['days_since_last'].median()",
  "hint": "jan['days_since_last'].median()",
  "required": true
}
```

```answer
{
  "id": "fe-02-p2",
  "prompt": "What is the churn rate of customers in the **lowest** quarter of **trend**? As a percentage, one decimal place.",
  "answer": 27.6,
  "format": "percent",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(jan.groupby('trend_band', observed=True)['churned'].mean()['lowest'] * 100, 1)",
  "hint": "The 'lowest' row of the first output.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why are trend features often so predictive of churn?",
    "options": ["They're the most complex", "Customers usually fade out before leaving, so falling activity is an early warning", "They remove outliers", "Models prefer ratios"],
    "answer": 1,
    "explanation": "Compare a recent window with an earlier one."
  },
  {
    "prompt": "A customer has no failed transactions in the window, so the count comes back missing. What should it be?",
    "options": ["Missing: leave it", "0: here, missing genuinely means none", "The average", "Delete the customer"],
    "answer": 1,
    "explanation": "But check what missing means each time; sometimes it means unknown."
  },
  {
    "prompt": "Churn is about the same in every quartile of a new feature. What does that suggest?",
    "options": ["It's the best feature", "It probably won't help the model much", "The data is wrong", "Use more quartiles"],
    "answer": 1,
    "explanation": "Check each feature's relationship with the target before modelling."
  }
]
```
