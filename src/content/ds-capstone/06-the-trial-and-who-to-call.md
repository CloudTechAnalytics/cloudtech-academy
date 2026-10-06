---
title: The trial and who to call
minutes: 30
summary: Use the randomised April trial to measure what a confirmation call achieves, find out how the effect grows with risk, and turn the model into a calling policy with a threshold set in naira.
---

## The problem

From April to June 2026, Kasuwa phoned a random half of pay-on-delivery customers before dispatch. The head of operations saw fewer failures and wants to call everyone. That would cost ₦250 a call on every order, including the many that were never going to fail. The model can direct the calls. But only the trial can say what a call is **worth** for each kind of order.

## The concept

### A randomised trial measures the effect

Because calls were assigned at random, the Call and No-call groups are alike in everything except the call. The difference in their failure rates is the call's effect: **failures prevented per call**.

### Effects differ by risk

A call can't prevent a failure that was never going to happen. So the effect should be bigger for riskier orders. Because the risk score uses only information from checkout, before the call, you can split the trial by risk band and compare Call with No call **within** each band. The randomisation still holds inside each band.

### Value per call

Value per call = failures prevented per call × ₦6,500 − ₦250. Call the orders where that's positive. The **threshold** is the risk level above which calls pay for themselves.

![Value per call by risk band using invented numbers: negative for low-risk bands, positive and rising for higher ones, with a threshold on the plateau](/images/courses/ds-capstone/value-per-call.svg "Value per call by risk band, and a threshold on the plateau.")

### Noise

Each band has a few thousand orders at most, so each estimate has an error of a few points. When several thresholds give similar values, don't chase the highest. Pick a sensible point on the plateau, and say it's an estimate.

## Example

The setup, then a check that the randomisation worked:

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
trial = pod[pod["call_group"].isin(["Call", "No call"])].copy()
trial.groupby("call_group").agg(orders=("failed", "size"), mean_risk=("risk", "mean"),
                                first_orders=("first_order", "mean"), failure_rate=("failed", "mean")).round(3)
```

```text
orders  mean_risk  first_orders  failure_rate
call_group
Call          5509      0.199         0.140         0.121
No call       5357      0.195         0.129         0.189
```

The two groups have the same average risk and the same share of first orders: the randomisation worked. Only the failure rate differs. The overall effect, with its uncertainty:

```python
rates = trial.groupby("call_group")["failed"].agg(["mean", "size"])
diff = rates.loc["No call", "mean"] - rates.loc["Call", "mean"]
se = np.sqrt(sum(r["mean"] * (1 - r["mean"]) / r["size"] for _, r in rates.iterrows()))
print(f"Failures prevented per 100 calls: {diff * 100:.1f} (95% interval {(diff - 1.96 * se) * 100:.1f} to {(diff + 1.96 * se) * 100:.1f})")
print(f"Value per call if we called everyone: ₦{diff * 6500 - 250:,.0f}")
```

```text
Failures prevented per 100 calls: 6.8 (95% interval 5.4 to 8.1)
Value per call if we called everyone: ₦190
```

Calls work, and on average they pay for themselves. But the average hides the important part. By risk band:

```python
trial["band"] = pd.cut(trial["risk"], [0, 0.1, 0.15, 0.2, 0.3, 1], labels=["under 10%", "10-15%", "15-20%", "20-30%", "30% and over"])
uplift = trial.pivot_table(index="band", columns="call_group", values="failed", aggfunc="mean", observed=True)
uplift["orders"] = trial.groupby("band", observed=True).size()
uplift["prevented_per_call"] = uplift["No call"] - uplift["Call"]
uplift["value_per_call"] = uplift["prevented_per_call"] * 6500 - 250
uplift.round(3)
```

```text
call_group     Call  No call  orders  prevented_per_call  value_per_call
band
under 10%     0.046    0.069    2961               0.023        -102.993
10-15%        0.069    0.106    2267               0.037          -9.654
15-20%        0.110    0.183    1696               0.073         223.822
20-30%        0.173    0.239    1976               0.067         182.259
30% and over  0.247    0.427    1966               0.180         919.397
```

The riskier the order, the more a call prevents. Below 15% risk, a call prevents only two to four failures per hundred, which doesn't cover its ₦250 cost. For the riskiest band, it prevents about 18 per hundred, worth over ₦900 a call. Now turn that into a policy: call every order at or above a threshold, and estimate the monthly result from the trial's three months:

```python
rows = []
for threshold in [0, 0.1, 0.15, 0.2, 0.25, 0.3]:
    chosen = trial[trial["risk"] >= threshold]
    prevented = chosen.loc[chosen["call_group"] == "No call", "failed"].mean() - chosen.loc[chosen["call_group"] == "Call", "failed"].mean()
    calls = len(chosen) / 3
    rows.append({"threshold": threshold, "calls_per_month": round(calls), "prevented_per_call": round(prevented, 3),
                 "net_per_month_ngn": round(calls * (prevented * 6500 - 250))})
