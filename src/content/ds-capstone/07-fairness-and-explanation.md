---
title: Fairness and explanation
minutes: 30
summary: Check how the model performs and who it selects in each city, find out what drives its predictions, test what happens without the city feature, and write the model card.
---

## The problem

The model will decide which customers get a phone call. That's a light-touch action, and most customers won't mind. But the same model could later be used for something harsher, such as demanding a deposit. Before it goes live, the head of operations and Kasuwa's lawyer want to know three things. Does it work equally well everywhere? What drives its predictions? And does it treat customers differently because of **where they live**?

## The concept

### Check performance by group

For each city, compare the actual failure rate with the average prediction (calibration), the AUC (ranking within the city), and the share of orders the policy would call. A model can be accurate overall and wrong for one group.

### Unseen groups

Kaduna launched in April 2026, after the training period. The model has never seen a Kaduna order. With `handle_unknown="ignore"`, it treats Kaduna as if it had no city effect at all, which may be badly wrong.

### Permutation importance

Shuffle one feature at a time in the validation data and see how much the AUC drops. A large drop means the model relies on that feature. It's fairer than the importance built into tree models, and it works for any model.

### Location as a proxy

City is a legitimate predictor, because delivery distances and promised days differ. But in Nigeria a city can also stand in for ethnicity or religion. For a call, using city is probably acceptable: the customer gets a helpful check, not a penalty. For a deposit or a refusal, it would need a much harder look. Test what the model loses without it.

### A model card

A short document saying what the model is for, its data, its performance overall and by group, its limits, and when it must be reviewed.

![A table checking performance by group including a group unseen in training, how permutation importance and location proxies work, and the five parts of a model card](/images/courses/ds-capstone/fairness-card.svg "Check each group, explain the model, write a model card.")

## Example

Performance on the test orders, by city:

```python
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Point-in-time features (lesson 3)
base = "https://academy.cloudtechanalytics.com/datasets/deliveries/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_time", "resolved_at"])
customers = pd.read_csv(base + "customers.csv")
orders = orders.sort_values(["order_time", "order_id"]).reset_index(drop=True)
orders["failed"] = (orders["status"] == "Failed delivery").astype(int)
orders["prior_orders"] = orders.groupby("customer_id").cumcount()
fails = orders.loc[orders["failed"] == 1, ["customer_id", "resolved_at"]].rename(columns={"resolved_at": "failed_at"}).sort_values("failed_at")
fails["prior_failures"] = fails.groupby("customer_id").cumcount() + 1
orders = pd.merge_asof(orders, fails, left_on="order_time", right_on="failed_at", by="customer_id", allow_exact_matches=False)
orders["prior_failures"] = orders["prior_failures"].fillna(0).astype(int)
orders = orders.merge(customers[["customer_id", "acquisition_channel", "phone_verified"]], on="customer_id", how="left")
orders["first_order"] = (orders["prior_orders"] == 0).astype(int)
orders["late_night"] = (orders["order_time"].dt.hour <= 3).astype(int)
orders["log_basket"] = np.log(orders["basket_value_ngn"])

# Time split and the chosen model (lesson 4)
pod = orders[(orders["payment_method"] == "Pay on delivery") & (orders["status"] != "Cancelled")].copy()
train = pod[pod["order_time"] < "2026-01-01"]
valid = pod[(pod["order_time"] >= "2026-01-01") & (pod["order_time"] < "2026-04-01")].copy()
test = pod[(pod["order_time"] >= "2026-04-01") & (pod["call_group"] == "No call")].copy()
numeric = ["prior_orders", "prior_failures", "first_order", "promised_days", "log_basket", "late_night",
           "promo_code_used", "address_has_house_number", "phone_verified"]
categorical = ["city", "device", "category", "acquisition_channel"]
features = numeric + categorical
model = make_pipeline(
    ColumnTransformer([("num", StandardScaler(), numeric),
                       ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical)]),
    LogisticRegression(max_iter=1000),
).fit(train[features], train["failed"])
pod["risk"] = model.predict_proba(pod[features])[:, 1]
valid["risk"] = model.predict_proba(valid[features])[:, 1]
test["risk"] = model.predict_proba(test[features])[:, 1]
def by_group(df, col):
    rows = []
    for g, part in df.groupby(col):
        rows.append({col: g, "orders": len(part), "actual": part["failed"].mean(), "predicted": part["risk"].mean(),
                     "auc": roc_auc_score(part["failed"], part["risk"]), "share_called": (part["risk"] >= 0.15).mean()})
    return pd.DataFrame(rows).set_index(col).round(3)

by_group(test, "city")
```

