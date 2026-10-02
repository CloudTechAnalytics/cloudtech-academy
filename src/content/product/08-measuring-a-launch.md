---
title: Measuring a launch
minutes: 25
summary: Check whether a launched feature actually worked, avoid the self-selection trap of comparing adopters with everyone else, use a randomised holdout, watch guardrails, and report an honest result.
---

## The problem

Paystream launched savings goals last quarter. The team's launch slide says: "Users who use savings goals are 18 points more likely to still be active after 8 weeks!" Leadership is delighted and wants to promote savings goals everywhere.

But users who choose to set up a savings goal are already the most engaged users. They would have stayed anyway. Comparing them with everyone else measures **who** adopts, not what the feature **did**.

## The concept

**Self-selection**

When users choose whether to use a feature, adopters differ from non-adopters before the feature exists. Any comparison between them mixes the feature's effect with those differences.

**A randomised holdout**

Paystream did something wise: it gave early access to a **random** half of users and held the other half back. Because the groups were chosen by chance, they're alike except for access. Comparing **all** early-access users (adopters or not) with the holdout measures the effect of offering the feature. This is the experimentation course's A/B test, applied to a launch.

**Effect per adopter**

The holdout comparison is diluted by early-access users who never adopted. Dividing the difference by the adoption rate gives a rough effect per adopter.

**Guardrails**

Metrics that must not get worse, such as support tickets or failed transactions, checked the same way.

## Example

The naive comparison, then the honest one:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
rollout = pd.read_csv(base + "rollout.csv")
early = rollout[rollout["group"] == "early access"]

naive = early.groupby("adopted_savings_goals")["active_week_8"].mean()
print(f"Naive: adopters {naive[1]:.1%} active vs non-adopters {naive[0]:.1%}: a gap of {(naive[1] - naive[0]) * 100:.1f} points")

rates = rollout.groupby("group")["active_week_8"].agg(["mean", "size"])
diff = rates.loc["early access", "mean"] - rates.loc["holdout", "mean"]
se = np.sqrt(sum(r["mean"] * (1 - r["mean"]) / r["size"] for _, r in rates.iterrows()))
adoption = early["adopted_savings_goals"].mean()
print(f"Randomised: early access {rates.loc['early access', 'mean']:.1%} vs holdout {rates.loc['holdout', 'mean']:.1%}")
print(f"Difference {diff * 100:.1f} points, 95% interval {(diff - 1.96 * se) * 100:.1f} to {(diff + 1.96 * se) * 100:.1f}")
print(f"Adoption among early access: {adoption:.0%}; rough effect per adopter: {diff / adoption * 100:.1f} points")
```

```text
Naive: adopters 70.4% active vs non-adopters 52.7%: a gap of 17.8 points
Randomised: early access 60.3% vs holdout 58.4%
Difference 1.9 points, 95% interval -0.6 to 4.4
Adoption among early access: 43%; rough effect per adopter: 4.4 points
```

The naive gap is large. The randomised difference is small, and its 95% interval includes zero: the data is consistent with savings goals helping a little, or not at all. Most of the 18 points was self-selection. Now the guardrail:

```python
tickets = rollout.groupby("group")["support_ticket"].mean() * 1000
print(f"Support tickets per 1,000 users: early access {tickets['early access']:.0f}, holdout {tickets['holdout']:.0f}")
```

```text
Support tickets per 1,000 users: early access 49, holdout 41
```

Early-access users raised slightly more support tickets. The difference is about the size of the noise, so it isn't proof of a problem, but it's worth reading those tickets. An honest summary: savings goals are popular with engaged users, may have added a few support requests, and there's no clear evidence yet that they keep users who would otherwise leave. That's a reason for a longer test, or a better version, not for a company-wide campaign built on the 18-point slide.

## Walkthrough

1. Run the cells. Compare adopters' and non-adopters' segments. How different were they?
2. How many users per group would you need to detect a 2-point difference reliably? (Use the experimentation course's sample size method.)
3. Check the randomised difference for salary earners only. Is it clearer?
4. Rewrite the launch slide (the task below).

## Practice

```answer
{
  "id": "pdm-08-p1",
  "prompt": "What's the **naive** gap between adopters and non-adopters, in percentage points? One decimal place.",
  "answer": 17.8,
  "format": "number",
  "dataset": "product",
  "files": ["rollout"],
  "pyVerify": "round((naive[1] - naive[0]) * 100, 1)",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "pdm-08-t1",
  "prompt": "Rewrite the launch slide's headline and three bullets (40 to 110 words) so they're **honest**: the **randomised** result with its **uncertainty**, why the 18-point figure **misleads**, the **guardrail**, and the **next step**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Savings goals: ...",
  "rules": [
    { "label": "Mentions the randomised or holdout comparison", "pattern": "random|holdout|early access" },
    { "label": "States uncertainty (interval, includes zero, not clear)", "pattern": "interval|zero|not (yet )?clear|uncertain|no clear" },
    { "label": "Explains self-selection (engaged, choose, would have stayed)", "pattern": "engaged|select|choose|would have stayed|already" },
    { "label": "Mentions the guardrail (support tickets)", "pattern": "ticket|support|guardrail" },
    { "label": "A next step", "pattern": "next|longer|test|improve|rerun" },
    { "label": "Between 40 and 110 words", "minWords": 40, "maxWords": 110 }
  ],
  "sample": "Savings goals: popular, effect on retention not yet clear\n- In a randomised holdout, early-access users were about 2 points more likely to be active in week 8, but the 95% interval includes zero.\n- The 18-point gap compares adopters with non-adopters; adopters were already our most engaged users and would mostly have stayed anyway.\n- Support tickets rose slightly (49 vs 41 per 1,000), about the size of the noise; we're reading them.\nNext: a longer test focused on salary earners, and a version with automatic payday saving, before any company-wide campaign.",
  "note": "The headline still credits what's true (popular, safe) while refusing to claim what isn't proven.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is comparing feature adopters with non-adopters misleading?",
    "options": ["Samples are small", "Adopters choose themselves and were already different, often more engaged", "It always understates effects", "It isn't"],
    "answer": 1,
    "explanation": "Self-selection."
  },
  {
    "prompt": "What does a randomised holdout make possible?",
    "options": ["Faster launches", "Comparing groups that differ only in access, so the difference is the feature's effect", "More adopters", "No guardrails"],
    "answer": 1,
    "explanation": "Chance makes the groups alike."
  },
  {
    "prompt": "The 95% interval for the effect runs from −0.5 to +4 points. What should you say?",
    "options": ["It works", "The data is consistent with a small benefit or none; it's not proven", "It hurts", "The test failed"],
    "answer": 1,
    "explanation": "Report uncertainty honestly."
  }
]
```
