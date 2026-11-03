---
title: Audit the data
minutes: 25
summary: Sort every column into known at checkout or known later, find the leaks before they find you, and explore what's linked to failed deliveries.
---

## The problem

The data was exported for you by an engineer who didn't know what you'd use it for. Some columns describe the order at checkout. Others were filled in **after** delivery, and one file holds totals calculated on the day of the export. A model trained on those will look brilliant in a notebook and fail in production. Before any modelling, audit the data.

## The concept

### Known at checkout, or known later?

| Known at checkout | Known later |
| :-- | :-- |
| City, device, category, basket value, promo code, payment method, promised days, address | Status, failure reason, delivery attempts, resolved time |
| The customer's signup details and **past** orders | The customer's **lifetime** totals as of June 2026 |

![A timeline with the prediction moment in the middle: information known before it is allowed, information known after it is a leak](/images/courses/ds-capstone/prediction-moment.svg "Allowed before the line; leaks after it.")

The trial's `call_group` is a special case. It was assigned after checkout and it **changes** the outcome. Never use it as a feature; it matters for evaluation (lesson 4) and for the trial (lesson 6).

### Leaks hide in plain sight

`delivery_attempts` is the classic leak. Failed orders always have two or three attempts, so it predicts failure almost perfectly, but you only know it once the delivery has happened. `lifetime_failed_deliveries` in `customers.csv` is subtler: it includes failures that happened **after** the order you're predicting.

### Explore with a question

For each feature you'll use, look at the failure rate by its values. You're looking for strong patterns, odd values and anything that changes over time.

## Example

Check whether the obvious leak really is one:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/deliveries/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_time", "resolved_at"])
pod = orders[(orders["payment_method"] == "Pay on delivery") & (orders["status"] != "Cancelled")].copy()
pod["failed"] = (pod["status"] == "Failed delivery").astype(int)
pod.groupby("delivery_attempts")["failed"].agg(orders="size", failure_rate="mean").round(3)
```

```text
orders  failure_rate
delivery_attempts
1                   26300         0.000
2                   10327         0.364
3                    3748         1.000
```

Three attempts means certain failure; one attempt means certain success. It's an outcome, not a predictor. Now the features known at checkout:

```python
for col in ["promised_days", "address_has_house_number", "promo_code_used", "city"]:
    print(pod.groupby(col)["failed"].agg(orders="size", failure_rate="mean").round(3), "\n")
```

```text
orders  failure_rate
promised_days
1                7886         0.121
2               13214         0.149
3                8415         0.192
4                6407         0.234
5                3258         0.312
6                1051         0.365
7                 144         0.424

                          orders  failure_rate
address_has_house_number
0                           7204         0.246
1                          33171         0.173

                 orders  failure_rate
promo_code_used
0                 32685         0.177
1                  7690         0.224

               orders  failure_rate
city
Abuja            5855         0.190
Benin City       3122         0.260
Enugu            3300         0.228
Ibadan           3981         0.165
Kaduna            593         0.408
Kano             3559         0.274
Lagos           15817         0.135
Port Harcourt    4148         0.197
```

Longer delivery promises fail much more often: customers have more time to change their mind or buy elsewhere. Addresses without a house number fail more, and so do promo orders. Kaduna stands out: it only launched in April 2026, its failure rate is very high, and it has few orders. Remember that when the model meets it for the first time.

How the failure rate moves over time:

```python
pod.groupby(pod["order_time"].dt.to_period("Q"))["failed"].mean().round(3)
```

```text
order_time
2025Q1    0.227
2025Q2    0.184
2025Q3    0.185
2025Q4    0.220
2026Q1    0.184
2026Q2    0.154
Freq: Q-DEC, Name: failed, dtype: float64
```

The launch quarter was the worst, and October to December 2025 nearly as bad: that's the November and December sale, with more promo codes and impulse buys. The last quarter is the lowest, but half its orders got a confirmation call in the trial, which lowers the failure rate. Keep that in mind: the trial changes the data you'll test on.

## Walkthrough

1. Run the cells.
2. Make a table of every column in both files: known at checkout (yes or no), and whether you'll use it.
3. Plot the failure rate by month, split by `call_group` from April 2026. What does the gap show?
4. Look at the failure rate by device, category and acquisition channel (from `customers.csv`).
5. Write the leakage audit (the task below).

## Practice

```answer
{
  "id": "dsc-02-p1",
  "prompt": "What's the failure rate of dispatched pay-on-delivery orders whose address has **no house number**? One decimal place.",
  "answer": 24.6,
  "format": "percent",
  "dataset": "deliveries",
  "files": ["orders"],
  "pyVerify": "round(100 * pod.loc[pod['address_has_house_number'] == 0, 'failed'].mean(), 1)",
  "hint": "The address_has_house_number table, the row for 0.",
  "required": true
}
```

```answer
{
  "id": "dsc-02-p2",
  "prompt": "What's the failure rate for orders with a promised delivery of **5 days or more**? One decimal place.",
  "answer": 32.8,
  "format": "percent",
  "dataset": "deliveries",
  "files": ["orders"],
  "pyVerify": "round(100 * pod.loc[pod['promised_days'] >= 5, 'failed'].mean(), 1)",
  "hint": "Filter on promised_days >= 5, then take the mean of failed.",
  "required": true
}
```

```task
{
  "id": "dsc-02-t1",
  "prompt": "Write the **leakage audit** (50 to 140 words): list at least **four** columns you **won't** use as features, and say **why** each one is unsafe.",
  "minutes": 7,
  "rows": 7,
  "placeholder": "- delivery_attempts: ...",
  "rules": [
    { "label": "Covers delivery_attempts", "pattern": "delivery_attempts|attempts" },
    { "label": "Covers the lifetime totals", "pattern": "lifetime" },
    { "label": "Covers call_group", "pattern": "call_group|call group|trial" },
    { "label": "Covers status, failure_reason or resolved_at", "pattern": "status|failure_reason|resolved" },
    { "label": "Explains timing (after checkout, after delivery, future)", "pattern": "after|future|later|export", "min": 2 },
    { "label": "Between 50 and 140 words", "minWords": 50, "maxWords": 140 }
  ],
  "sample": "- delivery_attempts: only known after the rider has tried; failed orders always have 2 or 3, so it would predict perfectly in the notebook and be useless at checkout.\n- status, failure_reason, resolved_at: these are the outcome itself, recorded after delivery.\n- lifetime_orders and lifetime_failed_deliveries: calculated at the export date, so they include orders and failures in the future of the order being predicted. I'll rebuild them point-in-time.\n- call_group: assigned after checkout by the trial, and it changes the outcome. It's for evaluation and the uplift analysis, not a feature.",
  "note": "Each leak is about timing. Asking \"when would we know this?\" catches all of them.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A feature predicts the target almost perfectly. What should you suspect first?",
    "options": ["A great feature", "A leak: it's probably recorded after the outcome", "Overfitting", "A small sample"],
    "answer": 1,
    "explanation": "Too good to be true usually is."
  },
  {
    "prompt": "Why is lifetime_failed_deliveries unsafe, even though it describes the customer?",
    "options": ["It's often missing", "It counts failures after the order being predicted", "It's a text column", "Customers can change it"],
    "answer": 1,
    "explanation": "Totals as of the export date look into the future."
  },
  {
    "prompt": "Why mustn't call_group be used as a feature?",
    "options": ["It's random", "It was assigned after checkout and changes the outcome", "It's mostly blank", "It's a string"],
    "answer": 1,
    "explanation": "It's a treatment, not a description of the order."
  }
]
```
