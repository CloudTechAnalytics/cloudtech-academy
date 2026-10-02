---
title: Monitoring and the final presentation
minutes: 30
summary: Plan how to tell when the model stops working: calibration by month, score drift and new markets. Then present the project to Kasuwa's leadership as a decision, with its value, its limits and its safeguards.
---

## The problem

A model is at its best on the day it's tested. After that, the world moves: new cities, new promotions, new kinds of customer. Kasuwa launched Kaduna in April, and a Christmas sale is coming. You need a plan to notice when the model drifts, and a short presentation that gets leadership to approve the calling policy with its safeguards.

## The concept

**What to monitor**

| Check | How | Why |
| :-- | :-- | :-- |
| Calibration | Predicted against actual failure rate, monthly, on orders **not called** | Catches the model going wrong |
| Score drift | Population stability index (PSI) of the risk scores against validation | Catches changes in who's ordering, before outcomes arrive |
| New categories | Share of orders from cities, devices or channels unseen in training | Catches blind spots, like Kaduna |
| The call's effect | Keep a small random group uncalled, and compare | Catches calls losing their effect |

**Outcomes arrive late**

A delivery's outcome is known days after checkout. Score drift can be checked the same day; calibration needs a lag.

**PSI**

Bin the validation scores into tenths. For new scores, PSI = Σ (new share − old share) × ln(new share ÷ old share) across the bins. As a rule of thumb, under 0.1 is stable, 0.1 to 0.25 is worth a look, and over 0.25 means a real shift.

**The final presentation**

Lead with the decision and its value, then the evidence (model, trial, policy), then the safeguards (fairness, monitoring, holdout), then the ask.

## Example

The setup, then calibration by month on orders that weren't called:

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
recent = pod[(pod["order_time"] >= "2026-01-01") & (pod["call_group"] != "Call")]
monthly = recent.groupby(recent["order_time"].dt.to_period("M")).agg(orders=("failed", "size"), predicted=("risk", "mean"), actual=("failed", "mean"))
monthly["gap"] = monthly["actual"] - monthly["predicted"]
monthly.round(3)
```

```text
orders  predicted  actual    gap
order_time
2026-01       2928      0.191   0.173 -0.018
2026-02       2815      0.191   0.189 -0.002
2026-03       3437      0.190   0.190 -0.000
2026-04       1671      0.196   0.185 -0.011
2026-05       1822      0.193   0.192 -0.002
2026-06       1864      0.196   0.189 -0.007
```

Month by month, the model is well calibrated, running slightly high, even after April. That looks reassuring. Remember lesson 7, though: the model misses Kaduna by twelve points. Kaduna is only a few percent of orders, and other cities run slightly high, so the miss disappears into the total. Now score drift, which doesn't need outcomes:

```python
def psi(expected, actual, bins=10):
    edges = np.quantile(expected, np.linspace(0, 1, bins + 1))
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual, edges)[0] / len(actual)
    return float(np.sum((a - e) * np.log(a / e)))

later = pod[pod["order_time"] >= "2026-04-01"]
for month, part in later.groupby(later["order_time"].dt.to_period("M")):
    print(f"{month}: PSI {psi(valid['risk'], part['risk']):.3f}, Kaduna {(part['city'] == 'Kaduna').mean():.1%} of orders, "
          f"{(part['risk'] >= 0.15).mean():.0%} above the 15% threshold")
