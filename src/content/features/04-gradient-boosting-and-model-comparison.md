---
title: Gradient boosting and model comparison
minutes: 20
summary: Train gradient-boosted trees, the workhorse of tabular machine learning, compare them fairly with logistic regression on a time-based test, and decide when the extra complexity earns its keep.
---

## The problem

Search any data science forum and you'll read that gradient boosting (XGBoost, LightGBM, scikit-learn's HistGradientBoosting) wins most competitions on tabular data. Paystream's head of data asks whether the churn model should use it.

The honest answer is "let's test it". Boosting is powerful when there are complex interactions and lots of data. With well-engineered features and a few thousand rows, a simple logistic regression can be just as good, and much easier to explain. The only way to know is a fair comparison on the same time-based test.

## The concept

### Gradient boosting

Boosting builds trees **one after another**, each new tree correcting the errors the previous ones made. Compared with a random forest (independent trees, averaged), boosting usually reaches higher accuracy, but has more settings to tune and overfits more easily.

scikit-learn's `HistGradientBoostingClassifier` is fast, handles missing values on its own and needs no scaling. Key settings:

| Setting | Effect |
| :-- | :-- |
| `learning_rate` | how big a correction each tree makes; smaller is slower but often better |
| `max_iter` | how many trees |
| `max_depth` or `max_leaf_nodes` | how complex each tree is |
| `early_stopping` | stop adding trees when a validation score stops improving |

### A fair comparison

- Same training snapshots, same test snapshot, same features.
- Same measure (AUC here), and look at more than one: calibration (lesson 5) and the top-decile capture that matters for the business (lesson 6).
- Prefer the simpler model if the scores are close. It's easier to explain, check and maintain.

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
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score

train = pd.concat([build_table(d) for d in ["2025-09-30", "2025-10-31", "2025-11-30", "2025-12-31"]])
test = build_table("2026-03-31")
X_train, y_train = features(train), train["churned"]
X_test, y_test = features(test, X_train.columns), test["churned"]

logit = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_train, y_train)
boost = HistGradientBoostingClassifier(random_state=42).fit(X_train, y_train)
p_logit = logit.predict_proba(X_test)[:, 1]
p_boost = boost.predict_proba(X_test)[:, 1]
print("Logistic regression AUC:", round(roc_auc_score(y_test, p_logit), 3))
print("Gradient boosting AUC:  ", round(roc_auc_score(y_test, p_boost), 3))
```

```text
Logistic regression AUC: 0.871
Gradient boosting AUC:   0.865
```

Now tune the boosting model a little: a smaller learning rate and shallower trees, which often help on small data:

```python
tuned = HistGradientBoostingClassifier(learning_rate=0.05, max_depth=3, max_iter=300,
                                       random_state=42).fit(X_train, y_train)
p_tuned = tuned.predict_proba(X_test)[:, 1]
print("Tuned gradient boosting AUC:", round(roc_auc_score(y_test, p_tuned), 3))
```

```text
Tuned gradient boosting AUC: 0.87
```

With good features, logistic regression holds its own against boosting here. The features already capture the main pattern (activity fading out), so there's little left for the trees to find. That won't always be true: with more data, raw features or strong interactions, boosting often pulls ahead. The point is to test rather than assume.

(One caution: the settings above were chosen by looking at the test snapshot, which is the trap from lesson 3 of Machine Learning Fundamentals. In a real project, tune on a validation snapshot before the test one.)

## Walkthrough

1. Run the cells and record the three AUCs in a comparison table.
2. Tune properly: use 31 December as a validation snapshot (training on September to November), choose the settings there, then retrain on all four and score 31 March once.
3. Try dropping the trend and fail-rate features from both models. Which model suffers more? (That tells you how much work the features are doing.)
4. Decide which model you'd put in front of the retention team, and why.

## Practice

```answer
{
  "id": "fe-04-p1",
  "prompt": "What is the **logistic regression** AUC on the 31 March test snapshot? Three decimal places.",
  "answer": 0.871,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "wallet",
  "files": ["customers", "transactions"],
  "pyVerify": "round(roc_auc_score(y_test, p_logit), 3)",
  "hint": "The first line of the first cell's output.",
  "required": true
}
```

```task
{
  "id": "fe-04-t1",
  "prompt": "Write your **model choice** for the head of data (50 to 130 words): which model, the **AUCs** you compared, and at least **two reasons** beyond the score.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "I recommend ...",
  "rules": [
    { "label": "Names the chosen model", "pattern": "logistic|boost" },
    { "label": "Gives at least two AUC values", "pattern": "0\\.\\d{2,3}", "min": 2 },
    { "label": "Gives reasons beyond the score (explain, simpler, maintain, calibrat, faster, interpret)", "pattern": "explain|simpler|maintain|calibrat|faster|interpret|transparent|check", "min": 2 },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "I recommend logistic regression. On the 31 March test snapshot it scored an AUC of 0.871, against 0.865 for default gradient boosting and 0.870 after light tuning, so boosting doesn't earn its extra complexity here. Logistic regression is also easier to explain to the retention team (falling activity and days since the last transaction drive the score), simpler to check and maintain, and its probabilities are straightforward to calibrate. We'll revisit boosting when we add more data sources, such as app logins.",
  "note": "\"Boosting won the competition\" is not a reason. A small gain in AUC is rarely worth a model nobody can explain.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "How does gradient boosting differ from a random forest?",
    "options": ["It uses one tree", "It builds trees one after another, each correcting the previous ones' errors", "It doesn't use trees", "It averages independent trees"],
    "answer": 1,
    "explanation": "Forests average independent trees; boosting builds them in sequence."
  },
  {
    "prompt": "Logistic regression scores 0.871 and boosting 0.865 on the same time-based test. What should you conclude?",
    "options": ["Boosting is broken", "With these features, the simpler model is at least as good, so prefer it", "Always use boosting", "The test is wrong"],
    "answer": 1,
    "explanation": "Test, don't assume, and prefer simplicity when scores are close."
  },
  {
    "prompt": "Why tune settings on a validation snapshot rather than the test snapshot?",
    "options": ["It's faster", "Tuning on the test snapshot makes its score optimistic", "Validation snapshots are bigger", "It doesn't matter"],
    "answer": 1,
    "explanation": "The test snapshot must stay unseen until the end."
  }
]
```
