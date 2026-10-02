---
title: What product managers do
minutes: 20
summary: What a product manager is responsible for (outcomes, not just features), how product work differs from project work, how to pick a north star metric, and a first look at Paystream's new users.
---

## The problem

Paystream, the mobile wallet from the AI courses, has a backlog of ten feature ideas, a sales team asking loudly for one of them, and a CEO who wants "more users". Eight thousand people signed up in the last eight weeks. Fewer than half of them ever sent money.

A product manager's job is to decide **what to build next and why**, using evidence about users, and then to check whether it worked. This course teaches that job with Paystream's real signup, feedback, interview and launch data.

## The concept

**Outcomes, not outputs**

An **output** is something shipped: "savings goals launched". An **outcome** is a change in what users do: "more salary earners keep money in Paystream for a month". Product managers are measured on outcomes; shipping is only the means.

**Product and project**

| | Project manager | Product manager |
| :-- | :-- | :-- |
| Question | are we delivering what was agreed, on time and budget? | are we building the right thing, and did it work? |
| Timescale | a project's life | the product's life |
| Success | delivered as planned | users' behaviour and the business improve |

Most teams need both, and the Project Manager track teaches both.

**A north star metric**

One number that captures the value users get, which the whole team can move. For a wallet: **weekly active users who make at least one transaction**, not downloads or signups.

## Example

Paystream's signups over eight weeks, and how far each new user got:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
users = pd.read_csv(base + "users.csv")
print(len(users), "signups;", users["signup_week"].value_counts().sort_index().tolist(), "per week")
steps = ["phone_verified", "bvn_verified", "first_deposit", "first_transfer"]
print((users[steps].mean() * 100).round(1).to_string())
```

```text
8000 signups; [1023, 960, 1008, 1018, 1010, 1001, 970, 1010] per week
phone_verified    91.9
bvn_verified      62.8
first_deposit     50.5
first_transfer    42.8
```

More than nine in ten new users verify their phone, but only about four in ten ever send money, which is the moment Paystream becomes useful to them. Celebrating signups would hide that. Now the users who matter most for the north star:

```python
activity = pd.read_csv(base + "activity.csv")
week_two = activity[activity["week_since_signup"] == 2]["user_id"].nunique()
print("Signups:", len(users))
print("Made a first transfer:", int(users["first_transfer"].sum()))
print("Active in their second week:", week_two)
```

```text
Signups: 8000
Made a first transfer: 3422
Active in their second week: 2596
```

Each step loses people. Lessons 4 and 5 find out where, and for whom.

## Walkthrough

1. Run the cells. Which step loses the most new users?
2. Propose an alternative north star metric for Paystream, and say what it would miss.
3. Rewrite "launch split bills" as an outcome.
4. Write three outcomes for Paystream's next quarter (the task below).

## Practice

```dataset
{"dataset": "product", "files": ["users", "activity", "feedback", "interviews", "backlog", "rollout"]}
```

```answer
{
  "id": "pdm-01-p1",
  "prompt": "What share of signups made a **first transfer**? As a percentage, one decimal place.",
  "answer": 42.8,
  "format": "percent",
  "dataset": "product",
  "files": ["users"],
  "pyVerify": "round(users['first_transfer'].mean() * 100, 1)",
  "hint": "The first_transfer line.",
  "required": true
}
```

```task
{
  "id": "pdm-01-t1",
  "prompt": "Write **three outcomes** for Paystream's next quarter, one per line starting with a dash. Each must name a **user group**, a **behaviour** that should change, and a **measure with a number**. None may be a feature.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "- More market traders ...",
  "rules": [
    { "label": "Three lines starting with -", "pattern": "^\\s*-\\s+\\S", "min": 3 },
    { "label": "User groups named", "pattern": "trader|salary|student|small business|new users|signups", "min": 3 },
    { "label": "A measure with a number on each", "pattern": "^\\s*-[^\\n]*\\d", "min": 3 },
    { "label": "No feature outputs (launch, build, ship, add)", "pattern": "^\\s*-\\s*(launch|build|ship|add|release)\\b", "absent": true }
  ],
  "sample": "- More new market traders get verified: BVN verification for traders rises from about 52% to 65% of signups.\n- More new users start transacting: the share of signups making a first transfer rises from about 43% to 50%.\n- More salary earners keep money with us: the share active in week 8 after signup rises by 5 percentage points.",
  "note": "Each outcome leaves the 'how' open: the team can test several features against it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is an outcome rather than an output?",
    "options": ["Ship split bills", "More students settle shared costs through Paystream each week", "Redesign the home screen", "Launch on iOS"],
    "answer": 1,
    "explanation": "Outcomes describe changed behaviour."
  },
  {
    "prompt": "Why is 'downloads' a poor north star for a wallet?",
    "options": ["It's hard to count", "Downloads don't show whether users get value; transactions do", "It's too high", "Investors dislike it"],
    "answer": 1,
    "explanation": "Measure the value users get."
  },
  {
    "prompt": "What's a product manager mainly accountable for?",
    "options": ["Delivering on schedule", "Building the right things and whether they change user behaviour and results", "Writing code", "Running support"],
    "answer": 1,
    "explanation": "Outcomes over outputs."
  }
]
```
