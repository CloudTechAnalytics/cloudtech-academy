---
title: Features and point-in-time thinking
minutes: 25
summary: Why good features matter more than clever algorithms, how to frame a prediction around a snapshot date, and how to define a target like churn precisely enough to build on.
---

## The problem

Paystream is a mobile wallet with 1,500 customers in this dataset. They send money, buy airtime, pay bills and cash out. Some stop using it. By the time anyone notices, they're gone. The head of growth wants to know, at the end of each month, which active customers are likely to leave in the next two months, so the retention team can call them before they do.

There's no table with a "churn" column waiting for you. There's a list of customers and 65,825 transactions. Everything the model will learn from (how often someone transacts, whether that's falling, how often their payments fail) has to be **engineered** from those raw events. And it has to be engineered **as of a date**, using only what was known on that date. Get that wrong and the model will look brilliant in testing and fail in real use.

## The concept

**Features beat algorithms**

In most business problems, the difference between a weak and a strong model comes from the features, not the algorithm. A logistic regression with well-built features usually beats a sophisticated model given raw data. Feature engineering is where domain knowledge enters the model.

**The snapshot**

Every row in a training table describes a customer **at a moment in time**: the **snapshot date**. Then:

- **Features** use only data from **on or before** the snapshot.
- The **target** uses only data from **after** the snapshot, over a fixed **horizon**.

```
          features: look back            target: look ahead
  ◄──────────────────────────────── | ──────────────────────────►
                                 snapshot           snapshot + 60 days
```

**Defining churn precisely**

Paystream has no contract to cancel, so "churn" must be defined from behaviour. This course uses:

- **Population**: customers with at least one transaction in the **90 days** up to the snapshot (active customers).
- **Churned** = 1 if they make **no transaction** in the **60 days** after the snapshot; otherwise 0.

The choices (90 days, 60 days) are business decisions. Write them down; every number in the project depends on them.

## Example

Load the data:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/wallet/"
customers = pd.read_csv(base + "customers.csv", parse_dates=["signup_date"])
tx = pd.read_csv(base + "transactions.csv", parse_dates=["transaction_date"])
print(customers.shape, tx.shape)
print(tx["transaction_date"].min().date(), "to", tx["transaction_date"].max().date())
```

```text
(1500, 6) (65825, 6)
2025-01-01 to 2026-06-30
```

Now apply the definition at one snapshot, 31 January 2026:

```python
snapshot = pd.Timestamp("2026-01-31")
past = tx[tx["transaction_date"] <= snapshot]
future = tx[(tx["transaction_date"] > snapshot) & (tx["transaction_date"] <= snapshot + pd.Timedelta(days=60))]

active_ids = past.loc[past["transaction_date"] > snapshot - pd.Timedelta(days=90), "customer_id"].unique()
table = customers[customers["customer_id"].isin(active_ids)].copy()
table["churned"] = (~table["customer_id"].isin(future["customer_id"])).astype(int)
print("Active customers at the snapshot:", len(table))
print("Churn rate in the next 60 days:", round(table["churned"].mean(), 3))
```

```text
Active customers at the snapshot: 1176
Churn rate in the next 60 days: 0.091
```

About 9% of active customers make no transaction in the following two months. That's the event the model will try to predict, and, as later lessons show, the rate doesn't stay the same from month to month.

## Walkthrough

1. Load both files and look at a few transactions: `tx.head()`, `tx["type"].value_counts()`, `tx["status"].value_counts()`.
2. Apply the churn definition at the snapshot above.
3. Repeat it at 31 March 2026 by changing one line. Is the churn rate higher or lower?
4. Write down your definitions (population, horizon, target) at the top of your notebook.

## Practice

```dataset
{"dataset": "wallet", "files": ["customers", "transactions"]}
```

```answer
{
  "id": "fe-01-p1",
  "prompt": "How many customers were **active** (at least one transaction in the 90 days up to and including the snapshot) on **31 January 2026**?",
  "answer": 1176,
  "format": "number",
  "dataset": "wallet",
  "files": ["transactions"],
  "pyVerify": "len(table)",
  "hint": "The first number printed by the snapshot cell.",
  "required": true
}
```

```answer
{
  "id": "fe-01-p2",
  "prompt": "Using the same definitions, what is the churn rate at the **31 March 2026** snapshot? As a percentage, one decimal place.",
  "answer": 10.7,
  "format": "percent",
  "dataset": "wallet",
  "files": ["transactions"],
  "pyVerify": "(lambda s: round(100 * (~customers[customers['customer_id'].isin(tx.loc[(tx['transaction_date'] <= s) & (tx['transaction_date'] > s - pd.Timedelta(days=90)), 'customer_id'])]['customer_id'].isin(tx.loc[(tx['transaction_date'] > s) & (tx['transaction_date'] <= s + pd.Timedelta(days=60)), 'customer_id'])).mean(), 1))(pd.Timestamp('2026-03-31'))",
  "hint": "Change snapshot to pd.Timestamp('2026-03-31') and rerun the cell.",
  "required": true
}
```

```task
{
  "id": "fe-01-t1",
  "prompt": "Write the **churn definition** for a different business: a gym chain with monthly memberships that customers can pause or stop paying without telling anyone. Give one line each for **Population:**, **Snapshot:**, **Horizon:** and **Churned =**, and a final **Why:** line explaining your choice of horizon.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Population: ...\nSnapshot: ...\nHorizon: ...\nChurned = ...\nWhy: ...",
  "rules": [
    { "label": "A Population line", "pattern": "^\\s*[-*]?\\s*population\\s*:" },
    { "label": "A Snapshot line", "pattern": "^\\s*[-*]?\\s*snapshot\\s*:" },
    { "label": "A Horizon line with a number of days or months", "pattern": "^\\s*[-*]?\\s*horizon\\s*:[^\\n]*\\d+\\s*(day|week|month)" },
    { "label": "A Churned = line", "pattern": "^\\s*[-*]?\\s*churned\\s*=" },
    { "label": "A Why line", "pattern": "^\\s*[-*]?\\s*why\\s*:" }
  ],
  "sample": "Population: members who paid for the current month and visited at least once in the last 60 days.\nSnapshot: the last day of each month.\nHorizon: 2 months.\nChurned = no payment and no visit in the 2 months after the snapshot.\nWhy: members often skip a month (holidays, travel), so one month of no payment would label too many returning members as churned; two months separates a pause from leaving.",
  "note": "The horizon has to fit how customers actually behave. Too short and normal gaps look like churn; too long and the retention team learns about it after the customer has already gone.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A feature for a snapshot on 31 January uses transactions from February. What's the problem?",
    "options": ["None", "It uses information that wouldn't be known on 31 January: leakage", "February has fewer days", "It makes the model slower"],
    "answer": 1,
    "explanation": "Features look back from the snapshot; only the target looks forward."
  },
  {
    "prompt": "Why define churn with an explicit population and horizon?",
    "options": ["It's a convention", "Every number in the project depends on them, and different choices give different churn rates", "To make the dataset smaller", "Models require it"],
    "answer": 1,
    "explanation": "Write the definitions down before building anything."
  },
  {
    "prompt": "Which usually improves a model most?",
    "options": ["A more complex algorithm", "Better features built with knowledge of the business", "More decimal places", "Fewer rows"],
    "answer": 1,
    "explanation": "Features carry the domain knowledge."
  }
]
```