```text
orders  actual  predicted    auc  share_called
city
Abuja             762   0.188      0.191  0.691         0.530
Benin City        420   0.238      0.277  0.703         0.771
Enugu             415   0.205      0.226  0.643         0.663
Ibadan            486   0.152      0.145  0.743         0.379
Kaduna            278   0.536      0.414  0.642         0.996
Kano              481   0.262      0.269  0.709         0.775
Lagos            2013   0.128      0.136  0.695         0.304
Port Harcourt     502   0.151      0.201  0.693         0.578
```

The model is calibrated within a few points in most cities. It over-predicts Port Harcourt by five points, and it badly under-predicts **Kaduna**, a city it has never seen, by twelve. It still calls almost every Kaduna order, so the calling policy happens to work there, but the risk numbers for Kaduna can't be trusted. Lagos customers are called least, because Lagos orders really do fail least: they have short delivery promises.

What the model relies on:

```python
from sklearn.inspection import permutation_importance

imp = permutation_importance(model, valid[features], valid["failed"], scoring="roc_auc", n_repeats=5, random_state=42)
pd.Series(imp.importances_mean, index=features).sort_values(ascending=False).round(4)
```

```text
prior_failures              0.0804
promised_days               0.0488
prior_orders                0.0243
log_basket                  0.0160
first_order                 0.0157
acquisition_channel         0.0093
category                    0.0091
address_has_house_number    0.0075
late_night                  0.0060
phone_verified              0.0057
device                      0.0038
promo_code_used             0.0030
city                       -0.0004
dtype: float64
```

The customer's own history (`prior_failures`) and promised delivery days matter most. City adds nothing: shuffling it doesn't hurt the AUC at all, because promised days already carries the distance effect. What happens without it?

```python
categorical_no_city = ["device", "category", "acquisition_channel"]
no_city = make_pipeline(
    ColumnTransformer([("num", StandardScaler(), numeric),
                       ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_no_city)]),
    LogisticRegression(max_iter=1000),
).fit(train[numeric + categorical_no_city], train["failed"])
test["risk_no_city"] = no_city.predict_proba(test[numeric + categorical_no_city])[:, 1]
print(f"Test AUC with city {roc_auc_score(test['failed'], test['risk']):.3f}, without city {roc_auc_score(test['failed'], test['risk_no_city']):.3f}")
test.groupby("city")[["failed", "risk", "risk_no_city"]].mean().round(3)
```

```text
Test AUC with city 0.733, without city 0.733
               failed   risk  risk_no_city
city
Abuja           0.188  0.191         0.196
Benin City      0.238  0.277         0.260
Enugu           0.205  0.226         0.231
Ibadan          0.152  0.145         0.154
Kaduna          0.536  0.414         0.382
Kano            0.262  0.269         0.278
Lagos           0.128  0.136         0.135
Port Harcourt   0.151  0.201         0.190
```

Without city, the test AUC is unchanged, and the predictions by city barely move. That makes the decision easy: **drop city**. The model performs the same and no longer uses where people live directly. Location still reaches the model through promised days, which is a genuine cause of failures, so keep checking outcomes by city. And notice that Kaduna is under-predicted even more without city: the fix for an unseen market is new data, not a feature.

## Walkthrough

