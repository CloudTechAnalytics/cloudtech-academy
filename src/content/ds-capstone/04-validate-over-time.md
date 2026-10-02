---
title: Validate over time
minutes: 30
summary: Split by time, not at random, so the model is tested the way it will be used. Compare a simple rule, logistic regression and gradient boosting, and test on orders the trial didn't touch.
---

## The problem

The model will score next month's orders using what it learned from past months. So it should be **tested** that way too: trained on earlier orders and judged on later ones. A random split would mix next March into the training data and flatter every model.

There's a second trap. From April 2026, half of pay-on-delivery orders got a confirmation call, which **changed** their outcome. If you test on those orders, you're judging the model against outcomes it was never meant to predict.

## The concept

**Train, validate, test by time**

| Set | Orders | Used for |
| :-- | :-- | :-- |
| Train | January to December 2025 | Fitting models |
| Validation | January to March 2026 | Choosing between models and settings |
| Test | April to June 2026, **No call** group only | One final, honest check |

Touch the test set once, at the end. If you keep checking it while you tune, it stops being a test.

**Why only the No-call group?**

The model predicts what happens **without** intervention. The No-call group was chosen at random, so it's a fair sample of all orders, untouched by calls. The Call group's outcomes were changed by the call, so they can't test the model. In lesson 6 they're exactly what you need, to measure the call's effect.

**Start with a baseline**

A simple rule, such as "longer delivery promises are riskier", shows how much the model really adds. Then compare logistic regression with gradient boosting. The more complex model has to earn its place.

**Two ranking measures**

- **AUC**: the chance that a random failed order is scored above a random delivered one.
- **Average precision**: how well the top of the ranking is concentrated with failures, which suits a decision about whom to call.

## Example

The features from lesson 3, then the split:

```python
import numpy as np
import pandas as pd

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

pod = orders[(orders["payment_method"] == "Pay on delivery") & (orders["status"] != "Cancelled")]
train = pod[pod["order_time"] < "2026-01-01"]
valid = pod[(pod["order_time"] >= "2026-01-01") & (pod["order_time"] < "2026-04-01")]
test = pod[(pod["order_time"] >= "2026-04-01") & (pod["call_group"] == "No call")]
for name, part in [("train", train), ("valid", valid), ("test", test)]:
    print(f"{name:5}  {len(part):6,} orders  failure rate {part['failed'].mean():.1%}")
```

```text
train  20,329 orders  failure rate 20.3%
valid   9,180 orders  failure rate 18.4%
test    5,357 orders  failure rate 18.9%
```

Now the baseline and two models, judged on validation:

```python
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric = ["prior_orders", "prior_failures", "first_order", "promised_days", "log_basket", "late_night",
           "promo_code_used", "address_has_house_number", "phone_verified"]
categorical = ["city", "device", "category", "acquisition_channel"]
features = numeric + categorical

def prep():
    return ColumnTransformer([("num", StandardScaler(), numeric),
                              ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical)])

logistic = make_pipeline(prep(), LogisticRegression(max_iter=1000)).fit(train[features], train["failed"])
boosting = make_pipeline(prep(), HistGradientBoostingClassifier(max_iter=300, learning_rate=0.05, max_leaf_nodes=15,
                                                                early_stopping=False, random_state=42)).fit(train[features], train["failed"])

scores = {
    "Rule: promised days": valid["promised_days"],
    "Logistic regression": logistic.predict_proba(valid[features])[:, 1],
    "Gradient boosting": boosting.predict_proba(valid[features])[:, 1],
}
for name, s in scores.items():
    print(f"{name:20}  AUC {roc_auc_score(valid['failed'], s):.3f}   average precision {average_precision_score(valid['failed'], s):.3f}")
```

```text
Rule: promised days   AUC 0.609   average precision 0.250
Logistic regression   AUC 0.712   average precision 0.373
Gradient boosting     AUC 0.703   average precision 0.361
```

Both models beat the rule clearly. Gradient boosting doesn't beat logistic regression: the patterns here are mostly additive, and the simpler model is easier to explain and to check. Choose logistic regression, and test it once:

