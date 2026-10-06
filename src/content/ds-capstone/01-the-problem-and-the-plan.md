---
title: The problem and the plan
minutes: 25
summary: Meet Kasuwa, an online shop losing money on pay-on-delivery orders that fail at the door. Turn "build a model to stop bad orders" into a decision, a target, a prediction moment and a metric in naira.
---

## The problem

This is the capstone of the Data Scientist track. There's nothing new to learn here. Instead, you'll take a business problem from a vague request to a model that's been tested, costed, checked for fairness, and planned for monitoring.

The company is **Kasuwa**, an online shop that launched in January 2025 and delivers across Nigeria. Most customers choose **pay on delivery**: they pay the rider when the parcel arrives. Too often, the rider arrives and the customer refuses the parcel or can't be reached. Each failed delivery costs Kasuwa about **₦6,500**: two rider trips, the return to the warehouse and restocking.

The head of operations has sent this:

> "Failed deliveries are eating our margin. I want a model that stops bad orders. In April we trialled phoning customers to confirm their order before dispatch, and it seemed to help, but calling everyone is expensive. Can data science tell us who to call?"

"A model that stops bad orders" isn't a plan. Stopping orders loses sales, and "bad" isn't defined. Your first job is to frame the problem so that a model can actually help a decision.

## The concept

### Start from the decision

A model is only useful if it changes a decision. Here the decision is: **for each pay-on-delivery order, at checkout, should we phone the customer to confirm before dispatch?** A call costs about **₦250** of agent time. Blocking orders, or demanding a deposit, would be harsher decisions with more risk of losing good customers, so start with the gentlest one.

### The target and the prediction moment

- **Unit**: one pay-on-delivery order that was dispatched (cancelled orders never reach a rider).
- **Target**: `failed` = 1 if the delivery failed.
- **Prediction moment**: checkout. Every feature must be something Kasuwa knew **at that moment**. This rule matters more than any choice of algorithm.

### A metric in naira

AUC tells you how well the model ranks orders. The business cares about **net naira saved**: failures prevented × ₦6,500, minus calls × ₦250. You'll need both, and the second needs evidence of what a call actually prevents. That's what the April trial is for.

![Framing a problem: the decision, the unit, the target, the prediction moment and a metric in naira, shown with an invented clinic booking example](/images/courses/ds-capstone/frame-problem.svg "Decision, unit, target, prediction moment, and a metric in naira.")

### The arc of the project

| Stage | Lesson |
| :-- | :-- |
| Frame the problem | 1 |
| Audit the data, and find what's known at checkout | 2 |
| Build point-in-time features | 3 |
| Validate models over time | 4 |
| Calibrate and choose thresholds | 5 |
| Use the trial to decide who to call | 6 |
| Check fairness and explain the model | 7 |
| Plan monitoring and present | 8 |

## Example