1. Run the cells.
2. Run `by_group` for `acquisition_channel` and `device`. Is the model fair across them?
3. Look at the Kaduna orders. Which features make them risky, apart from the city?
4. Decide what to do about Kaduna before the next retraining: for example, report its risk numbers as unreliable, or treat all its orders as high-risk until there's data.
5. Write the model card (the task below).

## Practice

```answer
{
  "id": "dsc-07-p1",
  "prompt": "On the test orders, by how many **percentage points** does the model **under-predict** Kaduna's failure rate (actual minus predicted)? One decimal place.",
  "answer": 12.2,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(100 * (test.loc[test['city'] == 'Kaduna', 'failed'].mean() - test.loc[test['city'] == 'Kaduna', 'risk'].mean()), 1)",
  "hint": "Kaduna's actual minus predicted, times 100.",
  "required": true
}
```

```answer
{
  "id": "dsc-07-p2",
  "prompt": "Which feature has the **largest** permutation importance? Type the column name.",
  "answer": "prior_failures",
  "format": "text",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "pd.Series(imp.importances_mean, index=features).idxmax()",
  "hint": "The top row of the importance list.",
  "required": true
}
```

```task
{
  "id": "dsc-07-t1",
  "prompt": "Write the **model card** (100 to 220 words) with these headings: **Purpose**, **Data**, **Performance** (with numbers), **By group** (including Kaduna), **Limits** and **Review**.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "Purpose: ...\nData: ...",
  "rules": [
    { "label": "Purpose", "pattern": "^\\W*purpose" },
    { "label": "Data", "pattern": "^\\W*data" },
    { "label": "Performance, with an AUC", "pattern": "auc[^\\n]*0\\.\\d" },
    { "label": "By group, mentioning Kaduna", "pattern": "kaduna" },
    { "label": "Limits", "pattern": "^\\W*limit" },
    { "label": "Review (when it must be checked or retrained)", "pattern": "^\\W*review" },
    { "label": "Between 100 and 220 words", "minWords": 100, "maxWords": 220 }
  ],
  "sample": "Purpose: score pay-on-delivery orders at checkout so the call centre can phone customers whose orders are most likely to fail. Only for choosing whom to call; not for refusing orders or demanding deposits without a separate review.\nData: Kasuwa orders from January to December 2025, with point-in-time customer history; validated on January to March 2026 and tested on the April to June No-call trial group.\nPerformance: logistic regression; test AUC 0.733; well calibrated overall; calling the riskiest 20% reaches about 41% of failures.\nBy group: calibrated within five points in most cities. Kaduna, launched after training, is under-predicted by about 12 points, though almost all its orders are still called. Removing the city feature leaves the AUC unchanged, so the production model drops it.\nLimits: no knowledge of new cities or new kinds of promotion; trained partly on the launch months and the November sale; the call's value comes from a three-month trial.\nReview: monthly calibration by city; retrain quarterly, or as soon as Kaduna has three months of data; review again before any harsher use.",
  "note": "The card is what lets someone else use the model safely after you've moved on.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why does the model under-predict Kaduna?",
    "options": ["Kaduna customers lie", "Kaduna wasn't in the training data, so the model ignores its city effect", "The AUC is low", "Calls changed the results"],
    "answer": 1,
    "explanation": "Unseen categories get no learned effect."
  },
  {
    "prompt": "Why is permutation importance useful?",
    "options": ["It's fast", "It shows how much the model's performance depends on each feature, for any model", "It removes bias", "It proves causation"],
    "answer": 1,
    "explanation": "Shuffle a feature and measure the damage."
  },
  {
    "prompt": "Removing city leaves the AUC unchanged. What should you do?",
    "options": ["Keep it: more features are better", "Drop it: same performance, less reliance on where people live, and keep checking outcomes by city", "Drop promised days too", "Nothing"],
    "answer": 1,
    "explanation": "A feature that adds nothing but risk should go."
  }
]
```
