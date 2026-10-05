---
title: Guardrails and decisions
minutes: 25
summary: Weigh a winning primary metric against guardrails that get worse, value both sides in money over a sensible horizon, and make a decision you can defend.
---

## The problem

Paystream tested raising its transfer fee from ₦10 to ₦25. The finance director is delighted: fee revenue per user more than doubled in four weeks. The product team is worried: users made fewer transfers, and more of them had stopped using the app by day 28.

Both are right, and that's the point of guardrails. An experiment that only looks at its primary metric can recommend changes that win this month and lose the customer base. The decision needs both sides on the same scale, usually money, over a long enough time to see the cost.

## The concept

### Primary metric and guardrails, together

Report every pre-agreed metric with its effect and confidence interval. A change that improves the primary metric but significantly harms a guardrail isn't a win; it's a trade-off to decide.

### Put both sides in naira

- The gain: extra fee revenue per user per month.
- The cost: users lost, each worth their future revenue (fees, interest on balances, other products) over a horizon such as a year.

Short tests measure the gain fully but the cost only partly: churn keeps accumulating long after four weeks. A decision based only on the test window favours changes that harvest revenue and pay for it later.

### Decision options

Not just "ship" or "don't": a smaller increase (₦15 or ₦20), the higher fee only for large transfers, or a further test that measures retention over longer.

## Example

```python
import pandas as pd
import numpy as np
from scipy import stats

fee = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/experiments/fee_test.csv")
summary = fee.groupby("variant")[["transfers_28d", "fee_revenue_28d_ngn", "active_on_day_28"]].mean()
summary.round(3)
```

```text
transfers_28d  fee_revenue_28d_ngn  active_on_day_28
variant
Control             8.810               88.099             0.937
Higher fee          7.586              189.654             0.903
```

Each difference, with its test:

```python
c = fee[fee["variant"] == "Control"]
t = fee[fee["variant"] == "Higher fee"]
for metric in ["fee_revenue_28d_ngn", "transfers_28d", "active_on_day_28"]:
    test = stats.ttest_ind(t[metric], c[metric], equal_var=False)
    change = t[metric].mean() - c[metric].mean()
    print(f"{metric}: change {change:+.3f}  ({change / c[metric].mean():+.1%})  p = {test.pvalue:.2g}")
```

```text
fee_revenue_28d_ngn: change +101.555  (+115.3%)  p = 6.5e-178
transfers_28d: change -1.224  (-13.9%)  p = 2.2e-10
active_on_day_28: change -0.034  (-3.6%)  p = 2.5e-08
```

Revenue per user more than doubles, but transfers fall and more users are inactive by day 28: all three changes are far too large to be chance. Now value the trade-off over a year for 100,000 users, assuming a retained user is worth ₦3,000 a year across all products. The test can't say whether the churn gap was a one-off or will repeat every month, so try both:

```python
users = 100_000                    # active users who'd get the higher fee
extra_fee_per_user_year = (t["fee_revenue_28d_ngn"].mean() - c["fee_revenue_28d_ngn"].mean()) * 13
extra_churn = c["active_on_day_28"].mean() - t["active_on_day_28"].mean()
value_per_user_year = 3000

scenarios = {
    "Gap stays at the 4-week level": extra_churn,
    "Same gap again every month": 1 - (1 - extra_churn) ** 12,
}
for name, lost_share in scenarios.items():
    gain = users * extra_fee_per_user_year * (1 - lost_share)
    loss = users * lost_share * value_per_user_year
    print(f"{name}: extra fees ₦{gain / 1e6:,.1f}m, users lost worth ₦{loss / 1e6:,.1f}m, net ₦{(gain - loss) / 1e6:,.1f}m")
```

```text
Gap stays at the 4-week level: extra fees ₦127.6m, users lost worth ₦10.1m, net ₦117.4m
Same gap again every month: extra fees ₦87.4m, users lost worth ₦101.3m, net ₦-13.8m
```

