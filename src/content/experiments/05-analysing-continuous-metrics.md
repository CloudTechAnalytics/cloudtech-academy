---
title: Analysing continuous metrics
minutes: 15
summary: Compare averages such as transactions or value per user with Welch's t-test, handle heavily skewed money metrics with a bootstrap, and decide whether a few big users are driving the result.
---

## The problem

The finance team cares less about KYC than about money: did the new flow make new users transact more, and more valuably? In the first 14 days, B's users transacted more on average, and their total value was higher.

Value is tricky. Most new users move small amounts, and a handful move very large ones. One trader moving ₦3m in their first week can swing a group's average. Before telling finance that the flow increased value, you need to know whether the difference is real, and whether it's the typical user or a few big ones.

## The concept

### Welch's t-test

For a numeric metric (transactions, value), compare the two means with `stats.ttest_ind(b, a, equal_var=False)`. "Welch" means it doesn't assume the two groups have the same spread, which is the safer default. With thousands of users per group, the t-test works even when the data are skewed, because averages of many values are close to normally distributed.

### Skewed metrics

For money, look at more than the mean:

- the **median**: what a typical user does;
- the share of the total from the top 1% of users;
- a **winsorised** or capped mean (capping values above, say, the 99th percentile), to check that a few extreme users aren't driving the result.

### The bootstrap

A general way to get a confidence interval for any statistic:

1. Resample each group **with replacement**, same size as the original.
2. Calculate the statistic (difference in means) on the resample.
3. Repeat thousands of times; the middle 95% of the results is the confidence interval.

No formula needed, and it works for medians, ratios and capped means alike.

## Example

```python
import pandas as pd
import numpy as np
from scipy import stats

onboarding = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/experiments/onboarding.csv")
a = onboarding[onboarding["variant"] == "A"]
b = onboarding[onboarding["variant"] == "B"]

for metric in ["txns_first_14d", "value_first_14d_ngn"]:
    t = stats.ttest_ind(b[metric], a[metric], equal_var=False)
    print(f"{metric}: A mean {a[metric].mean():,.2f}  B mean {b[metric].mean():,.2f}  p = {t.pvalue:.3g}")
print("Median value: A", a["value_first_14d_ngn"].median(), " B", b["value_first_14d_ngn"].median())
```

```text
txns_first_14d: A mean 1.61  B mean 1.82  p = 0.000271
value_first_14d_ngn: A mean 23,696.10  B mean 26,776.71  p = 0.00125
Median value: A 3625.0  B 5350.0
```

Both differences are significant, and the median moves too, so it isn't only a few big users. Check the money result with a bootstrap of the difference in mean value, and with values capped at the 99th percentile:

```python
rng = np.random.default_rng(42)
va, vb = a["value_first_14d_ngn"].to_numpy(), b["value_first_14d_ngn"].to_numpy()
boot = [rng.choice(vb, len(vb)).mean() - rng.choice(va, len(va)).mean() for _ in range(2000)]
low, high = np.percentile(boot, [2.5, 97.5])
print(f"Difference in mean value: {vb.mean() - va.mean():,.0f}   bootstrap 95% CI {low:,.0f} to {high:,.0f}")

cap = np.percentile(np.concatenate([va, vb]), 99)
print(f"Capped at ₦{cap:,.0f}: A {np.minimum(va, cap).mean():,.0f}  B {np.minimum(vb, cap).mean():,.0f}")
```

```text
Difference in mean value: 3,081   bootstrap 95% CI 1,301 to 4,911
Capped at ₦244,550: A 22,448  B 25,677
```

The bootstrap interval is clear of zero, and the capped means show the same direction. The flow's value effect is real and broad-based, though its size is uncertain: the interval is wide because money is so variable.

## Walkthrough

1. Run the cells. Plot a histogram of `value_first_14d_ngn` with a log scale on the x-axis to see the skew.
2. Bootstrap the difference in **medians** instead of means.
3. Remove the top 10 users by value from each group. Does the conclusion change?
4. Write one sentence for finance with the difference in mean value and its interval.

## Practice

```answer
{
  "id": "ab-05-p1",
  "prompt": "What is the average number of transactions in the first 14 days for variant **B**? Two decimal places.",
  "answer": 1.82,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "round(b['txns_first_14d'].mean(), 2)",
  "hint": "B's mean in the first line of output.",
  "required": true
}
```

```answer
{
  "id": "ab-05-p2",
  "prompt": "What is the difference in **mean** 14-day value per user (B − A)? (A rounded figure is fine.)",
  "answer": 3081,
  "format": "naira",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "round(vb.mean() - va.mean())",
  "hint": "The first number in the bootstrap cell's output.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use Welch's t-test rather than the standard t-test?",
    "options": ["It's newer", "It doesn't assume the two groups have equal spread, so it's a safer default", "It's only for small samples", "It ignores outliers"],
    "answer": 1,
    "explanation": "Treatments often change the spread as well as the mean."
  },
  {
    "prompt": "B's mean value is up but its median is unchanged. What might be happening?",
    "options": ["Nothing", "A few large users may be driving the mean; check capped means and the top users", "The median is wrong", "The test failed"],
    "answer": 1,
    "explanation": "Skewed metrics need more than one summary."
  },
  {
    "prompt": "How does a bootstrap confidence interval work?",
    "options": ["It uses a fixed formula", "Resample the data with replacement many times, recompute the statistic, and take the middle 95%", "It removes outliers", "It needs normal data"],
    "answer": 1,
    "explanation": "It works for almost any statistic."
  }
]
```