```python
test_scores = logistic.predict_proba(test[features])[:, 1]
print(f"Test (No call):  AUC {roc_auc_score(test['failed'], test_scores):.3f}   average precision {average_precision_score(test['failed'], test_scores):.3f}")
called = pod[(pod["order_time"] >= "2026-04-01") & (pod["call_group"] == "Call")]
called_scores = logistic.predict_proba(called[features])[:, 1]
print(f"Call group:      AUC {roc_auc_score(called['failed'], called_scores):.3f}   failure rate {called['failed'].mean():.1%}, predicted {called_scores.mean():.1%}")
```

```text
Test (No call):  AUC 0.733   average precision 0.415
Call group:      AUC 0.701   failure rate 12.1%, predicted 19.9%
```

On the untouched test orders, the model holds up. On the Call group, it predicts more failures than happened, because calls prevented some of them. That gap is the call's effect showing through, and it's the subject of lesson 6.

## Walkthrough

1. Run the cells.
2. Try a **random** 80/20 split of all 2025 and early 2026 orders instead. Is the validation AUC higher or lower than with the time split? Why might it differ?
3. Tune gradient boosting a little (`max_leaf_nodes`, `learning_rate`) using **validation** only. Does it overtake logistic regression?
4. Look at the logistic model's coefficients. Which features push risk up most?
5. Write the model comparison (the task below).

## Practice

```answer
{
  "id": "dsc-04-p1",
  "prompt": "What is the logistic regression's **validation AUC**? Three decimal places.",
  "answer": 0.712,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(roc_auc_score(valid['failed'], scores['Logistic regression']), 3)",
  "hint": "The Logistic regression line.",
  "required": true
}
```

```answer
{
  "id": "dsc-04-p2",
  "prompt": "What is its **test AUC** on the No-call orders? Three decimal places.",
  "answer": 0.733,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(roc_auc_score(test['failed'], test_scores), 3)",
  "hint": "The first line of the last cell.",
  "required": true
}
```

```task
{
  "id": "dsc-04-t1",
  "prompt": "Write the **model comparison** (50 to 140 words): the **validation** results for the rule and both models, the model you **choose** and **why**, its **test** result, and why the test uses only the **No-call** group.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "On January to March 2026 ...",
  "rules": [
    { "label": "Gives AUCs", "pattern": "0\\.\\d{2,3}", "min": 3 },
    { "label": "Names the chosen model", "pattern": "choose|chose|pick|select|recommend" },
    { "label": "A reason (simpler, explain, no better)", "pattern": "simpl|explain|no better|interpret|similar" },
    { "label": "Mentions the test result", "pattern": "test" },
    { "label": "Explains the No-call choice (calls changed outcomes)", "pattern": "no.call|untouched|call(s|ed)? (changed|prevented|affect)" },
    { "label": "Between 50 and 140 words", "minWords": 50, "maxWords": 140 }
  ],
  "sample": "On January to March 2026, the promised-days rule scored an AUC of 0.609, logistic regression 0.712 and gradient boosting 0.703. I chose logistic regression: boosting is no better here, and the simpler model is easier to explain to operations and to check for problems. On the April to June test orders it scored 0.733 AUC. The test uses only the No-call group because calls changed the outcomes of the other half; those orders measure the call's effect, not the model's accuracy.",
  "note": "\"No better, and simpler\" is a perfectly good reason to choose a model.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why split by time rather than at random?",
    "options": ["It's faster", "The model will predict future orders, so it should be tested on orders after its training data", "Random splits are biased against boosting", "It gives more test data"],
    "answer": 1,
    "explanation": "Test the way you'll use it."
  },
  {
    "prompt": "Why test only on the No-call group?",
    "options": ["It's smaller", "Calls changed the Call group's outcomes, so they can't test predictions of what happens without a call", "The Call group has missing data", "It doesn't matter"],
    "answer": 1,
    "explanation": "The treatment changes the label."
  },
  {
    "prompt": "Gradient boosting scores 0.703 and logistic regression 0.712 on validation. Which should you choose?",
    "options": ["Boosting: it's more advanced", "Logistic regression: it's at least as good and simpler to explain and check", "Neither", "Average them"],
    "answer": 1,
    "explanation": "Complexity has to earn its place."
  }
]
```