If the extra churn is a one-off, the fee increase pays handsomely. If the same gap opens up again every month, a third of the affected users are gone within a year and the higher fee loses money. A four-week test can't tell these apart, so the responsible decision is not "ship ₦25": it's to test smaller increases and measure retention for longer.

## Walkthrough

1. Run the cells. Add confidence intervals for each difference.
2. Change the value of a retained user to ₦6,000. Does the decision flip?
3. Find the monthly churn gap at which the two sides break even.
4. Write the recommendation (the task below).

## Practice

```answer
{
  "id": "ab-07-p1",
  "prompt": "What is the average **fee revenue per user** over 28 days in the **Higher fee** group? (A rounded figure is fine.)",
  "answer": 189.65,
  "format": "naira",
  "dataset": "experiments",
  "files": ["fee_test"],
  "pyVerify": "round(t['fee_revenue_28d_ngn'].mean(), 2)",
  "hint": "The Higher fee row of the first table.",
  "required": true
}
```

```answer
{
  "id": "ab-07-p2",
  "prompt": "By how many **percentage points** is the share of users active on day 28 lower in the Higher fee group? One decimal place.",
  "answer": 3.4,
  "format": "number",
  "dataset": "experiments",
  "files": ["fee_test"],
  "pyVerify": "round(extra_churn * 100, 1)",
  "hint": "Control's active share minus Higher fee's.",
  "required": true
}
```

```task
{
  "id": "ab-07-t1",
  "prompt": "Write the **recommendation** to the finance director and head of product (60 to 150 words): what the test showed on the **primary metric** and the **guardrails**, the value of each side, the **key uncertainty**, and your recommended **next step**.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "The ₦25 fee more than doubled ...",
  "rules": [
    { "label": "Reports the revenue gain", "pattern": "revenue|fee income" },
    { "label": "Reports a guardrail (transfers or users active)", "pattern": "transfer|active|retention|churn|inactive" },
    { "label": "Uses naira values", "pattern": "₦\\s*\\d|naira" },
    { "label": "Names the key uncertainty (longer term, beyond four weeks, value of a user)", "pattern": "longer|beyond (the )?(four|4)|after (four|4)|value of a (retained )?user|uncertain|depends|can'?t tell|one-off|every month" },
    { "label": "Recommends a next step (test, smaller, ₦15, ₦20, large transfers)", "pattern": "test|smaller|₦\\s*(15|20)|large transfers|pilot" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "The ₦25 fee more than doubled fee revenue per user in four weeks, but users made about 14% fewer transfers and the share still active on day 28 fell by about 3 points. Over a year for 100,000 users, the extra fees easily outweigh the users lost if that churn gap is a one-off, but if the same gap opens every month the fee increase loses money, and a four-week test can't tell which. We recommend not rolling out ₦25 yet: test ₦15 and ₦20 against ₦10 for at least eight weeks, measuring retention as the guardrail, before deciding.",
  "note": "Both directors get their concern answered with a number, and the next step tests exactly the uncertainty that matters.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A change raises revenue per user but significantly lowers retention. What is the result?",
    "options": ["A win", "A trade-off to value and decide, not an automatic win", "A failed test", "Inconclusive"],
    "answer": 1,
    "explanation": "Guardrails exist to catch exactly this."
  },
  {
    "prompt": "Why do short tests tend to favour price increases?",
    "options": ["They don't", "The revenue gain appears immediately, but churn keeps accumulating after the test ends", "Prices are seasonal", "Short tests have more users"],
    "answer": 1,
    "explanation": "Measure retention over a long enough horizon."
  },
  {
    "prompt": "Which is a sensible next step when a trade-off is close?",
    "options": ["Ship the bigger change", "Test smaller changes for longer, with the guardrail measured properly", "Stop testing", "Ignore the guardrail"],
    "answer": 1,
    "explanation": "Reduce the uncertainty that drives the decision."
  }
]
```
