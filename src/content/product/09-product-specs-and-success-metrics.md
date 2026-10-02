---
title: Product specs and success metrics
minutes: 20
summary: Write a product spec that engineers, designers and the business can work from (problem, users, evidence, scope, non-goals, success metrics with baselines, guardrails and the launch plan) for Paystream's top priority.
---

## The problem

Verification help at agents is at the top of the roadmap. The engineers ask: what exactly are we building? The designer asks: for whom, and what's the flow? Compliance asks: what are we changing about identity checks? The CEO asks: how will we know it worked?

A **product spec** (often called a PRD, product requirements document) answers all of them in one place, before work starts, so that everyone builds the same thing for the same reason.

## The concept

**What a good spec contains**

| Section | Answers |
| :-- | :-- |
| Problem | what's wrong, for whom, with evidence |
| Users | the segment and their job to be done |
| Goal and success metrics | the outcome, measured, with a **baseline** and a **target** |
| Guardrails | what must not get worse |
| Scope | what's in the first version |
| Non-goals | what's deliberately out |
| Launch and measurement plan | how it's rolled out and evaluated (a holdout, lesson 8) |
| Open questions | what isn't known yet |

**Baselines from data**

A target without a baseline is a guess. Measure the current value first, then set a realistic target.

## Example

Baselines for verification help, from the signup data:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
users = pd.read_csv(base + "users.csv")
feedback = pd.read_csv(base + "feedback.csv")

traders = users[(users["segment"] == "Market trader") & (users["phone_verified"] == 1)]
print(f"Traders who verified their phone: {len(traders)} in 8 weeks")
print(f"Their BVN verification rate: {traders['bvn_verified'].mean():.1%}")
print((traders.groupby("channel")["bvn_verified"].mean() * 100).round(1).to_string())
bvn = feedback[feedback["theme"] == "BVN verification problems"]
print(f"Verification feedback items: {len(bvn)}, of which app reviews average {bvn['rating'].mean():.2f} stars")
```

```text
Traders who verified their phone: 2555 in 8 weeks
Their BVN verification rate: 57.3%
channel
Agent sign-up        69.1
Instagram ad         35.8
Play Store search    47.7
Referral             53.3
Verification feedback items: 249, of which app reviews average 1.86 stars
```

Traders who signed up with an agent already verify far more often than those who signed up alone. That's evidence that helping at the agent works, and it suggests a realistic target: bring other traders closer to the agent-assisted rate. A spec that only said "improve verification" would give the team nothing to aim at.

## Walkthrough

1. Run the cell. Set a target for trader BVN verification and justify it with the channel numbers.
2. What guardrail matters most for an identity feature? (Think about fraud and compliance.)
3. Decide the launch plan: which traders get it first, and what's the holdout?
4. Write the spec (the task below).

## Practice

```answer
{
  "id": "pdm-09-p1",
  "prompt": "What's the BVN verification rate for traders who signed up through an **agent**? As a percentage, one decimal place.",
  "answer": 69.1,
  "format": "percent",
  "dataset": "product",
  "files": ["users"],
  "pyVerify": "round(traders[traders['channel'] == 'Agent sign-up']['bvn_verified'].mean() * 100, 1)",
  "hint": "The Agent sign-up line.",
  "required": true
}
```

```task
{
  "id": "pdm-09-t1",
  "prompt": "Write the **spec** for verification help at agents, with lines starting **Problem:**, **Users:**, **Success metric:** (with a **baseline and target**), **Guardrail:**, **Scope:**, **Non-goals:** and **Launch:** (including a **holdout**).",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Problem: ...",
  "rules": [
    { "label": "A Problem line with evidence (a number)", "pattern": "^\\s*problem\\s*:[^\\n]*\\d" },
    { "label": "A Users line", "pattern": "^\\s*users\\s*:" },
    { "label": "A Success metric line with baseline and target", "pattern": "^\\s*success metric\\s*:[^\\n]*\\d[^\\n]*\\d" },
    { "label": "A Guardrail line", "pattern": "^\\s*guardrails?\\s*:" },
    { "label": "Scope and Non-goals lines", "pattern": "^\\s*(scope|non-goals)\\s*:", "min": 2 },
    { "label": "A Launch line with a holdout", "pattern": "^\\s*launch\\s*:[^\\n]*(holdout|hold out|control|random)" }
  ],
  "sample": "Problem: only about 57% of market traders who verify their phone get through BVN verification, against about 80% of salary earners; it's the biggest drop in our funnel, and verification reviews average under 2 stars.\nUsers: market traders signing up, especially those not helped by an agent; their job is to start collecting payments at the stall.\nSuccess metric: trader BVN verification rises from 57% to 70% within the quarter.\nGuardrail: verification fraud flags and compliance exceptions must not rise; support tickets about verification should fall.\nScope: agents can start a guided verification with the trader in the app, fix name mismatches with an ID photo, and see the result immediately.\nNon-goals: changing our identity rules, verifying without BVN, or a USSD flow.\nLaunch: random half of agents in Lagos markets first, the other half as a holdout for six weeks, then compare trader verification rates.",
  "note": "The non-goals line protects compliance and keeps the first version small.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why include a baseline with every success metric?",
    "options": ["Tradition", "A target is meaningless unless you know where you start", "It's required by law", "To fill space"],
    "answer": 1,
    "explanation": "Measure first, then aim."
  },
  {
    "prompt": "What's a non-goal?",
    "options": ["A failed goal", "Something deliberately out of scope for this version", "A metric", "A bug"],
    "answer": 1,
    "explanation": "It keeps the first version focused."
  },
  {
    "prompt": "Which guardrail matters most for an identity verification feature?",
    "options": ["App size", "Fraud and compliance exceptions", "Dark mode usage", "Page colour"],
    "answer": 1,
    "explanation": "Easier verification must not mean easier fraud."
  }
]
```
