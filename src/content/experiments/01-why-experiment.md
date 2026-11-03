---
title: Why experiment
minutes: 20
summary: Why comparing users who did something with users who didn't can't tell you whether the thing worked, and how random assignment fixes that.
---

## The problem

Paystream's product team redesigned the signup flow. A month after launch, someone runs the numbers: new users who signed up through **referrals** complete identity verification (KYC) far more often than those from **social ads**. Should the company spend more on referrals? Probably, but the data can't say how much a referral **causes**: people who arrive through a friend may simply be more committed in the first place.

The same trap catches almost every "before and after" or "users who did X versus users who didn't" analysis. Those who chose X, or who arrived after the change, differ in ways you can't see. The only reliable way to measure the effect of a change is to decide **at random** who gets it. That's an **experiment**, or **A/B test**, and it's how product, marketing and pricing decisions are made at companies that take evidence seriously.

## The concept

### Correlation isn't causation, for a specific reason

When people **choose** a treatment (a feature, a channel, a plan), the choosers differ from the non-choosers: more engaged, richer, more urban. Those differences, not the treatment, may explain the outcome. They're called **confounders**.

### Randomisation breaks the link

If a coin decides who sees the new signup flow (B) and who sees the old one (A), then on average the two groups are the same in every way, seen and unseen. Any difference in outcomes beyond chance is caused by the flow. That's why A/B tests are the gold standard.

![Left: when users choose, the choosers are mostly highly engaged and the non-choosers mostly not. Right: when a coin decides, both groups have the same mix of engaged and less engaged users.](/images/courses/experiments/randomisation.svg "Self-selection mixes who chose with what worked. Randomisation separates them.")

### The pieces of an A/B test

| Piece | Paystream's onboarding test |
| :-- | :-- |
| **Unit** randomised | each new user, at signup |
| **Variants** | A: old flow (control); B: new flow (treatment) |
| **Primary metric** | completed KYC within 7 days |
| **Secondary metrics** | transactions and value in the first 14 days |
| **Guardrails** | metrics that mustn't get worse (support tickets, failed payments) |

## Example

The onboarding experiment: 12,000 new users, randomly assigned at signup.

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/experiments/"
onboarding = pd.read_csv(base + "onboarding.csv")
print(onboarding["variant"].value_counts())
onboarding.groupby("acquisition_channel")["completed_kyc_7d"].mean().round(3)
```

```text
variant
B    6054
A    5946
Name: count, dtype: int64
acquisition_channel
Agent         0.406
Organic       0.397
Referral      0.471
Social ads    0.337
Name: completed_kyc_7d, dtype: float64
```

Referral users verify most and social-ads users least, but users choose how they arrive, so that comparison is confounded. The A/B comparison isn't, because the coin decided the variant:

```python
onboarding.groupby("variant")[["completed_kyc_7d", "txns_first_14d"]].mean().round(3)
```

```text
completed_kyc_7d  txns_first_14d
variant
A                   0.382           1.615
B                   0.426           1.821
```

The new flow's users verify more often and transact more. Because assignment was random, this difference is the effect of the flow plus chance, and the next lessons show how to separate the two. Check that randomisation worked by comparing the groups on things the flow can't affect:

```python
pd.crosstab(onboarding["acquisition_channel"], onboarding["variant"], normalize="columns").round(3)
```

```text
variant                  A      B
acquisition_channel
Agent                0.302  0.299
Organic              0.206  0.202
Referral             0.249  0.256
Social ads           0.242  0.243
```

The channel mix is nearly identical in both variants, exactly what random assignment should produce.

## Walkthrough

1. Load the data and look at the columns: `onboarding.head()`.
2. Compare KYC completion by platform. Is that comparison causal? Why not?
3. Compare the variants on platform and region mix, as above. Are they balanced?
4. Think of a recent decision at a company you know that was based on a "users who did X" comparison. What confounders might explain the result?

## Practice

```dataset
{"dataset": "experiments", "files": ["onboarding", "banner_daily", "fee_test", "rollout"]}
```

```answer
{
  "id": "ab-01-p1",
  "prompt": "What share of onboarding users completed KYC within 7 days in variant **A** (the old flow)? As a percentage, one decimal place.",
  "answer": 38.2,
  "format": "percent",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "round(onboarding.loc[onboarding['variant'] == 'A', 'completed_kyc_7d'].mean() * 100, 1)",
  "hint": "The A row of the second output.",
  "required": true
}
```

```task
{
  "id": "ab-01-t1",
  "prompt": "A bank finds that customers who use its budgeting tool save twice as much as those who don't, and wants to say the tool doubles savings. Write a short reply (40 to 120 words) explaining why that conclusion isn't safe, naming **two possible confounders**, and describing the **experiment** that would answer the question.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Customers who choose to use the tool ...",
  "rules": [
    { "label": "Explains self-selection (choose, chose, already, different)", "pattern": "choose|chose|already|differ|self-select" },
    { "label": "Names at least two confounders (income, motivation, age, engagement, education, savers)", "pattern": "income|motivat|age|engag|educat|disciplin|saver|wealth|salary", "min": 2 },
    { "label": "Describes random assignment", "pattern": "random" },
    { "label": "Between 40 and 120 words", "minWords": 40, "maxWords": 120 }
  ],
  "sample": "Customers who choose to use the budgeting tool are probably different from those who don't: likely more motivated savers, perhaps with higher or more regular incomes. Those differences, not the tool, could explain why they save more. To measure the tool's real effect, the bank should randomly offer it to half of a group of similar customers, for example new current-account holders, and compare savings in the two halves after three months. Because a coin decides who's offered the tool, any difference beyond chance is caused by the tool.",
  "note": "\"Offered\" matters: you can randomise who's offered the tool, but not who uses it. Comparing everyone offered against everyone not offered keeps the comparison fair.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Users who enable notifications transact twice as much. Why can't you conclude notifications cause it?",
    "options": ["The sample is too small", "Users who choose to enable them may already be more engaged: a confounder", "Notifications don't work", "Transactions can't be measured"],
    "answer": 1,
    "explanation": "Self-selection makes the groups different from the start."
  },
  {
    "prompt": "What makes an A/B test's comparison causal?",
    "options": ["A large sample", "Random assignment, which makes the groups alike in everything except the treatment, on average", "A dashboard", "Using the mean"],
    "answer": 1,
    "explanation": "Randomisation removes confounders."
  },
  {
    "prompt": "What is a guardrail metric?",
    "options": ["The primary metric", "A metric that mustn't get worse, even if the primary metric improves", "The sample size", "A segment"],
    "answer": 1,
    "explanation": "Guardrails stop you winning one metric by damaging another."
  }
]
```