policy = pd.DataFrame(rows)
policy
```

```text
threshold  calls_per_month  prevented_per_call  net_per_month_ngn
0       0.00             3622               0.068             687194
1       0.10             2635               0.086             818287
2       0.15             1879               0.109             855705
3       0.20             1314               0.123             723060
4       0.25              919               0.163             744176
5       0.30              655               0.180             602512
```

Calling everyone spends ₦250 on thousands of safe orders, and it's worth less than any threshold from 10% to 25%. The estimates peak at 15%, but the thresholds from 10% to 25% are all within the trial's noise of each other. A threshold of **15%** is a sensible choice on that plateau: it has the highest estimate, it prevents more failures in total than the higher thresholds, and it calls about half of orders, which the call centre can manage.

## Walkthrough

1. Run the cells.
2. Add a 95% interval to `prevented_per_call` in each band. Which bands are clearly above the ₦250 break-even (3.8 failures prevented per 100 calls)?
3. Count failures prevented per month for each threshold, not just naira. Which threshold prevents most?
4. What if a failed delivery costs ₦4,500, not ₦6,500? Recalculate the policy table.
5. Write the policy recommendation (the task below).

## Practice

```answer
{
  "id": "dsc-06-p1",
  "prompt": "Across the whole trial, how many failures did calls prevent **per 100 calls**? One decimal place.",
  "answer": 6.8,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "round(diff * 100, 1)",
  "hint": "No-call failure rate minus Call failure rate, times 100.",
  "required": true
}
```

```answer
{
  "id": "dsc-06-p2",
  "prompt": "At a **15%** threshold, what's the estimated **net value per month** in naira? (A rounded figure is fine.)",
  "answer": 855705,
  "format": "naira",
  "dataset": "deliveries",
  "files": ["orders", "customers"],
  "pyVerify": "int(policy.loc[policy['threshold'] == 0.15, 'net_per_month_ngn'].iloc[0])",
  "tolerance": 5000,
  "hint": "The 0.15 row of the policy table.",
  "required": true
}
```

```task
{
  "id": "dsc-06-t1",
  "prompt": "Write the **calling policy** for the head of operations (60 to 150 words): **who** to call (the threshold), **how many** calls a month, the expected **net saving**, why **not** call everyone, and how **certain** the estimate is.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Call every pay-on-delivery order with a predicted risk of ...",
  "rules": [
    { "label": "States the threshold", "pattern": "\\d+\\s*%[^.]*(risk|threshold)|(risk|threshold)[^.]*\\d+\\s*%" },
    { "label": "Calls per month", "pattern": "\\d[\\d,]*\\s*calls" },
    { "label": "A net saving in naira", "pattern": "₦\\s*\\d|naira" },
    { "label": "Why not everyone", "pattern": "everyone|all orders|every order" },
    { "label": "Uncertainty (estimate, interval, noise, trial)", "pattern": "estimat|interval|noise|uncertain|plateau|similar" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Call every pay-on-delivery order with a predicted risk of 15% or more: about 1,880 calls a month, roughly half of these orders. From the April trial, those calls prevent about 11 failures per 100, for an estimated net saving of about ₦0.86m a month after the cost of calls. Calling everyone would cost almost twice as much in calls and save less, because calls on low-risk orders rarely prevent anything. Thresholds from 10% to 25% give similar results within the trial's noise, so treat ₦0.86m as an estimate with a margin of a few hundred thousand naira, and re-measure it by keeping a small random group uncalled.",
  "note": "The last sentence matters: keeping a holdout lets you keep measuring the effect after rollout.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is it valid to compare Call and No call within each risk band?",
    "options": ["The bands are large", "The risk score uses only information from before the call, and calls were random within every band", "The model is calibrated", "It isn't valid"],
    "answer": 1,
    "explanation": "A pre-treatment split keeps the randomisation intact."
  },
  {
    "prompt": "Why does calling low-risk orders add little value?",
    "options": ["Those customers don't answer", "Few of them would have failed anyway, so a call prevents few failures", "Calls cost more for them", "The model is wrong for them"],
    "answer": 1,
    "explanation": "You can't prevent a failure that wasn't going to happen."
  },
  {
    "prompt": "Several thresholds give similar net values. What should you do?",
    "options": ["Pick the single highest", "Pick a sensible point on the plateau, considering capacity and total failures prevented, and say it's an estimate", "Call everyone", "Run the model again"],
    "answer": 1,
    "explanation": "Don't chase noise."
  }
]
```