```

```text
2026-04: PSI 0.009, Kaduna 4.5% of orders, 52% above the 15% threshold
2026-05: PSI 0.012, Kaduna 5.6% of orders, 52% above the 15% threshold
2026-06: PSI 0.024, Kaduna 6.2% of orders, 51% above the 15% threshold
```

The PSI is small every month too: the overall mix of risk scores is stable. So both overall checks say all is well, while the model is badly wrong in its newest market, a small but growing share of orders. That's the lesson for monitoring: check calibration **by segment** as well as overall, track new markets separately, and retrain once Kaduna has enough history.

## Walkthrough

1. Run the cells.
2. Calculate the monthly calibration for Kaduna alone, and for the other cities. What do the overall totals hide?
3. Write the monitoring plan: each check, how often, the alert level and who acts.
4. Plan the presentation: five slides at most.
5. Open the project brief on the course page and plan your submission.

## Practice

```dataset
{"dataset": "deliveries", "files": ["orders", "customers"]}
```

```answer
{
  "id": "dsc-08-p1",
  "prompt": "In **June 2026**, what was the calibration gap (actual minus predicted failure rate, for orders not called), in percentage points? One decimal place (a negative number means the model predicted too high).",
  "answer": -0.7,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(100 * monthly.loc[pd.Period('2026-06', 'M'), 'gap'], 1)",
  "hint": "The 2026-06 row of the monthly table, the gap column, times 100.",
  "required": true
}
```

```task
{
  "id": "dsc-08-t1",
  "prompt": "Write the **executive summary** for Kasuwa's leadership (120 to 230 words): the **decision** you're asking for, the **evidence** (model and trial), the expected **value**, the **safeguards** (fairness and monitoring), and the **limits**.",
  "minutes": 12,
  "rows": 11,
  "placeholder": "We recommend ...",
  "rules": [
    { "label": "Opens with the decision (recommend, approve, ask)", "pattern": "^[^.]{0,200}(recommend|approve|ask)" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?", "min": 6 },
    { "label": "Cites the trial", "pattern": "trial|random" },
    { "label": "Gives a value in naira", "pattern": "₦\\s*\\d" },
    { "label": "Mentions fairness or city", "pattern": "fair|city|cities|where (customers|people) live" },
    { "label": "Mentions monitoring or retraining", "pattern": "monitor|retrain|calibrat|drift" },
    { "label": "States a limit (Kaduna, estimate, new)", "pattern": "kaduna|estimate|limit|new (cities|markets)" },
    { "label": "Between 120 and 230 words", "minWords": 120, "maxWords": 230 }
  ],
  "sample": "We recommend phoning every pay-on-delivery customer whose order has a predicted failure risk of 15% or more, before dispatch: about 1,900 calls a month.\n\nFailed deliveries cost Kasuwa about ₦40m last year at ₦6,500 each. Our model, built only on what's known at checkout, ranks orders well (test AUC 0.733) and its risk scores match actual failure rates. In the randomised April to June trial, calls prevented about 7 failures per 100 overall, and far more for risky orders: about 18 per 100 above 30% risk, against 2 per 100 below 10%. Calling above 15% saves an estimated ₦0.86m a month after call costs, more than calling everyone, at half the calls.\n\nSafeguards: the model doesn't use the customer's city, which added nothing to accuracy, and it is used only to offer a call, never to refuse an order. We'll monitor calibration and score drift monthly, keep 10% of orders uncalled to keep measuring the call's effect, and retrain quarterly.\n\nLimits: the saving is an estimate from three months; the model under-predicts Kaduna, which launched after training, so we'll retrain as soon as Kaduna has three months of data.",
  "note": "Every number traces to a lesson, and the limits are stated before anyone has to ask.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why check calibration only on orders that weren't called?",
    "options": ["They're cheaper", "Calls change outcomes, so called orders would make the model look wrong when it isn't", "There are more of them", "It doesn't matter"],
    "answer": 1,
    "explanation": "Measure the model on untreated orders."
  },
  {
    "prompt": "PSI is small every month, but the model badly misses Kaduna. What does that show?",
    "options": ["PSI is useless", "One overall drift number can hide a small group where the model fails; monitor new segments separately", "Kaduna doesn't matter", "The model is fine"],
    "answer": 1,
    "explanation": "Averages hide segments."
  },
  {
    "prompt": "Why keep a small random group uncalled after rollout?",
    "options": ["To save money", "To keep measuring whether calls still prevent failures", "For fairness", "Because the trial requires it"],
    "answer": 1,
    "explanation": "A holdout keeps the value measurable."
  }
]
```
