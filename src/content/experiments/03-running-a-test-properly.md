---
title: Running a test properly
minutes: 15
summary: Check that randomisation worked with a sample ratio mismatch test, and see by simulation why peeking at results and stopping early multiplies false alarms.
---

## The problem

Two things go wrong while tests are running, and both produce confident, wrong answers.

The homepage banner test was meant to split users 50/50. Variant B got 104,210 users and A got 110,094. "Close enough," says the product manager. It isn't: a gap that size is almost impossible by chance with this many users, which means something in the randomiser or the logging is broken, and the users who went missing from B might be exactly the ones who wouldn't have clicked.

Meanwhile, the growth team checks every test's dashboard each morning and stops a test the day it shows "significant". It feels efficient. It's a way of finding effects that don't exist.

## The concept

**Sample ratio mismatch (SRM)**

If you intended a 50/50 split, the number of users in each variant should be close to 50/50, within the range chance allows. A **chi-square test** of the counts against the intended split gives a p-value. If p is very small (say below 0.001), the split is broken. **Don't analyse the results**: find and fix the cause first (a bug that drops users, a redirect that fails on some phones, bots in one variant).

**Peeking**

A p-value below 0.05 means a 5% false-alarm rate **if you look once, at the planned end**. If you look every day and stop the first time p < 0.05, you get many chances for random noise to cross the line, and the real false-alarm rate rises far above 5%.

**An A/A test**

Two identical variants. Any "significant" difference is a false alarm by definition. Simulating many A/A tests is a powerful way to see what your process really does.

**The rules**

- Fix the sample size and duration in advance, and analyse once at the end.
- If you must monitor, use a method designed for it (sequential testing), or only stop early for harm on a guardrail.

## Example

The SRM check, on both tests:

```python
import pandas as pd
import numpy as np
from scipy import stats

base = "https://academy.cloudtechanalytics.com/datasets/experiments/"
onboarding = pd.read_csv(base + "onboarding.csv")
banner = pd.read_csv(base + "banner_daily.csv")

counts = onboarding["variant"].value_counts().sort_index()
print("Onboarding users:", counts.to_dict(), " SRM p-value:", round(stats.chisquare(counts).pvalue, 3))

banner_users = banner.groupby("variant")["users"].sum()
print("Banner users:", banner_users.to_dict(), " SRM p-value:", stats.chisquare(banner_users).pvalue)
```

```text
Onboarding users: {'A': 5946, 'B': 6054}  SRM p-value: 0.324
Banner users: {'A': 110094, 'B': 104210}  SRM p-value: 5.180176304654498e-37
```

The onboarding split is consistent with chance. The banner split has a p-value with dozens of zeros: it is broken, and its results can't be trusted until the cause is found. Now the peeking problem, simulated: 1,000 A/A tests of a 40% conversion rate, 400 users per variant per day for 20 days, checked every day:

```python
rng = np.random.default_rng(42)
tests, days, per_day, rate = 1000, 20, 400, 0.40

def p_value(conv_a, conv_b, n):
    pooled = (conv_a + conv_b) / (2 * n)
    se = np.sqrt(pooled * (1 - pooled) * 2 / n)
    return 2 * stats.norm.sf(np.abs(conv_b / n - conv_a / n) / se)

false_alarm_end, false_alarm_peeking = 0, 0
for _ in range(tests):
    a = rng.binomial(per_day, rate, days).cumsum()
    b = rng.binomial(per_day, rate, days).cumsum()
    n = per_day * np.arange(1, days + 1)
    pvals = p_value(a, b, n)
    false_alarm_end += pvals[-1] < 0.05
    false_alarm_peeking += (pvals < 0.05).any()
print("False alarms, looking once at the end:", false_alarm_end / tests)
print("False alarms, stopping at the first p < 0.05:", false_alarm_peeking / tests)
```

```text
False alarms, looking once at the end: 0.055
False alarms, stopping at the first p < 0.05: 0.268
```

Looking once gives about the 5% you'd expect. Checking every day and stopping at the first "win" makes false alarms several times more common, though there's never any real difference.

## Walkthrough

1. Run the cells. Then calculate the share of banner users in B: it should be 50%.
2. Change the peeking simulation to check every 5 days instead of every day. Does the false-alarm rate fall?
3. List three things that could cause the banner test's mismatch.
4. Write the rule your team will follow about looking at running tests.

## Practice

```answer
{
  "id": "ab-03-p1",
  "prompt": "What share of the banner test's users were in **variant B**? As a percentage, one decimal place.",
  "answer": 48.6,
  "format": "percent",
  "dataset": "experiments",
  "files": ["banner_daily"],
  "pyVerify": "round(banner_users['B'] / banner_users.sum() * 100, 1)",
  "hint": "B's users ÷ all users.",
  "required": true
}
```

```answer
{
  "id": "ab-03-p2",
  "prompt": "In the simulation, what share of A/A tests produced a false alarm when **stopping at the first p < 0.05**? As a percentage, one decimal place.",
  "answer": 26.8,
  "format": "percent",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "round(false_alarm_peeking / tests * 100, 1)",
  "hint": "The second line of the simulation's output.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A test meant to split 50/50 has 110,094 users in A and 104,210 in B, with an SRM p-value near zero. What should you do?",
    "options": ["Analyse it anyway", "Stop and find the cause; don't trust the results until the split is fixed", "Weight the results", "Drop some A users"],
    "answer": 1,
    "explanation": "The missing users may differ systematically, biasing everything."
  },
  {
    "prompt": "Why does checking a test every day and stopping at p < 0.05 cause problems?",
    "options": ["It's tiring", "Each look is another chance for noise to cross the line, so false alarms rise well above 5%", "p-values change meaning at night", "It doesn't"],
    "answer": 1,
    "explanation": "Analyse once, at the planned end."
  },
  {
    "prompt": "What is an A/A test for?",
    "options": ["Testing two new designs", "Checking the testing system: with identical variants, any 'win' is a false alarm", "Doubling the sample", "Measuring novelty"],
    "answer": 1,
    "explanation": "It reveals problems in randomisation and analysis."
  }
]
```