Load the orders and see how often each kind of order fails:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/deliveries/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_time", "resolved_at"])
print(orders.shape)
orders.groupby("payment_method")["status"].value_counts(normalize=True).unstack().round(3)
```

```text
(66884, 16)
status           Cancelled  Delivered  Failed delivery
payment_method
Pay on delivery      0.030      0.790             0.18
Prepaid              0.029      0.941             0.03
```

Prepaid orders rarely fail; pay-on-delivery orders fail far more often. Now the size of the problem over the last year:

```python
pod = orders[(orders["payment_method"] == "Pay on delivery") & (orders["status"] != "Cancelled")]
last_year = pod[pod["order_time"] >= "2025-07-01"]
failures = (last_year["status"] == "Failed delivery").sum()
print(f"Dispatched pay-on-delivery orders, July 2025 to June 2026: {len(last_year):,}")
print(f"Failed: {failures:,} ({failures / len(last_year):.1%})")
print(f"Cost at ₦6,500 each: ₦{failures * 6500 / 1e6:,.1f}m a year")
```

```text
Dispatched pay-on-delivery orders, July 2025 to June 2026: 33,835
Failed: 6,193 (18.3%)
Cost at ₦6,500 each: ₦40.3m a year
```

That's the prize, but a model can't win all of it. Some failures can't be prevented by any call. The realistic target is the share a call can prevent, at a cost lower than what it saves.

## Walkthrough

1. Download the dataset below and open it in Colab.
2. Run the two cells.
3. Read the column descriptions on the dataset page. For each column, ask: would Kasuwa know this at checkout?
4. Write down what success looks like: a net saving per month, and a check that good customers aren't harmed.
5. Write the project framing (the task below).

## Practice

```dataset
{"dataset": "deliveries", "files": ["orders", "customers"]}
```

```answer
{
  "id": "dsc-01-p1",
  "prompt": "Across the **whole dataset**, what percentage of dispatched **pay-on-delivery** orders failed? One decimal place.",
  "answer": 18.6,
  "format": "percent",
  "dataset": "deliveries",
  "files": ["orders"],
  "pyVerify": "round(100 * (pod['status'] == 'Failed delivery').mean(), 1)",
  "hint": "Use pod, not last_year.",
  "required": true
}
```

```answer
{
  "id": "dsc-01-p2",
  "prompt": "What did failed pay-on-delivery deliveries cost from **July 2025 to June 2026**, at ₦6,500 each, in ₦ millions? One decimal place.",
  "answer": 40.3,
  "format": "number",
  "dataset": "deliveries",
  "files": ["orders"],
  "pyVerify": "round(failures * 6500 / 1e6, 1)",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "dsc-01-t1",
  "prompt": "Write the **project framing** (60 to 140 words): the **decision** the model supports, the **target**, the **prediction moment**, the **metric** in naira, and one thing the model must **not** do.",
  "minutes": 7,
  "rows": 7,
  "placeholder": "Decision: ...\nTarget: ...",
  "rules": [
    { "label": "Names the decision (call, confirm)", "pattern": "call|confirm" },
    { "label": "Defines the target (failed delivery)", "pattern": "fail" },
    { "label": "States the prediction moment (checkout, when the order is placed)", "pattern": "checkout|when the order is placed|at the time of (the )?order|order time" },
    { "label": "A metric in naira (saving, cost, net)", "pattern": "₦|naira|net|saving|cost" },
    { "label": "Something the model must not do", "pattern": "must not|mustn't|shouldn't|should not|never|avoid" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 140 }
  ],
  "sample": "Decision: for each pay-on-delivery order, at checkout, should we phone the customer to confirm before dispatch?\nTarget: failed = 1 if a dispatched pay-on-delivery order fails at the door (refused or unreachable).\nPrediction moment: checkout. Only information known when the order is placed can be used.\nMetric: net saving per month = failures prevented × ₦6,500 − calls × ₦250, measured against the April trial. AUC is a check, not the goal.\nMust not: block or delay orders, or treat customers worse because of where they live; a call is a light-touch action, and anything harsher needs a separate review.",
  "note": "The metric needs the trial: a model that ranks well is worthless if calls don't change outcomes.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why frame the project around the decision rather than \"predict failed deliveries\"?",
    "options": ["It's shorter", "A prediction only creates value if it changes what the business does", "Models need decisions to train", "The board prefers it"],
    "answer": 1,
    "explanation": "Decision first, then the prediction that informs it."
  },
  {
    "prompt": "What does \"prediction moment: checkout\" rule out?",
    "options": ["Using the customer's city", "Using anything learned after checkout, such as delivery attempts", "Using past orders", "Using the basket value"],
    "answer": 1,
    "explanation": "Features must be known at the moment of the decision."
  },
  {
    "prompt": "Why is AUC not enough as the success measure?",
    "options": ["It's hard to compute", "It measures ranking, not whether acting on the ranking saves money", "It's always high", "The business can't read it"],
    "answer": 1,
    "explanation": "Value depends on what the action achieves and costs."
  }
]
```
