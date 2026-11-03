---
title: Analysing conversion tests
minutes: 25
summary: Test the difference between two conversion rates with a two-proportion z-test, report it with a confidence interval and relative lift, and say what it means in users and money.
---

## The problem

The onboarding test has finished: 12,000 users, randomisation checked. Now the head of product wants one sentence: "Did the new flow work, and by how much?"

"B converted 42.6% and A 38.2%, so B wins" isn't enough. With random samples, some difference is always there by chance. The analysis has to say whether this difference is bigger than chance can explain, how big the true effect plausibly is, and what that means for the business.

## The concept

### The two-proportion z-test

For conversion rates p_A and p_B from n_A and n_B users:

1. Pooled rate p = (conversions A + conversions B) ÷ (n_A + n_B).
2. Standard error SE = √[p(1 − p)(1/n_A + 1/n_B)].
3. z = (p_B − p_A) ÷ SE, and the two-sided p-value = 2 × P(Z > |z|).

A p-value below 0.05 means a difference this large would be rare if the flows were really the same.

### Report the effect, not just the p-value

- **Absolute difference**: p_B − p_A, in percentage points.
- **Confidence interval** for it: difference ± 1.96 × √[p_A(1 − p_A)/n_A + p_B(1 − p_B)/n_B]. It gives the range of effects consistent with the data.

![Three estimated differences with 95% confidence intervals against a zero line: a clear improvement entirely above zero, an inconclusive result crossing zero, and a harmful change entirely below zero.](/images/courses/experiments/confidence-intervals.svg "Read the interval against zero, illustrated.")
- **Relative lift**: (p_B − p_A) ÷ p_A.

### Translate it

"+4.5 points" means little to a director. "About 45 more verified customers per 1,000 signups, around 5,800 more a year at current signup rates" means a lot.

## Example

```python
import pandas as pd
import numpy as np
from scipy import stats

onboarding = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/experiments/onboarding.csv")
summary = onboarding.groupby("variant")["completed_kyc_7d"].agg(conversions="sum", users="count")
summary["rate"] = summary["conversions"] / summary["users"]
summary.round(4)
```

```text
conversions  users    rate
variant
A               2270   5946  0.3818
B               2581   6054  0.4263
```

```python
pA, pB = summary.loc["A", "rate"], summary.loc["B", "rate"]
nA, nB = summary.loc["A", "users"], summary.loc["B", "users"]

pooled = summary["conversions"].sum() / summary["users"].sum()
z = (pB - pA) / np.sqrt(pooled * (1 - pooled) * (1 / nA + 1 / nB))
p_value = 2 * stats.norm.sf(abs(z))

diff = pB - pA
se = np.sqrt(pA * (1 - pA) / nA + pB * (1 - pB) / nB)
print(f"Difference: {diff:.2%}   95% CI: {diff - 1.96 * se:.2%} to {diff + 1.96 * se:.2%}")
print(f"Relative lift: {diff / pA:.1%}   z = {z:.2f}   p-value = {p_value:.2g}")
```

```text
Difference: 4.46%   95% CI: 2.70% to 6.21%
Relative lift: 11.7%   z = 4.97   p-value = 6.6e-07
```

The new flow raised 7-day KYC completion by about 4.5 percentage points, a relative lift of about 12%, and the confidence interval is well clear of zero. With about 430 signups a day, that's roughly 19 more verified customers every day, or around 7,000 a year.

## Walkthrough

1. Run the cells and check the z-test by hand for the first step (the pooled rate).
2. Compare your result with `stats.chi2_contingency` on the 2×2 table of variant against KYC. The p-values should match closely.
3. Work out how many extra verified customers the flow would produce in a year.
4. Write the result for the head of product (the task below).

## Practice

```answer
{
  "id": "ab-04-p1",
  "prompt": "What is the **absolute difference** in 7-day KYC completion (B − A), in percentage points? One decimal place.",
  "answer": 4.5,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "round(diff * 100, 1)",
  "hint": "The difference printed by the second cell.",
  "required": true
}
```

```answer
{
  "id": "ab-04-p2",
  "prompt": "What is the **lower end** of the 95% confidence interval for the difference, in percentage points? One decimal place.",
  "answer": 2.7,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "round((diff - 1.96 * se) * 100, 1)",
  "hint": "The first number of the CI.",
  "required": true
}
```

```task
{
  "id": "ab-04-t1",
  "prompt": "Write the **result** for the head of product in 40 to 110 words: the effect with its **confidence interval**, whether it's **statistically significant**, and what it means in **customers** per day or year.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "The new signup flow raised ...",
  "rules": [
    { "label": "Gives the effect in points or percent", "pattern": "\\d+(\\.\\d+)?\\s*(percentage )?points?|\\d+(\\.\\d+)?\\s*%" },
    { "label": "Gives a confidence interval (CI, range, between … and)", "pattern": "confidence|\\bci\\b|range|between [^.]*and" },
    { "label": "Says whether it's significant", "pattern": "significant|p-value|p =|p<|p <|chance" },
    { "label": "Translates into customers", "pattern": "customers?|users?|verified" },
    { "label": "Between 40 and 110 words", "minWords": 40, "maxWords": 110 }
  ],
  "sample": "The new signup flow raised 7-day KYC completion from 38.2% to 42.6%, an increase of 4.5 percentage points (95% confidence interval 2.7 to 6.2 points), or about 12% in relative terms. The result is statistically significant (p < 0.001): a difference this large would be very unlikely if the flows performed the same. At about 430 signups a day, that's roughly 19 more verified customers every day, around 7,000 a year. We recommend rolling the new flow out to all users.",
  "note": "The interval matters: even the low end (2.7 points) would be worth having, which makes the decision easy.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A test shows +1.2 points with a 95% CI of −0.8 to +3.2 points. What should you conclude?",
    "options": ["B is better", "The data are consistent with no effect, or a small positive or negative one: inconclusive", "B is worse", "The test proves there's no effect"],
    "answer": 1,
    "explanation": "An interval that includes zero means the test couldn't tell."
  },
  {
    "prompt": "A conversion rate rises from 10% to 12%. What are the absolute and relative changes?",
    "options": ["2 points and 20%", "20 points and 2%", "2% and 2%", "12 points and 20%"],
    "answer": 0,
    "explanation": "Absolute: 12 − 10 = 2 points; relative: 2 ÷ 10 = 20%."
  },
  {
    "prompt": "Why translate the result into customers or money?",
    "options": ["It's more impressive", "Decision-makers act on business impact, not p-values", "It's required by statistics", "To avoid confidence intervals"],
    "answer": 1,
    "explanation": "A result is only useful if people can weigh it against costs."
  }
]
```
