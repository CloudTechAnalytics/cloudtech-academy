---
title: Calibration and capacity
minutes: 25
summary: Check that a predicted 30% risk really means about 30%, see how many failures the riskiest orders contain, and find out why ranking alone can't tell you whom to call.
---

## The problem

Operations will use the model in two ways. They'll **rank** orders, to call the riskiest first. And they'll read the **numbers**, as in "this order has a 40% chance of failing", to decide whether a call is worth ₦250. Ranking needs a good AUC. Reading the numbers needs **calibration**: predicted risks that match what actually happens.

## The concept

### Calibration

Group orders by predicted risk and compare the average prediction with the actual failure rate in each group. If they match, the model is calibrated. Logistic regression is often well calibrated on data like its training data. It drifts when the world changes.

![A calibration plot with points near the diagonal, Brier score compared with a no-skill guess, and recall at the top 20 percent](/images/courses/ds-capstone/calibration.svg "Do predicted risks match what really happens?")

### Brier score

The average squared gap between predicted probability and outcome (0 or 1). Lower is better. Compare it with the Brier score of predicting the overall failure rate for everyone.

**Capacity: the top of the ranking**

If the call centre can only make so many calls, the question is how many failures the riskiest orders contain. **Recall at the top 20%** is the share of all failures found by calling the riskiest fifth of orders.

### The missing piece

If a call prevented **every** failure it reached, the break-even risk would be ₦250 ÷ ₦6,500 = **3.8%**, and you'd call almost everyone. But a call doesn't turn every doubtful customer into a happy one. To set a threshold, you need to know how much a call actually **reduces** the risk, and that needs the trial.

## Example

The setup from lessons 3 and 4, in one cell:

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
print(f"Validation orders scored: {len(valid):,}")
```

```text
Validation orders scored: 9,180
```

Calibration on validation, by tenths of predicted risk:

```python
from sklearn.metrics import brier_score_loss

valid["decile"] = pd.qcut(valid["risk"], 10, labels=range(1, 11))
calibration = valid.groupby("decile", observed=True).agg(orders=("failed", "size"), predicted=("risk", "mean"), actual=("failed", "mean"))
print(calibration.round(3))
print(f"\nBrier score: model {brier_score_loss(valid['failed'], valid['risk']):.4f}, "
      f"same rate for everyone {brier_score_loss(valid['failed'], np.full(len(valid), train['failed'].mean())):.4f}")
```

```text
orders  predicted  actual
decile
1          918      0.050   0.047
2          918      0.077   0.090
3          918      0.098   0.094
4          918      0.120   0.113
5          918      0.144   0.125
6          918      0.171   0.161
7          918      0.204   0.196
8          918      0.246   0.259
9          918      0.310   0.303
10         918      0.487   0.454

Brier score: model 0.1361, same rate for everyone 0.1507
```

The predictions track the actual rates closely, from the safest tenth to the riskiest, though they run slightly high on average: the training year included the launch months and the November sale, which were worse than early 2026. Now capacity:

```python
ranked = valid.sort_values("risk", ascending=False)
for share in [0.1, 0.2, 0.3, 0.5]:
    top = ranked.head(int(len(ranked) * share))
    print(f"Call the riskiest {share:.0%}: {len(top):5,} orders, "
          f"{top['failed'].sum() / valid['failed'].sum():.0%} of failures, "
          f"{top['failed'].mean():.0%} of those called would fail")
```

```text
Call the riskiest 10%:   918 orders, 25% of failures, 45% of those called would fail
Call the riskiest 20%: 1,836 orders, 41% of failures, 38% of those called would fail
Call the riskiest 30%: 2,754 orders, 55% of failures, 34% of those called would fail
Call the riskiest 50%: 4,590 orders, 75% of failures, 27% of those called would fail
```

Calling the riskiest fifth of orders reaches a large share of the failures, at a much higher hit rate than calling at random. But "reaches" isn't "prevents". Whether those calls pay for themselves depends on what a call achieves, and that's lesson 6.

## Walkthrough

1. Run the cells.
2. Plot the calibration table: predicted against actual, with a diagonal line for perfect calibration.
3. Check calibration on the **test** orders. Is the model still calibrated in April to June?
4. Work out how many calls a day each option in the capacity table means.
5. Write the note to operations (the task below).

## Practice

```answer
{
  "id": "dsc-05-p1",
  "prompt": "If Kasuwa called the riskiest **20%** of validation orders, what percentage of all validation failures would those orders include? Whole number.",
  "answer": 41,
  "format": "percent",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(100 * ranked.head(int(len(ranked) * 0.2))['failed'].sum() / valid['failed'].sum())",
  "hint": "The second line of the capacity output.",
  "required": true
}
```

```answer
{
  "id": "dsc-05-p2",
  "prompt": "In the **riskiest tenth** of validation orders, what was the **actual** failure rate? One decimal place.",
  "answer": 45.4,
  "format": "percent",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(100 * calibration.loc[10, 'actual'], 1)",
  "hint": "The last row of the calibration table, the actual column.",
  "required": true
}
```

```task
{
  "id": "dsc-05-t1",
  "prompt": "Write a note to the head of operations (50 to 130 words): whether they can **trust the risk numbers** (calibration), what calling the **top 20%** would reach, and why that **isn't yet** a reason to start calling.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "The model's risk scores ...",
  "rules": [
    { "label": "Covers calibration", "pattern": "calibrat|predicted[^.]*actual|match" },
    { "label": "Gives the top-20% result", "pattern": "20\\s*%" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "Explains that reaching isn't preventing (the call's effect)", "pattern": "prevent|effect|trial|reduce" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "The model's risk scores can be read as probabilities: on January to March orders, predicted and actual failure rates match closely in every tenth, though the model runs a little high overall. Calling the riskiest 20% of orders would reach about 41% of all failures, and about 38% of the customers called would otherwise fail, against 18% on average. That isn't yet a reason to start calling: we know whom to call, but not how many failures a call actually prevents. The April trial answers that, and the threshold should come from it.",
  "note": "Separate the model's quality from the action's value.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In a group of orders, the model predicts 30% risk on average and 30% fail. What does that show?",
    "options": ["Good ranking", "Good calibration in that group", "Overfitting", "A leak"],
    "answer": 1,
    "explanation": "Predicted matches actual."
  },
  {
    "prompt": "Why does the threshold depend on the call's effect, not just the risk?",
    "options": ["It doesn't", "A call is worth making only if the failures it prevents are worth more than it costs", "Calls are free", "The model is uncalibrated"],
    "answer": 1,
    "explanation": "Value = failures prevented × cost of a failure − cost of the call."
  },
  {
    "prompt": "If calls prevented every failure, what would the break-even risk be with a ₦250 call and a ₦6,500 failure?",
    "options": ["About 3.8%", "25%", "50%", "6.5%"],
    "answer": 0,
    "explanation": "250 ÷ 6,500."
  }
]
```
