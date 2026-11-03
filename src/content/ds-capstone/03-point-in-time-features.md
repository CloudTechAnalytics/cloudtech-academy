---
title: Point-in-time features
minutes: 30
summary: Build the customer's history as it was at checkout, including only failures that had already happened. Prove the difference against the tempting shortcut and the leaky lifetime totals.
---

## The problem

A customer's past is the best clue to their next order. Customers who refused parcels before are more likely to refuse again. But "the past" has to mean the past **as Kasuwa knew it at checkout**. A customer can place a second order before their first has even been delivered. Counting the first order's failure would use information nobody had yet.

## The concept

### Point in time

For each order, a history feature must use only events that happened **before** the order time. For failures, the event is when the delivery **failed** (`resolved_at`), not when the earlier order was placed.

### The shortcut and why it's wrong

The usual pandas idiom, a cumulative sum of earlier orders' outcomes, counts the outcome of every earlier order, including ones still out for delivery. It's a small leak, but it's systematic: it's always in the direction that makes the model look better.

![One patient's timeline showing that a point-in-time feature counts only outcomes known at booking, while the cumulative-sum shortcut leaks a later result](/images/courses/ds-capstone/point-in-time.svg "Count only what was known at the time, not what was booked earlier.")

### `merge_asof`

`pd.merge_asof` joins each order to the most recent row of another table **at or before** its time, per customer. With a running count of failures timed by `resolved_at`, it gives the number of failures known at checkout. `allow_exact_matches=False` makes it strictly before.

### The features

| Feature | Meaning |
| :-- | :-- |
| `prior_orders` | Orders the customer had placed before this one |
| `prior_failures` | Their failed deliveries known at checkout |
| `first_order` | 1 for a customer's first order |
| `late_night` | Ordered between midnight and 4 a.m. |
| `log_basket` | Log of the basket value |
| From the order | `promised_days`, `promo_code_used`, `address_has_house_number`, `city`, `device`, `category` |
| From the customer | `acquisition_channel`, `phone_verified` (both known at signup) |

## Example

The history features, done properly and with the shortcut:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/deliveries/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_time", "resolved_at"])
customers = pd.read_csv(base + "customers.csv")
orders = orders.sort_values(["order_time", "order_id"]).reset_index(drop=True)
orders["failed"] = (orders["status"] == "Failed delivery").astype(int)

# Orders the customer had placed before this one
orders["prior_orders"] = orders.groupby("customer_id").cumcount()

# Failed deliveries known by the time they placed this one
fails = orders.loc[orders["failed"] == 1, ["customer_id", "resolved_at"]].rename(columns={"resolved_at": "failed_at"})
fails = fails.sort_values("failed_at")
fails["prior_failures"] = fails.groupby("customer_id").cumcount() + 1
orders = pd.merge_asof(orders, fails, left_on="order_time", right_on="failed_at", by="customer_id", allow_exact_matches=False)
orders["prior_failures"] = orders["prior_failures"].fillna(0).astype(int)

# The tempting shortcut: count the failures of all earlier orders, delivered yet or not
orders["prior_failures_naive"] = orders.groupby("customer_id")["failed"].cumsum() - orders["failed"]
different = (orders["prior_failures_naive"] != orders["prior_failures"]).sum()
print(f"Orders where the shortcut counts a failure nobody knew about yet: {different:,}")
```

```text
Orders where the shortcut counts a failure nobody knew about yet: 740
```

Those orders would carry information from the future. Now, does history matter?

```python
pod = orders[(orders["payment_method"] == "Pay on delivery") & (orders["status"] != "Cancelled")]
pod.groupby(pod["prior_failures"].clip(upper=2))["failed"].agg(orders="size", failure_rate="mean").round(3)
```

```text
orders  failure_rate
prior_failures
0                29069         0.166
1                 7358         0.202
2                 3948         0.299
```

The row labelled 2 means two or more. Failures repeat: customers with two or more known failures fail much more often than those with none. Compare the honest feature with the leaky lifetime total from `customers.csv`, on orders from January to March 2026:

```python
from sklearn.metrics import roc_auc_score

check = pod[(pod["order_time"] >= "2026-01-01") & (pod["order_time"] < "2026-04-01")]
check = check.merge(customers[["customer_id", "lifetime_failed_deliveries"]], on="customer_id", how="left")
print("AUC, prior failures (point in time):", round(roc_auc_score(check["failed"], check["prior_failures"]), 3))
print("AUC, lifetime failures (leaky):     ", round(roc_auc_score(check["failed"], check["lifetime_failed_deliveries"]), 3))
```

```text
AUC, prior failures (point in time): 0.587
AUC, lifetime failures (leaky):      0.844
```

On its own, the leaky total ranks orders far better, because it includes the very failure you're trying to predict. A model built on it would look excellent in testing and disappoint the day it went live. Finally, the remaining features:

```python
orders = orders.merge(customers[["customer_id", "acquisition_channel", "phone_verified"]], on="customer_id", how="left")
orders["first_order"] = (orders["prior_orders"] == 0).astype(int)
orders["late_night"] = (orders["order_time"].dt.hour <= 3).astype(int)
orders["log_basket"] = np.log(orders["basket_value_ngn"])
pod = orders[(orders["payment_method"] == "Pay on delivery") & (orders["status"] != "Cancelled")]
for col in ["first_order", "late_night", "acquisition_channel"]:
    print(pod.groupby(col)["failed"].mean().round(3), "\n")
```

```text
first_order
0    0.163
1    0.258
Name: failed, dtype: float64

late_night
0    0.18
1    0.25
Name: failed, dtype: float64

acquisition_channel
Influencer    0.233
Organic       0.163
Referral      0.137
Social ad     0.207
Name: failed, dtype: float64
```

First orders, late-night orders and customers who came from influencers all fail more often.

## Walkthrough

1. Run the cells, and check a few customers by hand: pick one with several orders and compare `prior_failures` with `prior_failures_naive`.
2. Add a point-in-time feature of your own, such as days since the customer's previous order, or their past failure **rate**.
3. Check that none of your features uses `status`, `resolved_at` or the lifetime totals for the **current** order.
4. Save the feature-building code as a function. You'll reuse it in every lesson that follows.
5. Write the feature specification (the task below).

## Practice

```answer
{
  "id": "dsc-03-p1",
  "prompt": "What's the failure rate of pay-on-delivery orders from customers with **two or more** failed deliveries known at checkout? One decimal place.",
  "answer": 29.9,
  "format": "percent",
  "dataset": "deliveries",
  "files": ["orders"],
  "pyVerify": "round(100 * pod.loc[pod['prior_failures'] >= 2, 'failed'].mean(), 1)",
  "hint": "The row labelled 2 in the history table.",
  "required": true
}
```

```answer
{
  "id": "dsc-03-p2",
  "prompt": "In how many orders does the **shortcut** count a failure that wasn't yet known at checkout?",
  "answer": 740,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders"],
  "pyVerify": "int(different)",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "dsc-03-t1",
  "prompt": "Write a **feature specification** for `prior_failures` that an engineer could build in production (40 to 120 words): what it **counts**, the **time rule**, what happens for **new customers**, and **one test** that would catch a leak.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "prior_failures counts ...",
  "rules": [
    { "label": "Says what it counts (failed deliveries)", "pattern": "fail" },
    { "label": "States the time rule (before checkout, resolved before)", "pattern": "before|earlier than|prior to" },
    { "label": "Uses the failure time (resolved), not the order time", "pattern": "resolv|when (the )?deliver|failed_at|failure time|time of (the )?failure" },
    { "label": "Covers new customers (zero)", "pattern": "new customer|first order|zero|\\b0\\b" },
    { "label": "A test", "pattern": "test|check|assert" },
    { "label": "Between 40 and 120 words", "minWords": 40, "maxWords": 120 }
  ],
  "sample": "prior_failures counts the customer's pay-on-delivery or prepaid deliveries that failed strictly before this order's checkout time, using the time each failure was recorded (resolved_at), not the time the earlier order was placed. Orders still out for delivery don't count. New customers, and customers with no failures yet, get 0. Test: for every order, recompute the count from the raw delivery log using only rows with resolved_at < order_time, and assert it matches; also assert it never exceeds prior_orders.",
  "note": "Writing the time rule down is what keeps training and production consistent.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A customer places order B while order A is still out for delivery. A later fails. What should prior_failures be for B?",
    "options": ["1", "0, because the failure wasn't known at B's checkout", "It depends on B's outcome", "Missing"],
    "answer": 1,
    "explanation": "Only failures already recorded count."
  },
  {
    "prompt": "What does merge_asof with allow_exact_matches=False do here?",
    "options": ["Joins exact times only", "Joins each order to the latest failure count strictly before its time", "Removes duplicates", "Sorts the data"],
    "answer": 1,
    "explanation": "A backward-looking, strictly earlier join."
  },
  {
    "prompt": "The leaky lifetime total gives a much higher AUC. What should you conclude?",
    "options": ["Use it", "It's leaking future information and must not be used", "The honest feature is broken", "AUC is wrong"],
    "answer": 1,
    "explanation": "A bigger number from a leak is a warning, not a win."
  }
]
```
