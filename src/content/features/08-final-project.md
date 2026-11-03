---
title: "Final project: Paystream's retention model"
minutes: 20
summary: Plan your final project, an end-to-end churn model with point-in-time features, time-based validation, calibration, targeting and monitoring, and start with a feature of your own.
---

## The problem

Paystream's head of growth wants a churn model the retention team can use every month from June 2026, and a plan for keeping it honest as the competitor keeps pushing. You'll build it end to end: features as of each month-end, a time-based test, a fair model comparison, calibrated probabilities, a calling plan with its value, and monitoring.

The best projects also add something the course didn't: a new feature that captures behaviour the others miss. This lesson starts you on that.

## The concept

### The project, step by step

| Step | Deliverable | Lesson |
| :-- | :-- | :-- |
| Define | population, snapshot, horizon and target, written down | 1 |
| Engineer | the course's features plus at least two of your own, each checked against churn | 2 |
| Validate | training snapshots with complete labels, a later test snapshot, the leakage checks | 3 |
| Compare | logistic regression and gradient boosting, with reasons for the choice | 4 |
| Calibrate | a reliability table and the Brier score | 5 |
| Target | gains, lift and a calling plan with its value | 6 |
| Monitor | drift checks by segment, a retraining rule and triggers | 7 |

### Ideas for new features

- **Variety**: the number of different transaction types in the last 90 days. Customers who use several services may be stickier.
- **Large-value share**: the share of value from transfers, where competitors usually compete.
- **Weekday pattern**: whether activity is concentrated on salary week.
- **Failure streaks**: the longest run of consecutive failed transactions.

## Example

A first new feature, variety, built point-in-time like the others:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/wallet/"
customers = pd.read_csv(base + "customers.csv", parse_dates=["signup_date"])
tx = pd.read_csv(base + "transactions.csv", parse_dates=["transaction_date"])

s = pd.Timestamp("2026-03-31")
recent = tx[(tx["transaction_date"] <= s) & (tx["transaction_date"] > s - pd.Timedelta(days=90))]
future = tx[(tx["transaction_date"] > s) & (tx["transaction_date"] <= s + pd.Timedelta(days=60))]
march = pd.DataFrame({"variety": recent.groupby("customer_id")["type"].nunique()})
march["churned"] = (~march.index.isin(future["customer_id"])).astype(int)
march.groupby("variety")["churned"].agg(["size", "mean"]).round(3)
```

```text
size   mean
variety
1          59  0.373
2         136  0.221
3         227  0.145
4         339  0.086
5         446  0.034
```

Check the pattern before trusting it: does churn fall steadily as variety rises, or is the difference driven by a small group?

## Walkthrough

1. Write your definitions at the top of the notebook.
2. Add the variety feature to `build_table`, and design one more of your own.
3. Check each new feature's relationship with churn, and confirm neither uses data after the snapshot.
4. Open the project brief on the course page and plan the remaining steps.

## Practice

```dataset
{"dataset": "wallet", "files": ["customers", "transactions"]}
```

```answer
{
  "id": "fe-08-p1",
  "prompt": "At the 31 March 2026 snapshot, what is the churn rate of active customers who used **only one** transaction type in the previous 90 days? As a percentage, one decimal place.",
  "answer": 37.3,
  "format": "percent",
  "dataset": "wallet",
  "files": ["transactions"],
  "pyVerify": "round(march.groupby('variety')['churned'].mean()[1] * 100, 1)",
  "hint": "The mean in the variety = 1 row.",
  "required": true
}
```

```task
{
  "id": "fe-08-t1",
  "prompt": "Describe **two new features** you'll add to the churn model, one per line in the form **Name | how it's calculated (with its time window) | why it might predict churn**. Neither may use data after the snapshot.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "variety_90d | number of distinct transaction types in the 90 days to the snapshot | ...",
  "rules": [
    { "label": "Two lines in the form Name | calculation | reason", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 2 },
    { "label": "Each calculation names a time window", "pattern": "\\|[^|\\n]*(\\d+\\s*days?|last (week|month)|since signup|to the snapshot)[^|\\n]*\\|", "min": 2 },
    { "label": "No future data (after the snapshot, next, following)", "pattern": "after the snapshot|next \\d+ days|following \\d+ days|in the horizon", "absent": true }
  ],
  "sample": "variety_90d | number of distinct transaction types in the 90 days to the snapshot | customers who use several services depend on the wallet more and are harder to lure away\ntransfer_share_90d | share of transaction value from transfers in the 90 days to the snapshot | competitors target transfers with free-transfer offers, so transfer-heavy customers may be most at risk",
  "note": "Each feature comes with a hypothesis. Test it: if churn doesn't change across the feature's range, drop it, however clever it sounds.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What makes a new feature worth keeping?",
    "options": ["It sounds clever", "It's built point-in-time, it relates to churn, and it improves the model on a later test snapshot", "It has many values", "It's correlated with another feature"],
    "answer": 1,
    "explanation": "Test every feature the same way."
  },
  {
    "prompt": "Which snapshot should the final model be judged on?",
    "options": ["One of the training snapshots", "A later snapshot than any used for training or tuning", "A random sample of all snapshots", "The earliest one"],
    "answer": 1,
    "explanation": "The honest test is always the future."
  },
  {
    "prompt": "The retention team asks how many customers to call. What evidence answers it?",
    "options": ["The AUC", "The gains table and the value of each extra decile, given the costs and save rate", "The Brier score", "The number of features"],
    "answer": 1,
    "explanation": "Targeting decisions come from lift and money."
  }
]
```
